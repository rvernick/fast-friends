import { getAllBrands } from "@/common/data-utils";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Text } from "@/components/ui/text";
import { Input, InputField } from "../ui/input";
import { Pressable } from "../ui/pressable";
import { VStack } from "../ui/vstack";
import { sleep } from "@/common/utils";
import { FlatList } from "react-native";

type BrandAutocompleteDropdownProps = {
  session: any;
  value: string;
  readonly: boolean;
  onSelect: (value: string) => void;
  testID?: string;
};

export const BrandAutocompleteDropdown: React.FC<BrandAutocompleteDropdownProps> = ({ session, value, readonly, onSelect, testID="brandSelector" }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [showList, setShowList] = useState(false);
  const [inList, setInList] = useState('');

  // TODO: handle unknown brands
  // TODO: set bike values based on selected brand

  const { data: brands, isFetching, isError } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => getAllBrands(session),
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
    console.log('getSuggestions brands:', brands);
    if (!text || text.length == 0) {
      return [];
    }
    const search = text.toLowerCase();
    const filteredBrands = brands.filter(b => b.toLowerCase().includes(search)).slice(0, 5);
    const sortedBrands = filteredBrands.sort((a, b) => closeScore(text, a, b));
    console.log('getSuggestions sortedModels:', sortedBrands);
    if (sortedBrands.length > 0) {
      setShowList(true);
    } else {
      setShowList(false);
    }
    if (sortedBrands.length === 0 && text.length > 3) {
      // searchForModel(text);  TODO: create API for asking ChatGPT to find brand like...
    }
    setSuggestions(sortedBrands);
    console.log('getSuggestions text: ' + text);
  }

  const closeScore = (text: string, a: string, b: string): number => {
    if (a.toLowerCase().startsWith(text)) return -2;   // prioritize matches at the start
    if (b.toLowerCase().startsWith(text)) return 2;
    return a.localeCompare(b);
  }

  const handleSelect = (item: string | null) => {
    console.log('handleSelect item:', item);
    setShowList(false);
    setInList('');
    if (!item) {
      setSelected('');
      onSelect('');
    } else {
      setSelected(item);
      onSelect(item);
    }
  }

  const handleBlur = async () => {
    await sleep(0.2);
    if (suggestions.length == 1) {
      handleSelect(suggestions[0])
    } else if (suggestions.length == 0) {
      verifyBrand();
    }
    setShowList(false);

  }

  const verifyBrand = () => {
    // TODO: verify brand with ChatGPT
  }

  const handleListBlur = (item: string) => {
    if (inList === item) {
      setInList('');
    }
  }

  useEffect(() => {
    setSelected(value);
    setShowList(false);
  }, [value]);

  const renderItem = (item: string) => {
    return (
      <Pressable
          onFocus={() => setInList(item)}
          onBlur={() => handleListBlur(item)}
          onPress={() => handleSelect(item)}>
        <Text>{item}</Text>
      </Pressable>
    );
  }


  return (
    <VStack>
      <Input
        className="opacity-100 z-50"
        variant="outline"
        size="md"
        isDisabled={false}
        isInvalid={false}
        isReadOnly={false}
      >
        <InputField
          className="opacity-100 z-50"
          autoComplete="off"
          value={selected}
          onChangeText={updateTextAndGetSuggestions}
          onBlur={handleBlur}
          placeholder="Enter brand here (e.g. Giant, Scott, Cannondale)"
          testID="brandInput"
          inputMode="none"
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="model"
          accessibilityHint="The model of the bike"/>
      </Input>
      {suggestions.length > 0 && (showList || inList.length > 0)? (
        <FlatList
          data={suggestions}
          renderItem={(item) => renderItem(item.item)}
          keyExtractor={item => item}
      />
      ): null}
    </VStack>
  );
}


const defaultBrands = ['Trek', 'Giant', 'Scott', 'Cannondale', 'Specialized', 'Kona', 'Yeti', 'Santa Cruz', 'Bianchi', 'Pinerello', 'GT', 'Colnago', 'Cervelo', 'Focus'];

/**
 * suggestionsListTextStyle={{
          color: '#8f3c96',
        }}

 */