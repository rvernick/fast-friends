import { ensureString } from "@/common/utils";
import { Bike } from "@/models/Bike";
import { Part } from "@/models/MaintenanceItem";
import { useEffect, useState } from "react";
import { Dropdown } from "react-native-paper-dropdown";

const options = Object.entries(Part).map(([key, val]) => ({ label: val, value: val }));

type PartDropdownProps = {
  value: string;
  readonly?: boolean;
  onSelect: (value: string) => void;
};

export const PartDropdown: React.FC<PartDropdownProps> = ({ value, readonly = false, onSelect }) => {
      
  const handleSelect = (value: string | undefined) => {
    if (value) {
      console.log('PartDropdown onSelect: ', value);
      onSelect(value);
    }
  }

  return (
    <Dropdown
        disabled={readonly}
        label="Part"
        placeholder={ensureString(value)}
        options={options}
        value={value}
        onSelect={handleSelect}
        testID="PartDropdown"
      />
  );
}
