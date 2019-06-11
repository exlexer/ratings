import actions from '../actions/users';
import { handleActions } from 'redux-actions';
import { forEach, split, cloneDeep, remove } from 'lodash/fp';
const forEachWithKeys = forEach.convert({ cap: false });

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

const defaultState = {};

const reducer = handleActions(
    {
        [actions.authorize]: (state, { payload }) => ({
            ...state,
            ...payload,
        }),
        [actions.signin]: (state, { payload }) => ({
            ...state,
            ...payload,
            role: getCookie('role'),
        }),
        [actions.signup]: (state, { payload }) => ({
            ...state,
            ...payload,
            role: getCookie('role'),
        }),
        [actions.logout]: (state, { payload }) => ({ loggedIn: false }),
        [actions.get]: (state, { payload }) => ({
            ...state,
            users: payload.data,
        }),
        [actions.update]: (state, { payload }) => {
            const newState = cloneDeep(state);

            forEachWithKeys((u, index) => {
                if (u.id === payload.id) {
                    newState.users[index] = payload.updated;
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
