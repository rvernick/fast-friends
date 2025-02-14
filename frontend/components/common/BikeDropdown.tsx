import { ensureString } from "@/common/utils";
import { Bike } from "@/models/Bike";
import { useEffect, useState } from "react";
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from "../ui/select";
import { ChevronDownIcon } from "../ui/icon";
import { Box } from "../ui/box";
import { Text } from "../ui/text";

type BikeDropdownProps = {
  bikes: Bike[] | null | undefined;
  value: string;
  readonly: boolean;
  onSelect: (value: string) => void;
  useAll?: boolean;
  label?: string;
};

export const BikeDropdown: React.FC<BikeDropdownProps> = ({ 
    bikes,
    value,
    readonly,
    onSelect,
    useAll = false,
    label = "Bike" }) => {
  const [bikeList, setBikeList] = useState<Bike[]>([]);
  const [options, setOptions] = useState<any[]>([]);
    
    //  console.log('BikeDropdown bike: ', value);
    // console.log('BikeDropdown bikes: ', JSON.stringify(bikes));
    const createOptions = (bikes: Bike[]) => {
      const result = [];
      if (bikes.length > 1 && useAll) {
        result.push({ label: 'All Bikes', value: '_All' });
      }
      for (const bike of bikes) {
        result.push({ label: bike.name, value: ensureString(bike.id) });
      }
      return result;
    }
    
    const handleSelect = (value: string | undefined) => {
      if (value) {
        console.log('BikeDropdown onSelect: ', value);
        onSelect(value);
      }
    }

    const bikeNameFor = (value: string) => {
      if (value === '_All') {
        return 'All Bikes';
      }
      if (!bikes || bikes == null || bikes.length == 0) return "";
      for (const bike of bikes) {
        if (ensureString(bike.id) === value) {
          return bike.name;
        }
      }
      return "Select a bike...";
    }

    const syncOnRefresh = () => {
      if (!bikes || bikes == null || bikes.length == 0) return;
      setBikeList(bikes);
      setOptions(createOptions(bikes));
    }

    useEffect(() => {
      syncOnRefresh();
    }, [bikes, useAll]);
    
    return (
    <Box>
      <Text className="text-xs">{label}</Text>
    <Select 
      isDisabled={readonly}
      // testID={testID}
      initialLabel="Choose a bike..."
      onValueChange={handleSelect}>
      <SelectTrigger>
        <SelectInput value={bikeNameFor(value)} />
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
 * return (
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
 */
/**
    return (
      <Dropdown
        mode="outlined"
        disabled={readonly}
        label="Bike"
        placeholder={ensureString(value)}
        options={options}
        value={value}
        onSelect={handleSelect}
        testID="BikeDropdown"
      />
    )
  }
*/