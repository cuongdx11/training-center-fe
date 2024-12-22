import React, { useEffect, useState } from 'react';
import { getClassOfStudent } from '../../services/courseClassService';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users } from 'lucide-react';

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
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <Link
            to={`/classes/${classItem.id}`}
            key={classItem.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{classItem.name}</h2>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  classItem.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {classItem.status === 'ACTIVE' ? 'Đang hoạt động' : 'Không hoạt động'}
                </span>
              </div>
              
              <div className="mb-4">
                <img
                  src={classItem.course.thumbnail}
                  alt={classItem.course.title}
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>

              <div className="space-y-2">
                <p className="text-gray-600">Khóa học: {classItem.course.title}</p>
                
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{classItem.studyDays}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{classItem.studyTime}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{classItem.currentStudentCount}/{classItem.maxStudents} học viên</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center">
                  <img
                    src={classItem.instructor.profilePicture}
                    alt={classItem.instructor.fullName}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-medium">{classItem.instructor.fullName}</p>
                    <p className="text-sm text-gray-600">Giảng viên</p>
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