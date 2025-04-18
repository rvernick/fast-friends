import { getAllBrands, getModels } from "@/common/data-utils";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Text } from "@/components/ui/text";
import Autocomplete from "react-native-autocomplete-input";
import { Pressable } from "../ui/pressable";
import { Input, InputField } from "../ui/input";

type BrandAutocompleteDropdownProps = {
  session: any;
  brand: string;
  value: string;
  readonly: boolean;
  onSelect: (value: string) => void;
  testID?: string;
};

export const ModelAutocompleteDropdown: React.FC<BrandAutocompleteDropdownProps> = ({ session, brand, value, readonly, onSelect, testID="brandSelector" }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [model, setModel] = useState('');
  const [hasChosen, setHasChosen] = useState(false);

  // TODO: handle unknown models
  // TODO: set bike values based on selected model
  
  const { data: models, isFetching, isError } = useQuery({
    queryKey: ['models', brand],
    queryFn: async () => getModels(session, brand),
    initialData: [],  // defaultBrands,
    refetchOnReconnect: true,
    refetchInterval: 60*60*1000,
    refetchIntervalInBackground: true,
  });

  const updateTextAndGetSuggestions = async (text: string) => {
    getSuggestions(text);
    setSelected(text);
  }

  const getSuggestions = async (text: string) => {
    console.log('getSuggestions text: ' + text);
    if (!text || text.length == 0) {
      return [];
    }
    const search = text.toLowerCase();
    const filteredModels = models.filter(b => b.toLowerCase().includes(search));
    const sortedModels = filteredModels.sort((a, b) => closeScore(text, a, b));
    console.log('getSuggestions sortedModels:', sortedModels);
    setHasChosen(false);
    if (sortedModels.length === 0 && text.length > 3) {
      // searchForModel(text);  TODO: create API for asking ChatGPT to find brand like...
    }
    setSuggestions(sortedModels);
  }

  const closeScore = (text: string, a: string, b: string): number => {
    if (a.toLowerCase().startsWith(text)) return -2;   // prioritize matches at the start
    if (b.toLowerCase().startsWith(text)) return 2;
    return a.localeCompare(b);
  }

  const handleSelect = (item: string | null) => {
    console.log('handleSelect item:', item);
    if (!item) {
      setSelected('');
      onSelect('');
    } else {
      setSelected(item);
      onSelect(item);
      setHasChosen(true);
    }
  }

  const verifyModel = () => {
    // TODO: verify model with ChatGPT
  }

  return (
    <Autocomplete  // TODO: should make the border match other input styles
      data={suggestions}
      value={selected}
      onChangeText={updateTextAndGetSuggestions}
      autoCorrect={false}
      hideResults={hasChosen}
      flatListProps={{
        keyboardShouldPersistTaps: 'always',
        keyExtractor: (item, idx) => item,
        renderItem: ({ item }) => (
          <Pressable 
              onPress={() => handleSelect(item)}>
            <Text >{item}</Text>
        </Pressable>
        ),
      }}
    />
  );
}


const defaultBrands = ['Trek', 'Giant', 'Scott', 'Cannondale', 'Specialized', 'Kona', 'Yeti', 'Santa Cruz', 'Bianchi', 'Pinerello', 'GT', 'Colnago', 'Cervelo', 'Focus'];

/**
 * suggestionsListTextStyle={{
          color: '#8f3c96',
        }}

 */