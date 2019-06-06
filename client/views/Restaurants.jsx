import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { map, isEmpty, isNaN, toNumber } from 'lodash/fp';
import actions from '../redux/actions/restaurants';

import { Container } from 'react-bootstrap';
import Restaurant from '../components/Restaurant';

const Restaurants = props => {
    useEffect(() => {
        if (!props.loggedIn) {
            props.history.replace('signin');
        } else {
            props.loadRestaurants();
        }
    }, [props.loggedIn]);

    return (
        <Container style={{ marginTop: 20 }}>
            {map(
                r => (
                    <Restaurant
                        key={r.id}
                        title={r.name}
                        rating={toNumber(r.rating) || 0}
                        actions={[{ title: 'Leave review' }]}
                        onReview={props.reviewRestaurant}
                        restaurant={r.id}
                        reviews={r.lastThree}
                        highestRating={r.highest}
                        lowestRating={r.lowest}
                    />
                ),
                props.restaurants,
            )}
        </Container>
    );
};

const mapStateToProps = state => ({
    loggedIn: state.users.loggedIn,
    restaurants: state.restaurants || [],
});

const mapDispatchToProps = {
    loadRestaurants: actions.load,
    reviewRestaurant: actions.review,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Restaurants);
