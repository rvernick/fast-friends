import { ensureString } from "@/common/utils";
import { Part } from "@/models/MaintenanceItem";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Dropdown } from "react-native-paper-dropdown";

const options = Object.entries(Part).map(([key, val]) => ({ label: val, value: val }));

type PartDropdownProps = {
  value: string;
  readonly?: boolean;
  onSelect: (value: string) => void;
  testID?: string;
};

export const PartDropdown: React.FC<PartDropdownProps> = ({ value, readonly = false, onSelect, testID="partDropdown" }) => {
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
      mode="outlined"
      disabled={readonly}
      label="Part"
      placeholder={ensureString(value)}
      options={options}
      value={value}
      onSelect={handleSelect}
      testID={testID}
    />    
  );
}
