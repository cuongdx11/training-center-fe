import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import PersonalInfo from '../components/PersonalInfo';
import userService from '../services/userService';
import Swal from 'sweetalert2';

const ProfilePage = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await userService.getProfileUser();
            setUserInfo(data);
        } catch (error) {
            setError(error.message || 'Có lỗi xảy ra khi tải thông tin người dùng');
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không thể tải thông tin người dùng',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSuccess = async (updatedInfo) => {
        try {
            const response = await userService.updateProfileUser(updatedInfo);
            setUserInfo(response);
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Cập nhật thông tin thành công',
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Cập nhật thông tin thất bại',
            });
        }
    };

    const handleAvatarUpdate = async (newAvatarUrl) => {
        setUserInfo(prev => ({
            ...prev,
            profilePicture: newAvatarUrl
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-red-500 bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="font-semibold text-xl mb-2">Đã xảy ra lỗi</h3>
                    <p className="mb-4">{error}</p>
                    <button 
                        onClick={fetchUserInfo}
                        className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                    >
                        Tải lại
                    </button>
                </div>
            </div>
        );
    }

    if (!userInfo) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-gray-500 bg-white p-6 rounded-lg shadow-lg">
                    Không tìm thấy thông tin người dùng
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar 
                userName={userInfo.fullName} 
                userImage={userInfo.profilePicture} 
            />
            <div className="flex-1 p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="md:hidden mb-6">
                        <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md">
                            <img
                                src={userInfo.profilePicture || '/default-avatar.png'}
                                alt={userInfo.fullName}
                                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/default-avatar.png';
                                }}
                            />
                            <div>
                                <h2 className="text-xl font-semibold">{userInfo.fullName}</h2>
                                <p className="text-gray-500">{userInfo.email}</p>
                                {userInfo.bio && (
                                    <p className="text-gray-600 text-sm mt-1">{userInfo.bio}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md">
                        <PersonalInfo 
                            userInfo={userInfo}
                            onUpdateSuccess={handleUpdateSuccess}
                            onAvatarUpdate={handleAvatarUpdate}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;