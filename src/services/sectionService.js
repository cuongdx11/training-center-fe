import api from './api';


export const getSectionsByCourseId = async (courseId) => {
    try {
        const response = await api.get(`/sections/courses/${courseId}`)
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const addSection = async (sectionData,courseId) => {
    try {
        const response = await api.post(`/sections`, {
            ...sectionData,
            courseId: courseId,
        });
        return response.data;
    }
    catch(error){
     throw error;
    }
}

// Cập nhật section
export const updateSection = async (sectionId, sectionData) => {
    try {
        const response = await api.put(`/sections/${sectionId}`, sectionData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Xóa section
export const deleteSection = async (sectionId) => {
    try {
        await api.delete(`/sections/${sectionId}`);
    } catch (error) {
        throw error;
    }
};