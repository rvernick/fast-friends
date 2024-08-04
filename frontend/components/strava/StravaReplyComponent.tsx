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

  var message = 'Updating your Strava settings...';

  const updateStravaAndReturn = async (code: string) => {
    const stravaInfo = await controller.updateStravaCode(session, appContext, code);
    console.log('updated strava code: ' + JSON.stringify(stravaInfo));
    appContext.invalidateUser(session);
    if (stravaInfo?.athlete?.id) {
      // window.close();
      router.replace('/settings?strava_id=' + stravaInfo?.athlete?.id);
    } else {
      router.replace('/settings');
    }
  }

  useEffect(() => {
    if (code) {
      if (session.jwt_token) {
        updateStravaAndReturn(ensureString(code));
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
      <Text>Strava Connection successful. Syncing Now.</Text>
      <Text>Window will stay open when finished</Text>
      {/* <Text>Code: {ensureString(code)}</Text>
      <Text>Scope:  {ensureString(scope)}</Text>
      <Text>State:  {ensureString(state)}</Text> */}
    </ThemedView>
    );
  };

  export default StravaReplyComponent;
