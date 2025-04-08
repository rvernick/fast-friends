import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { BikeDefinition } from './bike-definition.entity';
import OpenAI from 'openai';
const logger = new Logger('BikeDefinitionService');
import { createDefinitionFromJSON } from './bike-definition-parser';
import { z } from 'zod';
import { zodResponseFormat } from "openai/helpers/zod";
import { Bike } from './bike.entity';

@Injectable()
export class BikeDefinitionService {
  jsonDefinitionHasBeenUploaded = false;
  chatGPT = null;

  constructor(
    @InjectRepository(BikeDefinition)
    private bikeDefinitionRepository: Repository<BikeDefinition>,
    @InjectRepository(Bike)
    private bikeRepository: Repository<Bike>,
  ) {}

  async getBikeDefinitionsFor(brand: string, model: string, line: string): Promise<BikeDefinition[]> {
    return this.bikeDefinitionRepository.find({
      where: {
        brand: brand,
        model: model,
        line: line,
      },
    });
  }

  async getAllBrands(): Promise<string[]> {
    const adHocBrandsPromise = this.bikeRepository
      .createQueryBuilder()
      .select('brand')
      .distinct(true)
      .getRawMany();

    const definedBrands = await this.bikeDefinitionRepository
      .createQueryBuilder()
      .select('brand')
      .distinct(true)
      .getRawMany();

      console.log('defined: '+ JSON.stringify(definedBrands));
      const resultSet = new Set<string>();
      definedBrands.forEach((row) => resultSet.add(row.brand));
      const adHocBrands = await adHocBrandsPromise;
      adHocBrands.forEach((row) => resultSet.add(row.brand));
      return Array.from(resultSet).filter((brand) => brand !== null);
  }

  async getAllModelsForBrand(brand: string): Promise<string[]> {
    if (brand === null) {
      return [];
    }
    console.log('get all models for brand: '+ brand);
    const adHocBrandsPromise = this.bikeRepository
      .createQueryBuilder()
      .select('model')
      .distinct(true)
      .where('brand = :brand', { brand: brand })
      .getRawMany();

    const definedBrands = await this.bikeDefinitionRepository
      .createQueryBuilder()
      .select('model')
      .distinct(true)
      .where('brand = :brand', { brand: brand })
      .getRawMany();

      console.log('adHocBrands: '+ JSON.stringify(definedBrands));
      const resultSet = new Set<string>();
      definedBrands.forEach((row) => resultSet.add(row.model));
      const adHocBrands = await adHocBrandsPromise;
      adHocBrands.forEach((row) => resultSet.add(row.model));
      return Array.from(resultSet).filter((brand) => brand !== null);
  }

