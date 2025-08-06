import { getModels } from "@/common/data-utils";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Text } from "@/components/ui/text";
import { Input, InputField } from "../ui/input";
import { Pressable } from "../ui/pressable";
import { VStack } from "../ui/vstack";
import { sleep } from "@/common/utils";
import { FlatList } from "react-native";

type ModelAutocompleteDropdownProps = {
  session: any;
  brand: string;
  value: string;
  readonly: boolean;
  onSelect: (value: string) => void;
  testID?: string;
};

export const ModelAutocompleteDropdown: React.FC<ModelAutocompleteDropdownProps> = ({ session, brand, value, readonly, onSelect, testID="brandSelector" }) => {
  const [models, setModels] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [showList, setShowList] = useState(false);
  const [inList, setInList] = useState('');

  // TODO: handle unknown brands
  // TODO: set bike values based on selected model

  const updateTextAndGetSuggestions = async (text: string) => {
    updateSuggestions(text);
    setSelected(text);
  }

  const updateSuggestions = async (text: string) => {
    console.log('getSuggestions text: ' + text);
    console.log('getSuggestions models: ', models);
    if (!text || text.length == 0) {
      setSuggestions([]);
      setShowList(false);
      return;
    }
    const search = text.toLowerCase();
    const filteredModels = models.filter(b => b.toLowerCase().includes(search));
    const sortedModels = filteredModels.sort((a, b) => closeScore(text, a, b)).slice(0, 5);
    console.log('getSuggestions sortedModels: ', sortedModels);
    if (sortedModels.length > 0) {
      setShowList(true);
    } else {
      setShowList(false);
    }
    if (sortedModels.length === 0 && text.length > 3) {
      // searchForModel(text);  TODO: create API for asking ChatGPT to find model like...
    }
    setSuggestions(sortedModels);
    console.log('getSuggestions text: ' + text);
  }

  const closeScore = (text: string, a: string, b: string): number => {
    if (text.length == 0) return a.localeCompare(b);
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
      onSelect(selected);
    }
    setShowList(false);

  }

  const verifyModel = () => {
    // TODO: verify brand with ChatGPT
  }

  const handleListBlur = (item: string) => {
    if (inList === item) {
      setInList('');
    }
  }

  const syncModels = async (updatedBrand: string) => {
    setModels(await getModels(session, updatedBrand));
  }

  useEffect(() => {
    syncModels(brand);
  }, [brand]);

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
          placeholder="Enter model here (e.g. Defy, Rockhopper, Occam, Domane)"
          testID="modelInput"
          inputMode="text"
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
