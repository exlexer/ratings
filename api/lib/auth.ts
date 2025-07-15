import md5 from "md5";
import crypto from "crypto";
import { sha512 } from "js-sha512";

export function hashPassword(password) {
  const salt = crypto.randomBytes(128).toString("base64");
  return [md5(password + salt), salt];
}

export function checkPassword(hashed, salt, password) {
  return md5(password + salt) === hashed;
}

export function getAuthToken(username) {
  return sha512(
    `${crypto.randomBytes(128)}-${username}-${new Date().toDateString()}`,
  ).substring(0, 40);
}
