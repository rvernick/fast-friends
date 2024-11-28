import { screen, fireEvent, cleanup } from '@testing-library/react-native';
import { ProviderWrapper } from '../../test_utils';
import { renderRouter } from 'expo-router/testing-library';
import MaintenanceItemComponent from '../MaintenanceItemComponent';
import { createMockBike } from '@/common/test-utils';
import { ensureString, sleep } from '@/common/utils';
import { getSortedBikes } from '../MaintenanceComponent';

describe('Maintenance Component', () => {
  const names = ["Bike Share Bike", "Kinetic Trainer", "Novara Strada", "Specialized Roubaix Comp 2020", "rental (other)", "Specialized Roubaix SL4 Sport"];
  const bikes = names.map(name => (createMockBike(ensureString(name))));
  it('Bike sorting', async () => {
    const sortedBikes =  getSortedBikes(bikes, 'A-Z');
    console.log(sortedBikes);
  });


});
