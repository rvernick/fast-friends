import React, { useContext } from 'react';
import { Box, Center, Heading, ScrollView, FlatList } from 'native-base';
import { GlobalStateContext } from "../config/GlobalContext";
import MaintenanceListController from './MaintenanceListController';
import { useQuery } from'@tanstack/react-query';
import MaintenanceListItem from './MaintenanceListItem';


// Example component
const MaintenanceList = ({ bike, navigation }) => {
  const { appContext } = useContext(GlobalStateContext);
  const controller = new MaintenanceListController(appContext);

  const email = appContext.getEmail();

  appContext.getQueryClient
  const { status, data, error, isFetching } = useQuery({
    queryKey: [email, bike.id, 'maintenance'],
    queryFn: () => controller.getMaintenanceItems(email, bike.id),
    refetchOnWindowFocus: 'always',
    refetchOnReconnect: 'always',
    refetchOnMount: 'always',
  })

  const addMaintenanceItem = () => {
    const newMaintenanceItem = {
      id: 0,
      name: '',
      groupsetBrand: 'Shimano',
      groupsetSpeed: 11,
      isElectronic: false,
    }
    navigation.push('MaintenanceItem', { maintenanceItem: newMaintenanceItem });
  }

  const editItem = (bike) => {
    navigation.push('MaintenanceItem', { bike: bike })
  }

  const MaintenanceListComponent = ({ data }) => {
    return (
        <FlatList showsVerticalScrollIndicator={true} persistentScrollbar={true} scrollEnabled={true} data={data} renderItem={({item}) =>
          <MaintenanceListItem maintenanceItem={item}/>} keyExtractor={item => item.id} />
    );
  };

  if (error) {
    return (
      <Center w="100%">
        <Box safeArea p="2" py="8" w="90%">
          <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
          color: "warmGray.50"
        }}>
           {"Error: " + error}
          </Heading>
          <Heading mt="1" _dark={{
          color: "warmGray.200"
        }} color="coolGray.600" fontWeight="medium" size="xs">
            An error occured!
          </Heading>
        </Box>
      </Center>
    )
  }
  return (
    <Center w="99%">
      <Box safeArea p="2" py="8" w="99%">
        <MaintenanceListComponent data={data}/>
      </Box>
    </Center>
  );
};

export default MaintenanceList;