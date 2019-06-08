import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { map, filter } from 'lodash/fp';
import actions from '../redux/actions/restaurants';

import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import { Container, Nav, Navbar } from 'react-bootstrap';
import Restaurant from '../components/Restaurant';
import { ColumnContainer } from '../components/StyledComponents';
import Stars from '../components/Stars';

const Restaurants = props => {
    const [sortBy, setSortBy] = useState('rating');
    const [sortOrder, setSortOrder] = useState('desc');
    const [starFilter, setStarFilter] = useState();

    useEffect(() => {
        props.loadRestaurants(sortBy, sortOrder);
    }, [sortBy, sortOrder]);

    const _sort = _sortBy => () => {
        if (sortBy === _sortBy) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortOrder('asc');
            setSortBy(_sortBy);
        }
    };

    const _filterReviews = reviews => {
        if (starFilter) {
            return filter(r => r.rating >= starFilter, reviews);
        } else {
            return reviews;
        }
    };

    const _isSorted = key => {
        if (key === sortBy) {
            if (sortOrder === 'asc') {
                return <MdExpandLess />;
            } else {
                return <MdExpandMore />;
            }
        }
        return null;
    };

    return [
        <Navbar bg="light">
            <Navbar.Brand>Sort Order</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link onClick={_sort('rating')}>
                    Rating {_isSorted('rating')}
                </Nav.Link>
                <Nav.Link onClick={_sort('name')}>
                    Restaurant Name {_isSorted('name')}
                </Nav.Link>
            </Nav>
            <Navbar.Brand>Filter</Navbar.Brand>
            <Stars
                rating={starFilter}
                clearable
                onClick={n => setStarFilter(n)}
            />
        </Navbar>,
        <Container style={{ marginTop: 20 }}>
            {map(r => {
                const restaurantProps = {
                    key: r.id,
                    title: r.name,
                    rating: r.rating,
                    restaurant: r.id,
                    reviews: r.reviews,
                };

                if (props.role === 'user') {
                    restaurantProps.showRange = true;
                    restaurantProps.showRecent = true;
                    restaurantProps.highestRating = r.highest;
                    restaurantProps.lowestRating = r.lowest;
                    restaurantProps.recent = r.lastThree;
                    restaurantProps.onReview = props.reviewRestaurant;
                    restaurantProps.zeroState = (
                        <ColumnContainer>
                            No Reviews to yet, leave one!
                        </ColumnContainer>
                    );
                } else if (props.role === 'owner') {
                    restaurantProps.showUnreplied = true;
                    restaurantProps.onReply = props.replyToReview;
                    restaurantProps.zeroState = (
                        <ColumnContainer>
                            No Reviews to reply to right now!
                        </ColumnContainer>
                    );
                }

                return <Restaurant {...restaurantProps} />;
            }, _filterReviews(props.restaurants))}
        </Container>,
    ];
};

const mapStateToProps = state => ({
    loggedIn: state.users.loggedIn,
    role: state.users.role,
    restaurants: state.restaurants || [],
});

const mapDispatchToProps = {
    loadRestaurants: actions.load,
    reviewRestaurant: actions.review,
    replyToReview: actions.reply,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Restaurants);
