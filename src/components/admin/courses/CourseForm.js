import React from 'react';
import { Camera } from 'lucide-react';

const CourseForm = ({ data, setData, onSubmit, onCancel, submitText }) => {
  const handleChange = (field, value) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Main Course Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-700">Thông tin cơ bản</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1 text-gray-700">Tên khóa học</label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Nhập tên khóa học"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1 text-gray-700">Mô tả</label>
            <textarea
              value={data.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-32"
              placeholder="Nhập mô tả chi tiết về khóa học..."
              required
            />
          </div>
        </div>
      </div>

      {/* Course Details */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-700">Chi tiết khóa học</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Thời lượng (Tuần)</label>
            <input
              type="number"
              value={data.duration}
              onChange={(e) => handleChange('duration', e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="VD: 8"
              required
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Cấp độ</label>
            <select
              value={data.level}
              onChange={(e) => handleChange('level', e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            >
              <option value="BEGINNER">Cơ bản</option>
              <option value="INTERMEDIATE">Trung cấp</option>
              <option value="ADVANCED">Nâng cao</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Giá (VNĐ)</label>
            <input
              type="number"
              value={data.price}
              onChange={(e) => handleChange('price', e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Nhập giá khóa học"
              required
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Thumbnail */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-700">Ảnh khóa học</h3>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <Camera className="w-4 h-4 text-gray-500" />
              <label className="block text-sm font-medium text-gray-700">Ảnh thumbnail</label>
            </div>
            <input
              type="text"
              value={data.thumbnail}
              onChange={(e) => handleChange('thumbnail', e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Nhập URL ảnh thumbnail"
              required
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
        >
          {submitText}
        </button>
      </div>
    </form>
  );
};

export default CourseForm;