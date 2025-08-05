import { isMobile, isValidSession, login, remember, remind, sleep } from "@/common/utils";
import { BaseLayout } from "@/components/layouts/base-layout";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { router } from "expo-router";
import { Dimensions } from "react-native";
import { Image } from "react-native";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { useEffect } from "react";
import { FACE_ID_PASSWORD, FACE_ID_USERNAME, LAST_LOGIN_TIME_MS, TWELVE_HOURS_IN_MS } from "@/common/constants";
import { useSession } from "@/common/ctx";

export default function Index() {
  const session = useSession();
  const dimensions = Dimensions.get('window');


  const goToSignIn = () => { router.replace("/(sign-in-sign-up)/(sign-in)/sign-in") };
  const appStoreURL = "https://apps.apple.com/us/app/pedal-assistant/id6680175112?itscg=30200&itsct=apps_box_badge&mttnsubad=6680175112";

  const wasLoggedInRecently = async () => {
    const username = await remind(FACE_ID_USERNAME);
    if (!username || username.length < 5) return false;

    const password = await remind(FACE_ID_PASSWORD);
    if (!password || password.length < 5) return false;

    const lastLoginTimeString = await remind(LAST_LOGIN_TIME_MS);
    if (!lastLoginTimeString || lastLoginTimeString.length < 5) return false;

    const lastLoginTime = parseInt(lastLoginTimeString);
    return new Date().getTime() - lastLoginTime < TWELVE_HOURS_IN_MS;
  };

  const attemptLogin = async (username: string, password: string) => {
    const loginAttempt = login(username, password, session);
    loginAttempt
      .then(msg => {
        console.log('loginAttempt: ' + msg);
        if (!msg) {
          console.log('attemptLogin successful');
          router.replace('/logging-in');
        }
      })
      .catch(error => {
        console.log('Failed to log in ' + error.message);
      });
  }

  const loginUsingSavedCredentials = async () => {
    attemptLogin(await remind(FACE_ID_USERNAME), await remind(FACE_ID_PASSWORD));
  };

  const loginIfAppropriateOrGoToLoginPage = async () => {
    if (await isValidSession(session)) {
      router.replace('/logging-in');
    } else {
      if (isMobile() && await wasLoggedInRecently()) {
        loginUsingSavedCredentials();
      }
    }
  };

  useEffect(() => {
    loginIfAppropriateOrGoToLoginPage();
  }, []);

  return (
    <BaseLayout>
    <Icon></Icon>
    <Image
      source={{
        uri: 'https://apps.apple.com/us/app/pedal-assistant/id6680175112?itscg=30200&itsct=apps_box_badge&mttnsubad=6680175112',
      }}
      />
    <VStack className="max-w-[440px] w-full" space="md">
      <VStack className="md:items-center" space="md">
        <VStack>
          <Heading className="text-center" size="3xl">
            Pedal Assistant
          </Heading>
          <Text className="text-center">The usage-based maintenance tracker</Text>
          <Text className="text-center">You think about your rides</Text>
          <Text className="text-center">We'll remind you about your bike needs</Text>
          <Text> </Text>
        </VStack>
      </VStack>
      <Button className="bottom-button shadow-md rounded-lg m-1" onPress={goToSignIn}>
        <ButtonText>Get Started</ButtonText>
      </Button>
      <VStack className="md:items-center">
        <Image className="centered" source={require("../assets/images/api_logo_pwrd_by_strava_stack_light.png")}/>
        { isMobile() ? null : (
          <Pressable style={{ width: 246, height: 82}}
              onPress={() => window.open(appStoreURL)}>
            <Image className="absolute top-0 right-0"
              source={{
                uri: 'https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/black/en-us?releaseDate=1728691200',              }}
              style={{ width: 246, height: 82}}
            />
          </Pressable>
        )}
      </VStack>
    </VStack>
  </BaseLayout>
  );
}

