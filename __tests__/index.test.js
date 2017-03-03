import loginUC from '../src';

describe('PortalUC', () => {
  it('create instance', async () => {
    const instance = await loginUC();
    expect(instance).toBeTruthy();
  });
});
