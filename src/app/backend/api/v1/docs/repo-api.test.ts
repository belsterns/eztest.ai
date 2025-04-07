import { repoApi } from './repo-api';

describe('repoApi', () => {
  it('should return expected data', async () => {
    const response = await repoApi.getData();
    expect(response).toEqual(expectedData);
  });

  it('should handle errors', async () => {
    await expect(repoApi.getData()).rejects.toThrow('Error message');
  });
});