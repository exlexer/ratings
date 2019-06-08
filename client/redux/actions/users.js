import { createActions } from 'redux-actions';
import api from '../../api';

export default createActions({
    USERS: {
        SIGNIN: async (username, password) => {
            const { data } = await api.post('users/signin', {
                username,
                password,
            });
            return data;
        },
        SIGNUP: async (username, password) => {
            await api.post('users', {
                username,
                password,
            });
            const { data } = await api.post('users/signin', {
                username,
                password,
            });
            return data;
        },
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
