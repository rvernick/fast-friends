import { Repository } from "typeorm";
import { Instruction } from "./instruction.entity";
import * as fs from 'fs';
import * as path from 'path';
import { Step } from "./step.entity";
import { ToolNeed } from "./tool-need.entity";
import { instructions } from "./content/instructions";
import { testInstructions } from "./content/test-instructions";


export class InstructionUpdater {
  private instructionRepository: Repository<Instruction>;

  constructor(instructionRepo: Repository<Instruction>) {
    this.instructionRepository = instructionRepo;
  }

  async updateTestInstructions() {
    this.updateInstructionsFrom(testInstructions);
  }

  async updateInstructions() {
    this.updateInstructionsFrom(instructions);
  }

  async updateInstructionsFrom(baselineInstructions: any[]) {
    for (const baselineInstruction of baselineInstructions) {
      this.synchronizeInstruction(baselineInstruction);
    }
  }

  private async synchronizeInstruction(baselineInstruction: any) {
    console.log(`Updating instruction: ${baselineInstruction.part} ${baselineInstruction.action}`);
    var existingInstruction = await this.instructionRepository.findOne({
      where: {
        part: baselineInstruction.part,
        action: baselineInstruction.action,
      },
    });

    if (existingInstruction) {
      console.log(`Instruction already exists: updating... ${existingInstruction.id}`);
      this.updateInstruction(existingInstruction, baselineInstruction);
    } else {
      console.log(`Creating new instruction...`);
      existingInstruction = this.createInstruction(baselineInstruction);
      existingInstruction.part = baselineInstruction.part;
      existingInstruction.action = baselineInstruction.action;
    }
    await this.instructionRepository.save(existingInstruction);
    console.log(`Updated instruction: ${baselineInstruction.part} ${baselineInstruction.action}`);
  }

  private createInstruction(baselineInstruction: any): Instruction {
    const newInstruction = new Instruction();
    this.updateInstruction(newInstruction, baselineInstruction);
    return newInstruction;
  }

  private updateInstruction(existingInstruction: Instruction, baselineInstruction: any) {
    existingInstruction.difficulty = baselineInstruction.difficulty;
    const oldSteps = existingInstruction.steps;
    const newSteps: Step[] = [];
    for (const baselineStep of baselineInstruction.steps) {
      const createdStep = this.createStep(baselineStep, existingInstruction);
      newSteps.push(createdStep);
    }
    existingInstruction.steps = newSteps;

    const newTools: ToolNeed[] = [];
    for (const baselineTool of baselineInstruction.tools) {
      const createdTool = this.createTool(baselineTool, existingInstruction);
      newTools.push(createdTool);
    }
    existingInstruction.tools = newTools;

    existingInstruction.references = baselineInstruction.references;
    existingInstruction.hints = baselineInstruction.hints;
  }

  private createStep(baselineStep: any, instruction: Instruction): Step {
    const newStep = new Step();
    newStep.instruction = instruction;
    newStep.stepNumber = baselineStep.stepNumber;
    newStep.name = baselineStep.name;
    newStep.description = baselineStep.description;
    newStep.notes = baselineStep.notes;
    newStep.hints = baselineStep.hints;
    return newStep;
  }

  private createTool(baselineTool: any, instruction: Instruction): ToolNeed {
    const newTool = new ToolNeed();
    newTool.instruction = instruction;
    newTool.tool = baselineTool.tool;
    newTool.needed = baselineTool.needed;
    return newTool;
  }

  private readBaselineInstructions(filename: string): any[] {
    const filePath = path.join(__dirname + '/content/',  filename);
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContents) as any[];
  }
}