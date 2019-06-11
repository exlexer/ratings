import { createActions } from 'redux-actions';
import api from '../../api';

export default createActions({
    RESTAURANTS: {
        CREATE_RESTAURANT: name =>
            api
                .post('restaurants', { name })
                .then(() => api.get('restaurants'))
                .then(({ data }) => data),
        LOAD: (sortBy, sortOrder) =>
            api
                .get('restaurants', {
                    params: { sortBy, sortOrder },
                })
                .then(({ data }) => data),
        REVIEW: (restaurant, rate, date, comment) =>
            api
                .post(`restaurants/${restaurant}/reviews`, {
                    rate,
                    date,
                    comment,
                })
                .then(() => api.get('restaurants'))
                .then(({ data }) => data),
        REPLY: (restaurant, review, comment) =>
            api
                .post(`restaurants/${restaurant}/reviews/${review}/reply`, {
                    comment,
                })
                .then(() => api.get('restaurants'))
                .then(({ data }) => data),
        UPDATE: (id, updated) =>
            api
                .patch(`restaurants/${id}`, updated)
                .then(() => ({ id, updated })),
        DELETE: restaurant =>
            api.delete(`restaurants/${restaurant}`).then(() => restaurant),
        UPDATE_REVIEW: (restaurant, id, updated) =>
            api
                .patch(`restaurants/${restaurant}/reviews/${id}`, updated)
                .then(() => ({ restaurant, id, updated })),
        DELETE_REVIEW: (restaurant, id) =>
            api
                .delete(`restaurants/${restaurant}/reviews/${id}`)
                .then(() => ({ restaurant, id })),
    },
}).restaurants;
