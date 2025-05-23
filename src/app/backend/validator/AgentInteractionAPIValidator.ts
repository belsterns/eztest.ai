import * as yup from "yup";
import { FetchFileContentRequestDto } from "../infrastructure/dtos/FetchFileContentRequestDto";
import { FetchModifiedFilesRequestDto } from "../infrastructure/dtos/FetchModifiedFilesRequestDto";
import { CreateBranchRequestDto } from "../infrastructure/dtos/CreateBranchRequestDto";
import { CreatePullRequestDto } from "../infrastructure/dtos/CreatePullRequestDto";
import { FolderPathDtoRequest } from "../infrastructure/dtos/FolderPathDtoRequest";
import { GetAllBranchesRequestDto } from "../infrastructure/dtos/GetAllBranchesRequestDto";
import { UpdateExistingFileRequestDto } from "../infrastructure/dtos/UpdateExistingFileRequestDto";
import { CreateNewFileRequestDto } from "../infrastructure/dtos/CreateNewFileRequestDto";

export class AgentInteractionAPIValidator {
  async ValidateFetchFileContent(body: FetchFileContentRequestDto) {
    try {
      const schema = yup.object().shape({
        repo_url: yup.string().strict().required().url(),
        branch_name: yup.string().strict().required(),
        file_path: yup.string().strict().required(),
      });

      await schema.validate(body, { abortEarly: false });
      return true;
    } catch (err: any) {
      throw {
        statusCode: 422,
        message: "Validation error",
        data: err.inner.reduce((acc: any, error: any) => {
          acc[error.path] = error.message;
          return acc;
        }, {}),
      };
    }
  }

  async ValidateFetchModifiedFiles(body: FetchModifiedFilesRequestDto) {
    try {
      const schema = yup.object().shape({
        repo_url: yup.string().strict().required().url(),
        branch_name: yup.string().strict().required(),
        changed_files: yup
          .array()
          .of(
            yup.object().shape({
              filename: yup.string().strict().required(),
              status: yup.string().strict().required(),
            })
          )
          .strict()
          .required()
          .min(1, "At least one changed file is required"),
      });

      await schema.validate(body, { abortEarly: false });
      return true;
    } catch (err: any) {
      throw {
        statusCode: 422,
        message: "Validation error",
        data: err.inner.reduce((acc: any, error: any) => {
          acc[error.path] = error.message;
          return acc;
        }, {}),
      };
    }
  }

  async ValidateCreateBranch(body: CreateBranchRequestDto) {
    try {
      const schema = yup.object().shape({
        repo_url: yup.string().strict().required().url(),
        base_branch: yup.string().strict().required(),
        new_branch: yup.string().strict().required(),
      });

      await schema.validate(body, { abortEarly: false });
      return true;
    } catch (err: any) {
      throw {
        statusCode: 422,
        message: "Validation error",
        data: err.inner.reduce((acc: any, error: any) => {
          acc[error.path] = error.message;
          return acc;
        }, {}),
      };
    }
  }

  async ValidateCreatePullRequest(body: CreatePullRequestDto) {
    try {
      const schema = yup.object().shape({
        repo_url: yup.string().strict().required().url(),
        head_branch: yup.string().strict().required(),
        base_branch: yup.string().strict().required(),
        title: yup.string().strict().required(),
        body: yup.string().strict().required(),
      });

      await schema.validate(body, { abortEarly: false });
      return true;
    } catch (err: any) {
      throw {
        statusCode: 422,
        message: "Validation error",
        data: err.inner.reduce((acc: any, error: any) => {
          acc[error.path] = error.message;
          return acc;
        }, {}),
      };
    }
  }

  async ValidateFolderPathDtoRequest(body: FolderPathDtoRequest) {
    try {
      const schema = yup.object().shape({
        repo_url: yup.string().strict().required().url(),
        branch_name: yup.string().strict().required(),
        folder_path: yup.string().strict().required(),
      });

      await schema.validate(body, { abortEarly: false });
      return true;
    } catch (err: any) {
      throw {
        statusCode: 422,
        message: "Validation error",
        data: err.inner.reduce((acc: any, error: any) => {
          acc[error.path] = error.message;
          return acc;
        }, {}),
      };
    }
  }

  async ValidateGetAllBranches(body: GetAllBranchesRequestDto) {
    try {
      const schema = yup.object().shape({
        repo_url: yup.string().strict().required().url(),
      });

      await schema.validate(body, { abortEarly: false });
      return true;
    } catch (err: any) {
      throw {
        statusCode: 422,
        message: "Validation error",
        data: err.inner.reduce((acc: any, error: any) => {
          acc[error.path] = error.message;
          return acc;
        }, {}),
      };
    }
  }

  async validateUpdateExistingFile(body: UpdateExistingFileRequestDto) {
    try {
      const schema = yup.object().shape({
        repo_url: yup.string().strict().required().url(),
        branch_name: yup.string().strict().required(),
        file_path: yup.string().strict().required(),
        message: yup.string().strict().required(),
        committer: yup.object().shape({
          name: yup.string().strict().required(),
          email: yup.string().strict().email().required(),
        }),
        content: yup.string().strict().required(),
        sha: yup.string().strict().optional(),
      });

      await schema.validate(body, { abortEarly: false });
      return true;
    } catch (err: any) {
      throw {
        statusCode: 422,
        message: "Validation error",
        data: err.inner.reduce((acc: any, error: any) => {
          acc[error.path] = error.message;
          return acc;
        }, {}),
      };
    }
  }

  async validateCreateNewFile(body: CreateNewFileRequestDto) {
    try {
      const schema = yup.object().shape({
        repo_url: yup.string().strict().required().url(),
        branch_name: yup.string().strict().required(),
        file_path: yup.string().strict().required(),
        message: yup.string().strict().required(),
        committer: yup.object().shape({
          name: yup.string().strict().required(),
          email: yup.string().strict().email().required(),
        }),
        content: yup.string().strict().required(),
      });

      await schema.validate(body, { abortEarly: false });
      return true;
    } catch (err: any) {
      throw {
        statusCode: 422,
        message: "Validation error",
        data: err.inner.reduce((acc: any, error: any) => {
          acc[error.path] = error.message;
          return acc;
        }, {}),
      };
    }
  }
}
