import { ensureString } from "@/common/utils";
import { NeedType } from "@/models/HelpRequest";
import { Dropdown } from "react-native-paper-dropdown";

const options = Object.entries(NeedType).map(([key, val]) => ({ label: val, value: val }));

type NeedTypeDropdownProps = {
  value: string;
  readonly?: boolean;
  onSelect: (value: string) => void;
};

export const NeedTypeDropdown: React.FC<NeedTypeDropdownProps> = ({ value, readonly = false, onSelect }) => {
      
  const handleSelect = (value: string | undefined) => {
    if (value) {
      console.log('NeedTypeDropdown onSelect: ', value);
      onSelect(value);
    }
  }

  return (
    <Dropdown
        disabled={readonly}
        label="Need Type"
        placeholder={ensureString(value)}
        options={options}
        value={value}
        onSelect={handleSelect}
        testID="NeedTypeDropdown"
      />
  );
}
