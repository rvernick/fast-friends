import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { BikeDefinition } from './bike-definition.entity';
import OpenAI, { toFile } from 'openai';
const logger = new Logger('BikeDefinitionService');
import { bikeDefinitionSchema } from './bike.schema';
import { createDefinitionFromJSON } from './bike-definition-parser';

@Injectable()
export class BikeDefinitionService {
  jsonDefinitionHasBeenUploaded = false;
  chatGPT = null;

  constructor(
    @InjectRepository(User)
    private bikeDefinitionRepository: Repository<BikeDefinition>,
  ) {}

  async getPotentialStringCompletes(starter: string): Promise<Map<string, BikeDefinition>> {
    const sortMap = new Map<number, number>();
    const definitionsMap = new Map<number, BikeDefinition>();

    const words = starter.split(' ');
    if (words.length < 2) {
      return this.createSearchStringMap(await this.searchForWord(starter));
    }
    const waitForSearches = [];
    const wordMap = new Map<string, BikeDefinition[]>();
    for (const word in words) {
      waitForSearches.push(this.searchForWord(word)
        .then((results) => {
          results.forEach((definition) => {
            const wordScore = this.getWordScore(word, definition);
            sortMap.set(definition.id, sortMap.get(definition.id) || 0 + wordScore);
            definitionsMap.set(definition.id, definition);
            if (wordMap.has(word)) {
              wordMap.get(word).push(definition);
            } else {
              wordMap.set(word, [definition]);
            }
          });
        })
       .catch((error) => {
          logger.log('Error searching for bike definitions: ', error);
       }))
    }
    waitForSearches.forEach(async (promise) => await promise);

    const topTenIds = this.getTopTenIds(sortMap);
    return this.createSearchStringMap(topTenIds.map((id) => definitionsMap.get(id)));
  }

  // for definitions with multiple matches, prioritize those with more distinctive matches
  private getWordScore(word: string, definition: BikeDefinition): number {
    if (word.match(/[0-9]{3}/)) {
      return 1;
    }
    if (definition.brand.toLowerCase().includes(word.toLowerCase())) {
      return 2;
    }
    if (definition.model.toLowerCase().includes(word.toLowerCase())) {
      return 3;
    }
    if (definition.line.toLowerCase().includes(word.toLowerCase())) {
      return 1;
    }
  }

  private getTopTenIds(sortMap: Map<number, number>): number[] {
    const entries = Array.from(sortMap.entries());
    entries.sort((a, b) => b[1] - a[1]);
    const sortedIds = entries.map(entry => entry[0]);
    return sortedIds.slice(0, 10);
  }

  private createSearchStringMap(definitions: BikeDefinition[]): Map<string, BikeDefinition> {
    const searchStringMap = new Map<string, BikeDefinition>();

    definitions.forEach((definition) => searchStringMap.set(definition.brand, definition));
    return searchStringMap;
  }

  private async searchForWord(word: string): Promise<BikeDefinition[]> {
    try {
      const searchString = word.trim();
      if (searchString.length < 3) {
        return [];
      }
      return await this.bikeDefinitionRepository.findBy({
        searchString: 
          ILike("%${searchString}%"),
      });
    } catch (error) {
      logger.error('Error searching for bike definitions: ', error);
      return [];
    }
  }

  async createDefintionFor(year: string, brand: string, model: string, line: string): Promise<BikeDefinition> {
    const definitionJSON = this.queryChatGPTDefinition(year, brand, model, line);
    const definition = createDefinitionFromJSON(definitionJSON);
    return await this.bikeDefinitionRepository.save(definition);
  }


  private async queryChatGPTDefinition(year: string, brand: string, model: string, line: string): Promise<any> {
    const query = `What is a bike definition for a ${year} ${brand} ${model} ${line}?`;
    const client = this.openAIClient();
    if (!this.jsonDefinitionHasBeenUploaded) {
      await this.uploadJSONDefinition(client);
      this.jsonDefinitionHasBeenUploaded = true;
    }
    console.log('Querying ChatGPT for bike definition: ', query);
    return client.responses.create({
      model: 'gpt-4o',
      instructions: 'You are a bike specification expert who answers with the JSON schema in bikeDefinition.json',
      input: query,
    });
  }

  private async uploadJSONDefinition(client: OpenAI): Promise<void> {
    await client.files.create({
      file: await toFile(Buffer.from(JSON.stringify(bikeDefinitionSchema)), 'bikeDefinition.json'),
      purpose: 'fine-tune',
    });
  }


  private openAIClient(): OpenAI {
    if (!this.chatGPT) {
      const key = process.env['PA_OPENAI_API_KEY'];
      if (!key) {
        throw new Error('OpenAI API key not found in environment variables.');
      }
      this.chatGPT = new OpenAI({
        apiKey: key,
      });
    }
    return this.chatGPT;
  }
  
  async bootStrapAll(year?: string): Promise<void> {
    if (!year) {
      year = '2024';
    }
    const brands = await this.getAllBrands();
    for (const brand of brands) {
      await this.bootStrapBrand(brand, year);
    }
  }

  async bootStrapBrand(brand: string, year?: string): Promise<void> {
    if (!year) {
      year = '2024';
    }
    const models = await this.getModels(brand, year);
    for (const model of models) {
      const lines = await this.getLines(brand, model, year);
      for (const line of lines) {
        await this.createDefintionFor(year, brand, model, line);
      }
    }
  }

  private async getAllBrands(): Promise<string[]> {
    const response = await this.queryBikeInfoList('List the top 25 brands of bikes');
    console.log('Brands: ', response);
    return Promise.all(['Specialized']);
  }

  private async getModels(brand: string, year?: string): Promise<string[]> {
    const query = year ? `List the models of ${brand} bikes in ${year}` : `List the models of ${brand} bikes`;
    return ['Roubaix'];
  }

  private async getLines(brand: string, model: string, year?: string): Promise<string[]> {
    const query = year ? `List the lines of ${brand} ${model} bikes in ${year}` : `List the lines of ${brand} ${model} bikes`;
    return ['Pro', 'Comp'];
  }

  private async queryBikeInfoList(query: string): Promise<string[]> {
    const response = await this.openAIClient().responses.create({
      model: 'gpt-4o-mini',
      instructions: 'You are a bike specification expert who answer with a list of strings',
      input: query,
    });
    console.log('Bike info list query: ', query);
    console.log('Bike info list query response: ', response);
    return [];
  }
};
