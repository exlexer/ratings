import { Router } from "express";
const router = Router();

import {
  checkRestaurantName,
  createRestaurant,
  deleteRestaurant,
  getRestaurants,
  getRestaurantsByOwner,
  updateRestaurant,
} from "../models/restaurants.ts";
import {
  getReviewsByRestaurant,
  updateReview,
  deleteReview,
  createReview,
  replyToReview,
} from "../models/reviews.ts";
import { getUserByRestaurant } from "../models/users.ts";

import authorize from "../authorizeRequest.ts";

/**
 * Add new restaurant
 * @param {string} name
 */
router.post("", authorize(["owner", "user", "admin"]), (req, res, next) =>
  createRestaurant(req.body.name, req.user.id)
    .then((data) => {
      res.json(data);
    })
    .catch(next),
);

/**
 * Get all restaurants
 */
router.get("", authorize(["user", "owner", "admin"]), (req, res, next) => {
  const { sortBy = "rating", sortOrder = "desc" } = req.query;

  const gettingRestaurants =
    req.user.role === "owner"
      ? getRestaurantsByOwner(sortBy, sortOrder, req.user.id)
      : getRestaurants(sortBy, sortOrder);

  let _restaurants;

  gettingRestaurants
    .then((restaurants) => {
      if (restaurants.command) {
        _restaurants = [];
        return [];
      }
      _restaurants = Array.isArray(restaurants) ? restaurants : [restaurants];
      return Promise.all(
        _restaurants.map(({ id }) =>
          getReviewsByRestaurant(id, req.user.role !== "owner"),
        ),
      );
    })
    .then((reviews) =>
      res.json(
        _restaurants.map((r, index) => ({
          ...r,
          ...reviews[index],
          highest: reviews[index].highest[0] || null,
          lowest: reviews[index].lowest[0] || null,
          rating: parseInt(r.rating) || 0,
        })),
      ),
    )
    .catch(next);
});

/**
 * Checks if a username is already taken
 */
router.get("/duplicate/:name", (req, res, next) => {
  const { name } = req.params;

  checkRestaurantName(name)
    .then((exists) => res.json({ exists }))
    .catch(next);
});

/**
 * Deletes a restaurant
 */
router.delete("/:id", authorize(), (req, res, next) =>
  deleteRestaurant(req.params.id)
    .then(() => {
      res.json({ message: "success" });
    })
    .catch(next),
);

/**
 * Updates a restaurant
 */
router.patch("/:id", authorize(), (req, res, next) =>
  updateRestaurant(req.params.id, req.body)
    .then(() => {
      res.json({ message: "success" });
    })
    .catch(next),
);

/**
 * Updates a restaurant's review
 */
router.patch("/:id/reviews/:review", authorize(), (req, res, next) =>
  updateReview(req.params.id, req.params.review, req.body)
    .then(() => {
      res.json({ message: "success" });
    })
    .catch(next),
);

/**
 * Deletes a restaurant's review
 */
router.delete("/:id/reviews/:review", authorize(), (req, res, next) =>
  deleteReview(req.params.id, req.params.review)
    .then(() => {
      res.json({ message: "success" });
    })
    .catch(next),
);

/**
 * Add new review
 * @param {number} rate
 * @param {date} date
 * @param {string} comment
 */
router.post("/:id/reviews", authorize(["user"]), (req, res, next) => {
  const { rate, date, comment } = req.body;

  createReview(req.user.id, req.params.id, rate, date, comment)
    .then(({ id }) => res.json({ id }))
    .catch(next);
});

/**
 * Reply to a review
 * @param {string} comment
 */
router.post(
  "/:id/reviews/:review/reply",
  authorize(["owner"]),
  (req, res, next) => {
    const { id, review } = req.params;
    const { comment } = req.body;

    getUserByRestaurant(id)
      .then((data) => {
        if (data.id === req.user.id || req.user.role === "admin") {
          return replyToReview(review, comment);
        } else {
          res.sendStatus(401);
          throw new Error("Unauthorized");
        }
      })
      .then((data) => {
        res.json({ message: "Success!" });
      })
      .catch(next);
  },
);

export default router;
