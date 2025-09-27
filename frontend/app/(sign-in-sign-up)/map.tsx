import { AppleMaps, GoogleMaps } from 'expo-maps';
import { Platform } from 'react-native';
import { Text } from '../../components/ui/text';
import { BathroomsMapComponent } from '../../components/routes/Bathrooms';

export default function MapPage() {
  return (
    <BathroomsMapComponent />
  );
}