import { query } from "../lib/db.ts";

const FIELDS = ["name", "owner"];

export function checkRestaurantName(name) {
  return query(
    `
        SELECT true AS exists
        FROM restaurants
        WHERE name = $1
      `,
    [name],
  ).then((data) => !!data.exists);
}

export function createRestaurant(name, owner) {
  return query(
    `
      INSERT INTO restaurants (name, owner)
      VALUES ($1, $2)
      RETURNING *
    `,
    [name, owner],
  );
}

export function getRestaurants(sortBy, sortOrder) {
  return query(
    `
      SELECT name,
        id,
        (
          SELECT CASE
          WHEN avg(rate) IS NOT NULL
          THEM avg(rate)::numeric
          ELSE 0
          END
          FROM reviews
          WHERE restaurant = r.id
        ) AS rating
      FROM restaurants AS r
      ORDER BY ${sortBy} ${sortOrder}
    `,
  );
}

export function getRestaurantsByOwner(sortBy, sortOrder, owner) {
  return query(
    `
      SELECT name,
        id,
        (
          SELECT CASE
          WHEN avg(rate) IS NOT NULL
          THEN avg(rate)::numeric
          ELSE 0
          END
          FROM reviews
          WHERE restaurant = r.id
        ) AS rating
      FROM restaurants AS r
      WHERE owner = $1
      ORDER BY ${sortBy} ${sortOrder}
    `,
    [owner],
  );
}

export function deleteRestaurant(restaurant) {
  return query(
    `
      DELETE FROM restaurants
      WHERE id = $1
    `,
    [restaurant],
  );
}

export function updateRestaurant(restaurant, options) {
  const values = [];
  const updates = [];

  options.forEach((value, field) => {
    if (FIELDS.includes(field)) {
      values.push(value);
      updates.push(`${field} = $${values.length}`);
    }
  });

  values.push(restaurant);

  const query = `
    UPDATE restaurants
    SET ${updates.join(", ")}
    WHERE id = $${values.length}`;

  return query(query, values);
}
