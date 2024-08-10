import BikeComponent from "@/components/bikes/BikeComponent";
import { useLocalSearchParams } from "expo-router";
import { Surface } from "react-native-paper";

const Settings = () => {
  const search = useLocalSearchParams();
  const bikeId = new Number(search.bikeid) || 0;
  return (
    <Surface>
      <BikeComponent bikeid={bikeId.valueOf()}/>
    </Surface>
  );
};

export default Settings;
