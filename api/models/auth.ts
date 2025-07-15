import { query } from "../lib/db.ts";

export function setAuthToken(token, user) {
  return query(
    `
      INSERT INTO access_tokens (token, "user")
      VALUES ($1, $2)
    `,
    [token, user],
  );
}
