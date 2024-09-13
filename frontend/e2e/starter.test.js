describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have welcome screen', async () => {
    await expect(element(by.id('getStarted'))).toBeVisible();
  });

  it('should show hello screen after tap', async () => {
    await element(by.id('getStarted')).tap();
    await expect(element(by.id('emailInput'))).toBeVisible();
  });

});
