import * as bcrypt from "bcrypt";

export async function comparePassword(
  requestPassword: string,
  actualPassword: string
) {
  return await bcrypt.compare(requestPassword, actualPassword);
}
