import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Đợi cho đến khi authentication state được load xong
    if (loading) {
        return <div>Loading...</div>; // Hoặc loading spinner của bạn
    }

    if (!user) {
        // Redirect to login và lưu lại URL hiện tại để sau khi login có thể quay lại
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;