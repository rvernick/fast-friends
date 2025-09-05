import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { useSession } from "@/common/ctx";
import { useGlobalContext } from "@/common/GlobalContext";
import StravaController from "../settings/StravaController";
import { ensureString, isDevelopment, loginWithVerifyCode, pause } from "@/common/utils";
import { BaseLayout } from "../layouts/base-layout";
import { VStack } from "../ui/vstack";
import { Spinner } from "../ui/spinner";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";

// probably need to split this into one for login and one for syncing

type StravaReplyProps = {
  verifycode: string;
  code: string;
  scope: string;
  state: string;
  error: string;
};

const StravaReplyComponent: React.FC<StravaReplyProps> = ({verifycode, code, scope, state, error}) => {
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

  const handleError = async (error: string) => {
    console.log('Error during sync: ', error);
    await pause();
    router.replace('/(sign-in-sign-up)/(sign-in)/sign-in');
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
        if (error) {
          console.log('error during sync: ', error);
          handleError(error);
        }
      } catch (error) {
        console.log('error during login: ', error);
      }
    }
  }, [session, synced]);

  return (
    <BaseLayout>
      <VStack className="max-w-[440px] w-full" space="md">
        <Spinner />
        <VStack className="md:items-center" space="md">
          <VStack>
            <Heading className="text-center" size="3xl">
              Strava Connection successful. Syncing Now.
            </Heading>
            <Text className="text-center">Pedal Assistant</Text>
            <Text className="text-center">The usage-based maintenance tracker</Text>
            <Text className="text-center">You think about your rides</Text>
            <Text className="text-center">We'll remind you about your bike needs</Text>
            <Text> </Text>
            <Text className="text-center">Window may stay open when finished</Text>
            <Text> </Text>
          </VStack>
        </VStack>
      </VStack>
    </BaseLayout>
    );
  };

  export default StravaReplyComponent;
