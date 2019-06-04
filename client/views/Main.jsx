import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import actions from '../redux/actions/users';

import { map } from 'lodash/fp';
import { Navbar, Button } from 'react-bootstrap';

import { navigate } from '@reach/router';

const LINKS = {
    user: ['restaurant'],
    owner: ['reviews', 'restaurants'],
    admin: ['users'],
};

const MainView = ({ logout, loggedIn, role, children }) => [
    <Navbar bg="light">
        <Navbar.Brand>Restaurant Review</Navbar.Brand>
        {map(
            link => (
                <Button variant="link" onClick={() => navigate(link)}>
                    {link}
                </Button>
            ),
            LINKS[role],
        )}
        <div style={{ flexGrow: 1 }} />
        <Button variant="link" onClick={logout}>
            Logout
        </Button>
    </Navbar>,
    children,
];

const mapStateToProps = state => ({
    loggedIn: state.users.loggedIn,
    role: state.users.role,
});

const mapDispatchToProps = {
    logout: actions.logout,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(MainView);
