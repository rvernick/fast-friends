import React from 'react';
import {describe, it, expect } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react-native';
import { FinishAccount } from './FinishAccount'; // Update the path to where your FinishAccount component is located

describe('FinishAccount Component', () => {
  it('displays an error message for invalid phone number', () => {
    const navigation = {};
    const route = {params: {email: 'testaccount@testing.com'}};
    const { getByLabelText, getByText } = render(FinishAccount({navigation, route}));
    // Assuming your Input component for the mobile number has a placeholder text "Mobile"

    const mobileInput = getByLabelText('Mobile');

    // Simulate entering an invalid phone number
    fireEvent.changeText(mobileInput, '1234');

    // Assuming the error message is displayed as text, adjust if it's different
    const errorMessage = getByText('Invalid phone number');

    // Check if the error message is displayed
    expect(errorMessage).toBeTruthy();
  });
});