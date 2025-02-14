import { NeedType } from "@/models/HelpRequest";
import { Dropdown } from "./Dropdown";

const options = Object.entries(NeedType).map(([key, val]) => ({ label: val, value: val }));

type NeedTypeDropdownProps = {
  value: string;
  readonly?: boolean;
  onSelect: (value: string) => void;
  testID?: string;
  label?: string;
};

export const NeedTypeDropdown: React.FC<NeedTypeDropdownProps> = ({
    value,
    readonly = false,
    onSelect,
    testID="needTypeDropdown",
    label="Need Type" }) => {
      
  const handleSelect = (value: string | undefined) => {
    if (value) {
      console.log('NeedTypeDropdown onSelect: ', value);
      onSelect(value);
    }
  }
  
  return (
    <Dropdown
      value={value}
      label={label}
      disabled={readonly}
      onSelect={handleSelect}
      options={options}
      testID={testID}
      initialLabel="Choose a Type..."
    />
  );
}
