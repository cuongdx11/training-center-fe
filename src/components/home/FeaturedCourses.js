import React, { useEffect, useState } from 'react';
import CourseCard from './CourseCard';
import {getCourses} from '../../services/coursesService';

const FeaturedCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await getCourses();
                setCourses(response.slice(0, 3));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) {
        return <div className="text-center py-16">Đang tải...</div>;
    }

    if (error) {
        return <div className="text-center py-16 text-red-500">Có lỗi xảy ra: {error}</div>;
    }

    return (
        <section className="container mx-auto py-16 px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Các Khóa Học Nổi Bật</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course, index) => (
                    <CourseCard key={index} {...course} />
                ))}
            </div>
        </section>
    );
};

export default FeaturedCourses;
