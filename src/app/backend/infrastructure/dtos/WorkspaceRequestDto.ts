export type CreateWorkspaceRequestDto = {
  name: string;
  description: string;
};

export type UpdateWorkspaceRequestDto = {
  name?: string;
  description?: string;
};
