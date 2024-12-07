/// <reference types="jest" />
import { screen, fireEvent, cleanup, userEvent, waitFor } from '@testing-library/react-native';
import { ProviderWrapper } from '../../test_utils';
import { renderRouter } from 'expo-router/testing-library';
import MaintenanceHistoryComponent from '../MaintenanceHistoryComponent';
import '@testing-library/react-native/extend-expect';
import { mockedBikes, mockedHistory } from '@/common/test-utils';
import { sleep } from '@/common/utils';

afterEach(cleanup);

jest.mock('../../../common/utils', () => {
  const originalModule = jest.requireActual('../../../common/utils');
  return {
    __esModule: true,
  ...originalModule,
    getUserPreferences: jest.fn(() => { return Promise.resolve({ "units": "miles" }) }),
  };
});

const getMockedHistory = () => {
  console.log('getMockedHistory called');
  sleep(1);
  return Promise.resolve(mockedHistory);
}

const getMockedBikes = () => {
  console.log('getMockedBikes called');
  sleep(1);
  return Promise.resolve(mockedBikes);
}

jest.mock('../../../common/data-utils', () => {
  const originalModule = jest.requireActual('../../../common/http-utils');
  return {
    __esModule: true,
    ...originalModule,
    getHistory: jest.fn(() => getMockedHistory()),
    getBikes: jest.fn(() => getMockedBikes()),
    foo: 'mocked foo',
  };
});

describe('Maintenance History Component', () => {
  
  // it('Basic render', async () => {
  //   const wrappedMI = jest.fn(() => 
  //       <ProviderWrapper>
  //         <MaintenanceHistoryComponent/>
  //       </ProviderWrapper>);
  //   renderRouter(
  //     {
  //       index: wrappedMI,
  //       'directory/a': wrappedMI,
  //       '(group)/b': wrappedMI,
  //     },
  //     {
  //       initialUrl: '/directory/a',
  //     }
  //   );
  //   console.log("rendered: Basic render");
  //   const bikeNameCell = await screen.findByTestId('bikeCell: 0-text-container');
  //   console.log("bikeNameCell: " + bikeNameCell);
  //   const bikeDropdown = screen.getByText('First');
  //   console.log("bikeDropdown: " + bikeDropdown);
  //   const listItem = screen.getByText('Third');
  //   console.log("listItem: " + listItem.type);
  //   await waitFor(() => {
  //     const distanceHeader = screen.getByTestId('distanceHeader');
  //     expect(distanceHeader).toBeEnabled();
  //     console.log('done right render');
  //   }, {
  //       timeout: 2000,
  //   });
    
  // });

  it('Starts sorted by milage descending', async () => {
    // jest.mock('MaintenanceHistoryController'); // this happens automatically with automocking

    const wrappedMI = jest.fn(() => 
        <ProviderWrapper>
          <MaintenanceHistoryComponent/>
        </ProviderWrapper>);
    const rendered = renderRouter(
      {
        index: wrappedMI,
        'directory/a': wrappedMI,
        '(group)/b': wrappedMI,
      },
      {
        initialUrl: '/directory/a',
      }
    );
    console.log("rendered: " + rendered);
    console.log("renderedJSON: " + rendered.toJSON());
    // expect distance vals to be in descending order 4000, 3000, 2000, 1000
    const firstDistanceCell = await screen.findByTestId('distanceCell: 0-text-container');
    const secondDistanceCell = screen.getByTestId('distanceCell: 1-text-container');
    const thirdDistanceCell = screen.getByTestId('distanceCell: 2-text-container');
    const fourthDistanceCell = screen.getByTestId('distanceCell: 3-text-container');

    expect(firstDistanceCell.props.children).toBe("4000");
    expect(secondDistanceCell.props.children).toBe("3000");
    expect(thirdDistanceCell.props.children).toBe("2000");
    expect(fourthDistanceCell.props.children).toBe("1000");

    console.log("Getting the distance header and press it");
    const distanceHeader = screen.getByTestId('distanceHeader');
    console.log("Pressing the distance header");
    fireEvent.press(distanceHeader);
    console.log("Pressed the distance header");
    const firstDistanceCellA = await screen.findByTestId('distanceCell: 0-text-container');
    const secondDistanceCellA = await screen.findByTestId('distanceCell: 1-text-container');
    const thirdDistanceCellA = await screen.findByTestId('distanceCell: 2-text-container');
    const fourthDistanceCellA = await screen.findByTestId('distanceCell: 3-text-container');

    console.log("Running through last expecations MaintenanceHistoryComponent");
    expect(firstDistanceCellA.props.children).toBe("1000");
    expect(secondDistanceCellA.props.children).toBe("2000");
    expect(thirdDistanceCellA.props.children).toBe("3000");
    expect(fourthDistanceCellA.props.children).toBe("4000");
  });
});


