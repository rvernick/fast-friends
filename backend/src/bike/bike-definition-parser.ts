import { BikeComponent } from "./bike-component.entity";
import { BikeDefinitionBasis } from "./bike-definition-basis.entity";
import { BikeDefinition } from "./bike-definition.entity";
import { GroupsetBrand, Material, Part } from "./enums";

export const createDefinitionFromJSON = (query: string, definitionJSON: any): BikeDefinition => {
  const definition = new BikeDefinition();
  definition.brand = definitionJSON.brand;
  definition.model = definitionJSON.model;
  definition.line = definitionJSON.line;
  definition.year = parseInt(definitionJSON.year);
  populateDefinitionFromJSON(definition, query, definitionJSON);
  return definition;
}

export const populateDefinitionFromJSON = (definition: BikeDefinition, query: string, definitionJSON: any) => {
  definition.colors = definitionJSON.colors;
  definition.sizes = definitionJSON.sizes;
  definition.electricAssist = definitionJSON.electricAssist;
  definition.productLink = definitionJSON.productLink;
  definition.type = definitionJSON.type;
  definition.materialDescription = definitionJSON.frameMaterial;
  definition.material = getMaterial(definitionJSON.frameMaterial);
  definition.groupsetBrand = getGroupsetBrand(definitionJSON.groupsetBrand);
  definition.groupsetLine = definitionJSON.groupsetLine;
  definition.groupsetSpeed = definitionJSON.groupsetSpeed;
  const basis = new BikeDefinitionBasis();
  basis.json = definitionJSON;
  basis.query = query;
  definition.basis = definitionJSON;
  definition.description = definitionJSON.description;
  addComponents(definition, definitionJSON);
  console.log(`Created bike definition from JSON: ${JSON.stringify(definitionJSON)}`);
  return definition;
}

const getGroupsetBrand = (brand: string): GroupsetBrand => {
  if (!brand || brand.length === 0) {
    return null;
  }
  const brandLower = brand.toLowerCase();
  if (brandLower.match(/shim/i)) {
    return GroupsetBrand.SHIMANO;
  } else if (brandLower.match(/sram/i)) {
    return GroupsetBrand.SRAM;
  } else if (brandLower.match(/camp/i)) {
    return GroupsetBrand.CAMPAGNOLO;
  }
  return null;
}
export const getMaterial = (material: string): Material => {
  if (!material) {
    return null;
  }
  if (material.match(/carb/i)) {
    return Material.CARBON;
  } else if (material.match(/allo/i) || material.match(/alumin/i)) {
    return Material.ALLOY;
  } else if (material.match(/titan/i)) {
    return Material.TITANIUM;
  } else if (material.match(/stee/i) || material.match(/cro/i)) {
    return Material.STEEL;
  } else if (material.match(/bambo/i)) {
    return Material.BAMBOO;
  }
  return null;
}

const addComponents = (bikeDef: BikeDefinition, definitionJSON: any): void => {
  if (bikeDef.components == null) {
    bikeDef.components = [];
  }
  addComponent(bikeDef, Part.FRONT_WHEEL, definitionJSON.frontWheel);
  addComponent(bikeDef, Part.REAR_WHEEL, definitionJSON.rearWheel);
  addComponent(bikeDef, Part.FRONT_TIRE, definitionJSON.frontTire);
  addComponent(bikeDef, Part.REAR_TIRE, definitionJSON.rearTire);
  addComponent(bikeDef, Part.CHAIN, definitionJSON.chain);
  addComponent(bikeDef, Part.CASSETTE, definitionJSON.cassette);
  addComponent(bikeDef, Part.CRANKSET, definitionJSON.cranks);
  addComponent(bikeDef, Part.FRONT_SHIFTER, definitionJSON.frontShifter);
  addComponent(bikeDef, Part.REAR_SHIFTER, definitionJSON.rearShifter);
  addComponent(bikeDef, Part.FRONT_BRAKE, definitionJSON.frontBrake);
  addComponent(bikeDef, Part.REAR_BRAKE, definitionJSON.rearBrake);
  // addComponent(components, Part.PEDALS, definitionJSON.pedals);
  addComponent(bikeDef, Part.FRONT_SUSPENSION, definitionJSON.frontShock);
  addComponent(bikeDef, Part.REAR_SUSPENSION, definitionJSON.rearShock);
  return;
}

const addComponent = (bikeDef: BikeDefinition, part: Part, definition: any): BikeComponent => {
  if (definition) {
    console.log(`Found ${definition.brand} for part ${part}`);
  }
  if (!definition || !definition.brand) {
    console.log(`No brand ${definition} for part ${part}`);
    return;
  }
  if (definition.brand.toLowerCase() === "n/a" 
    || definition.brand.toLowerCase() === "not applicable"
    || definition.brand.toLowerCase() === "none") {
    return;
  }
  const result = new BikeComponent();
  result.part = part;
  result.brand = definition.brand;
  result.model = definition.model;
  result.line = definition.line;
  if (definition.productLink && definition.productLink !== bikeDef.productLink) {
    result.productLink = definition.productLink;
  }
  result.type = definition.type;
  result.size = definition.size;
  result.tubelessReady = definition.tubelessReady;
  result.clincher = definition.clincher;
  result.tubular = definition.tubular;
  result.hookless = definition.hookless;
  result.speeds = definition.speeds;
  result.thruAxle = definition.thruAxle;
  result.quickRelease = definition.quickRelease;
  result.cogConfiguration = definition.cogConfiguration;
  result.chainringCount = definition.chainringCount;
  result.chainringSizes = definition.chainringSizes;
  result.electronic = definition.electronic;
  result.wireless = definition.wireless;
  result.disc = definition.disc;
  result.hydraulic = definition.hydraulic;

  bikeDef.components.push(result)
}
