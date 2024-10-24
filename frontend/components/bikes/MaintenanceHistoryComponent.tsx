import React, { useEffect, useState } from 'react';
import { useQuery } from'@tanstack/react-query';
import { useGlobalContext } from '@/common/GlobalContext';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { Text, Surface, DataTable, ActivityIndicator } from 'react-native-paper';
import { useSession } from '@/ctx';
import { Dimensions, ScrollView, View } from 'react-native';
import { createStyles, styles } from '@/common/styles';
import { ensureString, isMobile, metersToMilesString } from '@/common/utils';
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
  var defaultBikeId = '_All';
  if (params.bikeId) {
    defaultBikeId = ensureString(params.bikeId);
  }
  const [bikeId, setBikeId ] = useState(defaultBikeId);
  const [filteredHistory, setFilteredHistory ] = useState<MaintenanceHistoryItem[]>([]);
  const [sortColumn, setSortColumn] = useState('distance');
  const [sortDirection, setSortDirection] = useState('ascending');
  var notSelected;

  const dimensions = Dimensions.get('window');
  const useStyle = isMobile() ? createStyles(dimensions.width, dimensions.height) : styles

  const { status: bikesStatus, data: bikes, error: bikeError, isFetching: bikesFetching } = useQuery({
    queryKey: ['bikes'],
    queryFn: () => controller.getBikes(session, email),
    initialData: [],
    refetchOnWindowFocus: 'always',
    refetchOnReconnect: 'always',
    refetchOnMount: 'always',
  })
  
  const { data: history, isFetching: historyFetching} = useQuery({
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
    if (bikeId && bikeId.length > 0 && bikeId !== '_All') {
      return history?.filter(h => ensureString(h.bikeId) === bikeId) || [];
    } else {
      return history || [];
    }
  }

  const compareHistoryItem = (a: MaintenanceHistoryItem, b: MaintenanceHistoryItem): number => {
    if (sortColumn === 'distance') {
      return b.dueDistanceMeters - a.dueDistanceMeters;
    } else if (sortColumn === 'bike') {
      return b.bikeName.localeCompare(a.bikeName);
    } 
    return b.part.localeCompare(a.part);
  }

  const sortedAndFilteredHistory = () => {
    const history = createFilteredHistory();
    return history.sort((a, b) => { return compareHistoryItem(a, b); });
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'ascending'? 'descending' : 'ascending');
    } else {
      setSortColumn(column);
    }
  }

  const sortBy = (column: string): "ascending" | "descending" | undefined => {
    if (sortColumn === column) {
      return sortDirection === 'ascending'? 'ascending' : 'descending';
    }
    return undefined;
  }

  useEffect(() => {
    navigation.setOptions({ title: 'Maintenance History' });
    console.log('Refreshing history: ' + bikeId);
    setFilteredHistory(sortedAndFilteredHistory() || []);
  }, [history, bikeId]);

  if (!bikes || bikesFetching || bikes.length === 0) {
    return (
      <Text>
        No bikes found. Add a bike or sync with Strava.
      </Text>
    )
  } else if (bikeError) {
    return (
      <Text>
        An error occured!
      </Text>
    )
  } else {
    return (
      <Surface style={useStyle.containerScreen}>
        <ActivityIndicator animating={historyFetching} size="large" />
        <BikeDropdown
          bikes={bikes}
          value={bikeId}
          readonly={false}
          onSelect={handleBikePress}
          useAll={true}
        />
        <DataTable style={useStyle.containerBody}>
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
              numeric={true}
              sortDirection={sortBy('distance')}
              onPress={() => handleSort('distance')}>
                Distance (miles)</DataTable.Title>
          </DataTable.Header>
          {filteredHistory.map(history => (
            <DataTable.Row key={'history' + history.id}>
              <DataTable.Cell>{history.bikeName}</DataTable.Cell>
              <DataTable.Cell>{history.part}</DataTable.Cell>
              <DataTable.Cell numeric>{metersToMilesString(history.distanceMeters)}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </Surface>
    );
  }
};

export default MaintenanceHistoryComponent;
