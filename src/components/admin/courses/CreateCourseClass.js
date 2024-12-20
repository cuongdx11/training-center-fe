import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { addClass, updateClass } from '../../../services/courseClassService';
import { getCourses } from '../../../services/coursesService';
import userService from '../../../services/userService';

const CreateCourseClass = ({ initialData, onSuccess, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    courseId: '',
    startDate: '',
    endDate: '',
    studyTime: '',
    studyDays: '',
    status: 'ACTIVE',
    instructorId: ''
  });
  
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        courseId: initialData.courseId || '',
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || '',
        studyTime: initialData.studyTime || '',
        studyDays: initialData.studyDays || '',
        status: initialData.status || 'ACTIVE',
        instructorId: initialData.instructorId || ''
      });
    }
  }, [initialData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesData, instructorsData] = await Promise.all([
          getCourses(),
          userService.getInstructors()
        ]);
        setCourses(coursesData);
        setInstructors(instructorsData);
      } catch (err) {
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      }
    };

    fetchData();
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
      if (isEditing) {
        await updateClass(initialData.id, formData);
      } else {
        await addClass(formData);
      }

      setSuccess(true);
      if (onSuccess) {
        onSuccess(formData);
      }

      if (!isEditing) {
        setFormData({
          name: '',
          courseId: '',
          startDate: '',
          endDate: '',
          studyTime: '',
          studyDays: '',
          status: 'ACTIVE',
          instructorId: ''
        });
      }
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <Calendar className="w-6 h-6 mr-2 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditing ? 'Chỉnh Sửa Lớp Học' : 'Tạo Lớp Học Mới'}
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-600">
              {isEditing ? 'Cập nhật lớp học thành công!' : 'Tạo lớp học thành công!'}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giảng Viên
            </label>
            <select
              name="instructorId"
              value={formData.instructorId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Chọn giảng viên</option>
              {instructors.map((instructor) => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.fullName}
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

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 text-gray-700 font-medium rounded-md border border-gray-300 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 text-white font-medium rounded-md
                ${loading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {loading 
                ? 'Đang xử lý...' 
                : (isEditing ? 'Cập Nhật Lớp Học' : 'Tạo Lớp Học')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourseClass;