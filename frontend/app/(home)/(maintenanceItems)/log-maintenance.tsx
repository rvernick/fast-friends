import { ensureString } from '@/common/utils';
import LogMaintenanceComponent from '@/components/bikes/LogMaintenanceComponent';
import { useLocalSearchParams } from 'expo-router';

export default function LogMaintenanceScreen() {
  const { bikeid } = useLocalSearchParams();
  return (
    <LogMaintenanceComponent bikeid={ensureString(bikeid)}/>
  );
}
