import * as yup from "yup";

export class AuthValidator {
  async SignUp(body: UserSignUpRequestDto) {
    try {
      const schema = yup.object().shape({
        email: yup.string().required().email(),
        password: yup.string().required(),
        organization_name: yup
          .string()
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

  async SignIn(body: UserSignInRequestDto) {
    try {
      const schema = yup.object().shape({
        email: yup.string().required().email(),
        password: yup.string().required(),
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
