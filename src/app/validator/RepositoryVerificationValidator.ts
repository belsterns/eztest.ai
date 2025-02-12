import * as yup from "yup";
import { RepositoryVerification } from "../infrastructure/dtos/RepositoryVerification";
import { SaveRepositoryDetails } from "../infrastructure/dtos/SaveRepositoryDetails";

export class RepositoryVerificationValidator {
  async ValidateRepository(body: RepositoryVerification) {
    try {
      const schema = yup.object().shape({
        host_url: yup.string().optional().max(255),
        remote_origin: yup.string().required().max(50),
        organization_name: yup.string().required().max(255),
        repo_name: yup.string().required().max(255),
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
        nocobase_id: yup.string().required(),
        host_url: yup.string().optional().max(255),
        remote_origin: yup.string().required().max(50),
        organization_name: yup.string().required().max(255),
        repo_name: yup.string().required().max(255),
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
