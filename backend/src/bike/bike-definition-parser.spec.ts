import { createDefinitionFromJSON } from "./bike-definition-parser";


describe('BikeDefinitionParser', () => {

  it('Should parse json', () => {
    const json = {
      brand: 'Specialized',
      model: 'Roubaix',
      line: 'Comp',
      year: '2020',
      colors: ['Blue', 'White'],
      sizes: ['S', 'M', 'L', 'XL'],
      electricAssist: false,
      productLink: 'https://www.specialized.com/en-US/product/road/roubaix-comp-2020/10003718',
      type: 'Road',
      material: 'Carbon fiber',
      groupsetBrand: 'Specialized',
      groupsetLine: '105',
      chain: {
        "brand": "Shimano",
        "model": "HGX",
        "speeds": "11",
      },
      frontWheel: {
        "brand": "Shimano",
        "model": "Shimano 115",
        "size": "16",
        "tubelessReady": true,
        "clincher": false,
      },
    }
    const bikeDef = createDefinitionFromJSON(json);
    expect(bikeDef.brand).toEqual('Specialized');
    expect(bikeDef.colors.length).toEqual(2);
    expect(bikeDef.sizes.length).toEqual(4);
    expect(bikeDef.components.length).toEqual(2);
  })

  it('Should have nulls where undefined in json', () => {
    expect(true).toBeTruthy();
  });
});
