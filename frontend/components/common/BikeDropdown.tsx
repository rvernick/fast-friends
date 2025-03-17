import { ensureString } from "@/common/utils";
import { Bike } from "@/models/Bike";
import { useEffect, useState } from "react";
import { Dropdown } from "./Dropdown";

type BikeDropdownProps = {
  bikes: Bike[] | null | undefined;
  value: string;
  readonly: boolean;
  onSelect: (value: string) => void;
  useAll?: boolean;
  testID?: string;
};

export const BikeDropdown: React.FC<BikeDropdownProps> = ({ 
    bikes,
    value,
    readonly,
    onSelect,
    useAll = false,
    testID="bikeDropdown"}) => {
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
    <Dropdown
      value={bikeNameFor(value)}
      disabled={readonly}
      onSelect={handleSelect}
      options={options}
      testID={testID}
      initialLabel="Choose a bike..."
    />
  );
};
