import { ensureString } from "@/common/utils";
import { Bike } from "@/models/Bike";
import { useEffect, useState } from "react";
import { Dropdown } from "react-native-paper-dropdown";


type BikeDropdownProps = {
  bikes: Bike[] | null | undefined;
  value: string;
  readonly: boolean;
  onSelect: (value: string) => void;
  useAll?: boolean;
};

export const BikeDropdown: React.FC<BikeDropdownProps> = ({ bikes, value, readonly, onSelect, useAll = false }) => {
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

    const syncOnRefresh = () => {
      if (!bikes || bikes == null || bikes.length == 0) return;
      setBikeList(bikes);
      setOptions(createOptions(bikes));
    }

    useEffect(() => {
      syncOnRefresh();
    }, [bikes]);
    
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
