import BikeComponent from "@/components/bikes/BikeComponent";
import HelpRequestComponent from "@/components/help/HelpRequestComponent";
import { useLocalSearchParams } from "expo-router";

const BikePage = () => {
  const search = useLocalSearchParams();
  const helpRequestId = new Number(search.id) || 0;
  return (
    <HelpRequestComponent id={helpRequestId.valueOf()}/>
  );
};

export default BikePage;
