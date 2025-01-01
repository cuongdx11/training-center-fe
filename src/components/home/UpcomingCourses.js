import React, { useEffect, useState } from 'react';
import { Calendar  } from 'lucide-react';
import { getCoursesWithParams } from '../../services/coursesService';

const UpcomingCourses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const params = { page: 0, size: 2, sortBy: 'createdAt', sortDirection: 'asc' };
        const data = await getCoursesWithParams(params);
        console.log(data.content); // Log dữ liệu trả về để kiểm tra
        setCourses(data.content || []); // Đảm bảo dữ liệu là mảng
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Khóa học mới</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((course, index) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">{course.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Thời lượng: {course.duration} giờ</span>
                </div>
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="rounded-lg w-full h-40 object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingCourses;
