import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Cake,
  Edit,
  Camera,
  UserCircle
} from 'lucide-react';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import userService from '../../services/userService';

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userService.getProfileUser();
        setProfile(response);
        setEditedProfile(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      await userService.uploadAvatar(formData);
      const response = await userService.getProfileUser();
      setProfile(response);
      toast.success("Cập nhật ảnh đại diện thành công!");
    } catch (err) {
      setError('Không thể tải lên ảnh đại diện');
      toast.error("Không thể tải lên ảnh đại diện");
    }
  };

  const handleInputChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const profileData = {
        fullName: editedProfile.fullName,
        email: editedProfile.email,
        gender: editedProfile.gender || null,
        birthDate: editedProfile.birthDate ? new Date(editedProfile.birthDate).toISOString().split('T')[0] : null,
        phoneNumber: editedProfile.phoneNumber || null,
        address: editedProfile.address || null,
        bio: editedProfile.bio || null
      };

      await userService.updateProfileUser(profileData);
      const response = await userService.getProfileUser();
      setProfile(response);
      setIsEditing(false);
      toast.success("Cập nhật thông tin thành công!");
    } catch (err) {
      setError('Không thể cập nhật thông tin');
      toast.error("Không thể cập nhật thông tin");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-600">Có lỗi xảy ra: {error}</div>
      </div>
    );
  }

  const renderValue = (isEditing, field, type = 'text') => {
    if (!isEditing) return profile[field] || 'Chưa cập nhật';

    const value = editedProfile[field] || '';
    
    if (type === 'gender') {
      return (
        <select
          value={value}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="w-full border rounded-md px-2 py-1"
        >
          <option value="">Chọn giới tính</option>
          <option value="MALE">Nam</option>
          <option value="FEMALE">Nữ</option>
        </select>
      );
    }

    if (type === 'date') {
      return (
        <input
          type="date"
          value={value ? new Date(value).toISOString().split('T')[0] : ''}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="w-full border rounded-md px-2 py-1"
        />
      );
    }

    return (
      <input
        type={type}
        value={value}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className="w-full border rounded-md px-2 py-1"
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-600 relative">
            {/* <button className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg">
              <Camera className="w-5 h-5 text-gray-600" />
            </button> */}
          </div>
          
          {/* Profile Info */}
          <div className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="absolute -top-16 left-6">
              <div className="relative">
                {profile.profilePicture ? (
                  <img 
                    src={profile.profilePicture}
                    alt="Profile" 
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                    <UserCircle className="w-20 h-20 text-gray-400" />
                  </div>
                )}
                <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                  />
                  <Camera className="w-4 h-4 text-gray-600" />
                </label>
              </div>
            </div>
            
            {/* Name and Bio */}
            <div className="pt-20">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{profile.fullName}</h1>
                  {isEditing ? (
                    <textarea
                      value={editedProfile.bio || ''}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="w-full mt-2 border rounded-md px-2 py-1"
                      rows="2"
                    />
                  ) : (
                    <p className="text-gray-600">{profile.bio}</p>
                  )}
                </div>
                {isEditing ? (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIsEditing(false)} 
                      className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                      Hủy
                    </button>
                    <button 
                      onClick={handleSaveProfile}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Edit className="w-4 h-4" />
                      Lưu
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Edit className="w-4 h-4" />
                    Chỉnh sửa
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Information Card */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Thông tin cá nhân</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Họ và tên</p>
                  <div className="text-gray-900">
                    {renderValue(isEditing, 'fullName')}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Số điện thoại</p>
                  <div className="text-gray-900">
                    {renderValue(isEditing, 'phoneNumber', 'tel')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Địa chỉ</p>
                  <div className="text-gray-900">
                    {renderValue(isEditing, 'address')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Cake className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Ngày sinh</p>
                  <div className="text-gray-900">
                    {isEditing ? (
                      renderValue(isEditing, 'birthDate', 'date')
                    ) : (
                      profile.birthDate ? 
                        new Date(profile.birthDate).toLocaleDateString('vi-VN') : 
                        'Chưa cập nhật'
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Giới tính</p>
                  <div className="text-gray-900">
                    {isEditing ? (
                      renderValue(isEditing, 'gender', 'gender')
                    ) : (
                      profile.gender === 'MALE' ? 'Nam' : 
                      profile.gender === 'FEMALE' ? 'Nữ' : 
                      'Chưa cập nhật'
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;