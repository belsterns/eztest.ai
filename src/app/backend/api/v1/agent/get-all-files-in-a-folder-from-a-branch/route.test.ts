import { getAllFilesInFolderFromBranch } from './route';

describe('getAllFilesInFolderFromBranch', () => {
  it('should return files from the specified folder in the branch', async () => {
    const folderPath = 'test-folder';
    const branchName = 'main';
    const result = await getAllFilesInFolderFromBranch(folderPath, branchName);
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it('should handle errors when folder does not exist', async () => {
    const folderPath = 'non-existent-folder';
    const branchName = 'main';
    await expect(getAllFilesInFolderFromBranch(folderPath, branchName)).rejects.toThrow();
  });
});