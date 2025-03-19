import * as yup from "yup";
import { FetchFileContentRequestDto } from "../infrastructure/dtos/FetchFileContentRequestDto";
import { FetchModifiedFilesRequestDto } from "../infrastructure/dtos/FetchModifiedFilesRequestDto";
import { CreateBranchRequestDto } from "../infrastructure/dtos/CreateBranchRequestDto";

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
}
