import { query } from "../lib/db.ts";

const FIELDS = ["restaurant", "rate", "visit_date", "comment"];

export function createReview(user, restaurant, rate, date, comment) {
  return query(
    `
      INSERT INTO reviews ("user", restaurant, rate, visit_date, comment)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `,
    [user, restaurant, rate, date, comment],
  );
}

export function replyToReview(review, reply) {
  return query(
    `
      UPDATE reviews
      SET reply = $2
      WHERE id = $1
    `,
    [review, reply],
  );
}

export function getReviewsByRestaurant(restaurant, includeReplied) {
  const replyFilter = "AND reply IS NULL";

  return new Promise((resolve, reject) => {
    Promise.all([
      query(
        `
          SELECT *,
                (SELECT username FROM users WHERE id = r.user)
          FROM reviews AS r
          WHERE restaurant = $1
          ${!includeReplied ? replyFilter : ""}
        `,
        [restaurant],
      ),
      query(
        `
          SELECT *,
                (SELECT username FROM users WHERE id = r.user)
          FROM reviews AS r
          WHERE restaurant = $1
          ${!includeReplied ? replyFilter : ""}
          ORDER BY visit_date DESC
          LIMIT 3
        `,
        [restaurant],
      ),
      query(
        `
          SELECT *,
                (SELECT username FROM users WHERE id = r.user)
          FROM reviews AS r
          WHERE restaurant = $1
          ${!includeReplied ? replyFilter : ""}
          ORDER BY rate DESC
          LIMIT 1
        `,
        [restaurant],
      ),
      query(
        `
          SELECT *,
                (SELECT username FROM users WHERE id = r.user)
          FROM reviews AS r
          WHERE restaurant = $1
          ${!includeReplied ? replyFilter : ""}
          ORDER BY rate ASC
          LIMIT 1
        `,
        [restaurant],
      ),
    ])
      .then(([reviews, lastThree, highest, lowest]) => {
        let results = {};

        const res = {
          reviews,
          lastThree,
          highest,
          lowest,
        };

        Object.keys(res).forEach((key) => {
          let data = res[key];

          if (data.command) {
            data = [];
          }
          if (!Array.isArray(data)) {
            data = [data];
          }
          results[key] = data;
        });
        resolve(results);
      })
      .catch(reject);
  });
}

export function deleteReview(restaurant, review) {
  return query(
    `
      DELETE FROM reviews
      WHERE restaurant = $1
      AND id = $2
    `,
    [restaurant, review],
  );
}

export function updateReview(restaurant, review, options) {
  const values = [];
  const updates = [];

  options.forEach((value, field) => {
    if (FIELDS.includes(field)) {
      values.push(value);
      updates.push(`${field} = $${values.length}`);
    }
  });

  values.push(restaurant);
  values.push(review);

  const query = `
    UPDATE reviews
    SET ${updates.join(", ")}
    WHERE restaurant = $${values.length - 1}
    AND id = $${values.length}
  `;

  return query(query, values);
}
