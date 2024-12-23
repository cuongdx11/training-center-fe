import React, { useState, useEffect } from 'react';
import { 
  Search, 
  EyeIcon, 
  BookOpen, 
  Clock,
  Users,
  X,
  ChevronDown,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { getStudentEnrollments, statisticsEnrollment } from '../../services/enrollmentService';

const StudentEnrollmentsPage = () => {
  const [students, setStudents] = useState([]);
  const [statistics, setStatistics] = useState({
    pendingCount: 0,
    totalStudents: 0,
    completedCount: 0,
    studyingCount: 0
  });
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enrollmentsData, statsData] = await Promise.all([
          getStudentEnrollments(),
          statisticsEnrollment()
        ]);
        setStudents(enrollmentsData);
        setStatistics(statsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusBadgeColor = (status) => {
    const colors = {
      INACTIVE: 'bg-gray-500',
      ACTIVE: 'bg-blue-500',
      COMPLETED: 'bg-green-500',
      CANCELED: 'bg-red-500',
      PENDING: 'bg-yellow-500',
      STUDYING: 'bg-purple-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getProgressColor = (progress) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 60) return 'bg-yellow-500';
    if (progress < 90) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.enrollments.some(e => 
      e.courses?.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const renderProgressBar = (progress) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
      <div 
        className={`h-2.5 rounded-full ${getProgressColor(progress)}`}
        style={{width: `${progress}%`}}
      ></div>
    </div>
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        {/* Header & Search */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Quản Đăng Ký Của Học Viên 
          </h1>
          
          <div className="relative">
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên, email, khóa học..."
              className="w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
            <Users className="w-10 h-10 text-blue-500 mr-4" />
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Tổng Học Viên</h3>
              <p className="text-xl font-bold text-blue-600">{statistics.totalStudents}</p>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
            <Clock className="w-10 h-10 text-purple-500 mr-4" />
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Đang Học</h3>
              <p className="text-xl font-bold text-purple-600">{statistics.studyingCount}</p>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
            <BookOpen className="w-10 h-10 text-green-500 mr-4" />
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Hoàn Thành</h3>
              <p className="text-xl font-bold text-green-600">{statistics.completedCount}</p>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
            <AlertCircle className="w-10 h-10 text-yellow-500 mr-4" />
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Chờ Xử Lý</h3>
              <p className="text-xl font-bold text-yellow-600">{statistics.pendingCount}</p>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="bg-white shadow-md rounded-lg">
          <div className="p-4 bg-gray-100 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Danh Sách Học Viên ({statistics.totalStudents})
            </h2>
          </div>
          
          {filteredStudents.map((student) => (
            <div key={student.id} className="border-b last:border-b-0">
              {/* Student Header */}
              <div 
                className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                onClick={() => setExpandedStudent(expandedStudent === student.id ? null : student.id)}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right mr-4">
                    <p className="text-sm text-gray-600">Số khóa học đăng ký</p>
                    <p className="font-medium text-gray-800">{student.totalEnrollments}</p>
                  </div>
                  {expandedStudent === student.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
              </div>

              {/* Enrollments Details */}
              {expandedStudent === student.id && (
                <div className="px-4 pb-4">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Khóa Học</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Ngày Đăng Ký</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Trạng Thái</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tiến Độ</th>
                        <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {student.enrollments.map((enrollment) => (
                        <tr key={enrollment.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">{enrollment.courses.title}</td>
                          <td className="px-4 py-3 text-gray-600">{formatDate(enrollment.enrollmentDate)}</td>
                          <td className="px-4 py-3">
                            <span className={`px-3 py-1 rounded-full text-white text-sm ${getStatusBadgeColor(enrollment.status)}`}>
                              {enrollment.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <span className="mr-2 text-sm text-gray-600">{enrollment.progress}%</span>
                              {renderProgressBar(enrollment.progress)}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button 
                              onClick={() => setSelectedEnrollment({ ...enrollment, student })}
                              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                            >
                              <EyeIcon size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Enrollment Detail Modal */}
        {selectedEnrollment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-3/4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 bg-gray-100 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  Chi Tiết Đăng Ký Khóa Học
                </h2>
                <button 
                  onClick={() => setSelectedEnrollment(null)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Student Information */}
                  <div className="bg-white shadow-md rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Thông Tin Học Viên</h3>
                    <p><strong>Họ Tên:</strong> {selectedEnrollment.student.name}</p>
                    <p><strong>Email:</strong> {selectedEnrollment.student.email}</p>
                    <p><strong>Số Điện Thoại:</strong> {selectedEnrollment.student.phone}</p>
                  </div>

                  {/* Course Progress */}
                  <div className="bg-white shadow-md rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Thông Tin Khóa Học</h3>
                    <p><strong>Tên Khóa Học:</strong> {selectedEnrollment.courses.title}</p>
                    <p><strong>Giá Khóa Học:</strong> {selectedEnrollment.orderItem?.price?.toLocaleString('vi-VN')} VNĐ</p>
                    <p><strong>Ngày Đăng Ký:</strong> {formatDate(selectedEnrollment.enrollmentDate)}</p>
                    <p><strong>Trạng Thái:</strong> 
                      <span className={`ml-2 px-3 py-1 rounded-full text-white text-sm ${getStatusBadgeColor(selectedEnrollment.status)}`}>
                        {selectedEnrollment.status}
                      </span>
                    </p>
                    <div className="mt-4">
                      <p className="font-medium mb-2">Tiến Độ Học Tập:</p>
                      <div className="flex items-center">
                        <span className="mr-2 text-sm text-gray-600">{selectedEnrollment.progress}%</span>
                        {renderProgressBar(selectedEnrollment.progress)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentEnrollmentsPage;