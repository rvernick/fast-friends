import { getAllBrands, getModels } from "@/common/data-utils";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import type { AutocompleteDropdownItem, IAutocompleteDropdownProps } from 'react-native-autocomplete-dropdown'
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import { Text } from "@/components/ui/text";

type ModelAutocompleteDropdownProps = {
  session: any;
  brand: string;  // received from parent component
  value: string;
  readonly: boolean;
  onSelect: (value: string) => void;
  testID?: string;
};

export const ModelAutocompleteDropdown: React.FC<ModelAutocompleteDropdownProps> = ({ session, value, readonly, onSelect, testID="modelSelector" }) => {
  const [suggestions, setSuggestions] = useState<AutocompleteDropdownItem[] | null>(null);
  const [selectedItem, setSelectedItem] = useState<AutocompleteDropdownItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [brand, setBrand] = useState('');

  const { data: models } = useQuery({
    queryKey: ['models', brand],
    queryFn: async () => getModels(session, brand),
    initialData: [], 
    refetchOnReconnect: true,
    refetchInterval: 60*60*1000,
    refetchIntervalInBackground: true,
  });

  const getSuggestions = async (text: string) => {
    console.log('getSuggestions text: ' + text);
    setLoading(true);
    if (!text || text.length == 0) {
      setLoading(false);
      return [];
    }
    if (text && text.length > 0) {
      const search = text.toLowerCase();
      const filteredModels = models.filter(b => b.toLowerCase().includes(search));
      const sortedModels = filteredModels.sort((a, b) => closeScore(text, a, b));
      const filteredSuggestions = sortedModels.map(b => ({ id: b, title: b }));  
      setSuggestions(filteredSuggestions);
    } else {
      const sortedModels = models.sort((a, b) => a.localeCompare(b));
      const modelSuggestions = sortedModels.map(b => ({ id: b, title: b }));
      setSuggestions(modelSuggestions)
    }
    setLoading(false);
  }

  const closeScore = (text: string, a: string, b: string): number => {
    if (a.toLowerCase().startsWith(text)) return -2;
    if (b.toLowerCase().startsWith(text)) return 2;
    return a.localeCompare(b);
  }

  const handleSelect = (item: AutocompleteDropdownItem | null) => {
    console.log('handleSelect item:', item);
    if (!item) {
      setSelectedItem(null);
      onSelect('');
    } else {
      setSelectedItem(item);
      onSelect(item.id);
    }
  }

  return (
    <AutocompleteDropdown
        dataSet={suggestions}
        editable={!readonly}
        closeOnBlur={true}
        showChevron={false}
        useFilter={true}
        clearOnFocus={false}
        textInputProps={{
          placeholder: 'Type Model (e.g. Defy, Stingray, ...)',
        }}
        onSelectItem={handleSelect}
        loading={loading}
        onChangeText={getSuggestions}
      />
  );
}


const defaultBrands = ['Trek', 'Giant', 'Scott', 'Cannondale', 'Specialized', 'Kona', 'Yeti', 'Santa Cruz', 'Bianchi', 'Pinerello', 'GT', 'Colnago', 'Cervelo', 'Focus'];
