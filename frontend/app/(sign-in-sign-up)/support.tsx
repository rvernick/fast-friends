import { createStyles, defaultWebStyles } from "@/common/styles";
import { isMobile } from "@/common/utils";
import { BaseLayout } from "@/components/layouts/base-layout";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { router } from "expo-router";
import { Dimensions } from "react-native";
import { Text } from "@/components/ui/text";

export default function Index() {
  const dimensions = Dimensions.get('window');
  const useStyle = isMobile() ? createStyles(dimensions.width, dimensions.height) : defaultWebStyles

  const signIn = () => { router.replace("/(sign-in-sign-up)/(sign-in)/sign-in") };

  return (
    <BaseLayout>
    <VStack className="max-w-[440px] w-full" space="md">
      <VStack className="md:items-center" space="md">
          <Heading className="text-center" size="3xl">
            Pedal Assistant Support
          </Heading>
          <Text className="text-center">Pedal assistant wants you to have the best experience possible</Text>
          <Text className="text-center">If you need any help, contact: support@pedal-assistant.com</Text>
          <Text> </Text>
          <Text> </Text>
          <Button icon="bike-fast" mode="contained" onPress={signIn}>
            <ButtonText>Get Started</ButtonText>
          </Button>
        </VStack>
      </VStack>
    </BaseLayout>
  );
}
