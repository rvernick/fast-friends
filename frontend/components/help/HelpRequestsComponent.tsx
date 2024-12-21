import React, { useEffect, useState } from 'react';
import { useQuery } from'@tanstack/react-query';
import { useGlobalContext } from '@/common/GlobalContext';
import { router, useNavigation } from 'expo-router';
import { Button, Text, Surface, DataTable, ActivityIndicator } from 'react-native-paper';
import { useSession } from '@/common/ctx';
import { Dimensions, ScrollView } from 'react-native';
import { createStyles, defaultWebStyles } from '@/common/styles';
import { isMobile } from '@/common/utils';
import HelpRequestsController from './HelpRequestsController';
import { HelpRequest } from '@/models/HelpRequest';

const HelpRequestsComponent = () => {
  const session = useSession();
  const email = session.email ? session.email : '';
  const appContext = useGlobalContext();
  const navigation = useNavigation();

  const controller = new HelpRequestsController(appContext);

  const [sortColumn, setSortColumn] = useState('submitted');
  const [sortDirection, setSortDirection] = useState('descending');

  const dimensions = Dimensions.get('window');
  const useStyle = isMobile() ? createStyles(dimensions.width, dimensions.height) : defaultWebStyles

  const { data: helpRequests, isFetching: helpFetching, error: helpError} = useQuery({
    queryKey: ['helpRequests'],
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
    } else if (col === 'needType') {
      result = b.needType.localeCompare(a.needType);
    }
    // Secondary sort by createdOn in case where not sorting by createdOn
    if (result === 0) {
      const bDate = new Date(b.createdOn);
      const aDate = new Date(a.createdOn);
      result = bDate.getTime() - aDate.getTime();
    }
    result = result * (upDown === 'descending'? 1 : -1);
    return result;
  }


  // Switches either column or direction.  Default to descending sort for createdOn ascending otherwise
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      console.log('Reversing sort direction ' + sortDirection);
      setSortDirection(sortDirection === 'ascending'? 'descending' : 'ascending');
    } else {
      setSortColumn(column);
      if (column === 'submitted') {
        setSortDirection('descending');
      } else {
        setSortDirection('ascending');
      }
    }
  }

  const sortedAndFilteredHelpRequests = (requests: HelpRequest[], col: string, upDown: string): HelpRequest[] => {
    try {
      if (!requests || requests.length === 0) return [];
      return requests.sort((a, b) => { return compareHelpRequests(col, upDown, a, b); });
    } catch (error) {
      console.error('Error sorting help requests: ', error);
      return [];
    }
  }
    
  const sortBy = (column: string): "ascending" | "descending" | undefined => {
    if (sortColumn === column) {
      return sortDirection === 'ascending'? 'ascending' : 'descending';
    }
    return undefined;
  }

  const displayDateString = (date: string): string => {
    try {
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString();
    } catch (error) {
      console.error('Invalid date string:', date);
      return '';
    }
  }

  const goTo = (id: number) => {
    router.push({ pathname: '/(home)/(assistance)/helpRequest', params: { id: id } });
  }

  useEffect(() => {
    navigation.setOptions({ title: 'Help Requests' });
  }, [helpRequests, helpFetching]);

  if (!helpRequests || helpFetching || helpRequests.length === 0) {
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
        {helpFetching ? <ActivityIndicator animating={helpFetching} size="large" /> : null}
        
        <DataTable style={useStyle.containerBodyFull} testID='historyTable'>
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
                {isMobile() ? null : 
                  <DataTable.Title
                    numeric={false}
                    sortDirection={sortBy('needType')}
                    testID='needTypeHeader'
                    onPress={() => handleSort('needType')}>
                    Need Type
                  </DataTable.Title>}
            <DataTable.Title
              numeric={false}
              sortDirection={sortBy('description')}
              onPress={() => handleSort('description')}>
                Description
            </DataTable.Title>
            <DataTable.Title
              numeric={false}
              sortDirection={sortBy('submitted')}
              testID='submittedHeader'
              onPress={() => handleSort('submitted')}>
                Submitted</DataTable.Title>
          </DataTable.Header>
          <ScrollView>
            {sortedAndFilteredHelpRequests(helpRequests, sortColumn, sortDirection).map((helpRequest, index) => (
              <DataTable.Row onPress={() => goTo(helpRequest.id)} key={'requestRow' + helpRequest.id} testID={"row: " + index}>
                <DataTable.Cell testID={"partCell: " + index}>{helpRequest.part}</DataTable.Cell>
                <DataTable.Cell testID={"actionCell: " + index}>{helpRequest.action}</DataTable.Cell>
                {isMobile()? null : <DataTable.Cell testID={"needTypeCell: " + index}>{helpRequest.needType} </DataTable.Cell>}
                <DataTable.Cell testID={"descriptionCell: " + index}>{helpRequest.description}</DataTable.Cell>
                <DataTable.Cell testID={"createdOn: " + index}>{displayDateString(helpRequest.createdOn)}</DataTable.Cell>
              </DataTable.Row>
            ))}
          </ScrollView>
        </DataTable>
        <Button mode="contained" onPress={() => router.push('/(assistance)/instructions') }> Instructions</Button>
      </Surface>
    );
  }
};

export default HelpRequestsComponent;
