// src/components/admin/UserRoleManagement.js
import React, { useState, useEffect } from 'react';
import  userService  from '../../services/userService';
import { roleService } from '../../services/roleService';
import { userRoleService } from '../../services/userRoleService';


const UserRoleManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [usersData, rolesData] = await Promise.all([
                userService.getAllUsers(),
                roleService.getAllRoles()
            ]);
            setUsers(usersData);
            setRoles(rolesData);
        } catch (err) {
            setError('Failed to fetch data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, roleId, checked) => {
        try {
            setLoading(true);
            if (checked) {
                await userRoleService.assignRoleToUser(userId, roleId);
            } else {
                await userRoleService.removeRoleFromUser(userId, roleId);
            }
            
            // Refresh user roles
            const updatedUserRoles = await userService.getUserRoles(userId);
            setUsers(users.map(user => 
                user.id === userId 
                    ? { ...user, roles: updatedUserRoles }
                    : user
            ));
        } catch (err) {
            setError('Failed to update user roles');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user => 
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Error Alert */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
                    <span className="block sm:inline">{error}</span>
                    <button 
                        className="absolute top-0 right-0 px-4 py-3"
                        onClick={() => setError('')}
                    >
                        <span className="text-xl">&times;</span>
                    </button>
                </div>
            )}

            {/* Header and Search */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-4">User Role Management</h1>
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Current Roles
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
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
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <button
                                        onClick={() => setSelectedUser(user)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Manage Roles
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Manage Roles Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="relative bg-white rounded-lg shadow-xl mx-auto p-6 w-[600px]">
                        <h2 className="text-xl font-bold mb-4">
                            Manage Roles for {selectedUser.fullName}
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
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
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
                                className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
            )}
        </div>
    );
};

export default UserRoleManagementPage;