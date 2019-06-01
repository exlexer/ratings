import React from 'react';
import ReactDOM from 'react-dom';

import { HashRouter, Route, NavLink } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';

import 'babel-polyfill';

import { Provider } from 'react-redux';

import store from './redux';

import SignIn from './views/SignIn';
import Home from './views/Home';
import Restaurants from './views/Restaurants';

const App = () => (
    <Provider store={store}>
        <HashRouter>
            <Navbar bg="light">
                <Navbar.Brand>Restaurant Review</Navbar.Brand>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/restaurants" style={{ marginLeft: 20 }}>
                    Example
                </NavLink>
            </Navbar>
            <div>
                <Route path="/signin" component={SignIn} />
                <Route path="/home" exact component={Home} />
                <Route path="/restaurants" component={Restaurants} />
            </div>
        </HashRouter>
    </Provider>
);

ReactDOM.render(<App />, document.getElementById('app'));
