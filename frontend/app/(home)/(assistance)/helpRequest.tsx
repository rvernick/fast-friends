import HelpRequestComponent from "@/components/help/HelpRequestComponent";
import { useLocalSearchParams } from "expo-router";

const HelpRequestPage = () => {
  const search = useLocalSearchParams();
  console.log('HelpRequestPage search: '+ JSON.stringify(search)  +'');
  const helpRequestId = new Number(search.id) || 0;
  return (
    <HelpRequestComponent id={helpRequestId.valueOf()}/>
  );
};

export default HelpRequestPage;
