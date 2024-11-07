import { screen, cleanup } from '@testing-library/react-native';
import { ProviderWrapper } from '../../test_utils';
import { renderRouter } from 'expo-router/testing-library';
import BikeComponent from '../BikeComponent';
import { milesToMeters } from '@/common/utils';

jest.useFakeTimers();
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
  };

const getMockedBike = () => {
  console.log('getMockedBike called');
  return Promise.resolve(mockedBike);
}

const mockedInternal = jest.fn(() => getMockedBike());

jest.mock('../../../common/data-utils', () => {
  const originalModule = jest.requireActual('../../../common/http-utils');
  return {
    __esModule: true,
    ...originalModule,
    getBike: jest.fn(() => getMockedBike()),
    foo: 'mocked foo',
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
    const name = await screen.findByTestId('nameInput');
    expect(milageField.props.value).toBe("2000");
    expect(name.props.value).toBe("Ten");
  });

});