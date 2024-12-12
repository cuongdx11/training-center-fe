import api from './api'

export const getCategories = () => {
    return api.get('/categories');
  };

export const createCategory = async(data) => {
  try {
    const response = await api.post('/categories', data);
    console.log('Category created:', response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getCategoryById = async(categoryId) => {
  try {
    const response = await api.get(`/catgories/${categoryId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const updateCategory = async(categoryId, data) => {
  try {
    const response = await api.put(`/categories/${categoryId}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const deleteCategory = async(categoryId) => {
  try {
    const response = await api.delete(`/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}