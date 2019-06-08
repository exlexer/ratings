import { createActions } from 'redux-actions';
import api from '../../api';

export default createActions({
    RESTAURANTS: {
        LOAD: async () => {
            const { data } = await api.get('restaurants');
            return data;
        },
        REVIEW: (restaurant, rate, date, comment) =>
            api
                .post('reviews', {
                    restaurant,
                    rate,
                    date,
                    comment,
                })
                .then(api.get('restaurants'))
                .then(({ data }) => {
                    console.log(data);
                    return data;
                }),

        REPLY: (review, comment) =>
            api
                .post(`reviews/${review}/reply`, {
                    comment,
                })
                .then(api.get('restaurants'))
                .then(({ data }) => {
                    console.log(data);
                    return data;
                }),
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
