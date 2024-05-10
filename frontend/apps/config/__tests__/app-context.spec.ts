import AppContext from '../app-context';

describe('Email verifications', () => {
  it('Clearly invalid', () => {
    const appContext = new AppContext();
    appContext.setEmail('emailIn');
    expect(appContext.getEmail()).toBe('emailIn');
  });

  it('Can store and retrieve any string pair', () => {
    const appContext = new AppContext();
    appContext.put('myKey','myValue');
    expect(appContext.get('myKey')).toBe('myValue');
    expect(appContext.get('noKey')).toBeUndefined();
  });
});