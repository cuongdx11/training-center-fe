import axios from './api';


export const getCourses = () => {
    return axios.get(`/courses`);
}


// Lấy chi tiết một khóa học
export const getCourseById = (courseId) => {
    return axios.get(`/courses/${courseId}`);
}

export const getCourseSchedule = (courseId) => {
    return axios.get(`/schedule/courses/${courseId}`);
}

export const addCourse = (courseData) => {
    return axios.post('/courses', courseData);
}

export const getCoursesByUser = (userId) => {
    return axios.get(`/courses/user/${userId}/enrollments`);
}

// Thêm hàm update course
export const updateCourse = (courseId, courseData) => {
    return axios.put(`/courses/${courseId}`, courseData);
}

// Thêm hàm xóa course (nếu cần)
export const deleteCourse = (courseId) => {
    return axios.delete(`/courses/${courseId}`);
}