import { removeIndex, removeRedundantInfo } from "./bike-definition.service";



describe('BikeDefinitionService', () => {

  it('returns a list without index information', () => {
    const indexedList = ["1. a", "b", "3. c"];
    const result = indexedList.map(item => removeIndex(item));
    expect(result).toEqual(['a', 'b', 'c']);
  });

  it('removes repeated model/line information', () => {
    const redundantList = ["Defy Advanced 0", "Advanced 1", "Defy Advanced Pro"];
    const result = redundantList.map(item => removeRedundantInfo('Defy', item));
    expect(result).toEqual(['Advanced 0', 'Advanced 1', 'Advanced Pro']);
  });

});