import { Part } from "@/models/MaintenanceItem";
import { useEffect, useState } from "react";
import { Dropdown } from "./Dropdown";

const options = Object.entries(Part).map(([key, val]) => ({ label: val, value: val }));

type PartDropdownProps = {
  value: string;
  readonly?: boolean;
  onSelect: (value: string) => void;
  testID?: string;
  label?: string;
};

export const PartDropdown: React.FC<PartDropdownProps> = ({
    value,
    readonly = false,
    onSelect,
    testID="partDropdown",
    label = "Part"
  }) => {
  const [selectedValue, setSelectedValue] = useState(value);
  
  const handleSelect = (value: string | undefined) => {
    if (value) {
      console.log('PartDropdown onSelect: ', value);
      onSelect(value);
      setSelectedValue(value);
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
      initialLabel="Choose a Part..."
    />
  );
}

//     <Box>
//       <Text className="text-xs">{label}</Text>
//       <Select 
//         isDisabled={readonly}
//         isRequired={true}
//         testID={testID}
//         initialLabel="Choose an action..."
//         onValueChange={handleSelect}>
//         <SelectTrigger>
//           <SelectInput value={value} />
//           <SelectIcon as={ChevronDownIcon} />
//         </SelectTrigger>
//         <SelectPortal>
//           <SelectBackdrop />
//           <SelectContent>
//             <SelectDragIndicatorWrapper>
//               <SelectDragIndicator />
//             </SelectDragIndicatorWrapper>
//             {options.map(option => (
//               <SelectItem key={option.value} label={option.label} value={option.value} />
//             ))}
//           </SelectContent>
//         </SelectPortal>
//       </Select>
//     </Box>
//   );
// };
