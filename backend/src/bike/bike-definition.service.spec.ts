import { isAnIndexedList, removeIndex } from "./bike-definition.service";



describe('BikeDefinitionService', () => {
  it('are lists indexed', () => {
    const list = ['a', 'b', 'c'];
    expect(isAnIndexedList(list)).toBeFalsy();

    const indexedList = ["1. a", "2. b", "3. c"];
    expect(isAnIndexedList(indexedList)).toBeTruthy();
  });

  it('returns a list without index information', () => {
    const indexedList = ["1. a", "2. b", "3. c"];
    const result = indexedList.map(item => removeIndex(item));
    expect(result).toEqual(['a', 'b', 'c']);
  });

});