import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from'@tanstack/react-query';
import { useGlobalContext } from '@/common/GlobalContext';
import BikeListController from './BikeListController';
import { useRouter } from 'expo-router';
import { Button, List, Text, Surface, Card, useTheme } from 'react-native-paper';
import { Bike } from '../../models/Bike';
import { useSession } from '@/ctx';
import { Dimensions, ScrollView, View } from 'react-native';
import { isMobile } from '@/common/utils';
import { createStyles, styles } from '@/common/styles';

type BikeListProps = {
  bikes: Bike[] | undefined;
  isUpdating: boolean;
};

// Example component
const BikeListComponent = () => {
  const queryClient = useQueryClient();
  const session = useSession();
  const email = session.email ? session.email : '';
  const appContext = useGlobalContext();
  const router = useRouter();
  const controller = new BikeListController(appContext);
  const [isUpdating, setIsUpdating] = useState(true);

  const dimensions = Dimensions.get('window');
  const useStyle = isMobile() ? createStyles(dimensions.width, dimensions.height) : styles

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

  const BikeList: React.FC<BikeListProps> = ({ bikes, isUpdating }) => {
    return (
      <List.Section>
        {bikes && bikes.length > 0? (
          bikes?.map(bike => (
            <List.Item
              style={{flex: 1}}
              key={bike.id + bike.name + bike.type}
              title={bike.name}
              description={bike.type}
              onPress={() => editBike(bike.id)}
              right={props => <BikeTypeIcon bikeType={bike.type}/>}
              left={props => <EBikeIcon isElectric={bike.isElectronic} />}
              accessibilityLabel={"List item for bike: " + bike.name}
              accessibilityHint={"Click for details on bike: " + bike.name}/>
        ))) : (
          <Text> No Bikes Found</Text>
        )}
      </List.Section>
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

  return (
    <Surface style={useStyle.containerScreen}>
      <ScrollView contentContainerStyle={{flexGrow:1}} style={useStyle.containerBody}>
        <BikeList bikes={data ? data : []} isUpdating={isUpdating} />
      </ScrollView>
      <Button style={useStyle.bottomButtons} mode="contained" onPress={addBike}> Add Bike</Button>
    </Surface>
  );
};


interface EBikeIconProps {
  isElectric: boolean;
}

const EBikeIcon: React.FC<EBikeIconProps> = ({ isElectric }) => {
  const theme = useTheme();
  if (isElectric) {
    return (
      <List.Icon
        icon="lightning-bolt"
        color={theme.colors.primary}
      />
    );
  }
  return (
    <List.Icon
      icon="bicycle"
      color={theme.colors.primary}
    />);
}

interface BikeIconProps {
  bikeType: string;
}

const BikeTypeIcon: React.FC<BikeIconProps> = ({ bikeType }) => {
    const theme = useTheme();
    
    if (bikeType === "Road") {
      return (
        <List.Icon
          icon="road"
          color={theme.colors.primary}
        />
      );
    }
    if (bikeType === "Gravel") {
      return (
        <List.Icon
          icon="grain"
          color={theme.colors.primary}
        />
      );
    }
    if (bikeType === "Mountain") {
      return (
        <List.Icon
          icon="terrain"
          color={theme.colors.primary}
        />
      );
    }
    if (bikeType === "Cargo") {
      return (
        <List.Icon
          icon="bicycle-cargo"
          color={theme.colors.primary}
        />
      );
    }
    if (bikeType === "Cruiser") {
      return (
        <List.Icon
          icon="bicycle-basket"
          color={theme.colors.primary}
        />
      );
    }
    return (
      <List.Icon
        icon="bike"
        color={theme.colors.primary}
      />
    );
  };

export default BikeListComponent;
