import React from 'react';
import { connect } from 'react-redux';
import { Navbar, Button } from 'react-bootstrap';
import { constant } from 'lodash/fp';

import actions from '../redux/actions/users';

const MainHeader = ({ logout }) => (
    <Navbar bg="dark" variant="dark">
        <Navbar.Brand className="mr-auto">Restaurant Review</Navbar.Brand>
        <Button variant="outline-info" onClick={logout}>
            Logout
        </Button>
    </Navbar>
);

const mapDispatchToProps = {
    logout: actions.logout,
};

export default connect(
    constant({}),
    mapDispatchToProps,
)(MainHeader);
