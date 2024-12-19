import React, { useState, useEffect } from 'react';
import { getClassOfInstructor, getStudentOfClass } from '../../services/courseClassService';
import { Calendar, Clock, Users, BookOpen } from 'lucide-react';

const InstructorClasses = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await getClassOfInstructor();
      setClasses(response);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setLoading(false);
    }
  };

  const fetchStudents = async (classId) => {
    try {
      const response = await getStudentOfClass(classId);
      setStudents(response);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleClassClick = async (classData) => {
    setSelectedClass(classData);
    await fetchStudents(classData.id);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg font-semibold text-gray-600">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Danh sách lớp học của bạn</h1>
      
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
        {/* Danh sách lớp học */}
        <div className="lg:col-span-2">
          <div className="grid gap-4">
            {classes.map((classItem) => (
              <div
                key={classItem.id}
                className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transform transition-transform hover:scale-[1.02] ${
                  selectedClass?.id === classItem.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleClassClick(classItem)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{classItem.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{classItem.course.name}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(classItem.status)}`}>
                    {classItem.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      {formatDate(classItem.startDate)} - {formatDate(classItem.endDate)}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">{classItem.studyTime}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span className="text-sm">{classItem.maxStudents} học viên</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <BookOpen className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      {classItem.completedSessions}/{classItem.totalSessions} buổi
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Danh sách học viên */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">
              {selectedClass ? 'Danh sách học viên' : 'Chọn một lớp để xem danh sách học viên'}
            </h2>
            {selectedClass && (
              <div className="space-y-4">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{student.fullName}</p>
                      <p className="text-sm text-gray-600">{student.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorClasses;