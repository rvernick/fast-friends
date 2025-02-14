import { Action } from "@/models/MaintenanceItem";
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from "../ui/select";
import { ChevronDownIcon } from "../ui/icon";
import { Box } from "../ui/box";
import { Text } from "../ui/text";
import { Dropdown } from "./Dropdown";

const defaultOptions = Object.entries(Action).map(([key, val]) => val);

type ActionDropdownProps = {
  value: string;
  readonly?: boolean;
  onSelect: (value: string) => void;
  actions?: string[];
  testID?: string;
  label?: string;
};

export const ActionDropdown: React.FC<ActionDropdownProps> = ({ 
    value,
    readonly=false,
    onSelect,
    actions=defaultOptions,
    testID="actionDropdown",
    label="Action"
  }) => {
  
  const options = Object.entries(actions).map(([key, val]) => ({ label: val, value: val }));

  return (
    <Dropdown
      value={value}
      label={label}
      disabled={readonly}
      onSelect={onSelect}
      options={options}
      testID={testID}
      initialLabel="Choose an action..."
    />
  );
};
