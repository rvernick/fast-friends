import React, { useEffect, useState } from 'react';
import { useQuery } from'@tanstack/react-query';
import { useGlobalContext } from '@/common/GlobalContext';
import { router, useNavigation } from 'expo-router';
import { Text, Surface, DataTable, ActivityIndicator, Button } from 'react-native-paper';
import { useSession } from '@/common/ctx';
import { Dimensions, ScrollView } from 'react-native';
import { createStyles, defaultWebStyles } from '@/common/styles';
import { ensureString, isMobile, isMobileSize, metersToDisplayString } from '@/common/utils';
import { BikeDropdown } from '../common/BikeDropdown';
import MaintenanceHistoryController from './MaintenanceHistoryController';
import { MaintenanceHistoryItem } from '@/models/MaintenanceHistory';

type MaintenanceHistoryProps = {
  bikeid: number,
};

const MaintenanceHistoryComponent: React.FC<MaintenanceHistoryProps> = ({ bikeid }) => {
  const session = useSession();
  const email = session.email ? session.email : '';
  const appContext = useGlobalContext();
  const navigation = useNavigation();

  const controller = new MaintenanceHistoryController(appContext);
  const preferences = controller.getUserPreferences(session);

  var defaultBikeId = '_All';
  const [bikeId, setBikeId ] = useState(defaultBikeId);
  const [smallScreen, setSmallScreen ] = useState(false);
  const [sortColumn, setSortColumn] = useState('distance');
  const [sortDirection, setSortDirection] = useState('descending');
  const [initialized, setInitialized ] = useState(false);
  const [distanceStrings, setDistanceStrings ] = useState(new Map<string, string>());
  const [distanceHeader, setDistanceHeader ] = useState('Distance (miles)');

  const dimensions = Dimensions.get('window');
  const useStyle = isMobile() ? createStyles(dimensions.width, dimensions.height) : defaultWebStyles

  const { data: bikes, error: bikesError, isFetching: bikesFetching } = useQuery({
    queryKey: ['bikes'],
    queryFn: () => controller.getAllBikes(session, email),
    initialData: [],
    refetchOnWindowFocus: 'always',
    refetchOnReconnect: 'always',
    refetchOnMount: 'always',
  })
  
  const { data: history, isFetching: historyFetching, error: historyError} = useQuery({
    queryKey: ['history'],
    queryFn: () => controller.getHistory(session, email),
    initialData: [],
    refetchOnWindowFocus: 'always',
    refetchOnReconnect: 'always',
    refetchOnMount: 'always',
  })

  const handleBikePress = (bikeId: string) => {
    if (!bikes || bikes.length == 0) return;
    setBikeId(bikeId);
  };

  const createFilteredHistory = (histories: MaintenanceHistoryItem[]): MaintenanceHistoryItem[] => {
    // console.log('create filtered history: ' + history);
    if (!histories || histories.length === 0) return [];
    if (bikeId && bikeId.length > 0 && bikeId !== '_All') {
      return histories?.filter(h => ensureString(h.bikeId) === bikeId) || [];
    } 
    return histories || [];
  }

  const compareHistoryItem = (col: string, upDown: string, a: MaintenanceHistoryItem, b: MaintenanceHistoryItem): number => {
    var result = 0;
    if (col === 'distance') {
      result = b.distanceMeters - a.distanceMeters;
      if (result === 0) {
        result = b.bikeName.localeCompare(a.bikeName);
      }
      if (result === 0) {
        result = b.part.localeCompare(a.part);
      }
    } else if (col === 'bike') {
      result = b.bikeName.localeCompare(a.bikeName);
      if (result === 0) {
        result = b.part.localeCompare(a.part);
      }
    } else if (col === 'action') {
      result = b.action.localeCompare(a.action);
      if (result === 0) {
        result = b.bikeName.localeCompare(a.bikeName);
      }
    } else {
      result = b.part.localeCompare(a.part);
      if (result === 0) {
        result = b.bikeName.localeCompare(a.bikeName);
      }
    }
    result = result * (upDown === 'descending'? 1 : -1);
    if (result === 0) {
      result = b.distanceMeters - a.distanceMeters;
    }
    return result;
  }

  const sortedAndFilteredHistory = (histories: MaintenanceHistoryItem[], col: string, upDown: string) => {
    try {
      const history = createFilteredHistory(histories);
      // console.log('Sorted and filtered history: ' + JSON.stringify(history));
      if (!history || history.length === 0) return [];
      return history.sort((a, b) => { return compareHistoryItem(col, upDown, a, b); });
    } catch (error) {
      console.error('Error sorting and filtering history: ', error);
      return [];
    }
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      console.log('Reversing sort direction ' + sortDirection);
      setSortDirection(sortDirection === 'ascending'? 'descending' : 'ascending');
    } else {
      setSortColumn(column);
      if (column === 'distance') {
        setSortDirection('descending');
      } else {
        setSortDirection('ascending');
      }
    }
  }

  const sortBy = (column: string): "ascending" | "descending" | undefined => {
    if (sortColumn === column) {
      return sortDirection === 'ascending'? 'ascending' : 'descending';
    }
    return undefined;
  }

  const syncDisplayDistance = async (history: MaintenanceHistoryItem[]) => {
    const pref = await preferences;
    const stringMap = new Map<string, string>();
    for (const historyItem of history) {
      stringMap.set(historyItem.id.toFixed(0),  metersToDisplayString(historyItem.distanceMeters, pref));
    }
    setDistanceStrings(stringMap);
    const units = pref.units === 'km'? 'km' :'miles';
    setDistanceHeader('Distance (' + units + ')');
  }

  const createHistoryItem = () => {
    router.push({
      pathname: '/(home)/(maintenanceHistory)/[maintenancehistoryid]',
      params: { maintenancehistoryid: 0, bikeid: bikeId} });
  }

  const editHistoryItem = (historyItem: MaintenanceHistoryItem) => {
    router.push({
      pathname: '/(home)/(maintenanceHistory)/[maintenancehistoryid]',
      params: { maintenancehistoryid: historyItem.id , bikeid: historyItem.bikeId} });
  }

  const logMaintenance = () => {
    console.log('Logging maintenance for bikefdsa: ' + bikeId);
    router.push({pathname: '/(home)/(maintenanceItems)/log-maintenance', params: { bikeid: bikeId} });
  }

  const initialize = async () => {
    await syncDisplayDistance(history);
    console.log('Refreshing history: ' + bikeId);
    if (!initialized) {
      setInitialized(true);
      console.log('Initializing history: ' + bikeid);
      if (bikeid) {
        defaultBikeId = ensureString(bikeid);
      }
      setBikeId(defaultBikeId);
    }
  }

  const setTitle = (newBikeId: string) => {
    var newTitle = "Maintenance History"
    if (newBikeId !== '_All') {
      const bike = bikes?.find(b => ensureString(b.id) === newBikeId);
      if (bike) {
        newTitle += ': '+ bike.name;
      }
    }
    navigation.setOptions({ title: newTitle });
  }

  useEffect(() => {
    setTitle(bikeId);
    setSmallScreen(isMobileSize());
    initialize();
  }, [bikeId, history]);

  if (!historyFetching && (!history  || history.length === 0)) {
    return (
      <Text>
        No history found.  Log maintenance on a bike for history.
      </Text>
    )
  } else if (historyError || bikesError) {
    return (
      <Text>
        An error occured!
      </Text>
    )
  } else {
    return (
      <Surface style={useStyle.containerScreen}>
        {historyFetching ? <ActivityIndicator animating={historyFetching} size="large" /> : null }
        <BikeDropdown
          bikes={bikes}
          value={bikeId}
          readonly={false}
          onSelect={handleBikePress}
          useAll={!smallScreen}
        />
        <ScrollView contentContainerStyle={{flexGrow:1}} style={useStyle.containerBody}>
          <DataTable style={useStyle.containerBody} testID='historyTable'>
            <DataTable.Header>
              {smallScreen ? null : (<DataTable.Title
                numeric={false}
                sortDirection={sortBy('bike')}
                onPress={() => handleSort('bike')}>
                  Bike</DataTable.Title>
              )}
              <DataTable.Title
                numeric={false}
                sortDirection={sortBy('part')}
                onPress={() => handleSort('part')}>
                  Part</DataTable.Title>
              <DataTable.Title
                numeric={false}
                sortDirection={sortBy('action')}
                onPress={() => handleSort('action')}>
                  Action</DataTable.Title>
              <DataTable.Title
                numeric={true}
                sortDirection={sortBy('distance')}
                testID='distanceHeader'
                onPress={() => handleSort('distance')}>
                  {distanceHeader}</DataTable.Title>
            </DataTable.Header>
            {history && history.length > 0 ? (
              sortedAndFilteredHistory(history, sortColumn, sortDirection).map((historyItem, index, histories) => (
                <DataTable.Row
                    onPress={() => editHistoryItem(historyItem)}
                    key={'history' + historyItem.id}
                    testID={"row: " + index}>
                  {smallScreen ? null : (
                    <DataTable.Cell testID={"bikeCell: " + index}>{historyItem.bikeName}</DataTable.Cell>
                  )}
                  <DataTable.Cell testID={"partCell: " + index}>{historyItem.part}</DataTable.Cell>
                  <DataTable.Cell testID={"actionCell: " + index}>{historyItem.action}</DataTable.Cell>
                  <DataTable.Cell testID={"distanceCell: " + index} numeric>{distanceStrings.get(historyItem.id.toFixed(0))}</DataTable.Cell>

                </DataTable.Row>
              ))) : (historyFetching ? (
                  <DataTable.Row>
                  <DataTable.Cell>Fetching </DataTable.Cell>
                  <DataTable.Cell>History</DataTable.Cell>
                  <DataTable.Cell> </DataTable.Cell>
                  <DataTable.Cell>{"0"}</DataTable.Cell>
                </DataTable.Row>
              ) : (
                <DataTable.Row>
                  <DataTable.Cell>No history found</DataTable.Cell>
                  <DataTable.Cell>Log history</DataTable.Cell>
                  <DataTable.Cell>To start tracking</DataTable.Cell>
                  <DataTable.Cell>{"0"}</DataTable.Cell>
                </DataTable.Row>
              ))}
          </DataTable>
        </ScrollView>
        <Surface style={useStyle.bottomButtons}>
          <Button
            style={{flex: 1}}
            mode="contained"
            onPress={ logMaintenance }
            testID="log-maintenance-button"
            accessibilityLabel="Log Maintenance"
            accessibilityHint="Log Maintenance">
                Log Maintenance
          </Button>
          <Button
            style={{flex: 1}}
            mode="contained"
            onPress={ createHistoryItem }
            testID="add-history-button"
            accessibilityLabel="Add History Item"
            accessibilityHint="Add History Item">
                Add History Item
          </Button>
        </Surface>
      </Surface>
    );
  }
};

export default MaintenanceHistoryComponent;
