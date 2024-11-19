import AppContext from "@/common/app-context";
import AppController from "@/common/AppController";
import { getInternal } from "@/common/http-utils";
import { Instruction, Step } from "@/models/Instruction";
import { Action, Part } from "@/models/MaintenanceItem";



const createMockInstructions = (): Instruction[] => {
  const result: Instruction[] = [];
  var i = 1;
  const difficulties = ["Trivial", "Easy", "Tricky", "Hard"];
  const parts = Object.values(Part);
  const actions = Object.values(Action);
  parts.forEach((part) => {
    console.log(part);
    if (part !== Part.CASSETTE) {   
      actions.forEach((action) => {
        result.push(createMockInstruction(i++, part, action, difficulties[i % difficulties.length]));
      });
    }
  });
  // for (const part in Object.values(Part)) {
  //   console.log(part);
  //   console.log(part.valueOf());
  //   for (const action in Object.values(Action)) {
  //     result.push(createMockInstruction(i++, part, action));
  //   }
  // }
   // console.log(JSON.stringify(result));
  return result;
};

const createMockInstruction = (id: number, part: string, action: string, difficulty: string): Instruction => {

  return {
      id: id,
      part: part,
      action: action,
      steps: createMockSteps(id, part, action),
      tools: [],
      difficulty: difficulty,
      references: [],
    };
}

const createMockSteps = (id: number, part: string, action: string): Step[] => {
  const result = [];
  var i = 10*id;
  result.push(createMockStep(i++, part, action) as Step);
  result.push(createMockStep(i++, part, action) as Step);
  result.push(createMockStep(i++, part, action) as Step);
  result.push(createMockStep(i++, part, action) as Step);
  result.push(createMockStep(i++, part, action) as Step);
  return result;
};

const createMockStep = (id: number, part: string, action: string): Step => {
  return {
      id: id,
      stepNumber: 1,
      name: "Step " + part + id.toFixed(0),
      description: "Description for step " + action + ' in id: ' + id.toFixed(0),
      notes: "notes for step " + id.toFixed(0),
      hints: "hints for step " + id.toFixed(0),
    };
};

class InstructionController extends AppController {
  constructor(appContext: AppContext) {
    super(appContext);
  }

  getInstructions = async (part: string): Promise<Instruction[]>  => {
    if (part === null || part === '') {
      console.log('getInstructions has no part');
      return Promise.resolve([]);
    }

    // Mock data for now

    // return Promise.resolve(createMockInstructions().filter(i => i.part === part));

    try {
      const parameters = {
        part: part,
      };
      console.log('get instruction');
      const result = await getInternal('/instruction/instructions', parameters, null);
      console.log('get instruction result:', result);
      if (result) {
        return result;
      } else {
        console.log('get instruction error:', result);
        return [];
      }
    } catch(e: any) {
      console.log(e.message);
      return [];
    }
  }
}

export default InstructionController;
