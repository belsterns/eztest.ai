export type FetchModifiedFilesRequestDto = {
  repo_url: string;
  branch_name: string;
  changed_files: ChangesFilesDto[];
};

export type ChangesFilesDto = {
  filename: string;
  status: string;
};
