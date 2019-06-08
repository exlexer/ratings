import React from 'react';
import { connect } from 'react-redux';
import { Navbar, Button } from 'react-bootstrap';
import { constant } from 'lodash/fp';

import actions from '../redux/actions/users';

const Header = ({ logout }) => (
    <Navbar bg="dark" variant="dark">
        <Navbar.Brand>Restaurant Review</Navbar.Brand>
        <div style={{ flexGrow: 1 }} />
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
)(Header);
