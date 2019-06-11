import { createActions } from 'redux-actions';
import api from '../../api';

export default createActions({
    USERS: {
        AUTHORIZE: () => api.get('users/authorize').then(({ data }) => data),
        SIGNIN: (username, password) =>
            api
                .post('users/signin', {
                    username,
                    password,
                })
                .then(({ data }) => ({ ...data, loggedIn: true }))
                .catch(() => ({
                    loggedIn: false,
                    error: 'Failed, please try again',
                })),
        SIGNUP: (username, password) =>
            api
                .post('users', {
                    username,
                    password,
                })
                .then(() =>
                    api.post('users/signin', {
                        username,
                        password,
                    }),
                )
                .then(({ data }) => ({ ...data, loggedIn: true }))
                .catch(() => ({
                    loggedIn: false,
                    error: 'Failed, please try again',
                })),

        LOGOUT: async () => {
            const { data } = await api.get('users/logout');
            return {};
        },
        GET: () => api.get('users'),
        UPDATE: (id, updated) =>
            api.patch(`users/${id}`, updated).then(() => ({ id, updated })),
        DELETE: user => api.delete(`users/${user}`).then(() => user),
    },
}).users;
