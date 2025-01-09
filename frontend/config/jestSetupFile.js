jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('@logrocket/react-native', () => 
  require('../__mocks__/mockLogRocket')
);

