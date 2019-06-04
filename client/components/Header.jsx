import React from 'react';
import { map } from 'lodash/fp';
import { NavLink } from 'react-router-dom';
import { Navbar, Button } from 'react-bootstrap';

const Header = ({ onLogout, links }) => (
    <Navbar bg="light">
        <Navbar.Brand>Restaurant Review</Navbar.Brand>
        {map(
            ({ label, path }) => (
                <NavLink style={{ marginLeft: 20 }} to={path}>
                    {label}
                </NavLink>
            ),
            links,
        )}
        <div style={{ flexGrow: 1 }} />
        <Button variant="link" onClick={onLogout}>
            Logout
        </Button>
    </Navbar>
);

export default Header;
