import actions from '../actions/restaurants';
import { handleActions } from 'redux-actions';
import { remove, values, forEach } from 'lodash/fp';

const defaultState = {};

const reducer = handleActions(
    {
        [actions.load]: (state, { payload }) => (payload.config ? [] : payload),
        [actions.review]: (state, { payload }) =>
            payload.config ? [] : payload,
        [actions.reply]: (state, { payload }) =>
            payload.config ? [] : payload,
        [actions.createRestaurant]: (state, { payload }) =>
            payload.config ? [] : payload,
        [actions.update]: (state, { payload }) => {
            const newState = values(state);

            forEach(r => {
                if (r.id === payload.id) {
                    r.name = payload.updated.name;
                }
            }, newState);

            return newState;
        },
        [actions.delete]: (state, { payload }) =>
            remove(({ id }) => id === payload, values(state)),
    },
    defaultState,
);

export default reducer;
