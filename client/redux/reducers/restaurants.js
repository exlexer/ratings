import actions from '../actions/restaurants';
import { handleActions } from 'redux-actions';
import { remove, values } from 'lodash/fp';

const defaultState = {};

const reducer = handleActions(
    {
        [actions.load]: (state, { payload }) => ({
            ...state,
            ...(payload.config ? [] : payload),
        }),
        [actions.delete]: (state, { payload }) =>
            remove(({ id }) => id === payload, values(state)),
    },
    defaultState,
);

export default reducer;
