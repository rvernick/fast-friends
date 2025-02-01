import React, { useEffect } from "react";
import { router } from "expo-router";
import { useSession } from "@/common/ctx";
import { useGlobalContext } from "@/common/GlobalContext";
import StravaController from "../settings/StravaController";
import { ensureString, sleep } from "@/common/utils";
import { ActivityIndicator, Surface, Text } from "react-native-paper";

type StravaReplyProps = {
  verifycode: string;
  code: string;
  scope: string;
  state: string;
};

const StravaReplyComponent: React.FC<StravaReplyProps> = ({verifycode, code, scope, state}) => {
  const session = useSession();  
  const appContext = useGlobalContext();
  appContext.setSession(session);

  const controller = new StravaController(appContext);
  const email = session.email? session.email : '';
  
  console.log('email: ' + email);
  console.log('verifycode: ' + verifycode);
  console.log('state: ' + state);
  console.log('scope: ' + scope);
  console.log('code: ' + code);

  const updateStravaAndReturn = async (code: string) => {
    const stravaInfo = await controller.updateStravaCode(session, appContext, code, verifycode);
    console.log('updated strava code: ' + JSON.stringify(stravaInfo));
    if (stravaInfo?.athlete?.id) {
      // window.close();
      await sleep(5);
      appContext.invalidateUser(session);
      router.replace({pathname: '/settings', params: {stravaid: stravaInfo?.athlete?.id}});
    } else {
      router.replace('/settings');
    }
  }

  useEffect(() => {
    try {
      if (code) {
        updateStravaAndReturn(ensureString(code));
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
    </Surface>
    );
  };

  export default StravaReplyComponent;
