import * as yup from "yup";
import {
  CreateWorkspaceRequestDto,
  UpdateWorkspaceRequestDto,
} from "../infrastructure/dtos/WorkspaceRequestDto";

export class WorkspaceValidator {
  async CreateWorkspace(body: CreateWorkspaceRequestDto) {
    try {
      const schema = yup.object().shape({
        name: yup.string().strict().required(),
        description: yup
          .string()
          .strict()
          .required()
          .max(255, "Must be alphanumeric with upto 255 characters"),
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

  async UpdateWorkspace(body: UpdateWorkspaceRequestDto) {
    try {
      const schema = yup.object().shape({
        name: yup.string().strict().optional(),
        description: yup
          .string()
          .strict()
          .optional()
          .max(255, "Must be alphanumeric with upto 255 characters"),
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
