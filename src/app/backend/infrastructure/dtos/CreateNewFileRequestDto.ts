export type CreateNewFileRequestDto = {
  repo_url: string;
  branch_name: string;
  file_path: string;
  message: string;
  committer: CommitterDto;
  content: string;
};

export type CommitterDto = {
  name: string;
  email: string;
};
