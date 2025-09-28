import { AppleMaps, GoogleMaps } from 'expo-maps';
import { Platform } from 'react-native';
import { Text } from '../../components/ui/text';
import { useRef, useState } from 'react';
import { ToiletCache } from './toilet-cache';
import { AppleMapsCircle } from 'expo-maps/build/apple/AppleMaps.types';

export const BathroomsMapComponent: React.FC = () => {
  const mapRef = useRef<AppleMaps.MapView>(null);
  const [latitude, setLatitude] = useState(37.7749);
  const [longitude, setLongitude] = useState(-122.4194);
  const [zoom, setZoom] = useState(11);
  const [cameraPosition, setCameraPosition] = useState({coordinates:{latitude, longitude}, zoom: zoom});
  const [toiletsCache, setToiletsCache] = useState(new ToiletCache());
  const [markers, setMarkers] = useState<AppleMaps.Marker[]>([]);
  const [circles, setCircles] = useState<AppleMapsCircle[]>([]);

  const handleCameraMove = async (newPosition: any) => {
    setCameraPosition(newPosition);
    setLatitude(newPosition.coordinates.latitude);
    setLongitude(newPosition.coordinates.longitude);
    setZoom(newPosition.zoom);
    if (mapRef.current) {
      mapRef.current.setCameraPosition(newPosition);
    }
    setCircles(await calculateCircles(cameraPosition));
    // setMarkers(await calculateMarkers(newPosition));
    console.log('Camera moved:', newPosition);
  };

  const calculateCircles = async (position: any): Promise<AppleMapsCircle[]> => {
    // ignoring zoom for now.  Will create a 9 square grid around the current position for now.
    // TODO: implement a more accurate grid based on the current zoom level
    const dim = 0.2;
    const baseLat = calculateBasePosition(position.coordinates.latitude, dim);
    const baseLon = calculateBasePosition(position.coordinates.longitude, dim);
    const latMin = baseLat - dim;
    const lat1 = baseLat;
    const lat2 = baseLat + dim;
    const lonMin = baseLon - dim;
    const lon1 = baseLon;
    const lon2 = baseLon + dim;

    console.log(`Calculating markers in grid from (${latMin}, ${lonMin}) to (${lat2}, ${lon2})`);

    const toiletCircles = await getToiletCircles(lat1, lon1, dim);

    toiletCircles.push(...await getToiletCircles(latMin, lonMin, dim));
    toiletCircles.push(...await getToiletCircles(latMin, lon1, dim));
    toiletCircles.push(...await getToiletCircles(latMin, lon2, dim));
    toiletCircles.push(...await getToiletCircles(lat1, lonMin, dim));
    toiletCircles.push(...await getToiletCircles(lat1, lon2, dim));
    toiletCircles.push(...await getToiletCircles(lat2, lonMin, dim));
    toiletCircles.push(...await getToiletCircles(lat2, lon1, dim));
    toiletCircles.push(...await getToiletCircles(lat2, lon2, dim));

    return toiletCircles;
  };

  const getToiletCircles = async (latMin: number, lonMin: number, dim: number): Promise<AppleMapsCircle[]> => {
    const toiletCircles = await toiletsCache.get(latMin, lonMin);
    if (toiletCircles) {
      return toiletCircles;
    }
    const fetchedCircles = await fetchToiletCircles(latMin, lonMin, dim);
    toiletsCache.set(latMin, lonMin, fetchedCircles);
    return fetchedCircles;
  }

  const calculateBasePosition = (pos: number, dim: number): number => {
    const base = Math.floor(pos);
    const remainder = pos - base;
    const zone = Math.trunc(remainder / dim);
    console.log(`Calculated base position for ${pos} with dim ${dim} is ${base}, remainder ${remainder}, zone ${zone}`);
    console.log(`resulting position: ${base + zone*dim}`);
    return base + zone*dim;
  }

  const fetchToiletCircles = async (lat: number, lon: number, dim: number): Promise<AppleMapsCircle[]> => {
    const rawNodes = await fetchToiletNodesFromOverpass(lat, lon, dim);
    return convertToAppleMapCircles(rawNodes);
  }

  const fetchToiletNodesFromOverpass = async (lat: number, lon: number, dim: number): Promise<any> => {
    const latMin = lat - 0.5*dim;
    const latMax = lat + 0.5*dim;
    const lonMin = lon - 0.5*dim;
    const lonMax = lon + 0.5*dim;
    console.log(`Fetching toilet nodes from Overpass: [${latMin},${lonMin},${latMax},${lonMax}]`);
    const body = "data="+ encodeURIComponent(`
                [bbox:${latMin},${lonMin},${latMax},${lonMax}]
                [out:json]
                [timeout:90];
                nwr["amenity"="toilets"](${latMin},${lonMin},${latMax},${lonMax});
                out center;
            `);
    console.log('Overpass request body:', body);
    try {
      const response = await fetch(
        "https://overpass-api.de/api/interpreter",
        {
            method: "POST",
            body: body
        },
      )
      const nodes = await response.json();
      console.log('Fetched toilet nodes:', nodes);
      // console.log('Fetched toilet nodes blob: ', response.blob());
      // console.log('Fetched toilet nodes json: ', response.json());
      // console.log('Fetched toilet nodes text: ', response.text());
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return nodes.elements;
    } catch (error) {
      console.error('Error fetching toilet nodes from Overpass:', error);
      return [];
    }
  }


  const convertToAppleMapCircles = (toiletNodes: any[]): AppleMapsCircle[] => {
    return toiletNodes.map((node: any) => {
      return {
        center: { latitude: node.lat, longitude: node.lon },
        radius: 100, // radius in meters
        color: 'blue',
        tags: node.tags,
      }
    });
  }

  const circleClick = (circle: AppleMapsCircle) => {

  }

  const convertToAppleMarkers = (toiletNodes: any[]): AppleMaps.Marker[] => {
    return toiletNodes.map((node: any) => {
       return {
        coordinates: { latitude: node.lat, longitude: node.lon },
        title: node.name,
        description: node.address,
        systemImage: 'mappin.circle.ultralight'
      };
    });
  }

  if (Platform.OS === 'ios') {
    return (
      <AppleMaps.View
        ref={mapRef}
        style={{ flex: 1 }}
        // markers={markers}
        cameraPosition={cameraPosition}
        circles={circles}
        onMarkerClick={markerClick => console.log('Marker clicked:', markerClick)}
        onCircleClick={circlesClick => console.log('Circle clicked:', circlesClick)}
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

/*


[bbox:37.45,-122.65,37.95,-122.15][out:json][timeout:90];nwr["amenity"="toilets"](37.45,-122.65,37.95,-122.15);out center;

*/