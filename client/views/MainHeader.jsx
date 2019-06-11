import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import { Navbar, Button, Overlay, Popover } from 'react-bootstrap';
import RestaurantForm from '../forms/RestaurantForm';

import userActions from '../redux/actions/users';
import restaurantActions from '../redux/actions/restaurants';

const MainHeader = ({ logout, createRestaurant, role }) => {
    const [show, setShow] = useState(false);
    const buttonRef = useRef();

    const _handleSubmit = ({ name }) => {
        createRestaurant(name);
        setShow(false);
    };

    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand className="mr-auto">Restaurant Review</Navbar.Brand>
            {role === 'owner' && (
                <>
                    <Button
                        variant="info"
                        className="mr-2"
                        name="new-restaurant"
                        ref={buttonRef}
                        onClick={() => setShow(!show)}
                    >
                        Add a Restaurant
                    </Button>
                    <Overlay
                        target={buttonRef.current}
                        show={show}
                        placement="bottom"
                    >
                        <Popover
                            id="popover-contained"
                            title="Add a Restaurant"
                        >
                            <RestaurantForm
                                onSubmit={_handleSubmit}
                                onCancel={() => setShow(false)}
                            />
                        </Popover>
                    </Overlay>
                </>
            )}
            <Button variant="outline-info" onClick={logout}>
                Logout
            </Button>
        </Navbar>
    );
};

const mapStateToProps = ({ users }) => ({
    role: users.role,
});

const mapDispatchToProps = {
    logout: userActions.logout,
    createRestaurant: restaurantActions.createRestaurant,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(MainHeader);
