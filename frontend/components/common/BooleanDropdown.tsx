import { Dropdown } from "react-native-paper-dropdown";

type BooleanDropdownProps = {
  label: string;
  value: boolean;
  readonly: boolean;
  onSelect: (value: boolean) => void;
};

export const BooleanDropdown: React.FC<BooleanDropdownProps> = ({ label, value, readonly, onSelect }) => {
  const yesno = ['Yes', 'No'];
    const options = yesno?.map(val => ({ label: val, value: val }));
    return (
      <Dropdown
        mode="outlined"
        disabled={readonly}
        label={label}
        placeholder={'Yes'}
        options={options}
        value={value ? 'Yes' : 'No' }
        onSelect={(value) => onSelect(value === 'Yes')}
      />
    )
  }
