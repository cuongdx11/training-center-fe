import React, { useState, useEffect, useCallback } from 'react';
import userService from '../../services/userService';
import { roleService } from '../../services/roleService';
import { userRoleService } from '../../services/userRoleService';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserRoleManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 5,
        totalElements: 0,
        totalPages: 0
    });
    const [filters, setFilters] = useState({
        fullName: '',
        gender: '',
        roleNames: [],
        status: ''
    });
    const [sortConfig, setSortConfig] = useState({
        sortBy: 'createdAt',
        sortDirection: 'desc'
    });

    const buildCriteria = useCallback(() => {
        const criteriaArray = [];
        
        if (filters.fullName) {
            criteriaArray.push(`fullName,:,${filters.fullName}`);
        }
        if (filters.gender) {
            criteriaArray.push(`gender,:,${filters.gender}`);
        }
        if (filters.roleNames.length > 0) {
            filters.roleNames.forEach(role => {
                criteriaArray.push(`roles.name,:,${role}`);
            });
        }
        if (filters.status) {
            criteriaArray.push(`isEnabled,:,${filters.status === 'active'}`);
        }

        return criteriaArray.join(';');
    }, [filters]);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const criteria = buildCriteria();
            const [usersResponse, rolesData] = await Promise.all([
                userService.getUsersWithFilters({
                    criteria,
                    page: pagination.page,
                    size: pagination.size,
                    sortBy: sortConfig.sortBy,
                    sortDirection: sortConfig.sortDirection
                }),
                roleService.getAllRoles()
            ]);

            setUsers(usersResponse.content);
            setRoles(rolesData);
            setPagination(prev => ({
                ...prev,
                totalElements: usersResponse.totalElements,
                totalPages: usersResponse.totalPages
            }));
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Đã xảy ra lỗi khi tải dữ liệu.');
        } finally {
            setLoading(false);
        }
    }, [buildCriteria, pagination.page, pagination.size, sortConfig.sortBy, sortConfig.sortDirection]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleRoleChange = async (userId, roleId, checked) => {
        try {
            setLoading(true);
            if (checked) {
                await userRoleService.assignRoleToUser(userId, roleId);
                toast.success('Gán vai trò thành công!');
            } else {
                await userRoleService.removeRoleFromUser(userId, roleId);
                toast.success('Hủy vai trò thành công!');
            }
            
            await fetchUsers();
        } catch (error) {
            console.error('Error updating user roles:', error);
            toast.error('Đã xảy ra lỗi khi cập nhật vai trò.');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage, newSize) => {
        setPagination(prev => ({
            ...prev,
            page: newPage,
            size: newSize || prev.size
        }));
    };

    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters);
        setPagination(prev => ({ ...prev, page: 0 }));
    };

    const handleSortChange = (field) => {
        setSortConfig(prev => ({
            sortBy: field,
            sortDirection: prev.sortBy === field && prev.sortDirection === 'asc' ? 'desc' : 'asc'
        }));
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 transition-all duration-300">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg transition-shadow hover:shadow-xl">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">Quản lý Vai trò người dùng</h1>
                        </div>

                        {/* Filters Section */}
                        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên..."
                                value={filters.fullName}
                                onChange={(e) => handleFiltersChange({ ...filters, fullName: e.target.value })}
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            
                            <select
                                value={filters.gender}
                                onChange={(e) => handleFiltersChange({ ...filters, gender: e.target.value })}
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Tất cả giới tính</option>
                                <option value="MALE">Nam</option>
                                <option value="FEMALE">Nữ</option>
                                <option value="OTHER">Khác</option>
                            </select>

                            <select
                                value={filters.roleNames[0] || ''} 
                                onChange={(e) => {
                                    const selectedRole = e.target.value;
                                    handleFiltersChange({
                                        ...filters,
                                        roleNames: selectedRole ? [selectedRole] : [],
                                    });
                                }}
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Tất cả vai trò</option>
                                {roles.map(role => (
                                    <option key={role.id} value={role.name}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>


                            <select
                                value={filters.status}
                                onChange={(e) => handleFiltersChange({ ...filters, status: e.target.value })}
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Tất cả trạng thái</option>
                                <option value="active">Đang hoạt động</option>
                                <option value="inactive">Không hoạt động</option>
                            </select>
                        </div>

                        {/* Users Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th 
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSortChange('fullName')}
                                        >
                                            Người dùng
                                            {sortConfig.sortBy === 'fullName' && (
                                                <span className="ml-1">
                                                    {sortConfig.sortDirection === 'asc' ? '↑' : '↓'}
                                                </span>
                                            )}
                                        </th>
                                        <th 
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSortChange('email')}
                                        >
                                            Email
                                            {sortConfig.sortBy === 'email' && (
                                                <span className="ml-1">
                                                    {sortConfig.sortDirection === 'asc' ? '↑' : '↓'}
                                                </span>
                                            )}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Vai trò hiện tại
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.fullName}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles?.map(role => (
                                                        <span 
                                                            key={role.id}
                                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                        >
                                                            {role.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => setSelectedUser(user)}
                                                    className="text-blue-600 hover:text-blue-900 font-medium"
                                                >
                                                    Cập nhật vai trò
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center">
                                <select
                                    value={pagination.size}
                                    onChange={(e) => handlePageChange(0, Number(e.target.value))}
                                    className="mr-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="5">5 / trang</option>
                                    <option value="10">10 / trang</option>
                                    <option value="20">20 / trang</option>
                                    <option value="50">50 / trang</option>
                                </select>
                                <span className="text-sm text-gray-700">
                                    Hiển thị {pagination.page * pagination.size + 1} đến {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} của {pagination.totalElements} kết quả
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page === 0}
                                    className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Trước
                                </button>
                                <button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page >= pagination.totalPages - 1}
                                    className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Sau
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Role Management Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <div className="relative bg-white rounded-lg shadow-xl mx-auto p-6 w-[600px]">
                        <h2 className="text-xl font-bold mb-4">
                            Quản lý vai trò cho {selectedUser.fullName}
                        </h2>
                        <div className="space-y-3 mb-6">
                            {roles.map((role) => (
                                <div key={role.id} className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        id={`role-${role.id}`}
                                        checked={selectedUser.roles?.some(r => r.id === role.id)}
                                        onChange={(e) => handleRoleChange(
                                            selectedUser.id,
                                            role.id,
                                            e.target.checked
                                        )}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label 
                                        htmlFor={`role-${role.id}`}
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        {role.name}
                                        <span className="text-sm text-gray-500 ml-2">
                                            ({role.description})
                                        </span>
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}
    
                {/* Loading Overlay */}
                {loading && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    </div>
                )}
            </div>
        );
    };
    
    export default UserRoleManagementPage;