import { createStyles, defaultWebStyles } from "@/common/styles";
import { isMobile } from "@/common/utils";
import { router } from "expo-router";
import { BaseLayout } from "@/components/layouts/base-layout";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";

export default function Index() {

  const signIn = () => { router.replace("/(sign-in-sign-up)/(sign-in)/sign-in") };

  return (
    <BaseLayout>
      <VStack className="max-w-[440px] w-full" space="md">
        <VStack className="md:items-center" space="md">
          <Heading className="text-center" size="3xl">
            Pedal Assistant Privacy
          </Heading>
          <Text className="text-center">Pedal Assistant does its best to maintain your data securly and privately</Text>
          <Text className="text-center">We track your use of the app to better support you.  We use the data for customer support and to know how best to update the experience.</Text>
          <Text className="text-center">We DO NOT sell this data nor do we use it for advertising.</Text>
          <Text className="text-center">Our privacy policy is evolving.  We'll notify you when it changes.</Text>
          <Text className="text-center">If you have questions, contact: privacy@pedal-assistant.com</Text>

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
