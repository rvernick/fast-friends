import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '@/common/GlobalContext';
import { router, useNavigation } from 'expo-router';
import { List, Text, Surface, TextInput, Checkbox, Card, Button } from 'react-native-paper';
import { Dimensions, ScrollView, View } from 'react-native';
import { createStyles, styles } from '@/common/styles';
import { isMobile } from '@/common/utils';
import { Instruction, Step } from '@/models/Instruction';
import HelpRequestController from './HelpRequestController';
import { ActionDropdown } from '../common/ActionDropdown';
import { PartDropdown } from '../common/PartDropdown';
import { NeedTypeDropdown } from '../common/NeedTypeDropdown';
import { HelpRequest } from '@/models/HelpRequest';
import { useSession } from '@/ctx';

type HelpRequestProps = {
  id: number;
  part?: string;
  action?: string;
};

const HelpRequestComponent: React.FC<HelpRequestProps> = ({id, part="Chain", action="Replace"}) => {
  const appContext = useGlobalContext();
  const session = useSession();
  const navigation = useNavigation();
  const controller = new HelpRequestController(appContext);

  const [readOnly, setReadOnly] = useState(true);
  const [isNew, setIsNew] = useState(id === 0);
  const [isIntialized, setIsIntialized] = useState(false);
  const [partOption, setPartOption] = useState(part);
  const [actionOption, setActionOption] = useState(action);
  const [needType, setNeedType] = useState("I have a question");
  const [description, setDescription] = useState("");
  const [resolved, setResolved] = useState(false);

  const dimensions = Dimensions.get('window');
  const useStyle = isMobile() ? createStyles(dimensions.width, dimensions.height) : styles

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      console.log("Cannot go back from current screen");
      router.push('/(home)');
    }
  }

  const updatePartOption = async (value: string | undefined) => {
    if (!value) {
      return;
    }
    setPartOption(value);
  }

  const updateActionOption = async (value: string | undefined) => {
    if (!value) {
      return;
    }
    setActionOption(value);
  }

  const updateNeedType = async (value: string | undefined) => {
    if (!value) {
      return;
    }
    setNeedType(value);
  }

  const editOrDone = () => {
    if (readOnly) {
      setReadOnly(false);
    } else {
      const username = session.email ? session.email : '';
      controller.updateOrAddHelpRequest(
        session,
        id,
        username,
        partOption,
        actionOption,
        needType,
        description,
        resolved
      );
    }
  }

  const cancel = () => {
    if (readOnly || isNew) {
      goBack();
    } else {
      initialize();
      setReadOnly(true);
    }
  }

  const showInstructions = () => {
    router.push({pathname: '/(home)/(maintenanceItems)/instructions',  params: {part: partOption, action: actionOption}});
  }

  const resetHelpRequest = (helpRequest: HelpRequest) => {
    setPartOption(helpRequest.part);
    setActionOption(helpRequest.action);
    setNeedType(helpRequest.needType);
    setDescription(helpRequest.description);
    setResolved(helpRequest.resolved);
  }

  const initialize = async () => {
    controller.getHelpRequest(id, sessionStorage)
      .then(helpRequest => {
        if (helpRequest != null) {
          resetHelpRequest(helpRequest);
        }
      });
    setIsIntialized(true);
    setReadOnly(true);
  }

  useEffect(() => {
    navigation.setOptions({ title: 'Help Request' });
    if (id == 0) {
      setIsIntialized(true);
      setReadOnly(false);
      return;
    }
    if (!isIntialized) {
      initialize();
    }
  }, []);

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
      </Surface>
      <NeedTypeDropdown
        value={needType}
        onSelect={updateNeedType}
      />
      <TextInput value={description} placeholder="Enter your question here" />
      <Checkbox.Item
        label="Resolved"
        status={resolved ? 'checked' : 'unchecked'}
        onPress={() => setResolved(!resolved)}
      />

      <Card>
        <Button mode="contained"
          onPress={ editOrDone }
          accessibilityLabel="Finished editing"
          accessibilityHint="Will save any changes and go back">
          { readOnly ? 'Edit' : 'Done' }
        </Button>
        <Button mode="contained" onPress={ cancel }> Cancel </Button>
        { (readOnly && !isNew) ? <Button mode="contained" onPress={ showInstructions }> Instructions </Button> : null }
      </Card>
    </Surface>
  );
};

export default HelpRequestComponent;
