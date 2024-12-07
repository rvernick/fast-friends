import React, { useEffect, useState } from 'react';
import { useQuery } from'@tanstack/react-query';
import { useGlobalContext } from '@/common/GlobalContext';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Text, Surface, DataTable, ActivityIndicator } from 'react-native-paper';
import { useSession } from '@/ctx';
import { Dimensions } from 'react-native';
import { createStyles, styles } from '@/common/styles';
import { isMobile } from '@/common/utils';
import HelpRequestsController from './HelpRequestsController';
import { HelpRequest } from '@/models/HelpRequest';

const HelpRequestsComponent = () => {
  const params = useLocalSearchParams();
  const session = useSession();
  const email = session.email ? session.email : '';
  const appContext = useGlobalContext();
  const navigation = useNavigation();

  const controller = new HelpRequestsController(appContext);

  const [sortColumn, setSortColumn] = useState('distance');
  const [sortDirection, setSortDirection] = useState('descending');

  const dimensions = Dimensions.get('window');
  const useStyle = isMobile() ? createStyles(dimensions.width, dimensions.height) : styles

  const { data: helpRequests, isFetching: helpFetching, error: helpError} = useQuery({
    queryKey: ['helpRequests', email],
    queryFn: () => controller.getRequests(session),
    initialData: [],
    refetchOnWindowFocus: 'always',
    refetchOnReconnect: 'always',
    refetchOnMount: 'always',
  })

  const compareHelpRequests = (col: string, upDown: string, a: HelpRequest, b: HelpRequest): number => {
    var result = 0;
    if (col === 'part') {
      result = b.part.localeCompare(a.part);
    } else if (col === 'action') {
      result = b.action.localeCompare(a.action);
    } else if (col === 'description') {
      result = b.description.localeCompare(a.description);
    } 
    // Secondary sort by createdOn in case where not sorting by createdOn
    if (result === 0) {
        result = b.createdOn.getTime() - a.createdOn.getTime();
      }
    result = result * (upDown === 'descending'? 1 : -1);
    return result;
  }

  const sortedAndFilteredHelpRequests = (col: string, upDown: string) => {
    try {
      // console.log('Sorted and filtered history: ' + JSON.stringify(history));
      if (!helpRequests || helpRequests.length === 0) return [];
      return helpRequests.sort((a, b) => { return compareHelpRequests(col, upDown, a, b); });
    } catch (error) {
      console.error('Error sorting help requests: ', error);
      return [];
    }
  }

  // Switches either column or direction.  Default to descending sort for createdOn ascending otherwise
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      console.log('Reversing sort direction ' + sortDirection);
      setSortDirection(sortDirection === 'ascending'? 'descending' : 'ascending');
    } else {
      setSortColumn(column);
      if (column === 'createdOn') {
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


  useEffect(() => {
    navigation.setOptions({ title: 'Help Requests' });
  }, [history, helpFetching]);

  if (!history || helpFetching || helpRequests.length === 0) {
    return (
      <Text>
        No help requests.
      </Text>
    )
  } else if (helpError) {
    return (
      <Text>
        An error occured!
      </Text>
    )
  } else {
    return (
      <Surface style={useStyle.containerScreen}>
        <ActivityIndicator animating={helpFetching} size="large" />
        
        <DataTable style={useStyle.containerBody} testID='historyTable'>
          <DataTable.Header>
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
              numeric={false}
              sortDirection={sortBy('description')}
              onPress={() => handleSort('description')}>
                Description</DataTable.Title>
            <DataTable.Title
              numeric={false}
              sortDirection={sortBy('submitted')}
              testID='submittedHeader'
              onPress={() => handleSort('submitted')}>
                Submitted</DataTable.Title>
          </DataTable.Header>
          {sortedAndFilteredHelpRequests(sortColumn, sortDirection).map((helpRequest, index, histories) => (
            <DataTable.Row key={'history' + helpRequest.id} testID={"row: " + index}>
              <DataTable.Cell testID={"partCell: " + index}>{helpRequest.part}</DataTable.Cell>
              <DataTable.Cell testID={"actionCell: " + index}>{helpRequest.action}</DataTable.Cell>
             <DataTable.Cell testID={"descriptionCell: " + index}>{helpRequest.description}</DataTable.Cell>
             <DataTable.Cell testID={"createdOn: " + index}>{helpRequest.createdOn.toLocaleDateString()}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </Surface>
    );
  }
};

export default HelpRequestsComponent;
