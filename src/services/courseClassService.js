import api from  './api';

export const addClass = async(formData) => {
    try{
        const response = await api.post('/classes',
            
                formData
            
        )
        return response;
    }
    catch(error) {
        throw error;
    }
}


export const getClassByCourseId = async(courseId) => {
    try {
        const response = await api.get(`/classes/course/${courseId}`)
        return response.data;
    }
    catch(error) {
        throw error;
    }
}
export const getClassById = async(Id) => {
    try {
        const response = await api.get(`/classes/${Id}`)
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

export const getClass = async() => {
    try {
        const response = await api.get(`/classes`)
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

export const getStudentOfClass = async(classId) => {
    try {
        const response = await api.get(`/classes/${classId}/students`)
        return response.data;
    }
    catch(error) {
        throw error;
    }
}


export const getClassOfInstructor = async() => {
    try {
        const response = await api.get(`/classes/instructor`)
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

export const getClassOfStudent = async() => {
    try {
        const response = await api.get(`/classes/student`)
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

export const updateClass = async(id, data) => {
    try {
        const response = await api.put(`/classes/${id}`, data);
        return response;
    } catch (error) {
        throw error;
    }
}

export const deleteClass = async(id) => {
    try {
        return await api.delete(`/classes/${id}`);
    } catch (error) {
        throw error;
    }
}


export const getClassByCourse = async (courseId) => {
    try {
        const response = await api.get(`/classes/student/select`, {
            params: {
                courseId: courseId
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getClassesWithFilters = async (filters) => {
    try {
        const response = await api.get('/classes/all', {
            params: {
                className: filters.className || '',
                courseId: filters.courseId || '',
                instructorId: filters.instructorId || '',
                page: filters.page || 0,
                size: filters.size || 10,
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};