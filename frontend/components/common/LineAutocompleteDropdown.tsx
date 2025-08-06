import { getLines, getModels } from "@/common/data-utils";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Text } from "@/components/ui/text";
import { Input, InputField } from "../ui/input";
import { Pressable } from "../ui/pressable";
import { VStack } from "../ui/vstack";
import { sleep } from "@/common/utils";
import { FlatList } from "react-native";

type LineAutocompleteDropdownProps = {
  session: any;
  brand: string;
  model: string;
  value: string;
  readonly: boolean;
  blankPlaceholder: boolean;
  onSelect: (value: string) => void;
  testID?: string;
};

export const LineAutocompleteDropdown: React.FC<LineAutocompleteDropdownProps> = ({ session, brand, model, value, blankPlaceholder, onSelect, testID="brandSelector" }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [showList, setShowList] = useState(false);
  const [inList, setInList] = useState('');

  // TODO: handle unknown brands
  // TODO: set bike values based on selected model

  const updateTextAndGetSuggestions = async (text: string) => {
    if (!text) {
      setSelected('')
      updateSuggestions('');
      return;
    }
    updateSuggestions(text);
    setSelected(text);
  }

  const updateSuggestions = async (text: string) => {
    // console.log('getSuggestions text: ' + text);
    // console.log('getSuggestions lines: ', lines);
    const search = text.toLowerCase();
    const filteredLines = lines.filter(b => b.toLowerCase().includes(search));
    const sortedLines = filteredLines.sort((a, b) => closeScore(text, a, b)).slice(0, 5);
    console.log('getSuggestions sortedLines: ', sortedLines);
    if (sortedLines.length > 0) {
      setShowList(true);
    } else {
      setShowList(false);
    }
    if (sortedLines.length === 0 && text.length > 3) {
      // searchForModel(text);  TODO: create API for asking ChatGPT to find model like...
    }
    setSuggestions(sortedLines);
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
      verifyModel();
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

  const syncLines = async (updatedBrand: string, updatedModel: string) => {
    setLines(await getLines(session, updatedBrand, updatedModel));
  }

  useEffect(() => {
    syncLines(brand, model);
  }, [brand, model]);

  useEffect(() => {
    setSelected(value);
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
          placeholder={blankPlaceholder ? '' : "Enter Line here (e.g. Pro, Advanced, Comp, etc.)"}
          testID="lineInput"
          inputMode="text"
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="line"
          accessibilityHint="The line of the bike based on brand and model"/>
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
