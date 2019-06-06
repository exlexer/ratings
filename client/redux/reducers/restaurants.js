import actions from '../actions/restaurants';
import { handleActions } from 'redux-actions';

const defaultState = {};

const reducer = handleActions(
    {
        [actions.load]: (state, { payload }) => ({
            ...state,
            ...payload,
        }),
    },
    defaultState,
);

export default reducer;
