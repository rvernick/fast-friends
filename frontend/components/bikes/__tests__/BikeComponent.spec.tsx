import { screen, cleanup } from '@testing-library/react-native';
import { ProviderWrapper } from '../../test_utils';
import { renderRouter } from 'expo-router/testing-library';
import BikeComponent from '../BikeComponent';
import { milesToMeters, sleep } from '@/common/utils';

afterEach(cleanup);

const mockedBike = {
    id: 256,
    name: "Ten",
    brand: "Shimano",
    model: "Ultegra",
    link: "",
    distanceMeters: milesToMeters(2000),
    type: "Road",
    groupsetSpeed: 11,
    groupsetBrand: "Shimano",
    isElectronic: true,
    odometerMeters: milesToMeters(2000),
    maintenanceItems: [],
    stravaId: '',
    isRetired: false,
  };

const getMockedBike = () => {
  console.log('getMockedBike called');
  sleep(1);
  return Promise.resolve(mockedBike);
}

const mockedInternal = jest.fn(() => getMockedBike());

jest.mock('../../../common/data-utils', () => {
  const originalModule = jest.requireActual('../../../common/data-utils');
  return {
    __esModule: true,
    ...originalModule,
    getBike: jest.fn(() => getMockedBike()),
    foo: 'mocked foo',
  };
});

jest.mock('../../../common/utils', () => {
  const originalModule = jest.requireActual('../../../common/utils');
  return {
    __esModule: true,
  ...originalModule,
    getUserPreferences: jest.fn(() => { return Promise.resolve({ "units": "miles" }) }),
  };
});

describe('Bike Component', () => {
  
  it('Bike mileage is displayed', async () => {
    const wrappedBike = jest.fn(() => 
        <ProviderWrapper>
          <BikeComponent bikeid={256} />
        </ProviderWrapper>);
    renderRouter(
      {
        index: wrappedBike,
        'directory/a': wrappedBike,
        '(group)/b': wrappedBike,
      },
      {
        initialUrl: '/directory/a',
      }
    );

    const milageField = await screen.findByTestId('mileageField');
    const name = screen.getByTestId('nameInput');
    expect(milageField.props.value).toBe("2000");
    expect(name.props.value).toBe("Ten");
  });

});
