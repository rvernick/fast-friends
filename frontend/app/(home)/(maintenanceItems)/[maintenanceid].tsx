import MaintenanceItemComponent from "@/components/bikes/MaintenanceItemComponent";
import { useLocalSearchParams } from "expo-router";

const Settings = () => {
  const search = useLocalSearchParams();
  console.log('Settings search: '+ JSON.stringify(search)  +'');
  console.log('Settings maintenanceId: '+ search.id + ' bikeId: '+ search.bikeid +'  ');
  const maintenanceId = new Number(search.id) || 0;
  const bikeId = new Number(search.bikeid) || 0;
  console.log('MaintItemComponent maintenanceId: '+ maintenanceId + ', bikeId: '+ bikeId.valueOf()  +'');
  return (
    <MaintenanceItemComponent maintenanceid={maintenanceId.valueOf()} bikeid={bikeId.valueOf()}/>
  );
};

export default Settings;
