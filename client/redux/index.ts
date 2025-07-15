import users from "./slices/users";
import restaurants from "./slices/restaurants";

import { configureStore } from "@reduxjs/toolkit";

export default configureStore({
  reducer: {
    users,
    restaurants,
  },
});
