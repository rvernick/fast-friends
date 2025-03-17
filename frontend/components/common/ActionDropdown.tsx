import { Action } from "@/models/MaintenanceItem";
import { Dropdown } from "./Dropdown";

const defaultOptions = Object.entries(Action).map(([key, val]) => val);

type ActionDropdownProps = {
  value: string;
  readonly?: boolean;
  onSelect: (value: string) => void;
  actions?: string[];
  testID?: string;
};

export const ActionDropdown: React.FC<ActionDropdownProps> = ({ 
    value,
    readonly=false,
    onSelect,
    actions=defaultOptions,
    testID="actionDropdown",
  }) => {
  
  const options = Object.entries(actions).map(([key, val]) => ({ label: val, value: val }));

  return (
    <Dropdown
      value={value}
      disabled={readonly}
      onSelect={onSelect}
      options={options}
      testID={testID}
      initialLabel="Choose an action..."
    />
  );
};
