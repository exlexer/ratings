import { combineReducers, applyMiddleware, compose } from 'redux';
import { createStore } from 'redux';
import users from './reducers/users';
import restaurants from './reducers/restaurants';

import promiseMiddleware from 'redux-promise';

const composeEnhancers =
    typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
              // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
          })
        : compose;

const enhancer = composeEnhancers(applyMiddleware(promiseMiddleware));

export default createStore(
    combineReducers({
        users,
        restaurants,
    }),
    enhancer,
);
