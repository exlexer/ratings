import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { map } from 'lodash/fp';
import actions from '../redux/actions/restaurants';
import { Container } from 'react-bootstrap';
import LineItem from '../components/LineItem';
import { ColumnContainer } from '../components/StyledComponents';

const mapWithKeys = map.convert({ cap: false });

const Restaurants = props => {
    useEffect(() => {
        props.loadRestaurants();
    }, []);

    return (
        <Container style={{ marginTop: 20 }}>
            {mapWithKeys((r, index) => {
                const style = {};

                if (index % 2) {
                    style.background = '#f8f9fa';
                }

                const restaurantProps = {
                    key: r.id,
                    title: r.name,
                    rating: r.rating,
                    restaurant: r.id,
                    reviews: r.reviews,
                    style,
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

                return <LineItem {...restaurantProps} />;
            }, props.restaurants)}
        </Container>
    );
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
