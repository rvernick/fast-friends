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

const startComponent = async () => {
  console.log('Starting component');
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
  console.log('Component started');
}

describe('Settings Component', () => {

  it('Button disabled until dirty', async () => {
    startComponent();
    const updateButton = await screen.findByTestId('update-button');
    console.log('button found');
    expect(updateButton.props.accessibilityState.disabled).toBe(true);
    console.log('button disabled');
    const kmButton = screen.getByTestId('unit-km');
    console.log('km button found');

    fireEvent.press(kmButton);
    console.log('km button pressed');
    expect(updateButton.props.accessibilityState.disabled).toBe(false);
  });

  it('Name disabled until dirty by name', async () => {
    startComponent();
    const updateButton = await screen.findByTestId('update-button');
    console.log('by name button found');
    expect(updateButton.props.accessibilityState.disabled).toBe(true);
    const firstName = screen.getByTestId('first-name');
    fireEvent.changeText(firstName, "FirstName");
    expect(updateButton.props.accessibilityState.disabled).toBe(false);
  });

  it('Units is km', async () => {
    startComponent();

    const kmButton = await screen.findByTestId('unit-km');
    console.log('kmButton found');
    const milesButton = screen.getByTestId('unit-miles');

    expect(kmButton.props.accessibilityState.checked).toBe(true);
    expect(milesButton.props.accessibilityState.checked).toBe(false);

    fireEvent.press(milesButton);

    expect(kmButton.props.accessibilityState.checked).toBe(false);
    expect(milesButton.props.accessibilityState.checked).toBe(true);

  });

});
