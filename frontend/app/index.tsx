import { createStyles, defaultWebStyles } from "@/common/styles";
import { isMobile } from "@/common/utils";
import { BaseLayout } from "@/components/layouts/base-layout";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { router } from "expo-router";
import { Dimensions } from "react-native";
import { Image } from "react-native";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";

export default function Index() {
  const dimensions = Dimensions.get('window');
  const useStyle = isMobile() ? createStyles(dimensions.width, dimensions.height) : defaultWebStyles

  const signIn = () => { router.replace("/(sign-in-sign-up)/(sign-in)/sign-in") };
  const appStoreURL = "https://apps.apple.com/us/app/pedal-assistant/id6680175112?itscg=30200&itsct=apps_box_badge&mttnsubad=6680175112";

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
            <Text className="text-center">Pedal Assistant, the Strava powered maintenance tracker</Text>
            <Text className="text-center">You think about your rides</Text>
            <Text className="text-center">We'll think about your bike needs so you don't have to</Text>
            <Text> </Text>
          </VStack>
        </VStack>
        <Button className="bottom-button" onPress={signIn}>
          <ButtonText>Get Started</ButtonText>
        </Button>
        <VStack>   
          <Image source={require("../assets/images/api_logo_pwrd_by_strava_stack_light.png")}/>
          { isMobile() ? null : (<Pressable style={{ width: 246, height: 82}} onPress={() => window.open(appStoreURL)}>
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

