import { fetchFileContent } from './route';

describe('fetchFileContent', () => {
  it('should return file content for a valid file path', async () => {
    const filePath = 'valid/path/to/file.txt';
    const content = await fetchFileContent(filePath);
    expect(content).toBeDefined();
    expect(content).toContain('expected content');
  });

  it('should throw an error for an invalid file path', async () => {
    const filePath = 'invalid/path/to/file.txt';
    await expect(fetchFileContent(filePath)).rejects.toThrow('File not found');
  });
});