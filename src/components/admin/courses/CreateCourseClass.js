import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { addClass } from '../../../services/courseClassService';
import { getCourses } from '../../../services/coursesService';

const CreateCourseClass = () => {
  const [formData, setFormData] = useState({
    name: '',
    courseId: '',
    startDate: '',
    endDate: '',
    studyTime: '',
    studyDays: '',
    status: 'ACTIVE'
  });
  
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await getCourses();
        setCourses(coursesData);
      } catch (err) {
        setError('Không thể tải danh sách khóa học. Vui lòng thử lại sau.');
      }
    };

    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await addClass(formData);

      if (!response.ok) {
        throw new Error('Failed to create class');
      }

      setSuccess(true);
      setFormData({
        name: '',
        courseId: '',
        startDate: '',
        endDate: '',
        studyTime: '',
        studyDays: '',
        status: 'ACTIVE'
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <Calendar className="w-6 h-6 mr-2 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Tạo Lớp Học Mới</h2>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-600">Tạo lớp học thành công!</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên Lớp Học
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Khóa Học
              </label>
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Chọn khóa học</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày Bắt Đầu
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày Kết Thúc
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thời Gian Học
              </label>
              <input
                type="text"
                name="studyTime"
                value={formData.studyTime}
                onChange={handleChange}
                placeholder="Ví dụ: 19:00 - 21:00"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Các Ngày Học
              </label>
              <input
                type="text"
                name="studyDays"
                value={formData.studyDays}
                onChange={handleChange}
                placeholder="Ví dụ: Thứ 2, 4, 6"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng Thái
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ACTIVE">Đang Hoạt Động</option>
                <option value="COMPLETED">Đã Hoàn Thành</option>
                <option value="CANCELLED">Đã Hủy</option>
              </select>
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 text-white font-medium rounded-md
                  ${loading 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                  }`}
              >
                {loading ? 'Đang xử lý...' : 'Tạo Lớp Học'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourseClass;