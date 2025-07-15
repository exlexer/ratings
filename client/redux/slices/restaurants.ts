import { createSlice } from "@reduxjs/toolkit";
import { forEach, remove, values } from "lodash/fp";
import api from "../../api";

export const restaurantsSlice = createSlice({
  name: "restaurants",
  initialState: [],
  reducers: {
    load: (state, { payload }) => {
      if (payload.config) {
        return [];
      } else {
        return payload;
      }
    },

    review: (state, { payload }) => {
      if (payload.config) {
        return [];
      } else {
        return payload;
      }
    },

    reply: (state, { payload }) => {
      if (payload.config) {
        return [];
      } else {
        return payload;
      }
    },

    createRestaurant: (state, { payload }) => {
      if (payload.config) {
        return [];
      } else {
        return payload;
      }
    },

    updateRestaurant: (state, { payload }) => {
      const restaurantIndex = state.findIndex((r: any) => r.id === payload.id);
      if (restaurantIndex !== -1) {
        state[restaurantIndex] = payload.updated;
      }
    },

    deleteRestaurant: (state, { payload }) => {
      return state.filter((r: any) => r.id !== payload.id);
    },
  },
});

export function loadRestaurants(sortBy: string, order: string) {
  return async function (dispatch) {
    const { data } = await api.get(
      `restaurants?sortBy=${sortBy}&order=${order}`,
    );
    dispatch(restaurantsSlice.actions.load(data));
  };
}

export function createRestaurant(name: string) {
  return async function (dispatch) {
    await api.post("restaurants", { name });
    const { data } = await api.get("restaurants");
    dispatch(restaurantsSlice.actions.createRestaurant(data));
  };
}

export function reviewRestaurant(
  resturantId: string,
  rate: number,
  date: Date,
  comment: string,
) {
  return async function (dispatch) {
    await api.post(`restaurants/${resturantId}/reviews`, {
      rate,
      date,
      comment,
    });
    const { data } = await api.get("restaurants");
    dispatch(restaurantsSlice.actions.createRestaurant(data));
  };
}

export function replyToReview(
  resturantId: string,
  reviewId: string,
  comment: string,
) {
  return async function (dispatch) {
    await api.post(`restaurants/${resturantId}/reviews/${reviewId}/reply`, {
      comment,
    });
    const { data } = await api.get("restaurants");
    dispatch(restaurantsSlice.actions.createRestaurant(data));
  };
}

export function updateRestaurant(id: string, updated: any) {
  return async function (dispatch) {
    await api.patch(`restaurants/${id}`, updated);
    dispatch(restaurantsSlice.actions.updateRestaurant({ id, updated }));
  };
}

export function deleteRestaurant(id: string) {
  return async function (dispatch) {
    await api.delete(`restaurants/${id}`);
    dispatch(restaurantsSlice.actions.deleteRestaurant({ id }));
  };
}

export default restaurantsSlice.reducer;
