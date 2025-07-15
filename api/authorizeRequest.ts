import { getUserByToken } from "./models/users.ts";

/**
 * Authorize a request
 * Without parameters, a route will
 * be scoped to admin, to add any
 * other scopes, an array of roles
 * can be passed
 * @param {array} roles
 */
export default function (roles = [], passThrough = false) {
  return (req, res, next) => {
    roles = [...roles, "admin"];

    const token = req.cookies.access_token;

    if (!token && !passThrough) {
      return res.sendStatus(401);
    }

    getUserByToken(token).then((user) => {
      if (roles.includes(user.role)) {
        req.user = {
          id: user.id,
          username: user.username,
          role: user.role,
        };
        next();
      } else if (passThrough) {
        next();
      } else {
        res.sendStatus(401);
      }
    });
  };
}
