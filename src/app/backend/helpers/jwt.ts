import * as Jose from "jose";

interface SignOption {
  expiresIn: string;
}

const DEFAULT_SIGN_OPTION: SignOption = {
  expiresIn: "1h",
};

const secret = new TextEncoder().encode(
  process.env.SECRET_KEY
);

export async function signJwtAccessToken(
  payload: any,
  options: SignOption = DEFAULT_SIGN_OPTION
) {
  const token = await new Jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(options.expiresIn)
    .sign(secret);
  return token;
}

export async function verifyJwt(token: string) {
  try {
    const decoded = await Jose.jwtVerify(token, secret);
    return decoded;
  } catch (error) {
    return null;
  }
}
