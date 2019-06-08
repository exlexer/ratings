import actions from '../actions/users';
import { handleActions } from 'redux-actions';
import { forEach, split, cloneDeep, remove } from 'lodash/fp';

const getCookie = key => {
    const cookies = split(' ', document.cookie);

    let value = false;

    forEach(c => {
        const [k, v] = split('=', c);
        if (k === key) {
            value = split(';', v)[0];
        }
    }, cookies);

    return value;
};

const defaultState = {
    loggedIn: !!getCookie('access_token'),
    role: getCookie('role'),
};

const reducer = handleActions(
    {
        [actions.signin]: (state, { payload }) => ({
            ...state,
            role: getCookie('role'),
            loggedIn: true,
        }),
        [actions.logout]: (state, { payload }) => ({ loggedIn: false }),
        [actions.get]: (state, { payload }) => ({
            ...state,
            users: payload.data,
        }),
        [actions.update]: (state, { payload }) => {
            const newState = cloneDeep(state);

            forEach(u => {
                if (u.id === payload.id) {
                    u.role = payload.role;
                }
            }, newState.users);

            return newState;
        },
        [actions.delete]: (state, { payload }) => ({
            ...state,
            users: remove(({ id }) => id === payload, state.users),
        }),
    },
    defaultState,
);

export default reducer;
