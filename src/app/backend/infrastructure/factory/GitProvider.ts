export interface GitProvider {
  fetchFileContent(
    repoFullName: string,
    branchName: string,
    filePath: string
  ): Promise<string | null>;
  fetchModifiedFiles(
    repoFullName: string,
    branchName: string,
    changedFiles: any
  ): Promise<any[]>;
  createBranch(
    repoFullName: string,
    baseBranch: string,
    newBranch: string
  ): Promise<void>;
  createPullRequest(
    repoFullName: string,
    headBranch: string,
    baseBranch: string,
    title: string,
    body: string
  ): Promise<void>;
  processFullRepo(
    userUuid: string,
    repoUuid: string,
    repoFullName: string,
    baseBranch: string
  ): Promise<any>;
  fetchFilesInFolderFromBranch(
    repoFullName: string,
    branchName: string,
    folderPath: string
  ): Promise<any[]>;
  getAllBranches(repoFullName: string): Promise<any[]>;
  updateExistingFile(
    repoFullName: string,
    branchName: string,
    filePath: string,
    message: string,
    committer: { name: string; email: string },
    content: string,
    sha: string
  ): Promise<any>;
  createNewFile(
    repoFullName: string,
    branchName: string,
    filePath: string,
    message: string,
    committer: { name: string; email: string },
    content: string
  ): Promise<any>;
}
