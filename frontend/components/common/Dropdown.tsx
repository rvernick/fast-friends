import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from "../ui/select";
import { ChevronDownIcon } from "../ui/icon";
import { Box } from "../ui/box";
import { Text } from "../ui/text";

interface Option { label: string; value: string };

type DropdownProps = {
  value: string;
  label: string;
  disabled?: boolean;
  onSelect: (value: string) => void;
  options: Option[];
  testID?: string;
  initialLabel?: string;
};

export const Dropdown: React.FC<DropdownProps> = ({ 
    value,
    disabled=false,
    onSelect,
    options,
    testID="dropdown",
    label,
    initialLabel="Choose..."
  }) => {
  
  const handleSelect = (value: string | undefined) => {
    if (value) {
      console.log('Dropdown onSelect: ', value);
      onSelect(value);
    }
  }
  return (
    <Box>
      <Text className="text-xs">{label}</Text>
      <Select 
        isDisabled={disabled}
        isRequired={true}
        initialLabel={initialLabel}
        onValueChange={handleSelect}
        testID={testID}>
        <SelectTrigger>
          <SelectInput value={value} testID={testID}/>
          <SelectIcon as={ChevronDownIcon} />
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            {options.map(option => (
              <SelectItem key={option.value} label={option.label} value={option.value} />
            ))}
          </SelectContent>
        </SelectPortal>
      </Select>
    </Box>
  );
}
