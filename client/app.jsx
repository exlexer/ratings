import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';

import { Provider } from 'react-redux';

import { Router } from '@reach/router';

import store from './redux';

import MainView from './views/Main';
import SignIn from './views/SignIn';
import Restaurants from './views/Restaurants';
import Reviews from './views/Reviews';

const App = ({ loggedIn, role }) => {
    if (!loggedIn) {
        return <SignIn />;
    }

    let routes;

    if (role === 'user') {
        routes = [<Restaurants path="/" />];
    }

    if (role === 'owner') {
        routes = [<Reviews path="/" />];
    }

    if (role === 'admin') {
        routes = [<Restaurants path="restaurants" />];
    }

    return (
        <Router>
            <MainView path="/">{routes}</MainView>
        </Router>
    );
};

const mapStateToProps = ({ users }) => users;

const AppContainer = connect(mapStateToProps)(App);

ReactDOM.render(
    <Provider store={store}>
        <AppContainer />
    </Provider>,
    document.getElementById('app'),
);
