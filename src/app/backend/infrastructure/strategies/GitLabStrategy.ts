import { IRepoStrategy } from "./IRepoStrategy";

export class GitLabStrategy implements IRepoStrategy {
  async findRepositoryDetails(
    baseUrl: string,
    _organizationName: string,
    repoName: string,
    repoToken: string
  ) {
    try {
      const url = baseUrl ?? process.env.GITLAB_API_BASE_URL;

      const projectPath = await encodeURIComponent(
        `${_organizationName}/${repoName}`
      );

      const myHeaders = new Headers();
      myHeaders.append("PRIVATE-TOKEN", repoToken);

      const requestOptions: any = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const searchResponse = await fetch(
        `${url}/projects/${projectPath}`,
        requestOptions
      );

      return searchResponse.json();
    } catch (err: any) {
      console.log(err);
      throw err;
    }
  }
}
