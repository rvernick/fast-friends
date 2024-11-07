import { screen, cleanup, fireEvent } from '@testing-library/react-native';
import { ProviderWrapper } from '../../test_utils';
import { renderRouter } from 'expo-router/testing-library';
import { SettingsComponent } from '../SettingsComponent';

jest.useFakeTimers();
afterEach(cleanup);

const mockedUser = {
  id: 512,
  username: "username",
  firstName: "first",
  lastName: "last",
  cellPhone: "4158675309",
  stravaId: '',
  bikes: [],
  units: "km",
};

const getMockedUser = () => {
  console.log('getMockedUser called');
  return Promise.resolve(mockedUser);
}

jest.mock('../../../common/utils', () => {
  const originalModule = jest.requireActual('../../../common/utils');
  return {
    __esModule: true,
    ...originalModule,
    fetchUser: jest.fn(() => getMockedUser()),
    foo: 'mocked foo',
  };
});
describe('Settings Component', () => {
  
  it('Units is km', async () => {
    const wrappedBike = jest.fn(() => 
        <ProviderWrapper>
          <SettingsComponent strava_id='' />
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

    const kmButton = await screen.findByTestId('unit-km');
    const milesButton = await screen.findByTestId('unit-miles');

    expect(kmButton.props.accessibilityState.checked).toBe(true);
    expect(milesButton.props.accessibilityState.checked).toBe(false);

    fireEvent.press(milesButton);

    expect(kmButton.props.accessibilityState.checked).toBe(false);
    expect(milesButton.props.accessibilityState.checked).toBe(true);

  });

});
