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