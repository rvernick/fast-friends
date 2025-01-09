
/* eslint-disable no-undef */
jest.mock('@logrocket/react-native', () => ({
  LogRocket: {
    init: jest.fn(),
    identify: jest.fn(),
  },
  init: jest.fn(),
  identify: jest.fn(),
}));
