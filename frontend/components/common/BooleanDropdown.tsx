import { Box } from "../ui/box";
import { ChevronDownIcon } from "../ui/icon";
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from "../ui/select";
import { Text } from "../ui/text";

type BooleanDropdownProps = {
  label: string;
  value: boolean;
  readonly: boolean;
  onSelect: (value: boolean) => void;
  testID?: string;
};

export const BooleanDropdown: React.FC<BooleanDropdownProps> = ({ label, value, readonly, onSelect, testID="boolean" }) => {
  const yesno = ['Yes', 'No'];
    const options = yesno?.map(val => ({ label: val, value: val }));
    return (
      <Box>
      <Text className="text-xs">{label}</Text>
      <Select 
        isDisabled={readonly}
        isRequired={true}
        testID={testID}
        initialLabel="Choose an action..."
        onValueChange={(value) => onSelect(value == 'Yes')}>
        <SelectTrigger>
          <SelectInput value={value ? 'Yes' : 'No'} />
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
    )
  }
/**
 * 
 * <Dropdown
        mode="outlined"
        disabled={readonly}
        label={label}
        placeholder={'Yes'}
        options={options}
        value={value ? 'Yes' : 'No' }
        onSelect={(value) => onSelect(value === 'Yes')}
      />
 */