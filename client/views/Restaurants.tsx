import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { map, filter } from "lodash/fp";
import { loadRestaurants } from "../redux/slices/restaurants";

import { reviewRestaurant, replyToReview, createRestaurant } from "../redux/slices/restaurants";
import { MdExpandLess, MdExpandMore, MdAdd } from "react-icons/md";
import { Container, Nav, Navbar, Button, Modal, Form as BootstrapForm } from "react-bootstrap";
import Restaurant from "../components/Restaurant";
import { ColumnContainer } from "../components/StyledComponents";
import Stars from "../components/Stars";
import Form from "../components/Form";
import * as yup from "yup";

export default function Restaurants() {
  const [sortBy, setSortBy] = useState("rating");
  const [sortOrder, setSortOrder] = useState("desc");
  const [starFilter, setStarFilter] = useState();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const dispatch = useDispatch();
  const role = useSelector((state) => state.users.role);
  const restaurants = useSelector((state) => state.restaurants || []);

  useEffect(() => {
    dispatch(loadRestaurants(sortBy, sortOrder));
  }, [sortBy, sortOrder]);

  const _sort = (_sortBy: string) => () => {
    if (sortBy === _sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortOrder("asc");
      setSortBy(_sortBy);
    }
  };

  const _filterReviews = (reviews) => {
    if (starFilter !== undefined) {
      return filter((r) => r.rating >= starFilter, reviews);
    } else {
      return reviews;
    }
  };

  const _isSorted = (key) => {
    if (key === sortBy) {
      if (sortOrder === "asc") {
        return <MdExpandLess />;
      } else {
        return <MdExpandMore />;
      }
    }
    return null;
  };

  const createRestaurantFields = [
    {
      key: "name",
      label: "Restaurant Name",
      validations: yup.string().required("Restaurant name is required."),
    },
  ];

  const handleCreateRestaurant = ({ name }) => {
    dispatch(createRestaurant(name));
    setShowCreateModal(false);
  };

  return [
    <Navbar key="nav" bg="light">
      <Navbar.Brand>Sort Order</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link onClick={_sort("rating")}>
          Rating {_isSorted("rating")}
        </Nav.Link>
        <Nav.Link onClick={_sort("name")}>
          Restaurant Name {_isSorted("name")}
        </Nav.Link>
      </Nav>
      <Navbar.Brand>Filter</Navbar.Brand>
      <Stars rating={starFilter} clearable onClick={(n) => setStarFilter(n)} />
      {(role === "user" || role === "admin") && (
        <Button 
          variant="primary" 
          onClick={() => setShowCreateModal(true)}
          style={{ marginLeft: '20px' }}
        >
          <MdAdd /> Create Restaurant
        </Button>
      )}
    </Navbar>,
    <Modal key="modal" show={showCreateModal} onHide={() => setShowCreateModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Restaurant</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          fields={createRestaurantFields}
          onSubmit={handleCreateRestaurant}
          submitText="Create"
        />
      </Modal.Body>
    </Modal>,
    <Container key="container" style={{ marginTop: 20 }}>
      {map((r) => {
        const restaurantProps = {
          key: r.id,
          title: r.name,
          rating: r.rating,
          restaurant: r.id,
          reviews: r.reviews,
        };

        if (role === "user") {
          restaurantProps.showRange = true;
          restaurantProps.showRecent = true;
          restaurantProps.highestRating = r.highest;
          restaurantProps.lowestRating = r.lowest;
          restaurantProps.recent = r.lastThree;
          restaurantProps.onReview = (
            id: string,
            rate: number,
            date: Date,
            comment: string,
          ) => dispatch(reviewRestaurant(id, rate, date, comment));
          restaurantProps.zeroState = (
            <ColumnContainer>No Reviews to yet, leave one!</ColumnContainer>
          );
        } else if (role === "owner") {
          restaurantProps.showUnreplied = true;
          restaurantProps.onReply = (
            id: string,
            reviewId: string,
            comment: string,
          ) => dispatch(replyToReview(id, reviewId, comment));
          restaurantProps.zeroState = (
            <ColumnContainer>No Reviews to reply to right now!</ColumnContainer>
          );
        }

        return <Restaurant {...restaurantProps} />;
      }, _filterReviews(restaurants))}
    </Container>,
  ];
}