    async getAllLinesForBrandModel(brand: string, model: string): Promise<string[]> {
    const adHocBrandsPromise = this.bikeRepository
      .createQueryBuilder()
      .select('bike.line')
      .distinctOn(['bike.line'])
      .where('bike.brand = :brand', { brand: brand })
      .andWhere('bike.model = :model', { model: model })
      .getRawMany();

    const definedBrands = await this.bikeDefinitionRepository
      .createQueryBuilder()
      .select('bikeDefinition.line')
      .distinctOn(['bikeDefinition.line'])
      .where('bikeDefinition.brand = :brand', { brand: brand })
      .andWhere('bikeDefinition.model = :model', { model: model })
      .getRawMany();

      console.log('adHocBrands: '+ JSON.stringify(definedBrands));
      const resultSet = new Set<string>();
      definedBrands.forEach((row) => resultSet.add(row.bikedefinition_line));
      const adHocBrands = await adHocBrandsPromise;
      adHocBrands.forEach((row) => resultSet.add(row.bike_line));
      return Array.from(resultSet);
  }

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
    try {      
      const response = await this.queryChatGPTDefinition(year, brand, model, line);
      console.log('Got response from ChatGPT: ', response);
      const definition = createDefinitionFromJSON(response);
      definition.brand = brand;
      definition.model = model;
      definition.line = line;
      console.log('Created bike definition: ', definition);
      const result =  await this.bikeDefinitionRepository.save(definition);
      console.log('Saved bike definition: ', result);
      return result;
    } catch (error) {
      logger.log('Error creating bike definition: ', error);
      return null;
    }
  }

  private async queryChatGPTDefinition(year: string, brand: string, model: string, line: string): Promise<any> {
    try {
      const query = `Can you describe a ${year} ${brand} ${model} ${line}? `;
      const client = this.openAIClient();
      const response = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
              "role": "system", 
              "content": "You are a verbose and meticulous bike specification expert"
          },
          {
              "role": "user", 
              "content": query,
          }
      ],
        response_format: zodResponseFormat(bikeDefinitionSchema, "bike_definition"),
      });
      console.log('Got response from ChatGPT: ', response);
      console.log('Choices', response.choices[0]);
      console.log('Choices', response.choices[0].message);
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      logger.log('Error querying ChatGPT: ', error);
      return null;
    }
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
    const brands = await this.searchForAllBrands(year);
    console.log(`Bootstrapping all brands with year ${year}`, brands);
    for (const brand of brands) {
      await this.bootStrapBrand(brand, year);
    }
  }

  async bootStrapBrand(brand: string, year?: string): Promise<void> {
    if (!year) {
      year = '2024';
    }
    console.log(`Bootstrapping brand ${brand} with year ${year}`);
    const models = await this.searchForModels(brand, year);
    for (const model of models) {
      const lines = await this.searchForLines(brand, model, year);
      for (const line of lines) {
        console.log(`Creating bike definition for: ${year} ${brand} ${model} ${line}`);
        await this.createDefintionFor(year, brand, model, line);
      }
    }
  }

  private async searchForAllBrands(year: string ): Promise<string[]> {
    const query = `List the top brands of bikes in ${year} as a pipe (|) deliniated list with no model or trim information.`;
    return await this.queryBikeInfoList(query);
    // return ['Giant'];
    // return ['Specialized', 'Giant'];
  }

  private async searchForModels(brand: string, year?: string): Promise<string[]> {
    const queryBase = year ? `List the models/family of ${brand} bikes in ${year}` : `List the models of ${brand} bikes`;
    const result = await this.queryBikeInfoList(queryBase + ' as a pipe (|) deliniated list with no brand or trim information');
    return result.map(model => removeRedundantInfo(brand, model))
  }

  private async searchForLines(brand: string, model: string, year?: string): Promise<string[]> {
    const queryBase = year ? `List the available trims of ${brand} ${model} bikes in ${year}` : `List the lines of ${brand} ${model} bikes`;
    const query = queryBase + ' as a pipe (|) deliniated list with no brand or model information';
    const result = await this.queryBikeInfoList(query);
    return result.map(line => removeRedundantInfo(model, line))
  }

  private async queryBikeInfoList(query: string): Promise<string[]> {    
    const response = await this.openAIClient().responses.create({
      model: 'gpt-4o-mini',
      instructions: 'You are a bike specification expert who answer with a list of strings',
      input: query,
    });
    console.log('Bike info list query: ', query);
    console.log('Bike info list query response: ', response);
    console.log('Output: ', response.output);
    console.log('Output[0]: ', response.output[0]);
    var result = response
      .output_text.split('|')
      .map(item => item.trim())
      .filter(item => item.trim().length > 0);
    
    result = result.map(item => removeIndex(item));
    console.log('Result: ', result);
    return result;
  }
};

export const removeRedundantInfo = (brand: string, model: string): string => {
  if (model.startsWith(brand)) {
    return model.substring(brand.length + 1).trim();
  }
  return model;
}

export const removeIndex = (item: string): string => {
  if (item.match(/^(\d+)\.\s+(.+)$/)) {
    return item.replace(/^(\d+)\.\s+(.+)$/, '$2');
  }
  return item;
}

