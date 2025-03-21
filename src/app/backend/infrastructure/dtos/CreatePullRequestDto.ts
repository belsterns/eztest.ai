export type CreatePullRequestDto = {
  repo_url: string;
  head_branch: string;
  base_branch: string;
  title: string;
  body: string;
};
