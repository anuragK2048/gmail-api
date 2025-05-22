import crypto from "crypto";

export function generateCSRFtoken() {
  return crypto.randomBytes(32).toString("hex");
}

console.log(generateCSRFtoken());
