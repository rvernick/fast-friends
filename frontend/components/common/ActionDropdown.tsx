import { ensureString } from "@/common/utils";
import { Action } from "@/models/MaintenanceItem";
import { Dropdown } from "react-native-paper-dropdown";

const defaultOptions = Object.entries(Action).map(([key, val]) => val);

type ActionDropdownProps = {
  value: string;
  readonly?: boolean;
  onSelect: (value: string) => void;
  useAll?: boolean;
  actions?: string[];
};

export const ActionDropdown: React.FC<ActionDropdownProps> = ({ 
    value,
    readonly=false,
    onSelect,
    actions=defaultOptions}) => {
  
  const options = Object.entries(actions).map(([key, val]) => ({ label: val, value: val }));

  const handleSelect = (value: string | undefined) => {
    if (value) {
      console.log('PartDropdown onSelect: ', value);
      onSelect(value);
    }
  }

  return (
    <Dropdown
      disabled={readonly}
      label="Action"
      placeholder={ensureString(value)}
      options={options}
      value={value}
      onSelect={handleSelect}
      testID="ActionDropdown"
    />
  );
}
