import { query } from "../lib/db.ts";

const FIELDS = ["username", "role"];

type User = {
  id: string;
  username: string;
  password: string;
  salt: string;
  role: string;
};

export function checkUsername(username: string): boolean {
  return query(
    `
      SELECT true AS exists
      FROM users
      WHERE username = $1
    `,
    [username],
  ).then((data) => !!data.exists);
}

export function getUsers() {
  return query(
    `
      SELECT username,
              role,
              id
      FROM users
    `,
  );
}

export function createUser(user: User) {
  return query(
    `
      INSERT INTO users (username, password, salt, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `,
    [user.username, user.password, user.salt, user.role || "User"],
  );
}

export async function getUserByUsername(username: string): Promise<User> {
  const user = await query(
    `
      SELECT *
      FROM users
      WHERE username = $1
    `,
    [username],
  );

  return user;
}

export async function getUserByToken(token: string): Promise<User> {
  const user = await query(
    `
      SELECT *
      FROM users
      WHERE id = (
        SELECT "user"
        FROM access_tokens
        WHERE token = $1
      )
    `,
    [token],
  );

  return user;
}

export async function getUserByRestaurant(restaurant: string): Promise<User> {
  const user = await query(
    `
      SELECT *
      FROM users
      WHERE id = (
        SELECT owner
        FROM restaurants
        WHERE id = $1
      )
    `,
    [restaurant],
  );

  return user as User;
}

export function deleteUser(userId: string) {
  return query(
    `
      DELETE FROM users
      WHERE id = $1
    `,
    [userId],
  );
}

export function updateUser(user, options) {
  const values = [];
  const updates = [];

  options.forEach((value, field) => {
    if (FIELDS.includes(field)) {
      values.push(value);
      updates.push(`${field} = $${values.length}`);
    }
  });

  values.push(user);

  return query(
    `
      UPDATE users
      SET ${updates.join(", ")}
      WHERE id = $${values.length}
    `,
    values,
  );
}
