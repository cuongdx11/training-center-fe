import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import userService from '../services/userService';
import { toast } from 'react-hot-toast';

const PersonalInfo = ({ userInfo, onUpdateSuccess, onAvatarUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...userInfo });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Ảnh không được vượt quá 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Chỉ chấp nhận file ảnh định dạng JPG, JPEG hoặc PNG');
      return;
    }

    try {
      setUploadingAvatar(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await userService.uploadAvatar(formData)

      if (response) {
        onAvatarUpdate(response);
        toast.success('Cập nhật ảnh đại diện thành công');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Không thể cập nhật ảnh đại diện');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onUpdateSuccess(formData);
    setIsEditing(false);
  };

  const fieldConfigs = [
    { label: 'Họ và tên', name: 'fullName', type: 'text', required: true },
    { label: 'Email', name: 'email', type: 'email', required: true },
    { label: 'Số điện thoại', name: 'phoneNumber', type: 'tel' },
    { label: 'Giới thiệu', name: 'bio', type: 'textarea' },
    { label: 'Địa chỉ', name: 'address', type: 'text' },
    { label: 'Giới tính', name: 'gender', type: 'select', options: [
      { value: 'MALE', label: 'Nam' },
      { value: 'FEMALE', label: 'Nữ' },
      { value: 'OTHER', label: 'Khác' }
    ]},
    { label: 'Ngày sinh', name: 'birthDate', type: 'date' }
  ];

  const renderField = (field) => {
    if (isEditing) {
      switch (field.type) {
        case 'textarea':
          return (
            <textarea
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleInputChange}
              className="w-full md:w-2/3 border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              rows="3"
            />
          );
        case 'select':
          return (
            <select
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleInputChange}
              className="w-full md:w-2/3 border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="">Chọn giới tính</option>
              {field.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );
        default:
          return (
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleInputChange}
              required={field.required}
              className="w-full md:w-2/3 border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            />
          );
      }
    }
    return (
      <span className="text-gray-800">
        {formData[field.name] || 'Chưa cập nhật'}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Thông tin cá nhân</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Chỉnh sửa
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center md:items-start mb-6">
          <div className="relative">
            <img
              src={userInfo.profilePicture || '/default-avatar.png'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-avatar.png';
              }}
            />
            <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition">
              {uploadingAvatar ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Camera className="h-4 w-4 text-white" />
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={uploadingAvatar}
                  />
                </>
              )}
            </label>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Nhấp vào biểu tượng camera để thay đổi ảnh đại diện
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {fieldConfigs.map((field) => (
            <div key={field.name} className="flex flex-col md:flex-row md:items-center py-3 border-b">
              <span className="text-gray-600 w-full md:w-1/3 mb-2 md:mb-0">
                {field.label}
              </span>
              <div className="w-full md:w-2/3">
                {renderField(field)}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setFormData({ ...userInfo });
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Lưu thay đổi
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PersonalInfo;