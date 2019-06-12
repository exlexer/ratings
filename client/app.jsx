import 'babel-polyfill';

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

import { Provider, connect } from 'react-redux';
import store from './redux';

import actions from './redux/actions/users';

import MainHeader from './views/MainHeader';
import SignIn from './views/SignIn';
import Restaurants from './views/Restaurants';
import Admin from './views/Admin';

import { isUndefined } from 'lodash/fp';

const App = ({ loggedIn, role, authorize }) => {
    useEffect(() => {
        authorize();
    }, [role]);

    if (isUndefined(loggedIn)) {
        return null;
    }

    if (!loggedIn) {
        return <SignIn />;
    }

    return (
        <div>
            <MainHeader key="header" />
            {role === 'admin' ? <Admin /> : <Restaurants />}
        </div>
    );
};

const mapStateToProps = ({ users }) => users;
const mapActions = { authorize: actions.authorize };

const AppContainer = connect(
    mapStateToProps,
    mapActions,
)(App);

ReactDOM.render(
    <Provider store={store}>
        <AppContainer />
    </Provider>,
    document.getElementById('app'),
);