export const bikeDefinitionSchema = z.object({
  brand: z.string().describe("The manufacturer of the bike"),
  model: z.string().describe("The specific model of the bike"),
  line: z.string().describe("The specific line of the bike"),
  type: z.string().describe("The type of bike (e.g., road, hybrid, mountain)"),
  colors: z.array(z.string()).describe("The color of the bike"),
  sizes: z.array(z.string()).describe("The available sizes of the bike"),
  frameMaterial: z.string().describe("The material used for the frame"),
  year: z.string().describe("The year the bike was manufactured"),
  hasElectricAssist: z.boolean().describe("Does the bike have electric assist"),
  productLink: z.string().describe("The link to the bike's product page"),
  groupsetBrand: z.string().describe("The brand of the groupset"),
  groupsetLine: z.string().describe("The specific line of the groupset"),
  groupsetSpeed: z.number().describe("The speed of the groupset"),
  description: z.string().describe("A brief description of the bike"),

  frontWheel: z.object({
    brand: z.string().describe("The manufacturer of the front wheel"),
    model: z.string().describe("The specific model of the front wheel"),
    size: z.string().describe("The size of the front wheel"),
    quickRelease: z.boolean().describe("Does it have quick release"),
    thruAxle: z.boolean().describe("Does it have a thru-axle"),
    tubelessReady: z.boolean().describe("Is it tubeless ready"),
    clincher: z.boolean().describe("Is it a clincher mounted rim"),
    tubular: z.boolean().describe("Is it a tubular rim"),
    hookless: z.boolean().describe("Does it use a hookless rim"),
    productLink: z.string().describe("The link to the bike's product page"),
  }),

  rearWheel: z.object({
    brand: z.string().describe("The manufacturer of the rear wheel"),
    model: z.string().describe("The specific model of the rear wheel"),
    size: z.string().describe("The size of the rear wheel"),
    tubelessReady: z.boolean().describe("Is it tubeless ready"),
    clincher: z.boolean().describe("Is it a clincher mounted rim"),
    tubular: z.boolean().describe("Is it a tubular rim"),
    hookless: z.boolean().describe("Does it use a hookless rim"),
    productLink: z.string().describe("The link to the bike's product page"),
  }),

  frontTire: z.object({
    brand: z.string().describe("The manufacturer of the front tire"),
    model: z.string().describe("The specific model of the front tire"),
    size: z.string().describe("The size of the front tire"),
    tubeless: z.boolean().describe("Is it tubeless ready"),
    productLink: z.string().describe("The link to the bike's product page"),
  }),

  rearTire: z.object({
    brand: z.string().describe("The manufacturer of the rear tire"),
    model: z.string().describe("The specific model of the rear tire"),
    size: z.string().describe("The size of the rear tire"),
    tubeless: z.boolean().describe("Is it tubeless ready"),
    productLink: z.string().describe("The link to the bike's product page"),
  }),

  chain: z.object({
    brand: z.string().describe("The manufacturer of the chain"),
    model: z.string().describe("The specific model of the chain"),
    speeds: z.string().describe("The number of cogs on the rear cassette"),
    productLink: z.string().describe("The link to the bike's product page"),
  }),

  cassette: z.object({
    brand: z.string().describe("The manufacturer of the cassette"),
    model: z.string().describe("The specific model of the cassette"),
    speeds: z.number().describe("The number of cogs on the rear cassette"),
    cogConfiguration: z.string().describe("The configuration of the cogs on the cassette (e.g. 11-28)"),
    productLink: z.string().describe("The link to the bike's product page"),
  }),

  cranks: z.object({
    brand: z.string().describe("The manufacturer of the cranks"),
    model: z.string().describe("The specific model of the cranks"),
    chainringCount: z.number().describe("The number of chainrings on the crankset"),
    chainringSizes: z.number().describe("The chainring configuration (e.g. 50/34)"),
    size: z.string().describe("The length of the crank arms (e.g. 172.5mm)"),
    productLink: z.string().describe("The link to the bike's product page"),
  }),

  frontShifter: z.object({
    brand: z.string().describe("The manufacturer of the shifter"),
    model: z.string().describe("The specific model of the shifter"),
    electronic: z.boolean().describe("True if the shifter is electric, false if it's mechanical"),
    wireless: z.boolean().describe("True if the shifter is wireless, false if uses cable or a wire"),
  }),

  rearShifter: z.object({
    brand: z.string().describe("The manufacturer of the shifter"),
    model: z.string().describe("The specific model of the shifter"),
    electronic: z.boolean().describe("True if the shifter is electric, false if it's mechanical"),
    wireless: z.boolean().describe("True if the shifter is wireless, false if uses cable or a wire"),
  }),

  frontBrake: z.object({
    brand: z.string().describe("The manufacturer of the brake"),
    model: z.string().describe("The specific model of the brake"),
    disc: z.boolean().describe("True if the brake is disc brake, false if it's cable brake"),
    hydric: z.boolean().describe("True if the brake is hydric, false if it's non-hydric"),
    size: z.string().describe("The size of the brake"),
    productLink: z.string().describe("The link to the bike's product page"),
  }),

  rearBrake: z.object({
    brand: z.string().describe("The manufacturer of the brake"),
    model: z.string().describe("The specific model of the brake"),
    disc: z.boolean().describe("True if the brake is disc brake, false if it's cable brake"),
    hydric: z.boolean().describe("True if the brake is hydric, false if it's non-hydric"),
    size: z.string().describe("The size of the brake"),
    productLink: z.string().describe("The link to the bike's product page"),
  }),

  frontShock: z.object({
    brand: z.string().describe("The manufacturer of the shock"),
    model: z.string().describe("The specific model of the shock"),
  }),

  rearShock: z.object({
    brand: z.string().describe("The manufacturer of the shock"),
    model: z.string().describe("The specific model of the shock"),
  }),
});

