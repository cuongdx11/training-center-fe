// src/components/home/UpcomingCourses.jsx
import React from 'react';
import { Calendar, Target } from 'lucide-react';

const UpcomingCourses = () => {
  const courses = [
    {
      title: "Fullstack JavaScript",
      startDate: "01/12/2024",
      duration: "6 tháng",
      spots: "15 chỗ còn trống",
      tags: ["React", "Node.js", "MongoDB"]
    },
    {
      title: "Java Spring Boot",
      startDate: "15/12/2024",
      duration: "8 tháng",
      spots: "10 chỗ còn trống",
      tags: ["Java", "Spring", "MySQL"]
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Khóa học sắp khai giảng</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((course, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">{course.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Khai giảng: {course.startDate}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4" />
                  <span>Thời lượng: {course.duration}</span>
                </div>
                <div className="text-blue-600 font-semibold mb-4">{course.spots}</div>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingCourses;