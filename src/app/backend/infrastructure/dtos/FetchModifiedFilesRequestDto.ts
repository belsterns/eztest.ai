export type FetchModifiedFilesRequestDto = {
  repo_url: string;
  branch_name: string;
  changed_files: { filename: string; status: string }[];
};
