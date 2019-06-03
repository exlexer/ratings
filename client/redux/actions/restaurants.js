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
    },
}).restaurants;
