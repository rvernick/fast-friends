import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '@/common/GlobalContext';
import { useNavigation } from 'expo-router';
import { List, Text, useTheme, Surface, Tooltip } from 'react-native-paper';
import { Action, Part } from '@/models/MaintenanceItem';
import { Dropdown } from 'react-native-paper-dropdown';
import { Dimensions, ScrollView, View } from 'react-native';
import { createStyles, styles } from '@/common/styles';
import { isMobile } from '@/common/utils';
import InstructionController from './InstructionController';
import { Instruction, Step } from '@/models/Instruction';

type InstructionProps = {
  part: string;
  action: string;
};

const InstructionComponent: React.FC<InstructionProps> = ({part, action}) => {
  const appContext = useGlobalContext();
  const navigation = useNavigation();
  const controller = new InstructionController(appContext);

  const [isInitialized, setIsInitialized] = useState(false);
  const partOptions = Object.entries(Part).map(([key, val]) => ({ label: val, value: val }));
  const [partOption, setPartOption] = useState(part);
  const actionOptions = Object.entries(Action).map(([key, val]) => ({ label: val, value: val }));
  const [actionOption, setActionOption] = useState(action);
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [instruction, setInstruction] = useState<Instruction>();
  const [sortedSteps, setSortedSteps] = useState<Step[]>([]);

  const dimensions = Dimensions.get('window');
  const useStyle = isMobile() ? createStyles(dimensions.width, dimensions.height) : styles

  const sortSteps = (steps: Step[]): Step[] => {
    return steps.sort((a, b) => a.stepNumber - b.stepNumber);
  }

  const initialize = async () => {
    console.log("Initializing instruction component");
    setIsInitialized(true);
    var selectedPart = partOption;
    var selectedAction = actionOption;
    if (!selectedPart) {
      selectedPart = "Chain";
    }
    if (!selectedAction) {
      selectedAction = "Check";
    }
    setActionOption(selectedAction);
    updatePartOption(selectedPart);
  }

  const emptyInstruction = (part: string, action: string): Instruction => {
    const emptyStep = {
      id: 0,
      stepNumber: 1,
      name: "We have not created instructions for" + part + "/" + action + " yet.  Our apologies for any inconvenience.",
      description: "If you have a suggestion for how to perform this maintenance, please let us know.  suggestions@pedal-assistant.com",
      notes: "",
      hints: ""
    };
    return {
      id: 0,
      part: part,
      action: action,
      steps: [emptyStep],
      tools: [],
      difficulty: "Easy",
      references: [],
    };
  }

  const updateInstructions = async (instructions: Instruction[], part: string, action: string) => {
    console.log("Updating instructions for part: " + part + " and action: " + action);
    console.log("Instructions: " + JSON.stringify(instructions));
    const nonEmptyInstructions = ensureInstructionsNotEmpty(instructions, part, action);
    var instruction = nonEmptyInstructions.find(i => i.part === part && i.action === action);
    console.log("Updated instruction: " + JSON.stringify(instruction));
    if (!instruction) {   // makes the compiler happy by ensuring not undefined
      instruction = emptyInstruction(part, action);  // not necessary as ensureInstructionsNotEmpty will handle this case already
    }
    const sortedSteps = sortSteps(instruction.steps);
    setSortedSteps(sortedSteps);
    setInstruction(instruction);
    setInstructions(nonEmptyInstructions);
  }

  const ensureInstructionsNotEmpty = (instructions: Instruction[], part: string, action: string): Instruction[] => {
    const instructionCheck = instructions.find(i => i.part === part && i.action === action);
    instructions.push(emptyInstruction(part, action));
    return instructions;
  }


  const updatePartOption = async (value: string | undefined) => {
    if (!value) {
      return;
    }
    setPartOption(value);
    const instructions = await controller.getInstructions(value);
    console.log("Updating instructions for part: " + value);
    // console.log("Instructions: " + JSON.stringify(instructions));

    updateInstructions(instructions, value, actionOption);
  }
  
  const updateActionOption = async (value: string | undefined) => {
    if (!value) {
      return;
    }
    setActionOption(value);
    updateInstructions(instructions, partOption, value);
  }

  type DifficultyItemProps = {
    instruction: Instruction | undefined;
  };


  const DifficultyIcon: React.FC<DifficultyItemProps> = ({ instruction }) => {
    const theme = useTheme();
    if (!instruction) {
      return (
        <Text>difficulty</Text>
      )
    }
    const difficulty = instruction.difficulty;
    console.log("Difficulty: " + difficulty);
    var wrenches = 1;
    if (difficulty === "Easy") {
      wrenches = 2;
    }
    if (difficulty === "Tricky") {
      wrenches = 3;
    }
    if (difficulty === "Hard") {
      wrenches = 4;
    }

    return (  // flex-end
      <Tooltip title={difficulty}>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          <List.Icon icon="wrench" color={theme.colors.primary} style={{justifyContent: 'center'}}/>
          {wrenches > 1 ? <List.Icon  icon="wrench" color={theme.colors.primary}/> : null}
          {wrenches > 2 ? <List.Icon icon="wrench" color={theme.colors.primary}/> : null}
          {wrenches > 3 ? <List.Icon icon="wrench" color={theme.colors.primary}/> : null}
        </View>
      </Tooltip>
    )
  }

  useEffect(() => {
    navigation.setOptions({ title: 'Instructions' });
    if (!isInitialized) {
      initialize();
    }
  }, []);

  useEffect(() => {

  }, [partOption]);

  if (!instructions || instructions.length === 0) {
    return (
      <Text>
       Loading...
      </Text>
    )
  } else {
    return (
      <Surface style={useStyle.containerScreen}>
        <Surface style={useStyle.topButtons}>
          <Dropdown 
              value={partOption}
              options={partOptions}
              onSelect={updatePartOption}
              />    
            <Dropdown 
              value={actionOption}
              options={actionOptions}
              onSelect={updateActionOption}
              />
            <DifficultyIcon instruction={instruction}/> 
        </Surface>
        <Text variant="titleMedium">Steps:</Text>
          <ScrollView contentContainerStyle={{flexGrow:1}} style={useStyle.containerBody}>
            <List.Section>
              {/* <List.Accordion
                title="Tools"
                id="tools">
                {instruction?.tools?.map(tool => (
                  <List.Item title={tool.tool.name} description={tool.needed}/>
                ))} 
              </List.Accordion> */}
              {sortedSteps?.map(step => (
                <List.Accordion
                  title={step.name}
                  key={'stepli' + step.id}
                  id={'stepli' + step.id}>
                    <Text>{step.name}</Text>
                    <Text>{step.description}</Text>
                {step.notes && step.notes.length > 0 ?  <Text> </Text> : null}
                {step.notes && step.notes.length > 0 ?  <Text>Notes: {step.notes}</Text> : null}
                {step.hints && step.hints.length > 0 ? <Text> </Text> : null}
                {step.hints && step.hints.length > 0 ? <Text>Hints: {step.hints}</Text> : null}
              </List.Accordion>))}
            </List.Section>
            <Text variant="titleMedium">References:</Text>
            <List.Section>
              {instruction?.references?.map(reference => (
                <List.Item key={"ref" + reference.id} title={reference.title} description={reference.link}/>
              ))}
            </List.Section>
        </ScrollView>
      </Surface>
    );
  }
};

// navigation.push('Bike', { bike })

export default InstructionComponent;
