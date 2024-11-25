import React, { useState } from 'react';
import { 
  Search, 
  EyeIcon, 
  BookOpen, 
  TrendingUp,
  Users,
  X 
} from 'lucide-react';

const StudentProgressManagementPage = () => {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Nguyễn Văn A',
      email: 'vana@example.com',
      phone: '0912345678',
      currentCourses: 3,
      completedCourses: 2,
      overallProgress: 65,
      lastActive: '2024-11-20',
      coursesDetails: [
        { name: 'React Căn Bản', progress: 75, status: 'Đang Học' },
        { name: 'Node.js', progress: 45, status: 'Đang Học' },
        { name: 'Database', progress: 100, status: 'Hoàn Thành' }
      ]
    },
    {
      id: 2,
      name: 'Trần Thị B',
      email: 'thib@example.com',
      phone: '0987654321', 
      currentCourses: 2,
      completedCourses: 1,
      overallProgress: 55,
      lastActive: '2024-11-19',
      coursesDetails: [
        { name: 'Frontend', progress: 60, status: 'Đang Học' },
        { name: 'Backend', progress: 50, status: 'Đang Học' }
      ]
    }
  ]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const getProgressColor = (progress) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 60) return 'bg-yellow-500';
    if (progress < 90) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderProgressBar = (progress) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
      <div 
        className={`h-2.5 rounded-full ${getProgressColor(progress)}`}
        style={{width: `${progress}%`}}
      ></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        {/* Tiêu Đề & Thanh Tìm Kiếm */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Quản Lý Học Viên
          </h1>
          
          <div className="relative">
            <input 
              type="text" 
              placeholder="Tìm kiếm học viên..."
              className="w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          </div>
        </div>

        {/* Thống Kê Tổng Quan */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
            <Users className="w-10 h-10 text-blue-500 mr-4" />
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Tổng Học Viên</h3>
              <p className="text-xl font-bold text-blue-600">{students.length}</p>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
            <TrendingUp className="w-10 h-10 text-green-500 mr-4" />
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Đang Học</h3>
              <p className="text-xl font-bold text-green-600">
                {students.filter(s => s.currentCourses > 0).length}
              </p>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
            <BookOpen className="w-10 h-10 text-purple-500 mr-4" />
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Tổng Khóa Học</h3>
              <p className="text-xl font-bold text-purple-600">
                {students.reduce((sum, s) => sum + s.currentCourses + s.completedCourses, 0)}
              </p>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
            <TrendingUp className="w-10 h-10 text-orange-500 mr-4" />
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Hoàn Thành</h3>
              <p className="text-xl font-bold text-orange-600">
                {students.reduce((sum, s) => sum + s.completedCourses, 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Danh Sách Học Viên */}
        <div className="bg-white shadow-md rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Tên Học Viên</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Số Điện Thoại</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Tiến Độ</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Hoạt Động Cuối</th>
                <th className="p-4 text-center text-sm font-semibold text-gray-700">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        {student.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-800">{student.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{student.email}</td>
                  <td className="p-4 text-gray-600">{student.phone}</td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <span className="mr-2 text-sm text-gray-600">{student.overallProgress}%</span>
                      {renderProgressBar(student.overallProgress)}
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{student.lastActive}</td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => setSelectedStudent(student)}
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

        {/* Modal Chi Tiết Học Viên */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-3/4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 bg-gray-100 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  Chi Tiết Học Viên: {selectedStudent.name}
                </h2>
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-3 gap-6">
                  {/* Thông Tin Cá Nhân */}
                  <div className="bg-white shadow-md rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Thông Tin Cá Nhân</h3>
                    <p><strong>Tên:</strong> {selectedStudent.name}</p>
                    <p><strong>Email:</strong> {selectedStudent.email}</p>
                    <p><strong>Điện Thoại:</strong> {selectedStudent.phone}</p>
                  </div>

                  {/* Tiến Độ Tổng Quan */}
                  <div className="bg-white shadow-md rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Tiến Độ Học Tập</h3>
                    <p><strong>Tổng Tiến Độ:</strong> {selectedStudent.overallProgress}%</p>
                    {renderProgressBar(selectedStudent.overallProgress)}
                    <div className="mt-4">
                      <p><strong>Khóa Đang Học:</strong> {selectedStudent.currentCourses}</p>
                      <p><strong>Khóa Hoàn Thành:</strong> {selectedStudent.completedCourses}</p>
                    </div>
                  </div>

                  {/* Chi Tiết Khóa Học */}
                  <div className="bg-white shadow-md rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Chi Tiết Khóa Học</h3>
                    {selectedStudent.coursesDetails.map((course, index) => (
                      <div key={index} className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{course.name}</span>
                          <span className="text-sm text-gray-600">{course.status}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2 text-sm text-gray-600">{course.progress}%</span>
                          {renderProgressBar(course.progress)}
                        </div>
                      </div>
                    ))}
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

export default StudentProgressManagementPage;