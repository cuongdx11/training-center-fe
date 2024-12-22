import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail } from 'lucide-react';
import userService from '../services/userService';

const UsersPage = () => {
    const [usersData, setUsersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await userService.getInstructors();
                setUsersData(response);
            } catch (err) {
                setError('Không thể tải danh sách người dùng');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-50 p-6 rounded-lg shadow-sm">
                    <h3 className="text-red-800 font-medium text-lg">Đã xảy ra lỗi</h3>
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 bg-gray-50">
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Danh Sách Giảng Viên</h1>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Khám phá đội ngũ giảng viên chất lượng cao, giàu kinh nghiệm, sẵn sàng đồng hành và giúp bạn phát triển kỹ năng để đạt được mục tiêu của mình.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {usersData.map((user) => (
                    <div key={user.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col h-full cursor-pointer">
                        <div className="relative">
                            <img
                                src={user.profilePicture}
                                alt={user.fullName}
                                className="h-48 w-full object-cover"
                            />
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            <h2 className="text-xl font-bold text-gray-800">{user.fullName}</h2>
                            <p className="text-gray-600 mb-2">
                                <Mail className="inline-block w-4 h-4 mr-1 text-blue-500" />
                                {user.email}
                            </p>
                            <p className="text-gray-600 mb-4">{user.bio || 'Không có mô tả'}</p>
                            <p className="text-sm text-gray-500">
                                <ShieldCheck className="inline-block w-4 h-4 mr-1 text-green-500" />
                                {user.roles.map((role) => role.name).join(', ')}
                            </p>
                            <Link
                                to={`/instructors/${user.id}`}
                                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg text-center hover:bg-blue-700"
                            >
                                Xem Chi Tiết
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UsersPage;
