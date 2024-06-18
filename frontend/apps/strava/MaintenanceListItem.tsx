import React, { useEffect, useState, useContext } from 'react';
import { Box, Text, Heading, VStack, ScrollView, Button, Spinner, HStack, Spacer } from 'native-base';
import { GlobalStateContext } from "../config/GlobalContext";
import MaintenanceListController from './MaintenanceListController';
import { convertToMiles } from './utils';

const MaintenanceListItem = ({ maintenanceItem }) => {
  const { appContext } = useContext(GlobalStateContext);
  const controller = new MaintenanceListController(appContext);

  const email = appContext.getEmail();


  return (
    <Box borderBottomWidth="1" _dark={{
      borderColor: "muted.50"
    }} borderColor="muted.800" pl={["0", "4"]} pr={["0", "5"]} py="2">
      <HStack space={[2, 3]} justifyContent="space-between">
        <VStack>
          <Text _dark={{
            color: "warmGray.50"
          }} color="coolGray.800" bold>
                  {maintenanceItem.part}
          </Text>
            <Text color="coolGray.600" _dark={{
            color: "warmGray.200"
          }}>
                  {'Due: ' + convertToMiles(maintenanceItem.dueDistanceMeters)}
            </Text>
        </VStack>
        <Spacer />
          <Button key={'done' + maintenanceItem.id} colorScheme="indigo"
            onPress={() => console.log('Done: ' + JSON.stringify(maintenanceItem))}>
              Done
          </Button>
          <Button key={'edit' + maintenanceItem.id} colorScheme="indigo"
            onPress={() => console.log('Edit: ' + JSON.stringify(maintenanceItem))}>
              Edit
          </Button>
      </HStack>
    </Box>
  )
};

export default MaintenanceListItem;

/* <Box>
      <Heading fontSize="xl" p="4" pb="3">
        Inbox
      </Heading>
      <FlatList data={data} renderItem={({
      item
    }) => } keyExtractor={item => item.id} />
    </Box>;
    */