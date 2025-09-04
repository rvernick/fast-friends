import { useGlobalContext } from "@/common/GlobalContext";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { router } from "expo-router";
import { pause } from "@/common/utils";
import { STRAVA_LINK_ROUTE, STRAVA_LOGIN_ROUTE } from "@/common/constants";
import { BaseLayout } from "@/components/layouts/base-layout";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Spinner } from "@/components/ui/spinner";

export default function RootLayout() {
const reply = useLocalSearchParams();
const globals = useGlobalContext();
  console.log('reply ', reply);
  console.log('globals ', globals);

  const checkIfThisIsStravaRedirect = async (reply: any) => {
    const path = reply['not-found'];
    console.log('path ', path);
    console.log('Strava Login Redirect0 ', path[0]);
    console.log('Strava Login Redirect1 ', path[1]);
    const redirect = path[1].toString() as string;
    console.log('Strava Login Redirect1 ', path[1].toString());
    console.log('Strava Login Redirect2 ', path[2]);

    if (redirect.includes(STRAVA_LOGIN_ROUTE)) {
      await pause();
      console.log('Strava Login Redirecting ', redirect);
      router.replace({
        pathname: "/strava-login/[verifycode]",
        params: {
          verifycode: path[2].toString(),
          code: reply['code'].toString(),
         }
      });
    } else if (redirect.includes(STRAVA_LINK_ROUTE)) {
      await pause();
      console.log('Strava Reply Redirecting ', redirect);
      router.replace({
        pathname: "/strava-reply/[verifycode]",
        params: {
          verifycode: path[2].toString(),
          code: reply['code'].toString(),
        }
      });
    } else {
      console.log('No Strava Redirect Found ');
      router.replace('/(home)');
    }
  }

  useEffect(() => {
    checkIfThisIsStravaRedirect(reply);
  }, []);

  return (
    <BaseLayout>
      <VStack className="max-w-[440px] w-full" space="md">
        <Spinner />
        <VStack className="md:items-center" space="md">
          <VStack>
            <Heading className="text-center" size="3xl">
              Verifying Strava Connection
            </Heading>
            <Text className="text-center">Pedal Assistant</Text>
            <Text className="text-center">The usage-based maintenance tracker</Text>
            <Text className="text-center">You think about your rides</Text>
            <Text className="text-center">We'll remind you about your bike needs</Text>
            <Text> </Text>
          </VStack>
        </VStack>
      </VStack>
    </BaseLayout>
  )
}

/**

reply  {"code": "cae23d7606435ddd17c37025bd354c536543534c", "not-found": ["www.pedal-assistant.com", "strava-login", "753752"], "scope": "activity:read,profile:read_all,read,read_all"}
globals  {"_jwtTokenExpiration": null, "_session": {"email": null, "isLoading": true, "jwt_token": null, "signIn": [Function signIn], "signOut": [Function signOut]}, "hotStringCache": Map {}, "queryClient": {}, "testing": true}

 */