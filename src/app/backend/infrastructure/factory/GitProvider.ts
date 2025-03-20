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
  fetchFilesInFolderFromBranch(
    repoFullName: string,
    branchName: string,
    folderPath: string
  ): Promise<any[]>;
}
