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
 
}

describe('Bike Dropdown Component', () => {
  
  it('Should not crash when bikes undefined', async () => {
    const wrappedBikeDropdown = jest.fn(() => 
        <ProviderWrapper>
          <BikeDropdown bikes={undefined} value={''} readonly={false} onSelect={function (value: string): void {
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

    const partSelector = await screen.findAllByText('Bike');
    expect(partSelector).not.toBeNull();
  });

  it('Should not crash when bikes is null', async () => {
    const wrappedBikeDropdown = jest.fn(() => 
        <ProviderWrapper>
          <BikeDropdown bikes={null} value={''} readonly={false} onSelect={function (value: string): void {
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

    const partSelector = await screen.findAllByText('Bike');
    expect(partSelector).not.toBeNull();
  });

  it('Should not crash when bikes is empty', async () => {
    const wrappedBikeDropdown = jest.fn(() => 
        <ProviderWrapper>
          <BikeDropdown bikes={[]} value={''} readonly={false} onSelect={function (value: string): void {
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
    
    const partSelector = await screen.findAllByText('Bike');
    expect(partSelector).not.toBeNull();
  });

});
