import {screen, cleanup } from '@testing-library/react-native';
import { ProviderWrapper } from '../../test_utils';
import { renderRouter } from 'expo-router/testing-library';
import { BikeDropdown } from '@/components/common/BikeDropdown';

// jest.useFakeTimers();
afterEach(cleanup);
jest.mock('../../../common/utils', () => {
  const originalModule = jest.requireActual('../../../common/utils');
  return {
    __esModule: true,
  ...originalModule,
    getUserPreferences: jest.fn(() => { return Promise.resolve({ "units": "miles" }) }),
  };
});

const startComponent = async (bikes: any) => {
  const wrappedBikeDropdown = jest.fn(() => 
      <ProviderWrapper>
        <BikeDropdown bikes={bikes} value={''} readonly={false} onSelect={function (value: string): void {
          throw new Error('Function not implemented.');
        } } />
      </ProviderWrapper>);
  renderRouter(
    {
      index: wrappedBikeDropdown,
      'directory/a': wrappedBikeDropdown,
      '(group)/b': wrappedBikeDropdown,
    },
    {
      initialUrl: '/directory/a',
    }
  );
}

describe('Bike Dropdown Component', () => {
  
  it('Should not crash when bikes undefined', async () => {
    startComponent(undefined);

    const partSelector = await screen.findAllByText('Bike');
    expect(partSelector).not.toBeNull();
  });

  it('Should not crash when bikes is null', async () => {
    startComponent(null);

    const partSelector = await screen.findAllByText('Bike');
    expect(partSelector).not.toBeNull();
  });

  it('Should not crash when bikes is empty', async () => {
    startComponent([]);
    
    const partSelector = await screen.findAllByText('Bike');
    expect(partSelector).not.toBeNull();
  });

});
