import React, { useEffect } from "react";
import { useGlobalContext } from "@/common/GlobalContext";
import { Text, Surface, ActivityIndicator } from "react-native-paper";
import { router } from "expo-router";
import EmailVerifyController from "./EmailVerifyController";
import { useSession } from "@/ctx";


type EmailVerifyProps = {
  token: string,
  email: string
}

export const EmailVerifyComponent: React.FC<EmailVerifyProps> = ({token, email}) => {
  const appContext = useGlobalContext();
  const session = useSession();
  const controller = new EmailVerifyController(appContext);

  const attemptVerification = async () => {
    console.log("Attempting to verify email: " + token);
    console.log("Attempting to verify session: " + JSON.stringify(session));
    if (await controller.verifyEmail(token, session)) {
      router.push("/logging-in")
    }
  }

  useEffect(() => {
    attemptVerification();
  }, []);

  return (
    <Surface>
      <ActivityIndicator/>
      <Text>Sending Verification</Text>
    </Surface>
  
  );
};
