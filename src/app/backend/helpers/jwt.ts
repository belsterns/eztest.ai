import jwt from "jsonwebtoken";

export function generateJwtToken(userInfo: any) {
  if (!process.env.AUTH_SECRET) {
    throw new Error("AUTH_SECRET is not defined in environment variables");
  }

  return jwt.sign(userInfo, process.env.AUTH_SECRET, {
    expiresIn: "30d",
  });
}
