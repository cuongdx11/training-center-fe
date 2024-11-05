import api from './api';


export const login = (credentials) => {
    return api.post('/auth/login', credentials); // Giả sử API của bạn có endpoint /login
};
