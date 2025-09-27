import { AppleMaps, GoogleMaps } from 'expo-maps';
import { Platform } from 'react-native';
import { Text } from '../../components/ui/text';
import { useRef, useState } from 'react';

export const BathroomsMapComponent: React.FC = () => {
  const mapRef = useRef<AppleMaps.MapView>(null);
  const [latitude, setLatitude] = useState(37.7749);
  const [longitude, setLongitude] = useState(-122.4194);
  const [zoom, setZoom] = useState(12);
  const [cameraPosition, setCameraPosition] = useState({coordinates:{latitude, longitude}, zoom: zoom});
  const [markers, setMarkers] = useState<AppleMaps.Marker[]>([]);

  const handleCameraMove = async (newPosition: any) => {
    setCameraPosition(newPosition);
    setLatitude(newPosition.coordinates.latitude);
    setLongitude(newPosition.coordinates.longitude);
    setZoom(newPosition.zoom);
    if (mapRef.current) {
      mapRef.current.setCameraPosition(newPosition);
    }
    setMarkers(await calculateMarkers(newPosition));
    console.log('Camera moved:', newPosition);
  };

  const calculateMarkers = async (position: any) => {
    const toiletNodes = await getToiletNodes(position);
    return convertToAppleMarkers(toiletNodes);
  };

  const getToiletNodes = (position: any): Promise<any[]> => {
    const latMin = position.coordinates.latitude - 0.005;
    const latMax = position.coordinates.latitude + 0.005;
    const lonMin = position.coordinates.longitude - 0.005;
    const lonMax = position.coordinates.longitude + 0.005;
    return fetch(
      "https://overpass-api.de/api/interpreter",
      {
          method: "POST",
          // The body contains the query
          body: "data="+ encodeURIComponent(`
              [bbox:${latMin},${lonMin},${latMax},${lonMax}];
              [out:json]
              [timeout:90];
              nwr["amenity"="toilets"](${latMin},${lonMin},${latMax},${lonMax});
              out center;
          `)
      },
    ).then(
      (data)=>data.json()
    )
  }

  const convertToAppleMarkers = (toiletNodes: any[]): AppleMaps.Marker[] => {
    return toiletNodes.map((node: any) => {
      return {
        coordinate: { latitude: node.latitude, longitude: node.longitude },
        title: node.name,
        description: node.address,
      };
    });
  }

  if (Platform.OS === 'ios') {
    return (
      <AppleMaps.View
        ref={mapRef}
        style={{ flex: 1 }}
        markers={markers}
        cameraPosition={cameraPosition}
        onCameraMove={handleCameraMove}
      />
    );
  } else if (Platform.OS === 'android') {
    return (
      <GoogleMaps.View
        style={{ flex: 1 }}
        cameraPosition={cameraPosition}
        onCameraMove={handleCameraMove}
      />
    );
  } else {
    return <Text>Maps are only available on Android and iOS</Text>;
  }
}