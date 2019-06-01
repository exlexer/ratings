import actions from '../actions/users';
import { handleActions } from 'redux-actions';
import { isEqual, split, some } from 'lodash/fp';

const getAccesToken = () =>
    some(
        c => isEqual(split('=', c)[0], 'access_token'),
        split(' ', document.cookie),
    );

const defaultState = {
    loggedIn: getAccesToken(),
};

const reducer = handleActions(
    {
        [actions.signin]: (state, { payload }) => ({
            ...state,
            role: payload,
            loggedIn: true,
        }),
    },
    defaultState,
);

export default reducer;
