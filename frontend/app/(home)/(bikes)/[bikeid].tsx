import BikeComponent from "@/components/bikes/BikeComponent";
import { useLocalSearchParams } from "expo-router";

const BikePage = () => {
  const search = useLocalSearchParams();
  const bikeId = new Number(search.bikeid) || 0;
  return (
    <BikeComponent bikeid={bikeId.valueOf()}/>
  );
};

export default BikePage;
