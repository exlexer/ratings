import { createSlice } from "@reduxjs/toolkit";
import api from "../../api";

const getCookie = (key: string) => {
  const cookies = document.cookie.split(" ");

  let value: string = undefined;

  cookies.forEach((c) => {
    const [k, v] = c.split("=");
    if (k === key) {
      value = v.split(";")[0];
    }
  });

  return value;
};

export const usersSlice = createSlice({
  name: "users",
  initialState: {
    loggedIn: false,
    users: [],
  },
  reducers: {
    authorize: (state, { payload }) => {
      return {
        ...state,
        ...payload,
      };
    },

    signin: (state, { payload }) => {
      return {
        ...state,
        ...payload,
        role: getCookie("role"),
      };
    },

    logout: (state) => {
      return { loggedIn: false, users: [] };
    },

    get: (state, { payload }) => {
      return {
        ...state,
        users: payload,
      };
    },

    update: (state, { payload }) => {
      const userIndex = state.users.findIndex((u: any) => u.id === payload.id);
      if (userIndex !== -1) {
        state.users[userIndex] = payload.updated;
      }
    },

    delete: (state, { payload }) => {
      state.users = state.users.filter((u: any) => u.id !== payload.id);
    },
  },
});

export async function authorize(dispatch) {
  const { data } = await api.get("users/authorize");

  dispatch(usersSlice.actions.authorize(data));
}

export function signin(username: string, password: string) {
  return async function (dispatch) {
    try {
      const { data } = await api.post("users/signin", {
        username,
        password,
      });

      dispatch(usersSlice.actions.signin({ ...data, loggedIn: true }));
    } catch (error) {
      dispatch(
        usersSlice.actions.signin({
          loggedIn: false,
          error: "Failed, please try again",
        }),
      );
    }
  };
}

export function signup(username: string, password: string) {
  return async function (dispatch) {
    try {
      await api.post("users", {
        username,
        password,
      });

      const { data } = await api.post("users/signin", {
        username,
        password,
      });
      dispatch(usersSlice.actions.signin({ ...data, loggedIn: true }));
    } catch (error) {
      dispatch(
        usersSlice.actions.signin({
          loggedIn: false,
          error: "Failed, please try again",
        }),
      );
    }
  };
}

export async function logout(dispatch) {
  await api.get("users/logout");
  dispatch(usersSlice.actions.logout());
}

export async function getUsers(dispatch) {
  const { data } = await api.get("users");
  dispatch(usersSlice.actions.get({ data }));
}

export function updateUser(id: string, updated: any) {
  return async function (dispatch) {
    await api.patch(`users/${id}`, updated);
    dispatch(usersSlice.actions.update({ id, updated }));
  };
}

export function deleteUser(id: string) {
  return async function (dispatch) {
    await api.delete(`users/${id}`);
    dispatch(usersSlice.actions.delete(id));
  };
}

export default usersSlice.reducer;
