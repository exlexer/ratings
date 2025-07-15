import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { signin, signup } from "../redux/slices/users";
import * as yup from "yup";
import api from "../api";
import { Alert, Container, Row, Col, Card } from "react-bootstrap";
import Form from "../components/Form";

export default function Signin() {
  const error = useSelector((state) => state.users.error);
  const [signingUp, setSigningUp] = useState();
  const dispatch = useDispatch();

  const signinFields = [
    {
      key: "username",
      label: "Username",
      validations: yup.string().required("Username is required."),
    },
    {
      key: "password",
      label: "Password",
      type: "password",
      validations: yup
        .string()
        .required("Password is required.")
        .min(6, "Password must be at least 6 characters."),
    },
  ];

  const signupFields = [
    {
      key: "username",
      label: "Username",
      validations: yup
        .string()
        .required("Username is required.")
        .test("isUsed", "This username is already taken.", (value) =>
          api.get(`users/duplicate/${value}`).then(({ data }) => !data.exists),
        ),
    },
    {
      key: "password",
      label: "Password",
      type: "password",
      validations: yup
        .string()
        .required("Password is required.")
        .min(6, "Password must be at least 6 characters."),
    },
  ];

  return (
    <Container>
      <Row style={{ marginTop: "2rem" }}>
        <Col />
        <Col>
          <Card style={{ width: "22rem" }}>
            <Card.Body>
              <Card.Title>{signingUp ? "Signup" : "Signin"}</Card.Title>
              {error && <Alert variant="danger">{error}</Alert>}
              {signingUp ? (
                <Form
                  key="signin"
                  fields={signupFields}
                  onSubmit={({ username, password }) =>
                    dispatch(signup(username, password))
                  }
                  actionText={"I Already have an account"}
                  onClickAction={() => setSigningUp(false)}
                />
              ) : (
                <Form
                  key="signup"
                  fields={signinFields}
                  onSubmit={({ username, password }) =>
                    dispatch(signin(username, password))
                  }
                  actionText={"New here? Signup"}
                  onClickAction={() => setSigningUp(true)}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col />
      </Row>
    </Container>
  );
}
