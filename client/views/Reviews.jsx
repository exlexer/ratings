import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { map, isEmpty } from 'lodash/fp';
import actions from '../redux/actions/restaurants';

import {
    Container,
    Row,
    Col,
    ListGroup,
    Button,
    Card,
    Table,
} from 'react-bootstrap';
import ReplyModal from '../components/ReplyModal';

const Home = props => {
    useEffect(() => {
        props.loadRestaurants();
    }, []);

    const [replying, setReplying] = useState();

    return (
        <>
            <Container fluid style={{ margin: '20px 0' }}>
                {map(
                    r => (
                        <div style={{ padding: 10 }}>
                            <div style={{ fontSize: 16, fontWeight: 500 }}>
                                {r.name}
                            </div>
                            <div
                                style={{
                                    fontSize: 13,
                                    fontWeight: 300,
                                    color: '#ccc',
                                }}
                            >
                                Rating: {r.rating}
                            </div>
                            <div
                                style={{
                                    padding: '10px 20px',
                                    display: 'flex',
                                }}
                            >
                                {map(
                                    re => [
                                        <div style={{ flexGrow: 1 }}>
                                            <div>{re.comment}</div>
                                            <div>{re.date_visited}</div>
                                        </div>,
                                        <Button>Reply</Button>,
                                    ],
                                    r.reviews,
                                )}
                            </div>
                        </div>
                    ),
                    props.restaurants,
                )}
            </Container>
            <ReplyModal
                show={!isEmpty(replying)}
                restaurant={replying}
                onSubmit={props.reply}
                onClose={() => setReplying()}
            />
        </>
    );
};

const mapStateToProps = state => ({
    loggedIn: state.users.loggedIn,
    restaurants: state.restaurants || [],
});

const mapDispatchToProps = {
    reply: actions.reply,
    loadRestaurants: actions.load,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Home);
