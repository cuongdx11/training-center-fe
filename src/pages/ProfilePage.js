import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import PersonalInfo from '../components/PersonalInfo';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';

const ProfilePage = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (!user?.id) return;
            
            try {
                setLoading(true);
                setError(null);
                // const data = await userService.getUserById(user.id);
                const data = await userService.getProfileUser();
                setUserInfo(data);
            } catch (error) {
                setError(error.message || 'Có lỗi xảy ra khi tải thông tin người dùng');
                console.error('Error fetching user info:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [user?.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500 bg-red-100 p-4 rounded-lg">
                    <h3 className="font-semibold">Lỗi</h3>
                    <p>{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    if (!userInfo) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">Không tìm thấy thông tin người dùng</div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="hidden md:block">
                <Sidebar 
                    userName={userInfo.fullName} 
                    userImage={userInfo.profilePicture} 
                />
            </div>
            <div className="flex-1 p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="md:hidden mb-6">
                        <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow">
                            <img
                                src={userInfo.profilePicture || '/default-avatar.png'}
                                alt={userInfo.fullName}
                                className="w-16 h-16 rounded-full"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/default-avatar.png';
                                }}
                            />
                            <div>
                                <h2 className="text-xl font-semibold">{userInfo.fullName}</h2>
                                <p className="text-gray-500">{userInfo.email}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow">
                        <PersonalInfo 
                            userInfo={userInfo}
                            onUpdateSuccess={(updatedInfo) => setUserInfo(updatedInfo)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;