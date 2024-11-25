
import React, { useState, useEffect } from 'react';
import { Clock, GraduationCap, Users } from 'lucide-react';

import {getCourseByType} from '../../services/coursesService'

const OfflineCourses = () => {
    const [coursesData, setCoursesData] = useState({
        content: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        last: true
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await getCourseByType('offline')
                setCoursesData(response.data);
                setLoading(false);
            } catch (err) {
                setError('Không thể tải khóa học. Vui lòng thử lại sau.');
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const getLevelColor = (level) => {
        switch(level) {
            case 'BEGINNER':
                return 'bg-green-500';
            case 'INTERMEDIATE':
                return 'bg-yellow-500';
            case 'ADVANCED':
                return 'bg-red-500';
            default:
                return 'bg-blue-500';
        }
    };

    const getLevelText = (level) => {
        switch(level) {
            case 'BEGINNER':
                return 'Cơ bản';
            case 'INTERMEDIATE':
                return 'Trung cấp';
            case 'ADVANCED':
                return 'Nâng cao';
            default:
                return level;
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="text-center text-red-500 py-6 text-sm">{error}</div>
    );

    return (
        <section className="py-12 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">Khóa Học Offline</h2>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {coursesData.content.map((course) => (
                        <div key={course.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                            <div className="relative">
                                <img 
                                    src={course.thumbnail || "/api/placeholder/300/200"} 
                                    alt={course.title}
                                    className="w-full h-36 object-cover rounded-t-lg"
                                />
                                <div className="absolute top-2 right-2 bg-blue-500 bg-opacity-90 text-white px-2 py-0.5 rounded-full text-xs">
                                    {course.category.name}
                                </div>
                                <div className={`absolute bottom-2 left-2 ${getLevelColor(course.level)} text-white px-2 py-0.5 rounded-full text-xs`}>
                                    {getLevelText(course.level)}
                                </div>
                            </div>
                            
                            <div className="p-4">
                                <h3 className="text-base font-medium text-gray-800 mb-2 line-clamp-2 min-h-[40px]">
                                    {course.title}
                                </h3>
                                
                                <div className="space-y-1.5 mb-3 text-xs">
                                    <div className="flex items-center text-gray-600">
                                        <Clock className="w-3 h-3 mr-1.5" />
                                        <span>{course.duration} phút</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <GraduationCap className="w-3 h-3 mr-1.5" />
                                        <span className="truncate">{course.instructors.length} giảng viên</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Users className="w-3 h-3 mr-1.5" />
                                        <span>{course.studentCount} học viên</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                    <p className="text-base font-bold text-blue-500">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(course.price * 23000)} {/* Giả sử price đang ở USD, chuyển đổi sang VND */}
                                    </p>
                                    <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600 transition-colors">
                                        Đăng ký
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {coursesData.totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                        <div className="flex space-x-2">
                            {[...Array(coursesData.totalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    className={`px-3 py-1 rounded-full text-sm ${
                                        coursesData.page === index
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default OfflineCourses;