import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { ScrollView } from "@/components/ui/scroll-view";
import { Image } from "@/components/ui/image";
import { Pressable } from "../ui/pressable";

type BaseLayoutProps = {
  children: React.ReactNode;
  image?: string;
  imagePress?: () => void;
};

export const BaseLayout = (props: BaseLayoutProps) => {
  const imagePressed = () => {
    props.imagePress && props.imagePress();
  };

  return (
    <SafeAreaView className="w-full h-full">
      <ScrollView
        className="w-full h-full"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <HStack className="w-full h-full bg-background-0 flex-grow justify-center">
            {props.image ? (
              <VStack
                className="relative hidden md:flex h-full w-full flex-1  items-center justify-center"
                space="md"
              >
                <Pressable className="w-full h-1/2" onPress={imagePressed}>
                  <Image
                    source={{ uri: props.image }}
                    className="object-cover w-full h-full"
                    alt="Radial Gradient"
                  />
                </Pressable>
               <Image
                source={require("@/assets/images/spiral-gears.jpg")}
                className="object-cover w-full h-1/2"
                alt="Radial Gradient"
              />
            </VStack>
            ) : (
            <VStack
              className="relative hidden md:flex h-full w-full flex-1  items-center justify-center"
              space="md"
            >
              <Image
                source={require("@/assets/images/spiral-gears.jpg")}
                className="object-cover h-full w-full"
                alt="Radial Gradient"
              />
            </VStack>
          )}
          <VStack className="md:items-center md:justify-start flex-1 w-full  p-9 md:gap-10 gap-16 md:m-auto md:w-1/2 h-full">
            {props.children}
          </VStack>
        </HStack>
      </ScrollView>
    </SafeAreaView>
  );
};
