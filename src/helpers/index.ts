import crypto from "crypto";

const SECRET = "Secret_key_rest_api";

export const random = () => {
  return crypto.randomBytes(128).toString("base64");
};
export const authentication = (salt: string, password: string) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(SECRET)
    .digest()
    .toString();
};
