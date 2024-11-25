import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, ChevronDown } from 'lucide-react';

const CourseForm = ({ data, setData, onSubmit, onCancel, submitText, categories, instructors }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Set initial preview if thumbnail exists
    if (data.thumbnail && typeof data.thumbnail === 'string') {
      setPreviewUrl(data.thumbnail);
    }
  }, [data.thumbnail]);

  const handleChange = (field, value) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleChange('thumbnail', file);
      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert data to FormData for multipart/form-data submission
    const formData = new FormData();
    
    // Append all form fields
    Object.keys(data).forEach(key => {
      if (key === 'instructorIds' && Array.isArray(data[key])) {
        data[key].forEach(id => formData.append('instructorIds', id));
      } else if (key !== 'thumbnail' || (key === 'thumbnail' && data[key] instanceof File)) {
        formData.append(key, data[key]);
      }
    });

    onSubmit(formData);
  };

  const handleRemoveImage = () => {
    handleChange('thumbnail', null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const selectedInstructors = instructors?.filter(instructor => 
    data.instructorIds?.includes(instructor.id)
  ) || [];

  const toggleInstructor = (instructorId) => {
    const currentIds = data.instructorIds || [];
    const newIds = currentIds.includes(instructorId)
      ? currentIds.filter(id => id !== instructorId)
      : [...currentIds, instructorId];
    handleChange('instructorIds', newIds);
  };

  const removeInstructor = (instructorId) => {
    const newIds = (data.instructorIds || []).filter(id => id !== instructorId);
    handleChange('instructorIds', newIds);
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

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Danh mục</label>
            <select
              value={data.categoryId}
              onChange={(e) => handleChange('categoryId', e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            >
              <option value="">Chọn danh mục</option>
              {categories?.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-medium mb-1 text-gray-700">Giảng viên</label>
            <div className="min-h-[42px] p-1.5 border rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
              <div className="flex flex-wrap gap-1">
                {selectedInstructors.map(instructor => (
                  <span 
                    key={instructor.id}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                  >
                    {instructor.fullName}
                    <button
                      type="button"
                      onClick={() => removeInstructor(instructor.id)}
                      className="hover:text-blue-600"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-800"
                >
                  <span className="sr-only">Toggle instructor selection</span>
                  <ChevronDown size={20} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <div className="p-2">
                  {instructors?.map(instructor => (
                    <div
                      key={instructor.id}
                      onClick={() => toggleInstructor(instructor.id)}
                      className={`
                        flex items-center gap-2 p-2 rounded cursor-pointer
                        ${data.instructorIds?.includes(instructor.id) 
                          ? 'bg-blue-50 text-blue-800' 
                          : 'hover:bg-gray-50'
                        }
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={data.instructorIds?.includes(instructor.id)}
                        onChange={() => {}}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300"
                      />
                      <span>{instructor.fullName}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

      {/* Thumbnail Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-700">Ảnh khóa học</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-1">
            <Camera className="w-4 h-4 text-gray-500" />
            <label className="block text-sm font-medium text-gray-700">Ảnh thumbnail</label>
          </div>
          
          {previewUrl ? (
            <div className="relative w-48 h-32">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full hover:bg-red-200"
              >
                <X className="w-4 h-4 text-red-600" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-48 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500"
            >
              <Camera className="w-8 h-8 text-gray-400" />
              <span className="mt-2 text-sm text-gray-500">Click to upload</span>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
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