import BikeListComponent from "@/components/bikes/BikeListComponent";
import { ThemedView } from "@/components/ThemedView";
import { Text } from 'react-native-paper'

const BikeList = () => {
  return (
    <ThemedView>
      <BikeListComponent/>
    </ThemedView>
  );
};

export default BikeList;
