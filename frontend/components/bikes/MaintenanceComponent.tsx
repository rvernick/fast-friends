import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from'@tanstack/react-query';
import { useGlobalContext } from '@/common/GlobalContext';
import BikeListController from './BikeListController';
import { useRouter } from 'expo-router';
import { Button, Card, List, Text, useTheme, Surface } from 'react-native-paper';
import { Bike } from '../../models/Bike';
import { useSession } from '@/ctx';
import { MaintenanceItem } from '@/models/MaintenanceItem';
import MaintenanceListController from './MaintenanceListController';

type MaintenanceListProps = {
  maintenanceItems: MaintenanceItem[] | undefined;
  bikes: Bike[] | undefined;
  isUpdating: boolean;
};

type MaintenanceItemProps = {
  maintenanceItem: MaintenanceItem;
}

const MaintenanceComponent = () => {
  const queryClient = useQueryClient();
  const session = useSession();
  const email = session.email ? session.email : '';
  const appContext = useGlobalContext();
  const router = useRouter();
  const controller = new MaintenanceListController(appContext);
  const [isUpdating, setIsUpdating] = useState(true);
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [sortOption, setSortOption] = useState('dueDate');

  const { status, data, error, isFetching } = useQuery({
    queryKey: ['maintenanceItems'],
    queryFn: () => controller.getMaintenanceItems(session, email),
    refetchOnWindowFocus: 'always',
    refetchOnReconnect: 'always',
    refetchOnMount: 'always',
  })
  
  const addMaintenanceItem = () => {
    queryClient.removeQueries({ queryKey: ['maintenanceItems'] });
    router.push({ pathname: "0", params: {maintenanceItem: 0 }});
  }

  const editMaintenanceItem = (id: number) => {
    const idString = id.toString();
    router.push({ pathname: idString})
  }

  type BikeAccordainProps = {
    bike: Bike;
  };

  const BikeAccordian: React.FC<BikeAccordainProps> = ({bike}) => {
    if (!bike.maintenanceItems || bike.maintenanceItems.length ==0) return null;
    return (
      <List.Accordion title={bike.name} description={convertUnits(bike.odometerMeters)} key={'bike' + bike.id} id={'bike' + bike.id}>
        {bike.maintenanceItems.map(maintenanceItem => (
          <List.Item
                key={'mi' + maintenanceItem.id}
                title={maintenanceItem.part}
                id={'bike' + maintenanceItem.bikeId}         
                description={convertUnits(maintenanceItem.dueDistanceMeters)}
                left={props => <BikePartIcon maintenanceItem={maintenanceItem}/>}
          />
        ))}
      </List.Accordion>
    )
  }

  const MaintenanceList: React.FC<MaintenanceListProps> = ({ maintenanceItems, bikes, isUpdating }) => {
    if (!maintenanceItems || maintenanceItems?.length == 0) {
      return <Text>No Maintenance Items Found</Text>
    }
    if (bikes && bikes.length > 1) {
      return (
      <List.AccordionGroup >
        {bikes.map(bike => (
          <BikeAccordian bike={bike} key={bike.id}/>
        ))}
      </List.AccordionGroup>
      );
    } else {
      return (
        <List.Section> 
          {maintenanceItems && maintenanceItems.length > 0 ? (
            maintenanceItems.map(maintenanceItem => (
              <List.Item
                key={'limi' + maintenanceItem.id}
                title={maintenanceItem.part}
                description={convertUnits(maintenanceItem.dueDistanceMeters)}                
                left={props => <BikePartIcon maintenanceItem={maintenanceItem} />}
              />
            ))
          ) : (
            <Text>No MaintenanceItems Found</Text>
          )}
        </List.Section>
      )
    }
  };

  const ensureBikesUpToDate = async () => {
    if (!data) return;
    var newBikes = bikes;
    for (const maintenanceItem of data) {
      if (!bikes.some(bike => bike.id === maintenanceItem.bikeId)) {
        const bike = await controller.getBike(session, maintenanceItem.bikeId, email);
        if (bike) {
          newBikes.push(bike);
          setBikes(newBikes);
        }
      }
    }
  }
  
  /**
   * 
   * @param param0 CHAIN = "Chain",
  CASSETTE = "Cassette",
  FRONT_TIRE = "Front Tire",
  REAR_TIRE = "Rear Tire",
  CRANKSET = "Crankset",
  FRONT_BRAKE_CABLE = "Front Brake Cable",
  REAR_BRAKE_CABLE = "Rear Brake Cable",
  FRONT_BRAKE_PADS = "Front Brake Pads",
  REAR_BRAKE_PADS = "Rear Brake Pads",
  REAR_SHIFTER_CABLE = "Rear Shifter Cable",
  FRONT_SHIFTER_CABLE = "Front Shifter Cable",
  BAR_TAPER = "Bar Tape",
  TUNE_UP = "Tune Up",
   * @returns 
   */
  const BikePartIcon: React.FC<MaintenanceItemProps> = ({ maintenanceItem }) => {
    const theme = useTheme();
    const part = maintenanceItem.part;
    if (part === "Chain") {
      return (
        <List.Icon
          icon="link"
          color={theme.colors.primary}
        />
      );
    }
    if (part === "Cassette") {
      return (
        <List.Icon
          icon="cog"
          color={theme.colors.primary}
        />
      );
    }
    if (part === "Front Tire" || part === "Rear Tire") {
      return (
        <List.Icon
          icon="atom-variant"
          color={theme.colors.primary}
        />
      );
    }
    if (part === "Front Brake Pads" || part === "Rear Brake Pads") {
      return (
        <List.Icon
          icon="lungs"
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

  useEffect(() => {
    if (isUpdating && !isFetching) {
      console.log('sync updating bikes');
      setIsUpdating(false);
      ensureBikesUpToDate();
    }
  });

  const sortOptions = ["dueDate", "lastUpdate", "A-Z"].map(option => ({ label: option, value: option}));

  if (error) {
    return (
      <Text>
        An error occured!
      </Text>
    )
  }
  return (
    <Surface>
      <Card>
        {/* <Card.Actions>
          <Dropdown 
            label="Sort by"
            placeholder="dueDate"
            options={sortOptions}
            value={sortOption}
            onSelect={(value) => setSortOption(value ? value : '')}
          />
        </Card.Actions>
      </Card> */}
        <MaintenanceList maintenanceItems={data} bikes={bikes} isUpdating={isUpdating}/>
        <Button mode="contained" onPress={addMaintenanceItem}> Add Maintenance Item</Button>
        </Card>
    </Surface>
  );
};

// navigation.push('Bike', { bike })

const convertUnits = (meters: number): string => {
  return (meters / 1609).toFixed(0);
}

export default MaintenanceComponent;
