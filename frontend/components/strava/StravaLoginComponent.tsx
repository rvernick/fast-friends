import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { useSession } from "@/common/ctx";
import { useGlobalContext } from "@/common/GlobalContext";
import StravaController from "../settings/StravaController";
import { ensureString, isDevelopment, loginWithVerifyCode, sleep } from "@/common/utils";
import { ActivityIndicator, Surface, Text } from "react-native-paper";

// probably need to split this into one for login and one for syncing

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
  const [synced, setSynced] = useState(false);

  const controller = new StravaController(appContext);
  const email = session.email? session.email : '';

  if (isDevelopment()) {
    console.log('email: ' + email);
    console.log('verifycode: ' + verifycode);
    console.log('state: ' + state);
    console.log('scope: ' + scope);
    console.log('code: ' + code);
  }

  const updateStravaAndReturn = async (code: string) => {
    const tokenInfo = await controller.doTokenExchange(session, appContext, code, verifycode);
    const errorMessage = await controller.upsertStravaUser(session, tokenInfo, code, verifycode);
    if (errorMessage === '') {
      await loginWithVerifyCode(verifycode, session);
      router.replace('/logging-in');
    }
  }

  useEffect(() => {
    if (!synced) {
      setSynced(true);
      try {
        if (code) {
          updateStravaAndReturn(ensureString(code));
        } else {
          console.log('no code found');
        }
      } catch (error) {
        console.log('error during login: ', error);
      }
    }
  }, [session, synced]);

  return (
    <Surface>
      <ActivityIndicator size="large"/>
      <Text variant="displayLarge">Strava Connection successful. Syncing Now.</Text>
      <Text variant="displayMedium">Window will stay open when finished</Text>
    </Surface>
    );
  };

  export default StravaReplyComponent;
