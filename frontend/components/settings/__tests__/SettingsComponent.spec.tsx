import { screen, cleanup, fireEvent } from '@testing-library/react-native';
import { ProviderWrapper } from '../../test_utils';
import { renderRouter } from 'expo-router/testing-library';
import { SettingsComponent } from '../SettingsComponent';

// jest.useFakeTimers();
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

  it('Button disabled until dirty', async () => {
    const wrappedSettings = jest.fn(() => 
        <ProviderWrapper>
          <SettingsComponent strava_id='' />
        </ProviderWrapper>);
    renderRouter(
      {
        index: wrappedSettings,
        'directory/a': wrappedSettings,
        '(group)/b': wrappedSettings,
      },
      {
        initialUrl: '/directory/a',
      }
    );
    const updateButton = await screen.findByTestId('update-button');
    expect(updateButton.props.accessibilityState.disabled).toBe(true);
    const kmButton = await screen.findByTestId('unit-km');
    fireEvent.press(kmButton);
    expect(updateButton.props.accessibilityState.disabled).toBe(false);
  });

  it('Name disabled until dirty by name', async () => {
    const wrappedSettings = jest.fn(() => 
        <ProviderWrapper>
          <SettingsComponent strava_id='' />
        </ProviderWrapper>);
    renderRouter(
      {
        index: wrappedSettings,
        'directory/a': wrappedSettings,
        '(group)/b': wrappedSettings,
      },
      {
        initialUrl: '/directory/a',
      }
    );

    const updateButton = await screen.findByTestId('update-button');
    expect(updateButton.props.accessibilityState.disabled).toBe(true);
    const firstName = await screen.findByTestId('first-name');
    fireEvent.changeText(firstName, "FirstName");
    expect(updateButton.props.accessibilityState.disabled).toBe(false);
  });

  it('Units is km', async () => {
    const wrappedSettings = jest.fn(() => 
        <ProviderWrapper>
          <SettingsComponent strava_id='' />
        </ProviderWrapper>);
    renderRouter(
      {
        index: wrappedSettings,
        'directory/a': wrappedSettings,
        '(group)/b': wrappedSettings,
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
