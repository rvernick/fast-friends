import React, { useEffect, useState } from "react";
import { GestureResponderEvent, Keyboard, NativeSyntheticEvent, TextInputSubmitEditingEventData } from "react-native";
import { login, remind, isMobile } from '@/common/utils';
import { baseUrl } from "../../common/http-utils";
import { router } from "expo-router";
import * as LocalAuthentication from 'expo-local-authentication';
import { useSession } from "@/common/ctx";
import { useQueryClient } from "@tanstack/react-query";
import { BaseLayout } from "@/layouts/base-layout";
import { VStack } from "@/components/ui/vstack";
import {
  ArrowLeftIcon,
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  Icon,
} from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { HStack } from "@/components/ui/hstack";
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from "@/components/ui/checkbox";
import { Link, LinkText } from "@/components/ui/link";
import { Button, ButtonText } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react-native";
import { useToast } from "@/components/ui/toast";

export const LoginComponent = () => {
  const session = useSession();
  const queryClient = useQueryClient();
  
  var user = '';
  var pword = '';

  if (baseUrl().includes('localhost:')) {
    user = 't5@t.com';
    pword = 'h@ppyHappy';
  }

  const [email, setEnteredEmail] = useState(user);
  const [password, setEnteredPassword] = useState(pword);
  const [loginErrorMessage, setLoginErrorMessage] = useState('');
  const [useFaceRecognition, setUseFaceRecognition] = useState(isMobile());
  const [canUseFaceId, setCanUseFaceId] = useState(false);
  const [passwordHidden, setPasswordHidden] = useState(true);
  const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email(),
    password: z.string().min(1, "Password is required"),
    rememberme: z.boolean().optional(),
  });

  type LoginSchemaType = z.infer<typeof loginSchema>;

  const onSubmit = (data: LoginSchemaType) => {
    // const user = USERS.find((element) => element.email === data.email);
    // if (user) {
    //   if (user.password !== data.password)
    //     setValidated({ emailValid: true, passwordValid: false });
    //   else {
    //     setValidated({ emailValid: true, passwordValid: true });
    //     toast.show({
    //       placement: "bottom right",
    //       render: ({ id }) => {
    //         return (
    //           <Toast nativeID={id} variant="accent" action="success">
    //             <ToastTitle>Logged in successfully!</ToastTitle>
    //           </Toast>
    //         );
    //       },
    //     });
    //     reset();
    //   }
    // } else {
    //   setValidated({ emailValid: false, passwordValid: true });
    // }
  };

  const handleState = () => {
    setPasswordHidden((showState) => {
      return !showState;
    });
  };
  const handleKeyPress = () => {
    Keyboard.dismiss();
    handleSubmit(onSubmit)();
  };

  const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<LoginSchemaType>({
      resolver: zodResolver(loginSchema),
    });
    const toast = useToast();
    const [validated, setValidated] = useState({
      emailValid: true,
      passwordValid: true,
    });

  const updateEmail = function(newText: string) {
    setLoginErrorMessage('');
    setEnteredEmail(newText.toLocaleLowerCase());
  }

  const updatePassword = function(newText: string) {
    setLoginErrorMessage('');
    setEnteredPassword(newText);
  }

  const loginButton = function(e: GestureResponderEvent) {
    e.preventDefault();
    attemptLogin();
  };

  const loginSubmit = function(e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) {
      e.preventDefault();
      attemptLogin();
    };

  const invalidateLoginConfirmation = () => {
    console.log('Invalidate login confirmation');
    queryClient.removeQueries({queryKey: ['loginConfirmation']});
  }

  const attemptLogin = function() {
    attemptLoginUsing(email, password);
  }

  const attemptLoginUsing = (username: string, pass: string) => {
    invalidateLoginConfirmation();
    const loginAttempt = login(username, pass, session);
    loginAttempt
      .then(msg => {
        console.log('loginAttempt: ' + msg);
        if (msg) {
          setLoginErrorMessage(msg);
          turnOffFaceRecognition();
        } else {
          console.log('attemptLogin successful');
          router.replace('/logging-in');
        }
      })
      .catch(error => {
        console.log('Failed to log in ' + error.message);
        setLoginErrorMessage(error.message);
        turnOffFaceRecognition();
      });
  };

  const turnOffFaceRecognition = () => {
    setUseFaceRecognition(false);
  }

  const attemptLoginViaDeviceId = async () => {
    const lastUser = await remind('ff.username');
    const lastPass = await remind('ff.password');
    if (lastUser && lastPass) {
      attemptLoginUsing(lastUser, lastPass);
    } else {
      turnOffFaceRecognition();
    }
  }

  const confirmUseFaceRecognition = async () => {
    if (!isMobile()) {
      setUseFaceRecognition(false);
      setCanUseFaceId(false);
      return false;
    }
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync()
    const hasBiometrics = await LocalAuthentication.isEnrolledAsync();
    const lastUser =  await remind('ff.username');
    const lastPass = await remind('ff.password');
    if ( !hasHardware
      || !hasBiometrics
      || !types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)
      || !(lastUser && lastUser.length > 0)
      || !(lastPass && lastPass.length > 0)) {
      setUseFaceRecognition(false);
      setCanUseFaceId(false);
      return false;
    } else {
      setCanUseFaceId(true);
      return true;
    }
  }

  const loginWithFaceRecognition = async () => {
    const confirm = await confirmUseFaceRecognition();
    if (confirm) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Scan your face to log in',
        cancelLabel: 'Cancel',
      });
      if (result.success) {
        console.log('Face ID login successful');
        attemptLoginViaDeviceId();
      } else {
        console.log('Face ID login failed');
        turnOffFaceRecognition();
        setLoginErrorMessage('Face ID login failed');
      }
    }
  }

  useEffect(() => {
    if (useFaceRecognition) {
      loginWithFaceRecognition();
    }
    if (!canUseFaceId) {
      confirmUseFaceRecognition();
    }
  }, [useFaceRecognition, canUseFaceId]);

  if (useFaceRecognition && canUseFaceId) {
    return (
      <BaseLayout>
      <VStack className="max-w-[440px] w-full" space="md"></VStack>
      </BaseLayout>
      // <Surface>
      //   <Text>Face Recognition</Text>
      // </Surface>
    );
  }
  return (
    <BaseLayout>
      <VStack className="max-w-[440px] w-full" space="md">
        <VStack className="md:items-center" space="md">
          <Pressable
            onPress={() => {
              router.back();
            }}
          >
            <Text>Back</Text>
            {/* <Icon
              as={ArrowLeftIcon}
              className="md:hidden text-background-800"
              size="xs"
            /> */}
          </Pressable>
          <VStack>
            <Heading className="md:text-center" size="3xl">
              Log in
            </Heading>
            <Text>Login to start using gluestack</Text>
          </VStack>
        </VStack>
      <VStack className="w-full">
        <VStack space="xl" className="w-full">
          <FormControl
            isInvalid={!!errors?.email || !validated.emailValid}
            className="w-full"
          >
            <FormControlLabel>
              <FormControlLabelText>Email</FormControlLabelText>
            </FormControlLabel>
            <Controller
              defaultValue=""
              name="email"
              control={control}
              rules={{
                validate: async (value) => {
                  try {
                    await loginSchema.parseAsync({ email: value });
                    return true;
                  } catch (error: any) {
                    return error.message;
                  }
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input>
                  <InputField
                    placeholder="Enter email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    onSubmitEditing={handleKeyPress}
                    returnKeyType="done"
                  />
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorIcon as={AlertTriangle} />
              <FormControlErrorText>
                {errors?.email?.message ||
                  (!validated.emailValid && "Email ID not found")}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
          {/* Label Message */}
          <FormControl
            isInvalid={!!errors.password || !validated.passwordValid}
            className="w-full"
          >
            <FormControlLabel>
              <FormControlLabelText>Password</FormControlLabelText>
            </FormControlLabel>
            <Controller
              defaultValue=""
              name="password"
              control={control}
              rules={{
                validate: async (value) => {
                  try {
                    await loginSchema.parseAsync({ password: value });
                    return true;
                  } catch (error: any) {
                    return error.message;
                  }
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input>
                  <InputField
                    type={passwordHidden ? "password" : "text"}
                    placeholder="Enter password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    onSubmitEditing={handleKeyPress}
                    returnKeyType="done"
                  />
                  <InputSlot onPress={handleState} className="pr-3">
                    <InputIcon as={passwordHidden ? EyeOffIcon : EyeIcon} />
                  </InputSlot>
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorIcon as={AlertTriangle} />
              <FormControlErrorText>
                {errors?.password?.message ||
                  (!validated.passwordValid && "Password was incorrect")}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
          <HStack className="w-full justify-between ">
            <Controller
              name="rememberme"
              defaultValue={false}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Checkbox
                  size="sm"
                  value="Remember me"
                  isChecked={value}
                  onChange={onChange}
                  aria-label="Remember me"
                >
                  <CheckboxIndicator>
                    <CheckboxIcon as={CheckIcon} />
                  </CheckboxIndicator>
                  <CheckboxLabel>Remember me</CheckboxLabel>
                </Checkbox>
              )}
            />
            <Link href="/auth/forgot-password">
              <LinkText className="font-medium text-sm text-primary-700 group-hover/link:text-primary-600">
                Forgot Password?
              </LinkText>
            </Link>
          </HStack>
        </VStack>
        <VStack className="w-full my-7 " space="lg">
          <Button className="w-full" onPress={handleSubmit(onSubmit)}>
            <ButtonText className="font-medium">Log in</ButtonText>
          </Button>
        </VStack>
        <HStack className="self-center" space="sm">
          <Text size="md">Don't have an account?</Text>
          <Link href="/auth/signup">
            <LinkText
              className="font-medium text-primary-700 group-hover/link:text-primary-600  group-hover/pressed:text-primary-700"
              size="md"
            >
              Sign up
            </LinkText>
          </Link>
        </HStack>
      </VStack>
    </VStack>
    </BaseLayout>

  );
}


function zodResolver(loginSchema: z.ZodObject<{ email: z.ZodString; password: z.ZodString; rememberme: z.ZodOptional<z.ZodBoolean>; }, "strip", z.ZodTypeAny, { email: string; password: string; rememberme?: boolean | undefined; }, { email: string; password: string; rememberme?: boolean | undefined; }>): import("react-hook-form").Resolver<{ email: string; password: string; rememberme?: boolean | undefined; }, any> | undefined {
  console.log('resolver called');
}
/** 
const PaperLoginForm = () => {
  return (
    <Surface style={useStyle.container}>
      <Text style={{textAlign: "center"}} variant="headlineMedium">Pedal Assistant</Text>

      <ActivityIndicator animating={useFaceRecognition} testID="activity" size="large"/>
      <Card >
        <Card.Content>
            <TextInput
                label="Email"
                keyboardType="email-address"
                inputMode="email"
                textContentType="emailAddress"
                onChangeText={updateEmail}
                value={email}
                autoComplete="email"
                autoCapitalize="none"
                testID="emailInput"
                accessibilityLabel="email input"
                accessibilityHint="The email address for the account being logged in"/>
            <TextInput label="Password"
                secureTextEntry={passwordHidden}
                inputMode="text"
                textContentType="password"
                autoCapitalize="none"
                onChangeText={updatePassword}
                onSubmitEditing={loginSubmit}
                value={password}
                right={<TextInput.Icon icon="eye" onPress={() => setPasswordHidden(!passwordHidden)}/>}
                testID="passwordInput"
                accessibilityLabel="password input"
                accessibilityHint="The password for the account being logged in"/>
            <HelperText 
                type="error"
                visible={loginErrorMessage.length > 0}
                testID="loginError">
              {loginErrorMessage}
            </HelperText>
            <Button
              mode="contained"
              onPress={loginButton}
              testID="loginButton"
              accessibilityLabel="confirm button"
              accessibilityHint="Will attempt to login based on the user and password entered">
              Confirm
            </Button>
            <Button
              onPress={() => router.push('/(sign-in)/password-reset')}
              accessibilityLabel="forgot password button"
              accessibilityHint="Go to the screen to request a password reset">
              Forgot email/password
            </Button>
            <Button
              onPress={() => router.replace('/(sign-in-sign-up)/sign-up')}
              accessibilityLabel="Sign Up button"
              accessibilityHint="Go to the create account screen">
              Sign Up
            </Button>
            {canUseFaceId ? (
              <Button onPress={() => setUseFaceRecognition(true)}>
                [ Use Face ID ]
              </Button>
            ) : null}
        </Card.Content>
      </Card>  
    </Surface>
  );
}
*/