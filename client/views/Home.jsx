import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { map, isEmpty } from 'lodash/fp';
import actions from '../redux/actions/restaurants';

import { Container, Row, Col, ListGroup, Button } from 'react-bootstrap';
import ReviewModal from '../components/ReviewModal';

const Home = props => {
    useEffect(() => {
        console.log(props);
        if (!props.loggedIn) {
            props.history.replace('signin');
        } else {
            props.loadRestaurants();
        }
    }, [props.loggedIn]);

    const [reviewing, setReviewing] = useState();

    return (
        <>
            <Container style={{ marginTop: 20 }}>
                <ListGroup>
                    {map(
                        r => (
                            <ListGroup.Item key={r.id}>
                                <Row>
                                    <Col>
                                        <div>{r.name}</div>
                                        <div>
                                            Rating{' '}
                                            {parseInt(r.rating || 0).toFixed(1)}
                                        </div>
                                    </Col>
                                    <Col style={{ textAlign: 'right' }}>
                                        <Button onClick={() => setReviewing(r)}>
                                            Write Review
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ),
                        props.restaurants,
                    )}
                </ListGroup>
            </Container>
            <ReviewModal
                show={!isEmpty(reviewing)}
                restaurant={reviewing}
                onSubmit={props.reviewRestaurant}
                onClose={() => setReviewing()}
            />
        </>
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
)(Home);
