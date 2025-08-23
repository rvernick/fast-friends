import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { useSession } from "@/common/ctx";
import { useGlobalContext } from "@/common/GlobalContext";
import { ensureString, sleep } from "@/common/utils";
import { ActivityIndicator, Surface, Text } from "react-native-paper";
import BikeIndexController from "../settings/BikeIndexController";

type BikeIndexReplyProps = {
  verifycode: string;
  code: string;
  scope: string;
  state: string;
};

const BikeIndexReplyComponent: React.FC<BikeIndexReplyProps> = ({verifycode, code, scope, state}) => {
  const session = useSession();
  const appContext = useGlobalContext();
  appContext.setSession(session);
  const [synced, setSynced] = useState(false);

  const controller = new BikeIndexController(appContext);
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
      await sleep(5);
      appContext.invalidateUser(session);
      router.replace('/(home)/(maintenanceItems)/bulk-maintenance');
    } else {
      router.replace('/settings');
    }
  }

  useEffect(() => {
    if (!synced) {
      setSynced(true);
      try {
        if (code) {
          // updateStravaAndReturn(ensureString(code));
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
      <Text variant="displayLarge">Bike Index Connection successful. Syncing Now.</Text>
      <Text variant="displayMedium">Window will stay open when finished</Text>
    </Surface>
    );
  };

  export default BikeIndexReplyComponent;
