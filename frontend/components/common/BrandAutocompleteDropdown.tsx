import { getAllBrands } from "@/common/data-utils";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import type { AutocompleteDropdownItem, IAutocompleteDropdownProps } from 'react-native-autocomplete-dropdown'
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import { Text } from "@/components/ui/text";

type BrandAutocompleteDropdownProps = {
  session: any;
  value: string;
  readonly: boolean;
  onSelect: (value: string) => void;
  testID?: string;
};

export const BrandAutocompleteDropdown: React.FC<BrandAutocompleteDropdownProps> = ({ session, value, readonly, onSelect, testID="brandSelector" }) => {
  const [suggestions, setSuggestions] = useState<AutocompleteDropdownItem[] | null>(null);
  const [selectedItem, setSelectedItem] = useState<AutocompleteDropdownItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [brand, setBrand] = useState('');

  const { data: brands, isFetching, isError } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => getAllBrands(session),
    initialData: [],  // defaultBrands,
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
    const search = text.toLowerCase();
    const filteredBrands = brands.filter(b => b.toLowerCase().includes(search));
    const sortedBrands = filteredBrands.sort((a, b) => closeScore(text, a, b));
    const filteredSuggestions = sortedBrands.map(b => ({ id: b, title: b }));
    console.log('filteredSuggestions: ', filteredSuggestions);
    if (filteredSuggestions.length === 0 && text.length > 3) {
      // searchForModel(text);  TODO: create API for asking ChatGPT to find brand like...
    }
    setSuggestions(filteredSuggestions);
    setLoading(false);
  }

  const closeScore = (text: string, a: string, b: string): number => {
    if (a.toLowerCase().startsWith(text)) return -2;   // prioritize matches at the start
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
        useFilter={true}
        clearOnFocus={false}
        showChevron={false}
        textInputProps={{
          placeholder: 'Type brand (e.g. Trek, Giant, Specialized...)',
        }}
        onSelectItem={handleSelect}
        loading={loading}
        onChangeText={getSuggestions}  
      />
  );
}


const defaultBrands = ['Trek', 'Giant', 'Scott', 'Cannondale', 'Specialized', 'Kona', 'Yeti', 'Santa Cruz', 'Bianchi', 'Pinerello', 'GT', 'Colnago', 'Cervelo', 'Focus'];

/**
 * suggestionsListTextStyle={{
          color: '#8f3c96',
        }}

 */