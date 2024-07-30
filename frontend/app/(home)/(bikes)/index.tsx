import BikeListComponent from "@/components/bikes/BikeListComponent";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet, View, Text } from "react-native";

const Settings = () => {
  return (
    <ThemedView>
      <BikeListComponent/>
    </ThemedView>
  );
};

const styles = StyleSheet.create({});

export default Settings;
