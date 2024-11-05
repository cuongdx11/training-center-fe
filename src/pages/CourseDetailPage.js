import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CourseDetail from '../components/CourseDetail'; // Import component chi tiết khóa học đã tạo trước đó
import { getCourseById } from '../services/coursesService';
const CourseDetailPage = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourseDetail = async () => {
            try {
                setLoading(true);
                const response = await getCourseById(id);
                setCourse(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Không thể tải thông tin khóa học');
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-50 p-6 rounded-lg shadow-sm">
                    <h3 className="text-red-800 font-medium text-lg">Đã xảy ra lỗi</h3>
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-yellow-50 p-6 rounded-lg shadow-sm">
                    <h3 className="text-yellow-800 font-medium text-lg">Không tìm thấy khóa học</h3>
                    <p className="text-yellow-600">Khóa học này có thể đã bị xóa hoặc không tồn tại</p>
                </div>
            </div>
        );
    }

    return <CourseDetail course={course} />;
};

export default CourseDetailPage;