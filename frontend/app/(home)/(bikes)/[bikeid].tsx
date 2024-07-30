import BikeComponent from "@/components/bikes/BikeComponent";
import { ThemedView } from "@/components/ThemedView";
import { useLocalSearchParams } from "expo-router";

const Settings = () => {
  const search = useLocalSearchParams();
  const bikeId = new Number(search.bikeid) || 0;
  return (
    <ThemedView>
      <BikeComponent bikeid={bikeId.valueOf()}/>
    </ThemedView>
  );
};

export default Settings;
