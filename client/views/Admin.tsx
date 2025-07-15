import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { map } from "lodash/fp";
import {
  Container,
  Tabs,
  Tab,
  Form,
  Button,
  Col,
  Accordion,
} from "react-bootstrap";
import { deleteUser, updateUser } from "../redux/slices/users";
import {
  deleteRestaurant,
  loadRestaurants,
  updateRestaurant,
} from "../redux/slices/restaurants";
import { BlockQuote } from "../components/StyledComponents";
import { getUsers } from "../redux/slices/users";

import moment from "moment";
import Stars from "../components/Stars";

export default function Admin() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const restaurants = useSelector((state) => state.restaurants);

  useEffect(() => {
    dispatch(getUsers);
    dispatch(loadRestaurants);
  }, []);

  const tabStyles = { padding: 10 };

  const _handleUserUpdate = (id) => (e) => {
    e.preventDefault();
    const updatedUser = {
      username: e.currentTarget[0].value,
      role: e.currentTarget[1].value,
    };

    dispatch(updateUser(id, updatedUser));
  };

  const _handleUserDelete = (id) => dispatch(deleteUser(id));

  const _handleRestaurantUpdate = (id) => (e) => {
    e.preventDefault();
    const updatedRestaurant = {
      name: e.currentTarget[0].value,
    };

    dispatch(updateRestaurant(id, updatedRestaurant));
  };

  const _handleRestaurantDelete = (id) => dispatch(deleteRestaurant(id));

  const _handleReviewUpdate = (restaurant, id) => (e) => {
    e.preventDefault();
    const updatedReview = {
      comment: e.currentTarget[0].value,
      reply: e.currentTarget[1].value === "" ? null : e.currentTarget[1].value,
      visit_date: e.currentTarget[2].value,
    };

    dispatch(updateReview(restaurant, id, updatedReview));
  };

  //   const _handleReviewDelete = (restaurant, id) =>
  //     dispatch(deleteReview(restaurant, id);

  return (
    <Container fluid style={{ marginTop: 20 }}>
      <Tabs defaultActiveKey="users">
        <Tab eventKey="users" title="Users" style={tabStyles}>
          {map(
            (u) => (
              <Form
                key={u.id}
                style={{ padding: 10 }}
                onSubmit={_handleUserUpdate(u.id)}
                inline
              >
                <Form.Row style={{ width: "100%" }}>
                  <Col>
                    <Form.Control
                      size="sm"
                      style={{
                        width: "100%",
                      }}
                      defaultValue={u.username}
                    />
                  </Col>
                  <Col
                    style={{
                      flexGrow: "unset",
                    }}
                  >
                    <Form.Control size="sm" defaultValue={u.role} as="select">
                      <option value="user">User</option>
                      <option value="owner">Owner</option>
                      <option value="admin">Admin</option>
                    </Form.Control>
                  </Col>
                  <Col
                    style={{
                      flexGrow: "unset",
                    }}
                  >
                    <Button size="sm" variant="info" type="submit">
                      Update
                    </Button>
                  </Col>
                  <Col
                    style={{
                      flexGrow: "unset",
                    }}
                  >
                    <Button
                      variant="danger"
                      size="sm"
                      type="button"
                      onClick={() => _handleUserDelete(u.id)}
                    >
                      Delete
                    </Button>
                  </Col>
                </Form.Row>
              </Form>
            ),
            users,
          )}
        </Tab>
        <Tab eventKey="restaurants" title="Restaurants" style={tabStyles}>
          <Accordion>
            {map((r) => {
              return (
                <>
                  <Form
                    key={r.id}
                    style={{ padding: 10 }}
                    onSubmit={_handleRestaurantUpdate(r.id)}
                    inline
                  >
                    <Form.Row style={{ width: "100%" }}>
                      <Col>
                        <Form.Control
                          size="sm"
                          style={{ width: "100%" }}
                          defaultValue={r.name}
                        />
                      </Col>
                      <Col style={{ flexGrow: "unset" }}>
                        <Button type="submit" variant="info" size="sm">
                          Update
                        </Button>
                      </Col>
                      <Col style={{ flexGrow: "unset" }}>
                        <Button
                          size="sm"
                          variant="danger"
                          type="button"
                          onClick={() => _handleRestaurantDelete(r.id)}
                        >
                          Delete
                        </Button>
                      </Col>
                      <Col style={{ flexGrow: "unset" }}>
                        <Accordion.Toggle
                          as={Button}
                          eventKey={r.id}
                          variant="outline-info"
                          size="sm"
                          type="button"
                        >
                          Reviews
                        </Accordion.Toggle>
                      </Col>
                    </Form.Row>
                  </Form>

                  <Accordion.Collapse eventKey={r.id}>
                    <BlockQuote>
                      {!!r.reviews.length ? (
                        map(
                          (re) => (
                            <Form
                              key={re.id}
                              style={{
                                padding: 10,
                              }}
                              onSubmit={_handleReviewUpdate(
                                re.restaurant,
                                re.id,
                              )}
                              inline
                            >
                              {re.username}
                              <Stars rating={r.rating} />
                              <Form.Row
                                style={{
                                  width: "100%",
                                }}
                              >
                                <Col>
                                  <Form.Control
                                    size="sm"
                                    style={{
                                      width: "100%",
                                    }}
                                    defaultValue={re.comment}
                                  />
                                </Col>
                                <Col>
                                  <Form.Control
                                    size="sm"
                                    style={{
                                      width: "100%",
                                    }}
                                    disabled={!re.reply}
                                    defaultValue={re.reply}
                                    placeholder="No reply"
                                  />
                                </Col>
                                <Col
                                  style={{
                                    flexGrow: "unset",
                                  }}
                                >
                                  <Form.Control
                                    size="sm"
                                    style={{
                                      width: 170,
                                    }}
                                    type="date"
                                    name="date"
                                    defaultValue={moment(re.visit_date).format(
                                      "YYYY-MM-DD",
                                    )}
                                  />
                                </Col>

                                <Col
                                  style={{
                                    flexGrow: "unset",
                                  }}
                                >
                                  <Button
                                    size="sm"
                                    variant="info"
                                    type="submit"
                                  >
                                    Update
                                  </Button>
                                </Col>
                                <Col
                                  style={{
                                    flexGrow: "unset",
                                  }}
                                >
                                  <Button
                                    size="sm"
                                    variant="danger"
                                    type="button"
                                    onClick={() =>
                                      _handleReviewDelete(re.restaurant, re.id)
                                    }
                                  >
                                    Delete
                                  </Button>
                                </Col>
                              </Form.Row>
                            </Form>
                          ),
                          r.reviews,
                        )
                      ) : (
                        <div>No reviews here!</div>
                      )}
                    </BlockQuote>
                  </Accordion.Collapse>
                </>
              );
            }, restaurants)}
          </Accordion>
        </Tab>
      </Tabs>
    </Container>
  );
}
