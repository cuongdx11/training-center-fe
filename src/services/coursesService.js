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