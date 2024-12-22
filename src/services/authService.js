import api from './api';


export const login = (credentials) => {
    return api.post('/auth/login', credentials); // Giả sử API của bạn có endpoint /login
};

export const adminLogin = (credentials) => {
    const response = api.post('/auth/admin/login', credentials); 
    return response;
};

export const register = (credentials) => {
    return api.post('/auth/register', credentials); 
}

export const activateUser = async (token) => {
    const response = await api.get(`/auth/activate?token=${token}`);
    return response.data;
};

export const changePass = async (data) => {
    try {
        const response = await api.post(`/auth/change-password`,data);
    return response.data;
    }
    catch(error) {
        throw error;
    }
    
};
