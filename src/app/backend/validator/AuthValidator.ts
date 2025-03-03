import * as yup from "yup";
import { UserSignUpRequestDto } from "../infrastructure/dtos/UserSignUpRequestDto";

export class AuthValidator {
  async SignUp(body: UserSignUpRequestDto) {
    try {
      const schema = yup.object().shape({
        email: yup.string().strict().required().email(),
        password: yup.string().strict().optional(),
        full_name: yup
          .string()
          .strict()
          .required()
          .max(255, "Must be alphanumeric with upto 255 characters"),
        organization_name: yup
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
}
