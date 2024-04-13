import {render, fireEvent} from '@testing-library/react-native';
import { NativeBaseProvider } from 'native-base';
import { GlobalStateProvider } from "../../config/GlobalContext";
// import { BASE_URL } from '@env';

// import {describe, it, expect } from '@jest/globals';
// import { render, fireEvent } from '@testing-library/react-native';
import { FinishAccount, stripPhoneNumber } from '../FinishAccount'; // Update the path to where your FinishAccount component is located

describe('FinishAccount Component', () => {
  it('displays an error message for invalid phone number', () => {
    const navigation = {};
    const route = {params: {email: 'testaccount@testing.com'}};
    const { getByTestId, findAllByText, getAllByDisplayValue } = render(
      <GlobalStateProvider>
        <NativeBaseProvider >
          <FinishAccount navigation={navigation} route={route}/>
        </NativeBaseProvider>
      </GlobalStateProvider>);

    // const bytestId = getByTestId('FinishAccount:');
    // const mobile = findAllByText('Mobile');
    // console.log('mobile is: ' + mobile);
    // console.log('mobile0 is: ' + mobile[0]);
    // console.log('mobile1 is: ' + mobile[1]);

    // Simulate entering an invalid phone number
    // fireEvent.changeText(mobile, '1234');

    // Assuming the error message is displayed as text, adjust if it's different
    // const errorMessage = getByLabel('Invalid phone number');
    // console.log(errorMessage);

    // Check if the error message is displayed
    // expect(errorMessage).toBeTruthy();
  });
});



