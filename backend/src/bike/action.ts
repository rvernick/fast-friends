
export enum Action {
  CHECK = "Check",
  CLEAN = "Clean",
  LUBRICATE = "Lubricate",
  REPLACE = "Replace",
};

export const getActionFor = (actionCode: string): Action | null => {
  const vals = Object.values(Action);
  const keys = Object.keys(Action)
  for (const checkKey in keys) {
    if (vals[checkKey] === actionCode) {
      return Action[keys[checkKey]];
    }
  }
  return null;
}
