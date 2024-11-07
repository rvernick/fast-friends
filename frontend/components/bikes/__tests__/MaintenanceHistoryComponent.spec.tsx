/// <reference types="jest" />
import { screen, fireEvent, cleanup } from '@testing-library/react-native';
import { ProviderWrapper } from '../../test_utils';
import { renderRouter } from 'expo-router/testing-library';
import MaintenanceHistoryComponent from '../MaintenanceHistoryComponent';
import { milesToMeters } from '@/common/utils';
import '@testing-library/react-native/extend-expect';

jest.useFakeTimers();
afterEach(cleanup);

const bikes = [
  {
    id: 10,
    name: "Ten",
    brand: "Shimano",
    model: "Ultegra",
    link: "",
    distanceMeters: 10000,
    type: "Road", // Example: Road, Mountain, etc.
    groupsetSpeed: 11,
    groupsetBrand: "Shimano",
    isElectronic: true,
    odometerMeters: 10000,
    maintenanceItems: [],
    stravaId: '',
  }
];

const history = [
  {
    id: 10,
  //  bike: Bike;
    bikeName: "Forth",
    bikeId: 11,
    distanceMeters: milesToMeters(1000),
    part: "Chain",
    name: "",
    brand: "Shimano",
    model: "Ultegra",
    link: "",
    bikeDistance: 15000,
    dueDistanceMeters: 18000,
    defaultLongevity: 3000,
    autoAdjustLongevity: true,
  },
  {
    id: 40,
  //  bike: Bike;
    bikeName: "First",
    bikeId: 11,
    distanceMeters: milesToMeters(4000),
    part: "Rear Tire",
    name: "",
    brand: "Shimano",
    model: "Ultegra",
    link: "",
    bikeDistance: 45000,
    dueDistanceMeters: 48000,
    defaultLongevity: 3000,
    autoAdjustLongevity: true,
  },
  {
    id: 20,
  //  bike: Bike;
    bikeName: "Third",
    bikeId: 11,
    distanceMeters: milesToMeters(2000),
    part: "Cassette",
    name: "",
    brand: "Shimano",
    model: "Ultegra",
    link: "",
    bikeDistance: 25000,
    dueDistanceMeters: 28000,
    defaultLongevity: 3000,
    autoAdjustLongevity: true,
  },
  {
    id: 30,
  //  bike: Bike;
    bikeName: "Second",
    bikeId: 11,
    distanceMeters: milesToMeters(3000),
    part: "Front Brake Pads",
    name: "",
    brand: "Shimano",
    model: "Ultegra",
    link: "",
    bikeDistance: 35000,
    dueDistanceMeters: 38000,
    defaultLongevity: 3000,
    autoAdjustLongevity: true,
  },
];


const getMockedHistory = () => {
  console.log('getMockedHistory called');
  return Promise.resolve(history);
}

const getMockedBikes = () => {
  console.log('getMockedBikes called');
  return Promise.resolve(bikes);
}

const mockedInternal = jest.fn(() => getMockedBikes());

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
  
  it('Basic render', async () => {
    const wrappedMI = jest.fn(() => 
        <ProviderWrapper>
          <MaintenanceHistoryComponent/>
        </ProviderWrapper>);
    renderRouter(
      {
        index: wrappedMI,
        'directory/a': wrappedMI,
        '(group)/b': wrappedMI,
      },
      {
        initialUrl: '/directory/a',
      }
    );
    const bikeNameCell = await screen.findByTestId('bikeCell: 0-text-container');
  });

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
    const secondDistanceCell = await screen.findByTestId('distanceCell: 1-text-container');
    const thirdDistanceCell = await screen.findByTestId('distanceCell: 2-text-container');
    const fourthDistanceCell = await screen.findByTestId('distanceCell: 3-text-container');

    expect(firstDistanceCell.props.children).toBe("4000");
    expect(secondDistanceCell.props.children).toBe("3000");
    expect(thirdDistanceCell.props.children).toBe("2000");
    expect(fourthDistanceCell.props.children).toBe("1000");

    const distanceHeader = await screen.findByTestId('distanceHeader');
    fireEvent.press(distanceHeader);

    const firstDistanceCellA = await screen.findByTestId('distanceCell: 0-text-container');
    const secondDistanceCellA = await screen.findByTestId('distanceCell: 1-text-container');
    const thirdDistanceCellA = await screen.findByTestId('distanceCell: 2-text-container');
    const fourthDistanceCellA = await screen.findByTestId('distanceCell: 3-text-container');

    expect(firstDistanceCellA.props.children).toBe("1000");
    expect(secondDistanceCellA.props.children).toBe("2000");
    expect(thirdDistanceCellA.props.children).toBe("3000");
    expect(fourthDistanceCellA.props.children).toBe("4000");

  });

  //   it('Starts sorted by milage descending', async () => {
  //     const mockHistory = jest.fn(() => {
  //       return Promise.resolve(history);
  //     });

  //     jest.mocked(MaintenanceHistoryController).mockImplementation((appContext: AppContext) => {
  //       const controller = new MaintenanceHistoryController(appContext);
  //       controller.getHistory = mockHistory;
  //       return controller;
  //     });

  //     const wrappedMI = jest.fn(() => 
  //         <ProviderWrapper>
  //           <MaintenanceHistoryComponent/>
  //         </ProviderWrapper>);
  //     const maintenanceHistoryComp = renderRouter(
  //       {
  //         index: wrappedMI,
  //         'directory/a': wrappedMI,
  //         '(group)/b': wrappedMI,
  //       },
  //       {
  //         initialUrl: '/directory/a',
  //       }
  //     );

  //     // maintenanceHistoryComp.
  // });

});


