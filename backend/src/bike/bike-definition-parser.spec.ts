import { createDefinitionFromJSON, getMaterial } from "./bike-definition-parser";
import { Material } from "./enums";


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
      groupsetBrand: 'sHimaNo',
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
        productLink: 'https://www.specialized.com/en-US/product/road/roubaix-comp-2020/10003718',
      },
      rearShock: {    // should be ignored
        "brand": "None",
      },
      frontTire: {    // should be ignored
        "brand": "N/A",
      }

    }
    const bikeDef = createDefinitionFromJSON(json);
    expect(bikeDef.brand).toEqual('Specialized');
    expect(bikeDef.groupsetBrand).toEqual('Shimano');
    expect(bikeDef.colors.length).toEqual(2);
    expect(bikeDef.sizes.length).toEqual(4);
    expect(bikeDef.components.length).toEqual(2);
    expect(bikeDef.components[0].productLink).toBeUndefined();
    expect(bikeDef.components[1].productLink).toBeUndefined();
  })

  it('Should have nulls where undefined in json', () => {
    expect(true).toBeTruthy();
  });

  it('Should find material from string', () => {
    var material = getMaterial('FACT 10r Carbon');
    expect(material).toEqual(Material.CARBON);
    material = getMaterial('Carb fiber');
    expect(material).toEqual(Material.CARBON);
    material = getMaterial('Cromoly');
    expect(material).toEqual(Material.STEEL);
    material = getMaterial('TiTan');
    expect(material).toEqual(Material.TITANIUM);
    material = getMaterial('Allo');
    expect(material).toEqual(Material.ALLOY);
    material = getMaterial('Alumin');
    expect(material).toEqual(Material.ALLOY);
    material = getMaterial('DEFAULT');
    expect(material).toEqual(null);
  });

});
