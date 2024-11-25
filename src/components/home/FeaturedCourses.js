import React from 'react';
import CourseCard from './CourseCard';

const FeaturedCourses = () => {
    const courses = [
        {
            image: "/course-web.jpg",
            title: "Lập Trình Web",
            description: "Học cách xây dựng website chuyên nghiệp từ A đến Z.",
            link: "/courses/web-development"
        },
        {
            image: "/course-python.jpg",
            title: "Lập Trình Python",
            description: "Tìm hiểu lập trình Python từ cơ bản đến nâng cao.",
            link: "/courses/python"
        },
        {
            image: "/course-react.jpg",
            title: "Lập Trình ReactJS",
            description: "Khám phá lập trình ReactJS và phát triển ứng dụng động.",
            link: "/courses/react"
        }
    ];

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
