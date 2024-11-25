import api from './api';


export const login = (credentials) => {
    return api.post('/auth/login', credentials); // Giả sử API của bạn có endpoint /login
};


export const register = (credentials) => {
    return api.post('/auth/register', credentials); 
}

export const activateUser = async (token) => {
    const response = await api.get(`/auth/activate?token=${token}`);
    return response.data;
};
