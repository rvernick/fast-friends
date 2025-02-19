import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from'@tanstack/react-query';
import { useGlobalContext } from '@/common/GlobalContext';
import BikeListController from './BikeListController';
import { useRouter } from 'expo-router';
import { Bike } from '../../models/Bike';
import { useSession } from '@/common/ctx';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from '../ui/safe-area-view';
import { VStack } from '../ui/vstack';
import { HStack } from '../ui/hstack';
import { ScrollView } from '../ui/scroll-view';
import { BikeIcon, ZapIcon, FlipHorizontalIcon, MountainSnowIcon, ComponentIcon, ShoppingBasketIcon } from 'lucide-react-native';
import { Pressable } from '../ui/pressable';
import { Text } from '../ui/text';
import { Button, ButtonText } from '../ui/button';
import { useTheme } from 'react-native-paper';

type BikeListProps = {
  bikes: Bike[] | undefined;
  isUpdating: boolean;
  isInFocus: boolean;
};

// Example component
const BikeListComponent = () => {
  const queryClient = useQueryClient();
  const session = useSession();
  const email = session.email ? session.email : '';
  const appContext = useGlobalContext();
  const router = useRouter();
  const isFocused = useIsFocused();
  const controller = new BikeListController(appContext);
  const [isUpdating, setIsUpdating] = useState(true);

  const { data, error, isFetching } = useQuery({
    queryKey: ['bikes'],
    queryFn: () => controller.getAllBikes(session, email),
    refetchOnWindowFocus: 'always',
    refetchOnReconnect: 'always',
    refetchOnMount: 'always',
    initialData: [],
  })
  
  const addBike = () => {
    queryClient.removeQueries({ queryKey: ['bikes'] });
    router.push({ pathname: "/(home)/(bikes)/[bikeid]", params: {bikeid: 0 }});
  }

  const editBike = (id: number) => {
    const idString = id.toString();
    router.push({ pathname: '/(home)/(bikes)/[bikeid]', params: { bikeid: idString } });
  }

  const BikeList: React.FC<BikeListProps> = ({ bikes, isUpdating, isInFocus }) => {
    return (
      <VStack className="w-full h-full">
        {bikes && bikes.length > 0? (
          bikes?.map(bike => (
            <Pressable onPress={() => editBike(bike.id)} >
            <HStack className='row-primary' key={'bike: ' + bike.id + '-' + bike.odometerMeters} >
                {bike.isElectronic ? <ZapIcon size="48"/> : <BikeIcon size="48"/> }
                <VStack>
                  <Text >{bike.name}</Text>
                </VStack>
              <Pressable className="absolute top-0 right-0" onPress={() => editBike(bike.id)} >
                <BikeTypeIcon bikeType={bike.type}/>
              </Pressable>
            </HStack>
            </Pressable>
        ))) : (
          <Text> No Bikes Found</Text>
        )}
      </VStack>
    );
  };

  useEffect(() => {
    if (isUpdating && !isFetching) {
      console.log('sync updating bikes');
      setIsUpdating(false);
    }
  });

  if (error) {
    return (
      <Text>
        An error occured!
      </Text>
    )
  }

  if (isFetching) {
    return (
      <Text>
        Fetching bikes...
      </Text>
    )
  } else if (data && data.length > 0) {
    return (
      <SafeAreaView className="w-full h-full">
        <VStack className="w-full h-full">
          <ScrollView
            className="w-full h-full"
            contentContainerStyle={{ flexGrow: 1 }}
          >     
          <BikeList bikes={data} isUpdating={isFetching} isInFocus={isFocused}/>
          </ScrollView>
          <HStack className="w-full flex bg-background-0 flex-grow justify-center">
            <Button 
              className="bottom-button"
              action="primary"
              onPress={ addBike }
              style={{flex: 1}} 
              testID='addBikeButton'
              accessibilityLabel="Create new bike"
              accessibilityHint="Opens page for adding a bike">
              <ButtonText>Add Bike</ButtonText>
            </Button>
          </HStack>
        </VStack>
      </SafeAreaView>
    )
  } else {
    return (
      <Text> Loading... </Text>
    )
  };
};

interface BikeIconProps {
  bikeType: string;
}

const BikeTypeIcon: React.FC<BikeIconProps> = ({ bikeType }) => {
  const theme = useTheme();
  const iconSize = "36";

  if (bikeType === "Road") {
    return <FlipHorizontalIcon size={iconSize}/>
  }
  if (bikeType === "Gravel") {
    return <ComponentIcon size={iconSize}/>
  }
  if (bikeType === "Mountain") {
    return <MountainSnowIcon size={iconSize}/>
  }
  if (bikeType === "Cargo") {
    return <ShoppingBasketIcon size={iconSize}/>
  }
  if (bikeType === "Cruiser") {
    return <ShoppingBasketIcon size={iconSize} />
  }
  return <BikeIcon size={iconSize}/>
};

export default BikeListComponent;
