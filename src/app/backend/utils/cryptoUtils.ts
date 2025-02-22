import * as crypto from "crypto";

const SECRET_KEY = process.env.SECRET_KEY!;
const IV_LENGTH = 16;

if (!SECRET_KEY) throw new Error("Secret key not found");

export function encryptToken(token: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(SECRET_KEY, "hex"),
    iv,
  );
  const encrypted = cipher.update(token, "utf8", "hex") + cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

export function decryptToken(encryptedToken: string): string {
  const [ivHex, encryptedHex] = encryptedToken.split(":");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(SECRET_KEY, "hex"),
    Buffer.from(ivHex, "hex"),
  );
  return decipher.update(encryptedHex, "hex", "utf8") + decipher.final("utf8");
}
