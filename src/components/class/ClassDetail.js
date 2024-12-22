import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getClassById, getStudentOfClass } from '../../services/courseClassService';
import { Calendar, Clock, Users, BookOpen, GraduationCap } from 'lucide-react';

const ClassDetail = () => {
  const { id } = useParams();
  const [classDetail, setClassDetail] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } catch (err) {
        setError('Có lỗi xảy ra khi tải thông tin lớp học');
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (!classDetail) {
    return <div className="text-center p-4">Không tìm thấy thông tin lớp học</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md">
        {/* Header Section */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2">{classDetail.name}</h1>
              <p className="text-gray-600">{classDetail.course.title}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm ${
              classDetail.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {classDetail.status === 'ACTIVE' ? 'Đang hoạt động' : 'Không hoạt động'}
            </span>
          </div>
        </div>

        {/* Course Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          <div className="col-span-2">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="font-semibold mb-3 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Thông tin khóa học
                </h2>
                <div className="space-y-2">
                  <p><span className="font-medium">Mô tả:</span> {classDetail.course.description}</p>
                  <p><span className="font-medium">Thời lượng:</span> {classDetail.course.duration} buổi</p>
                  <p><span className="font-medium">Trình độ:</span> {classDetail.course.level}</p>
                  <p><span className="font-medium">Học phí:</span> {classDetail.course.price.toLocaleString()}đ</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="font-semibold mb-3">Lịch học</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Ngày học</p>
                      <p>{classDetail.studyDays}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Giờ học</p>
                      <p>{classDetail.studyTime}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="font-semibold mb-3 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" />
                Giảng viên
              </h2>
              <div className="flex items-center mb-4">
                <img
                  src={classDetail.instructor.profilePicture}
                  alt={classDetail.instructor.fullName}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <p className="font-medium">{classDetail.instructor.fullName}</p>
                  <p className="text-sm text-gray-600">{classDetail.instructor.email}</p>
                  <p className="text-sm text-gray-600">{classDetail.instructor.phoneNumber}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="p-6 border-t">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Danh sách học viên ({students.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Học viên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số điện thoại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Địa chỉ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={student.profilePicture}
                          alt={student.fullName}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.fullName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.phoneNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.address}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetail;