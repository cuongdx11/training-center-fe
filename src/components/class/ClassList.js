import React, { useEffect, useState } from 'react';
import { getClassOfStudent } from '../../services/courseClassService';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, BookOpen, AlertCircle } from 'lucide-react';

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await getClassOfStudent();
        setClasses(data);
        setLoading(false);
      } catch (err) {
        setError('Có lỗi xảy ra khi tải danh sách lớp học');
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        <p className="text-gray-500">Đang tải danh sách lớp học...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="w-16 h-16 text-red-500" />
        <p className="text-red-500 font-medium text-lg">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!classes.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <BookOpen className="w-16 h-16 text-gray-400" />
        <h3 className="text-xl font-semibold text-gray-600">Chưa có lớp học nào</h3>
        <p className="text-gray-500 text-center max-w-md">
          Bạn chưa tham gia lớp học nào. Hãy khám phá các khóa học của chúng tôi để bắt đầu hành trình học tập của bạn.
        </p>
        <Link
          to="/courses"
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Xem khóa học
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <Link
            to={`/classes/${classItem.id}`}
            key={classItem.id}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
              <div className="relative">
                <img
                  src={classItem.course.thumbnail}
                  alt={classItem.course.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    classItem.status === 'ACTIVE' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-500 text-white'
                  }`}>
                    {classItem.status === 'ACTIVE' ? 'Đang hoạt động' : 'Không hoạt động'}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-500 transition-colors">
                  {classItem.name}
                </h2>
                
                <p className="text-gray-600 mb-4">{classItem.course.title}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-3 text-blue-500" />
                    <span>{classItem.studyDays}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-3 text-blue-500" />
                    <span>{classItem.studyTime}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-3 text-blue-500" />
                    <div className="flex items-center gap-2 flex-1">
                      <span>{classItem.currentStudentCount} học viên</span>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                          style={{
                            width: `${(classItem.currentStudentCount / classItem.maxStudents) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center">
                    <img
                      src={classItem.instructor.profilePicture}
                      alt={classItem.instructor.fullName}
                      className="w-12 h-12 rounded-full mr-3 border-2 border-gray-100"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{classItem.instructor.fullName}</p>
                      <p className="text-sm text-gray-500">Giảng viên</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ClassList;