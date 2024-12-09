import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '@/common/GlobalContext';
import { router, useNavigation } from 'expo-router';
import { List, Text, useTheme, Surface, Tooltip, Card, Button, TextInput } from 'react-native-paper';
import { Action, Part } from '@/models/MaintenanceItem';
import { Dimensions, ScrollView, View } from 'react-native';
import { createStyles, styles } from '@/common/styles';
import { isMobile } from '@/common/utils';
import InstructionController from './InstructionController';
import { Instruction, InstructionReference, Step } from '@/models/Instruction';
import { PartDropdown } from '../common/PartDropdown';
import { ActionDropdown } from '../common/ActionDropdown';
import { NeedTypeDropdown } from '../common/NeedTypeDropdown';
import { useSession } from '@/ctx';
import { useQuery, useQueryClient } from '@tanstack/react-query';

type InstructionProps = {
  part: string;
  action: string;
};

const InstructionComponent: React.FC<InstructionProps> = ({part, action}) => {
  const session = useSession();
  const queryClient = useQueryClient();
  const appContext = useGlobalContext();
  const navigation = useNavigation();
  const controller = new InstructionController(appContext);

  const [isInitialized, setIsInitialized] = useState(false);
  const partOptions = Object.entries(Part).map(([key, val]) => ({ label: val, value: val }));
  console.log('InstructionComponent part: ', part);
  const [partOption, setPartOption] = useState(part);
  const actionOptions = Object.entries(Action).map(([key, val]) => ({ label: val, value: val }));
  const [actionOption, setActionOption] = useState(action);
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [instruction, setInstruction] = useState<Instruction>();
  const [sortedSteps, setSortedSteps] = useState<Step[]>([]);
  const [references, setReferences] = useState<InstructionReference[]>([]);
  const [helpRequestId, setHelpRequestId] = useState(0);
  const [needType, setNeedType] = useState("I have a question");
  const [description, setDescription] = useState("");
  const [descriptionPlaceholder, setDescriptionPlaceholder] = useState("Enter your question here");

  const dimensions = Dimensions.get('window');
  const useStyle = isMobile() ? createStyles(dimensions.width, dimensions.height) : styles

  const sortSteps = (steps: Step[]): Step[] => {
    return steps.sort((a, b) => a.stepNumber - b.stepNumber);
  }

  const initialize = async () => {
    console.log("Initializing instruction component " + partOption + " - " + actionOption);
    setIsInitialized(true);
    var selectedPart = partOption;
    var selectedAction = actionOption;
    if (!selectedPart) {
      console.log("No part selected, defaulting to Chain " + partOption);
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
    console.log("updatingPartOption: " + value);
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

  const { data: helpRequests, error: helpError, isFetching: helpFetching } = useQuery({
    queryKey: ['helpRequests', session.email],
    queryFn: () => controller.getMyOpenHelpRequests(session),
    initialData: [],
    refetchOnWindowFocus: 'always',
    refetchOnReconnect: 'always',
    refetchOnMount: 'always',
  })

  const checkForHelpRequest = async (part: string, action: string) => {
    console.log("Looking for help request for part: " + part + " and action: " + action);
    console.log("Help requests: " + JSON.stringify(helpRequests));
    if (helpRequests && helpRequests.length > 0) {
      console.log("No help requests found");
      const helpRequest = helpRequests.find(hr => hr.part === part && hr.action === action);
      if (helpRequest) {
        console.log("Found help request for part: " + part + " and action: " + action);
        console.log("Help request: " + JSON.stringify(helpRequest));
        setNeedType(helpRequest.needType);
        setDescription(helpRequest.description);
        setHelpRequestId(helpRequest.id);
        return;
      }
    }
    setNeedType("I have a question");
    setDescription("");
    setHelpRequestId(0);
  }

  const updateNeedType = (value: string) => {
    setNeedType(value);
    updateDescriptionPlaceholder(value);
  }

  const updateDescriptionPlaceholder = (value: string) => {
    if (value === "I have a question") {
      setDescriptionPlaceholder("Enter your question here");
    } else {
      setDescriptionPlaceholder("Enter details here");
    }
  }

  const updateDescription = (value: string) => {
    setDescription(value);
  }

  const handleAskQuestion = async () => {
    await controller.askQuestion(session, partOption, actionOption, needType, description);
    queryClient.invalidateQueries({ queryKey: ['helpRequests', session.email] });
  }

  const goToHelpRequestDetails = () => {
    router.push( { pathname: '/(home)/(assistance)', params: { id: helpRequestId } });
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
    checkForHelpRequest(partOption, actionOption);
  }, [helpRequests, partOption, actionOption]);

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
          <PartDropdown
            value={partOption}
            onSelect={updatePartOption}
            />
          <ActionDropdown
            value={actionOption}
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
            <Card>
              <Text variant="titleMedium">Need More Information</Text>
              <NeedTypeDropdown
                value={needType}
                onSelect={updateNeedType}
                readonly={helpRequestId > 0}
              />
              <TextInput
                value={description}
                onChangeText={updateDescription}
                placeholder={descriptionPlaceholder}
                readOnly={helpRequestId > 0}
              />
              {helpRequestId == 0 ? 
                <Button onPress={handleAskQuestion}> Ask </Button> : 
                <Button onPress={goToHelpRequestDetails}> Details </Button>  }
              
            </Card>
            {references.length > 0 ? <Text variant="titleMedium">References:</Text> : null}
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
