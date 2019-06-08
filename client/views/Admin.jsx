import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { map } from 'lodash/fp';
import {
    Container,
    Tabs,
    Tab,
    Form,
    Button,
    Col,
    Accordion,
    Card,
} from 'react-bootstrap';
import userActions from '../redux/actions/users';
import restaurantActions from '../redux/actions/restaurants';

const Admin = props => {
    useEffect(() => {
        props.getUsers();
        props.getRestaurants();
    }, []);

    const tabStyles = { padding: 10, background: '#f8f9fa' };

    const _handleUserUpdate = id => e => {
        e.preventDefault();
        const updatedUser = {
            username: e.currentTarget[0].value,
            role: e.currentTarget[1].value,
        };

        props.updateUser(id, updatedUser);
    };

    const _handleUserDelete = id => props.deleteUser(id);

    const _handleRestaurantUpdate = id => e => {
        e.preventDefault();
        const updatedUser = {
            name: e.currentTarget[0].value,
        };

        props.updateRestaurant(id, updatedUser);
    };

    const _handleRestaurantDelete = id => props.deleteRestaurant(id);

    return (
        <Container style={{ marginTop: 20 }}>
            <Tabs defaultActiveKey="users">
                <Tab eventKey="users" title="Users" style={tabStyles}>
                    {map(
                        u => (
                            <Form
                                key={u.id}
                                style={{ padding: 10 }}
                                onSubmit={_handleUserUpdate(u.id)}
                                inline
                            >
                                <Form.Row style={{ width: '100%' }}>
                                    <Col>
                                        <Form.Control
                                            style={{
                                                width: '100%',
                                            }}
                                            defaultValue={u.username}
                                        />
                                    </Col>
                                    <Col
                                        style={{
                                            flexGrow: 'unset',
                                        }}
                                    >
                                        <Form.Control
                                            defaultValue={u.role}
                                            as="select"
                                        >
                                            <option value="user">User</option>
                                            <option value="owner">Owner</option>
                                            <option value="admin">Admin</option>
                                        </Form.Control>
                                    </Col>
                                    <Col
                                        style={{
                                            flexGrow: 'unset',
                                        }}
                                    >
                                        <Button type="submit">Submit</Button>
                                    </Col>
                                    <Col
                                        style={{
                                            flexGrow: 'unset',
                                        }}
                                    >
                                        <Button
                                            variant="danger"
                                            type="button"
                                            onClick={() =>
                                                _handleUserDelete(u.id)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </Col>
                                </Form.Row>
                            </Form>
                        ),
                        props.users,
                    )}
                </Tab>
                <Tab
                    eventKey="restaurants"
                    title="Restaurants"
                    style={tabStyles}
                >
                    <Accordion>
                        {map(r => {
                            return (
                                <>
                                    <Form
                                        key={r.id}
                                        style={{ padding: 10 }}
                                        onSubmit={_handleRestaurantUpdate(r.id)}
                                        inline
                                    >
                                        <Form.Row style={{ width: '100%' }}>
                                            <Col>
                                                <Form.Control
                                                    style={{ width: '100%' }}
                                                    defaultValue={r.name}
                                                />
                                            </Col>
                                            <Col style={{ flexGrow: 'unset' }}>
                                                <Button type="submit">
                                                    Submit
                                                </Button>
                                            </Col>
                                            <Col style={{ flexGrow: 'unset' }}>
                                                <Button
                                                    variant="danger"
                                                    type="button"
                                                    onClick={() =>
                                                        _handleRestaurantDelete(
                                                            r.id,
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </Button>
                                            </Col>
                                            <Col style={{ flexGrow: 'unset' }}>
                                                <Accordion.Toggle
                                                    as={Button}
                                                    eventKey={r.id}
                                                    variant="link"
                                                    type="button"
                                                >
                                                    Reviews
                                                </Accordion.Toggle>
                                            </Col>
                                        </Form.Row>
                                    </Form>

                                    <Accordion.Collapse eventKey={r.id}>
                                        <Card.Body>
                                            Hello! I'm the body
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </>
                            );
                        }, props.restaurants)}
                    </Accordion>
                </Tab>
            </Tabs>
        </Container>
    );
};

const mapStateToProps = ({ users, restaurants }) => ({
    users: users.users,
    restaurants,
});

const mapDispatchToProps = {
    getUsers: userActions.get,
    getRestaurants: restaurantActions.load,
    updateRestaurant: restaurantActions.update,
    deleteRestaurant: restaurantActions.delete,
    updateUser: userActions.update,
    deleteUser: userActions.delete,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Admin);
