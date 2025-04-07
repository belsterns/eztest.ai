import { createPullRequest } from '../create-pull-request';

describe('createPullRequest', () => {
  it('should create a pull request successfully', async () => {
    const result = await createPullRequest({/* mock data */});
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('url');
  });

  it('should throw an error if required fields are missing', async () => {
    await expect(createPullRequest({/* missing fields */})).rejects.toThrow('Required fields are missing');
  });

  it('should handle API errors gracefully', async () => {
    jest.spyOn(api, 'create').mockImplementationOnce(() => Promise.reject(new Error('API error')));
    await expect(createPullRequest({/* valid data */})).rejects.toThrow('API error');
  });
});