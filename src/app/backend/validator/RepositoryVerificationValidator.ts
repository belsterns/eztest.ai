import * as yup from "yup";
import { RepositoryVerification } from "../infrastructure/dtos/RepositoryVerification";
import { SaveRepositoryDetails } from "../infrastructure/dtos/SaveRepositoryDetails";
import { UpdateRepositoryDetails } from "../infrastructure/dtos/UpdateRepositoryDetails";

export class RepositoryVerificationValidator {
  async ValidateRepository(body: RepositoryVerification) {
    try {
      const schema = yup.object().shape({
        host_url: yup.string().strict().optional().nullable().url(),
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

  async SaveRepositoryDetails(body: SaveRepositoryDetails) {
    try {
      const schema = yup.object().shape({
        workspace_uuid: yup.string().strict().required(),
        host_url: yup.string().strict().optional().nullable().url(),
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

  async UpdateRepositoryDetails(body: UpdateRepositoryDetails) {
    try {
      const schema = yup.object().shape({
        host_url: yup.string().strict().optional().nullable().url(),
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
}
