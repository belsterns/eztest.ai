export interface IRepoStrategy {
  findRepositoryDetails(
    baseUrl: string,
    organizationName: string,
    repoName: string,
    repoToken: string,
  ): Promise<any>;
}
