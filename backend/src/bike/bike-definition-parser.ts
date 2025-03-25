import { BikeComponent } from "./bike-component.entity";
import { BikeDefinition } from "./bike-definition.entity";
import { Part } from "./enums";

export const createDefinitionFromJSON = (definitionJSON: any): BikeDefinition => {
  const definition = new BikeDefinition();
  definition.brand = definitionJSON.brand;
  definition.model = definitionJSON.model;
  definition.line = definitionJSON.line;
  definition.year = parseInt(definitionJSON.year);
  definition.colors = definitionJSON.colors;
  definition.sizes = definitionJSON.sizes;
  definition.electricAssist = definitionJSON.electricAssist;
  definition.productLink = definitionJSON.productLink;
  definition.type = definitionJSON.type;
  definition.material = definitionJSON.material;
  definition.groupsetBrand = definitionJSON.groupsetBrand;
  definition.groupsetLine = definitionJSON.groupsetLine;
  definition.basis = definitionJSON;
  definition.components = createComponentsFrom(definitionJSON);
  console.log(`Created bike definition from JSON: ${JSON.stringify(definitionJSON)}`);
  return definition;
}

const createComponentsFrom = (definitionJSON: any): BikeComponent[] => {
  const components: BikeComponent[] = [];
  addComponent(components, Part.FRONT_WHEEL, definitionJSON.frontWheel);
  addComponent(components, Part.REAR_WHEEL, definitionJSON.rearWheel);
  addComponent(components, Part.FRONT_TIRE, definitionJSON.frontTire);
  addComponent(components, Part.REAR_TIRE, definitionJSON.rearTire);
  addComponent(components, Part.CHAIN, definitionJSON.chain);
  addComponent(components, Part.CASSETTE, definitionJSON.cassette);
  addComponent(components, Part.CRANKSET, definitionJSON.cranks);
  addComponent(components, Part.FRONT_SHIFTER, definitionJSON.frontShifter);
  addComponent(components, Part.REAR_SHIFTER, definitionJSON.rearShifter);
  addComponent(components, Part.FRONT_BRAKE, definitionJSON.frontBrake);
  addComponent(components, Part.REAR_BRAKE, definitionJSON.rearBrake);
  addComponent(components, Part.PEDALS, definitionJSON.pedals);
  addComponent(components, Part.FRONT_SUSPENSION, definitionJSON.frontShock);
  addComponent(components, Part.REAR_SUSPENSION, definitionJSON.rearShock);
  return components;
}

const addComponent = (components: BikeComponent[], part: Part, definition: any): BikeComponent => {
  if (definition) {
    console.log(`Found ${definition.brand} for part ${part}`);
  }
  if (!definition || !definition.brand) {
    console.log(`No brand ${definition} for part ${part}`);
    return;
  }
  const result = new BikeComponent();
  result.part = part;
  result.brand = definition.brand;
  result.model = definition.model;
  result.line = definition.line;
  result.productLink = definition.productLink;
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

  components.push(result)
}
