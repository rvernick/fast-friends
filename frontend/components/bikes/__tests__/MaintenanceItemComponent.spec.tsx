import { screen, fireEvent, cleanup } from '@testing-library/react-native';
import { ProviderWrapper } from '../../test_utils';
import { renderRouter } from 'expo-router/testing-library';
import MaintenanceItemComponent from '../MaintenanceItemComponent';
import { mockedBikes, mockedHistory } from '@/common/test-utils';

jest.useFakeTimers();
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
  return Promise.resolve(mockedHistory);
}

const getMockedBikes = () => {
  console.log('getMockedBikes called');
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

describe('Maintenance Item Component', () => {
  
  it('New Maintenance Item is editable', async () => {
  const wrappedMI = jest.fn(() => 
        <ProviderWrapper>
          <MaintenanceItemComponent maintenanceid={0} bikeid={0} />
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

    const partSelector = await screen.findByTestId('partDropdown');
    const dueMilesInput = screen.getByTestId('dueMilesInput');
    // fireEvent(partSelector, 'onChange', 'Cassette');
    console.log("fire dueMilesInput");
    fireEvent.changeText(dueMilesInput, '1000');
    console.log("partSelector props: " + Object.keys(partSelector.props));
    console.log("partSelector disabled: " + Object.keys(partSelector.props));
    console.log("partSelector disabled prop: " + partSelector.props.disabled);
    console.log("partSelector focusable: " + partSelector.props.focusable);
    // expect(await screen.findByTestId('Cassette')).not.toBeNull();
    // expect(partSelector.props.value).toBe('Cassette');
    expect(dueMilesInput.props.value).toBe('1000');
    // const dueDistanceLabel = await screen.findByText('Due Distance (mild');
  });

});
