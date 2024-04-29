import AppContext from '../app-context';

describe('Email verifications', () => {
  it('Clearly invalid', () => {
    const appContext = new AppContext();
    appContext.setEmail('emailIn');
    expect(appContext.getEmail()).toBe('emailIn');
  });
});