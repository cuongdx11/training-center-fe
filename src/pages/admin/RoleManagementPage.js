import React, { useState, useEffect } from 'react';
import { roleService  } from '../../services/roleService';
import {permissionService} from '../../services/permissionService';
import {rolePermissionService} from '../../services/rolePermissionService';

const RoleManagementPage = () => {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [newRole, setNewRole] = useState({ name: '', description: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [rolesData, permissionsData] = await Promise.all([
                roleService.getAllRoles(),
                permissionService.getAllPermissions()
            ]);
            setRoles(rolesData);
            setPermissions(permissionsData);
        } catch (err) {
            setError('Failed to fetch data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddRole = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await roleService.addRole(newRole);
            setNewRole({ name: '', description: '' });
            setIsModalOpen(false);
            await fetchInitialData();
        } catch (err) {
            setError('Failed to add role');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePermissionChange = async (roleId, permissionId, checked) => {
        try {
            setLoading(true);
            if (checked) {
                await rolePermissionService.addPermissionToRole(roleId, permissionId);
            } else {
                await rolePermissionService.removePermissionFromRole(`${roleId}-${permissionId}`);
            }
            await fetchInitialData();
        } catch (err) {
            setError('Failed to update permissions');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Error Alert */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Role Management</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Add New Role
                </button>
            </div>

            {/* Roles Table */}
            <div className="bg-white shadow rounded-lg mb-6">
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Description</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {roles.map((role) => (
                            <tr key={role.id}>
                                <td className="px-6 py-4 text-sm text-gray-900">{role.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{role.description}</td>
                                <td className="px-6 py-4 text-sm">
                                    <button
                                        onClick={() => setSelectedRole(role)}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        Manage Permissions
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Role Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Add New Role</h2>
                        <form onSubmit={handleAddRole}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    value={newRole.name}
                                    onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <input
                                    type="text"
                                    value={newRole.description}
                                    onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                                >
                                    {loading ? 'Adding...' : 'Add Role'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Permissions Management Modal */}
            {selectedRole && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-[800px]">
                        <h2 className="text-xl font-bold mb-4">
                            Manage Permissions for {selectedRole.name}
                        </h2>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            {permissions.map((permission) => (
                                <div key={permission.id} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedRole.permissions?.includes(permission.id)}
                                        onChange={(e) => handlePermissionChange(
                                            selectedRole.id,
                                            permission.id,
                                            e.target.checked
                                        )}
                                        className="rounded border-gray-300"
                                    />
                                    <span className="text-sm">{permission.name}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setSelectedRole(null)}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-white">Loading...</div>
                </div>
            )}
        </div>
    );
};

export default RoleManagementPage;