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
        LOGOUT: async () => {
            const { data } = await api.post('users/logout');
            return {};
        },
    },
}).users;
