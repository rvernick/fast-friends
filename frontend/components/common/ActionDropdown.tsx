import { Action } from "@/models/MaintenanceItem";
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from "../ui/select";
import { ChevronDownIcon } from "../ui/icon";
import { Box } from "../ui/box";
import { Text } from "../ui/text";

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

  const handleSelect = (value: string | undefined) => {
    if (value) {
      console.log('PartDropdown onSelect: ', value);
      onSelect(value);
    }
  }
  return (
    <Box>
      <Text className="text-xs">{label}</Text>
      <Select 
        isDisabled={readonly}
        isRequired={true}
        testID={testID}
        initialLabel="Choose an action..."
        onValueChange={handleSelect}>
        <SelectTrigger>
          <SelectInput value={value} />
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
