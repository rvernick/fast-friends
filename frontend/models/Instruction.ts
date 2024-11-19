export interface Instruction {
  id: number;
  part: string;
  action: string; 
  steps: Step[];
  difficulty: string;
  tools: ToolNeed[];
  references: InstructionReference[];
};

export interface Step {
  id: number;
  stepNumber: number;
  name: string;
  description: string;
  notes: string;
  hints: string;
}

export interface Tool {
  id: number;
  name: string;
  description: string;
  link: string;
}
export interface ToolNeed {
  tool: Tool;
  needed: string;
}

export interface InstructionReference {
  id: number;
  title: string;
  link: string;
}

export const difficulties = ["Trivial", "Easy", "Tricky", "Hard"];
