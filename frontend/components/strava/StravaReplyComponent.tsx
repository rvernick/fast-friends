import React, { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useSession } from "@/ctx";
import { useGlobalContext } from "@/common/GlobalContext";
import StravaController from "../settings/StravaController";
import { ensureString, sleep } from "@/common/utils";
import { ActivityIndicator, Surface, Text } from "react-native-paper";

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
      sleep(10);
      router.replace('/settings?strava_id=' + stravaInfo?.athlete?.id);
    } else {
      router.replace('/settings');
    }
  }

  useEffect(() => {
    try {
      if (code) {
        if (session.jwt_token) {
          updateStravaAndReturn(ensureString(code));
        } else {
          console.log('no token found');
        }
      } else {
        console.log('no code found');
      }
    } catch (error) {
      console.log('error during login: ', error);
    }
  }, [session]);

  return (
    <Surface>
      <ActivityIndicator size="large"/>
      <Text variant="displayLarge">Strava Connection successful. Syncing Now.</Text>
      <Text variant="displayMedium">Window will stay open when finished</Text>
      {/* <Text>Code: {ensureString(code)}</Text>
      <Text>Scope:  {ensureString(scope)}</Text>
      <Text>State:  {ensureString(state)}</Text> */}
    </Surface>
    );
  };

  export default StravaReplyComponent;
