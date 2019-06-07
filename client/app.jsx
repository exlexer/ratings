import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';

import store from './redux';
import MainHeader from './views/MainHeader';
import SignIn from './views/SignIn';
import Restaurants from './views/Restaurants';

const App = ({ loggedIn, role }) => {
    if (!loggedIn) {
        return <SignIn />;
    }

    return (
        <div>
            <MainHeader key="header" />
            {role === 'admin' ? <div>ADMIN</div> : <Restaurants />}
        </div>
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
