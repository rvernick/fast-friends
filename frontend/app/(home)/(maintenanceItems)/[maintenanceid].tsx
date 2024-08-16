import MaintenanceItemComponent from "@/components/bikes/MaintenanceItemComponent";
import { useLocalSearchParams } from "expo-router";
import { Surface } from "react-native-paper";

const Settings = () => {
  const search = useLocalSearchParams();
  console.log('Settings maintenanceId: '+ search.maintenanceid + ' bikeId: '+ search.bikeid +'  ');
  const maintenanceId = new Number(search.maintenanceid) || 0;
  const bikeId = new Number(search.bikeid) || 0;
  console.log('MaintItemComponent maintenanceId: '+ maintenanceId + ', bikeId: '+ bikeId.valueOf()  +'');
  return (
    <Surface>
      <MaintenanceItemComponent maintenanceid={maintenanceId.valueOf()} bikeid={bikeId.valueOf()}/>
    </Surface>
  );
};

export default Settings;
