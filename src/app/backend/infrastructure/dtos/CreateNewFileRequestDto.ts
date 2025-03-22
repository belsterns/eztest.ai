export type CreateNewFileRequestDto = {
  repo_url: string;
  branch_name: string;
  file_path: string;
  message: string;
  committer: {
    name: string;
    email: string;
  };
  content: string;
};
