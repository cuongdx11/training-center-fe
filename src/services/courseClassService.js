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