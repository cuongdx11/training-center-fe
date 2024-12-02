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

import userService from '../../services/userService';

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userService.getProfileUser();
        setProfile(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-600 relative">
            <button className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg">
              <Camera className="w-5 h-5 text-gray-600" />
            </button>
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
                <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md">
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
            
            {/* Name and Bio */}
            <div className="pt-20">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{profile.fullName}</h1>
                  <p className="text-gray-600">{profile.bio}</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Edit className="w-4 h-4" />
                  Chỉnh sửa
                </button>
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
                  <p className="text-gray-900">{profile.fullName}</p>
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
                  <p className="text-gray-900">{profile.phoneNumber || 'Chưa cập nhật'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Địa chỉ</p>
                  <p className="text-gray-900">{profile.address || 'Chưa cập nhật'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Cake className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Ngày sinh</p>
                  <p className="text-gray-900">
                    {profile.birthDate ? new Date(profile.birthDate).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Giới tính</p>
                  <p className="text-gray-900">{profile.gender || 'Chưa cập nhật'}</p>
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