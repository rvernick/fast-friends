import { NeedType } from "@/models/HelpRequest";
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from "../ui/select";
import { ChevronDownIcon } from "../ui/icon";
import { Box } from "../ui/box";
import { Text } from "../ui/text";

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

/**
 * <Dropdown
      mode="outlined"
      disabled={readonly}
      label="Need Type"
      placeholder={ensureString(value)}
      options={options}
      value={value}
      onSelect={handleSelect}
      testID="NeedTypeDropdown"
    />
 */