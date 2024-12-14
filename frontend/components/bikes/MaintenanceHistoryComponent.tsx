import React, { useEffect, useState } from 'react';
import { useQuery } from'@tanstack/react-query';
import { useGlobalContext } from '@/common/GlobalContext';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Text, Surface, DataTable, ActivityIndicator } from 'react-native-paper';
import { useSession } from '@/ctx';
import { Dimensions } from 'react-native';
import { createStyles, defaultWebStyles } from '@/common/styles';
import { ensureString, isMobile, metersToDisplayString } from '@/common/utils';
import { BikeDropdown } from '../common/BikeDropdown';
import MaintenanceHistoryController from './MaintenanceHistoryController';
import { MaintenanceHistoryItem } from '@/models/MaintenanceHistory';

const MaintenanceHistoryComponent = () => {
  const params = useLocalSearchParams();
  const session = useSession();
  const email = session.email ? session.email : '';
  const appContext = useGlobalContext();
  const navigation = useNavigation();

  const controller = new MaintenanceHistoryController(appContext);
  const preferences = controller.getUserPreferences(session);

  var defaultBikeId = '_All';
  const [bikeId, setBikeId ] = useState(defaultBikeId);
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
    queryKey: ['history', email],
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

  const createFilteredHistory = (): MaintenanceHistoryItem[] => {
    // console.log('create filtered history: ' + history);
    if (!history || history.length === 0) return [];
    if (bikeId && bikeId.length > 0 && bikeId !== '_All') {
      return history?.filter(h => ensureString(h.bikeId) === bikeId) || [];
    } 
    return history || [];
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
      if (result === 0) {
        result = b.distanceMeters - a.distanceMeters;
      }
    } else {
      result = b.part.localeCompare(a.part);
      if (result === 0) {
        result = b.bikeName.localeCompare(a.bikeName);
      }
      if (result === 0) {
        result = b.distanceMeters - a.distanceMeters;
      }
    }
    result = result * (upDown === 'descending'? 1 : -1);
    return result;
  }

  const sortedAndFilteredHistory = (col: string, upDown: string) => {
    try {
      const history = createFilteredHistory();
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

  const initialize = async () => {
    await syncDisplayDistance(history);
    console.log('Refreshing history: ' + bikeId);
    if (!initialized) {
      setInitialized(true);
      console.log('Initializing history: ' + JSON.stringify(params));
      if (params.bikeId) {
        defaultBikeId = ensureString(params.bikeId);
      }
      setBikeId(defaultBikeId);
    }
  }

  useEffect(() => {
    navigation.setOptions({ title: 'Maintenance History' });
    syncDisplayDistance(history);
    initialize();
  }, [history, bikeId, historyFetching]);

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
          useAll={true}
        />
        <DataTable style={useStyle.containerBody} testID='historyTable'>
          <DataTable.Header>
            <DataTable.Title
              numeric={false}
              sortDirection={sortBy('bike')}
              onPress={() => handleSort('bike')}>
                Bike</DataTable.Title>
            <DataTable.Title
              numeric={false}
              sortDirection={sortBy('part')}
              onPress={() => handleSort('part')}>
                Part</DataTable.Title>
            <DataTable.Title
              numeric={false}>
                Action</DataTable.Title>
            <DataTable.Title
              numeric={true}
              sortDirection={sortBy('distance')}
              testID='distanceHeader'
              onPress={() => handleSort('distance')}>
                {distanceHeader}</DataTable.Title>
          </DataTable.Header>
          {sortedAndFilteredHistory(sortColumn, sortDirection).map((history, index, histories) => (
            <DataTable.Row key={'history' + history.id} testID={"row: " + index}>
              <DataTable.Cell testID={"bikeCell: " + index}>{history.bikeName}</DataTable.Cell>
              <DataTable.Cell testID={"partCell: " + index}>{history.part}</DataTable.Cell>
              <DataTable.Cell testID={"actionCell: " + index}>{history.action}</DataTable.Cell>
              <DataTable.Cell testID={"distanceCell: " + index} numeric>{distanceStrings.get(history.id.toFixed(0))}</DataTable.Cell>

            </DataTable.Row>
          ))}
        </DataTable>
      </Surface>
    );
  }
};

export default MaintenanceHistoryComponent;
