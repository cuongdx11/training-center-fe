import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getClassById, getStudentOfClass } from '../../services/courseClassService';
import { Calendar, Clock, Users, BookOpen, MapPin, Phone, Mail } from 'lucide-react';

const InstructorClassesDetail = () => {
  const [classDetail, setClassDetail] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classData, studentsData] = await Promise.all([
          getClassById(id),
          getStudentOfClass(id)
        ]);
        setClassDetail(classData);
        setStudents(studentsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold text-gray-600">Đang tải...</div>
      </div>
    );
  }

  if (!classDetail) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Class Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{classDetail.name}</h1>
            <p className="text-lg text-gray-600">{classDetail.course.title}</p>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
            classDetail.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
            classDetail.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
            'bg-red-100 text-red-800'
          }`}>
            {classDetail.status}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center text-gray-700">
            <Calendar className="w-5 h-5 mr-3" />
            <div>
              <p className="text-sm font-semibold">Thời gian học</p>
              <p className="text-sm">{formatDate(classDetail.startDate)} - {formatDate(classDetail.endDate)}</p>
            </div>
          </div>
          <div className="flex items-center text-gray-700">
            <Clock className="w-5 h-5 mr-3" />
            <div>
              <p className="text-sm font-semibold">Giờ học</p>
              <p className="text-sm">{classDetail.studyTime}</p>
              <p className="text-sm">{classDetail.studyDays}</p>
            </div>
          </div>
          <div className="flex items-center text-gray-700">
            <Users className="w-5 h-5 mr-3" />
            <div>
              <p className="text-sm font-semibold">Số lượng học viên</p>
              <p className="text-sm">{classDetail.currentStudentCount}/{classDetail.maxStudents || 'Không giới hạn'}</p>
            </div>
          </div>
          <div className="flex items-center text-gray-700">
            <BookOpen className="w-5 h-5 mr-3" />
            <div>
              <p className="text-sm font-semibold">Tiến độ</p>
              <p className="text-sm">{classDetail.completedSessions}/{classDetail.totalSessions} buổi</p>
            </div>
          </div>
        </div>
      </div>

      {/* Instructor Info */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Thông tin giảng viên</h2>
        <div className="flex items-start space-x-4">
          <img 
            src={classDetail.instructor.profilePicture} 
            alt={classDetail.instructor.fullName}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h3 className="text-lg font-semibold">{classDetail.instructor.fullName}</h3>
            <p className="text-gray-600 mb-2">{classDetail.instructor.bio}</p>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm">{classDetail.instructor.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm">{classDetail.instructor.phoneNumber}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm">{classDetail.instructor.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Danh sách học viên ({students.length})</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map(student => (
            <div key={student.id} className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200">
              <img 
                src={student.profilePicture} 
                alt={student.fullName}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold">{student.fullName}</h3>
                <div className="flex flex-col space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>{student.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{student.phoneNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstructorClassesDetail;