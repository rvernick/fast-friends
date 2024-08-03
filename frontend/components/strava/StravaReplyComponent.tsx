import React, { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useSession } from "@/ctx";
import { useGlobalContext } from "@/common/GlobalContext";
import StravaController from "../settings/StravaController";
import { ensureString } from "@/common/utils";
import { ActivityIndicator, Text } from "react-native-paper";
import { ThemedView } from "../ThemedView";

type StravaReplyProps = {
  code: string;
  scope: string;
  state: string;
};

const StravaReplyComponent: React.FC<StravaReplyProps> = () => {
  const { code, scope, state } = useLocalSearchParams();
  const session = useSession();  
  const appContext = useGlobalContext();
  appContext.setSession(session);

  const controller = new StravaController(appContext);
  const email = session.email? session.email : '';
  
  console.log('email: ' + email);
  console.log('state: ' + state);
  console.log('scope: ' + scope);
  console.log('code: ' + code);

const refresh = () => {
  if (appContext.isLoggedIn()) {
    console.log('refreshing is logged in');
  } else {
    console.log('refreshing...' + window.parent.location.origin);
    console.log(window.parent);
    window.parent.location = window.parent.location.origin;
  }
};

var message = 'Updating your Strava settings...';

const updateStravaAndReturn = async (code: string) => {
  await controller.updateStravaCode(session, appContext, code);
  console.log('updated strava code: ');
  appContext.invalidateUser(session);
}

useEffect(() => {
  if (code) {
    if (session.jwt_token) {
      updateStravaAndReturn(ensureString(code));
//     router.replace('/settings');
    } else {
      console.log('no token found');
    }
  } else {
    console.log('no code found');
  }
}, [session]);

  return (
    <ThemedView>
      <ActivityIndicator size="large"/>
      <Text>Strava Reply Component Connection successful. Please return to Settings.</Text>
      <Text>Code: {ensureString(code)}</Text>
      <Text>Scope:  {ensureString(scope)}</Text>
      <Text>State:  {ensureString(state)}</Text>
    </ThemedView>
    );
  };

  export default StravaReplyComponent;
