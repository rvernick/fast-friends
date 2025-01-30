import { ensureString } from '@/common/utils';
import MaintenanceHistoryComponent from '@/components/bikes/MaintenanceHistoryComponent';
import { useLocalSearchParams } from 'expo-router';

export default function MaintenanceHistoryListScreen() {
  const search = useLocalSearchParams();
  console.log('Settings search: '+ JSON.stringify(search)  +'');
  console.log('Settings maintenanceId: '+ search.maintenancehistoryid + ' bikeId: '+ search.bikeid +'  ');
  const bikeId = parseInt(ensureString(search.bikeId)) || 0;
  console.log('MaintItemComponent bikeId: '+ bikeId.valueOf()  +'');
  return (
    <MaintenanceHistoryComponent bikeid={bikeId}/>
  );
}
