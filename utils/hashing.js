import { compare, hash } from "bcrypt";
import { createHmac } from "crypto";
export const doHash = (value, setValue) => {
  const result = hash(value, setValue);
  return result;
};
export const doHashValidate = (value, hashedValue) => {
  const result = compare(value, hashedValue);
  return result;
};

export const hmacProcess = (value, hashedValue) => {
  const result = createHmac("sha256", value, hashedValue)
    .update(value)
    .digest("hex");
  return result;
};
