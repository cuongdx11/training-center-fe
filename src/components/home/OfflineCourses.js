import React, { useState, useEffect, useCallback } from 'react';
import { Clock, GraduationCap, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { getCourseByType } from '../../services/coursesService';
import { useNavigate } from 'react-router-dom';

const OfflineCourses = () => {
    const navigate = useNavigate();
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
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsToShow, setItemsToShow] = useState(4);

    // Update items to show based on screen size
    useEffect(() => {
        const updateItemsToShow = () => {
            if (window.innerWidth < 640) { // mobile
                setItemsToShow(1);
            } else if (window.innerWidth < 768) { // small tablet
                setItemsToShow(2);
            } else if (window.innerWidth < 1024) { // tablet
                setItemsToShow(3);
            } else { // desktop
                setItemsToShow(4);
            }
        };

        updateItemsToShow();
        window.addEventListener('resize', updateItemsToShow);
        return () => window.removeEventListener('resize', updateItemsToShow);
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getCourseByType('OFFLINE');
                setCoursesData(data);
                setLoading(false);
            } catch (err) {
                setError('Không thể tải khóa học. Vui lòng thử lại sau.');
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Auto-slide effect
    useEffect(() => {
        const timer = setInterval(() => {
            if (coursesData.content.length > 0) {
                setCurrentIndex(current => 
                    current === coursesData.content.length - 1 ? 0 : current + 1
                );
            }
        }, 3000);

        return () => clearInterval(timer);
    }, [coursesData.content.length]);

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

    const nextSlide = useCallback(() => {
        setCurrentIndex(current => 
            current === coursesData.content.length - 1 ? 0 : current + 1
        );
    }, [coursesData.content.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex(current => 
            current === 0 ? coursesData.content.length - 1 : current - 1
        );
    }, [coursesData.content.length]);

    const getVisibleItems = () => {
        if (!coursesData.content.length) return [];
        const items = [];
        for (let i = 0; i < itemsToShow; i++) {
            const index = (currentIndex + i) % coursesData.content.length;
            items.push({
                ...coursesData.content[index],
                offset: i
            });
        }
        return items;
    };

    if (loading) return (
        <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="text-center text-red-500 py-6 text-sm">{error}</div>
    );

    const slideWidth = 100 / itemsToShow;

    return (
        <section className="py-8 md:py-12 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6 md:mb-8">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">Khóa Học Offline</h2>
                    </div>
                </div>

                <div className="relative">
                    {/* Navigation buttons - Hidden on mobile */}
                    <button 
                        onClick={prevSlide}
                        className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-all"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <button 
                        onClick={nextSlide}
                        className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-all"
                    >
                        <ChevronRight className="w-6 h-6 text-gray-600" />
                    </button>

                    <div className="overflow-hidden relative">
                        <div className="relative h-[400px] md:h-[420px]">
                            {getVisibleItems().map((course) => (
                                <div 
                                    key={`${course.id}-${course.offset}`}
                                    className="absolute w-full sm:w-1/2 md:w-1/3 lg:w-1/4 transition-all duration-500"
                                    style={{
                                        left: `${course.offset * slideWidth}%`,
                                        opacity: 1,
                                        transform: 'translateX(0)'
                                    }}
                                >
                                    <div className="mx-2 md:mx-3">
                                        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                                            <div 
                                                className="relative cursor-pointer" 
                                                onClick={() => navigate(`/courses/${course.id}`)}
                                            >
                                                <img 
                                                    src={course.thumbnail || "/api/placeholder/300/200"} 
                                                    alt={course.title}
                                                    className="w-full h-32 sm:h-36 object-cover rounded-t-lg"
                                                />
                                                <div className="absolute top-2 right-2 bg-blue-500 bg-opacity-90 text-white px-2 py-0.5 rounded-full text-xs">
                                                    {course.category.name}
                                                </div>
                                                <div className={`absolute bottom-2 left-2 ${getLevelColor(course.level)} text-white px-2 py-0.5 rounded-full text-xs`}>
                                                    {getLevelText(course.level)}
                                                </div>
                                            </div>
                                            
                                            <div className="p-4">
                                                <h3 
                                                    className="text-base font-medium text-gray-800 mb-2 line-clamp-2 min-h-[40px] cursor-pointer hover:text-blue-600"
                                                    onClick={() => navigate(`/courses/${course.id}`)}
                                                >
                                                    {course.title}
                                                </h3>
                                                
                                                <div className="space-y-1.5 mb-3 text-xs">
                                                    <div className="flex items-center text-gray-600">
                                                        <Clock className="w-3 h-3 mr-1.5" />
                                                        <span>{course.duration} tuần</span>
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
                                                    <p className="text-sm md:text-base font-bold text-blue-500">
                                                        {new Intl.NumberFormat('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND'
                                                        }).format(course.price)}
                                                    </p>
                                                    <button
                                                        onClick={() => navigate(`/checkout/${course.id}`)}
                                                        className="px-4 py-1.5 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700 transition-colors"
                                                    >
                                                        Đăng ký
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Indicators */}
                    <div className="flex justify-center mt-4 md:mt-6 space-x-2">
                        {coursesData.content.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${
                                    index === currentIndex 
                                        ? 'bg-blue-500 w-4' 
                                        : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OfflineCourses;