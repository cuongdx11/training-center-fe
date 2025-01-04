import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCoursesOfTopic, getTopics } from '../services/courseTopicService';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TopicCoursesList = () => {
  const { topicId } = useParams();
  const [courses, setCourses] = useState([]);
  const [topics, setTopics] = useState([]);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesData, topicsData] = await Promise.all([
          getCoursesOfTopic(topicId),
          getTopics()
        ]);
        setCourses(coursesData);
        setTopics(topicsData);
        setCurrentTopic(topicsData.find(topic => topic.id === topicId));
        setLoading(false);
      } catch (err) {
        toast.error('Không thể tải dữ liệu. Vui lòng thử lại sau!');
        setLoading(false);
      }
    };

    fetchData();
  }, [topicId]);

  const getLevelColor = (level) => {
    switch (level) {
      case 'BEGINNER':
        return 'bg-green-100 text-green-800';
      case 'ADVANCED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getLevelText = (level) => {
    switch (level) {
      case 'BEGINNER':
        return 'Cơ bản';
      case 'ADVANCED':
        return 'Nâng cao';
      default:
        return 'Trung bình';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen bg-white shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Chủ đề</h2>
          <nav>
            {topics.map((topic) => (
              <Link
                key={topic.id}
                to={`/topic/${topic.id}/courses`}
                className={`block py-2 px-4 rounded-lg mb-2 transition-colors duration-200 ${
                  topic.id === topicId
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {topic.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 py-8 px-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Danh Sách Khóa Học - {currentTopic?.name || 'Đang tải...'}
          </h1>
          
          {courses.length === 0 ? (
            <div className="text-center text-gray-600 py-8">
              Chưa có khóa học nào trong chủ đề này
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Link 
                  key={course.id} 
                  to={`/courses/${course.id}`}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative h-48">
                    <img
                      src={course.thumbnail || '/api/placeholder/400/320'}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(course.level)}`}>
                        {getLevelText(course.level)}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {course.title}
                    </h2>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600">{course.duration} giờ học</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-gray-600">{course.studentCount} học viên</span>
                      </div>
                    </div>

                    <div className="text-2xl font-bold text-blue-600">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(course.price)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopicCoursesList;