import MaintenanceHistoryItemComponent from "@/components/bikes/MaintenanceHistoryItemComponent";
import { useLocalSearchParams, useNavigation } from "expo-router";

const MaintenanceHistoryScreen = () => {
  const search = useLocalSearchParams();
  const nav = useNavigation();
  console.log('nav search: '+ JSON.stringify(nav));
  console.log('maintenancehistoryid search: '+ JSON.stringify(search)  +'');
  console.log('Settings maintenanceId: '+ search.maintenancehistoryid + ' bikeId: '+ search.bikeid +'  ');
  const maintenanceHistoryId = new Number(search.maintenancehistoryid) || 0;
  const bikeId = new Number(search.bikeid) || 0;
  console.log('MaintHistItemComponent maintenanceId: '+ maintenanceHistoryId + ', bikeId: '+ bikeId.valueOf()  +'');
  return (
    <MaintenanceHistoryItemComponent maintenancehistoryid={maintenanceHistoryId.valueOf()} bikeid={bikeId.valueOf()}/>
  );
};

export default MaintenanceHistoryScreen;
