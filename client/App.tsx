import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { authorize } from "./redux/slices/users";

import MainHeader from "./views/MainHeader";
import SignIn from "./views/SignIn";
import Restaurants from "./views/Restaurants";
import Admin from "./views/Admin";

import { isUndefined } from "lodash/fp";

export default function App() {
  const loggedIn = useSelector((state) => state.users.loggedIn);
  const role = useSelector((state) => state.users.role);
  const dispatch = useDispatch();

  console.log("role", role, "loggedIn", loggedIn);

  useEffect(() => {
    dispatch(authorize);
  }, [role]);

  if (isUndefined(loggedIn)) {
    return null;
  }

  if (!loggedIn) {
    return <SignIn />;
  }

  return (
    <div>
      <MainHeader key="header" />
      {role === "admin" ? <Admin /> : <Restaurants />}
    </div>
  );
}
