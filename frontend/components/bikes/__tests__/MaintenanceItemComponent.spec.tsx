import {render, screen, fireEvent, cleanup } from '@testing-library/react-native';
import { ProviderWrapper } from '../../test_utils';
import MaintenanceItemComponent, { BikeDropdown } from '../MaintenanceItemComponent';

jest.useFakeTimers();
afterEach(cleanup);

describe('Login Component', () => {
  
  it('New Maintenance Item is editable', () => {
    render(
      <ProviderWrapper>
        <MaintenanceItemComponent maintenanceid={0} bikeid={0} />
      </ProviderWrapper>
    );

    const partSelector = screen.getByTestId('partDropdown');
    const dueMilesInput = screen.getByTestId('dueMilesInput');
    // fireEvent(partSelector, 'onChange', 'Cassette');
    fireEvent.changeText(dueMilesInput, '1000');
    console.log("partSelector props: " + Object.keys(partSelector.props));
    console.log("partSelector disabled: " + Object.keys(partSelector.props));
    console.log("partSelector disabled prop: " + partSelector.props.disabled);
    console.log("partSelector focusable: " + partSelector.props.focusable);
    // expect(screen.getByDisplayValue('Cassette')).not.toBeNull();
    // expect(partSelector.props.value).toBe('Cassette');
    expect(dueMilesInput.props.value).toBe('1000');
  });

  it('Should not crash when bikes undefined', () => {
    render(
      <ProviderWrapper>
        <BikeDropdown bikes={undefined} value={''} readonly={false} onSelect={function (value: string): void {
          throw new Error('Function not implemented.');
        } } />
      </ProviderWrapper>
    );
  });

  it('Should not crash when bikes is null', () => {
    render(
      <ProviderWrapper>
        <BikeDropdown bikes={null} value={''} readonly={false} onSelect={function (value: string): void {
          throw new Error('Function not implemented.');
        } } />
      </ProviderWrapper>
    );
  });
  it('Should not crash when bikes is empty', () => {
    render(
      <ProviderWrapper>
        <BikeDropdown bikes={[]} value={''} readonly={false} onSelect={function (value: string): void {
          throw new Error('Function not implemented.');
        } } />
      </ProviderWrapper>
    );
  });

});
