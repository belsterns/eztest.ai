import { CommitterDto } from "./CreateNewFileRequestDto";

export type UpdateExistingFileRequestDto = {
  repo_url: string;
  branch_name: string;
  file_path: string;
  message: string;
  committer: CommitterDto;
  content: string;
  sha: string;
};
