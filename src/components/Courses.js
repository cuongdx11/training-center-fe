import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCourses } from '../services/coursesService';
import { Clock, Users, ChevronRight } from 'lucide-react';

const Courses = () => {
    const [coursesData, setCoursesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await getCourses();
                setCoursesData(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Không thể tải danh sách khóa học');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleCourseClick = (courseId) => {
        navigate(`/courses/${courseId}`);
    };

    const formatDuration = (duration) => {
        if (!duration) return '8 tuần';
        return `${duration} giờ`;
    };

    const formatStudentCount = (count) => {
        if (!count) return '0 học viên';
        return count === 1 ? '1 học viên' : `${count.toLocaleString('vi-VN')} học viên`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
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

    return (
        <div className="container mx-auto px-4 py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">
                    Khóa Học Nổi Bật
                </h1>
                <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                    Khám phá các khóa học chất lượng cao được thiết kế để giúp bạn phát triển kỹ năng và đạt được mục tiêu của mình.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {coursesData.map((course) => (
                        <div 
                            key={course.id} 
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col h-full cursor-pointer"
                            onClick={() => handleCourseClick(course.id)}
                        >
                            <div className="relative">
                                {course.thumbnail ? (
                                    <img 
                                        src={course.thumbnail} 
                                        alt={course.title}
                                        className="h-48 w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-500" />
                                )}
                                <div className="absolute top-4 right-4 bg-white py-1 px-3 rounded-full text-sm font-semibold text-blue-600">
                                    {course.level || 'Cơ bản'}
                                </div>
                            </div>
                            
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex-grow">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-3 line-clamp-2">
                                        {course.title}
                                    </h2>
                                    <p className="text-gray-600 mb-4 line-clamp-3">
                                        {course.description}
                                    </p>
                                </div>
                                
                                <div className="mt-auto">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center text-gray-500">
                                            <Clock className="w-4 h-4 mr-2" />
                                            <span className="text-sm">
                                                {formatDuration(course.duration)}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-gray-500">
                                            <Users className="w-4 h-4 mr-2" />
                                            <span className="text-sm">
                                                {formatStudentCount(course.studentCount)}
                                            </span>
                                        </div>
                                    </div>

                                    <Link 
                                        to={`/courses/${course.id}`}
                                        className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition duration-300 group"
                                    >
                                        <div className="flex items-center justify-center">
                                            <span>Xem Chi Tiết</span>
                                            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Courses;