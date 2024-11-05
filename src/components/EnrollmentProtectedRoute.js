import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { checkEnrollment } from '../services/enrollmentService'; // Đường dẫn đến service bạn đã tạo

const EnrollmentProtectedRoute = ({ children, courseId }) => {
    const [isEnrolled, setIsEnrolled] = useState(null); // Trạng thái đăng ký
    const [loading, setLoading] = useState(true); // Trạng thái tải

    useEffect(() => {
        const userId = localStorage.getItem('userId'); // Lấy userId từ localStorage
        const fetchEnrollment = async () => {
            try {
                const result = await checkEnrollment(userId, courseId);
                setIsEnrolled(result.enrolled);
            } catch (error) {
                console.error('Error checking enrollment', error);
                setIsEnrolled(false);
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollment();
    }, [courseId]);

    if (loading) {
        return <div>Loading...</div>; // Có thể thay bằng loading spinner
    }

    return isEnrolled ? children : <Navigate to="/my-courses" replace />; // Chuyển hướng nếu không đăng ký
};

export default EnrollmentProtectedRoute;
