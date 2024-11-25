import React, { useState, useEffect } from 'react';
import { roleService } from '../../services/roleService';
import { permissionService } from '../../services/permissionService';
import { rolePermissionService } from '../../services/rolePermissionService';

const RoleManagementPage = () => {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [newRole, setNewRole] = useState({ name: '', description: '' });
    const [newPermission, setNewPermission] = useState({ name: '', description: '' });
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('roles');

    // Fetch initial data
    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [rolesResponse, permissionsResponse] = await Promise.all([
                roleService.getAllRoles(),
                permissionService.getAllPermissions()
            ]);
            setRoles(rolesResponse);
            setPermissions(permissionsResponse);
        } catch (err) {
            setError('Failed to fetch data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchInitialData();
    }, []);

    // Add new role
    const handleAddRole = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await roleService.addRole(newRole);
            setNewRole({ name: '', description: '' });
            setIsRoleModalOpen(false);
            await fetchInitialData();
        } catch (err) {
            setError('Failed to add role');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Add new permission
    const handleAddPermission = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await permissionService.addPermission(newPermission);
            setNewPermission({ name: '', description: '' });
            setIsPermissionModalOpen(false);
            await fetchInitialData();
        } catch (err) {
            setError('Failed to add permission');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Manage role permissions
    const handlePermissionChange = async (roleId, permissionId, checked) => {
        try {
            setLoading(true);
            if (checked) {
                await rolePermissionService.addPermissionToRole(roleId, permissionId);
            } else {
                await rolePermissionService.removePermissionFromRole(roleId, permissionId);
            }
            await fetchInitialData();
        } catch (err) {
            setError('Failed to update permissions');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Delete role
    const handleDeleteRole = async (roleId) => {
        try {
            setLoading(true);
            await roleService.deleteRole(roleId);
            await fetchInitialData();
        } catch (err) {
            setError('Failed to delete role');
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

            {/* Tabs */}
            <div className="flex mb-6">
                <button
                    onClick={() => setActiveTab('roles')}
                    className={`px-4 py-2 mr-2 ${activeTab === 'roles' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Roles
                </button>
                <button
                    onClick={() => setActiveTab('permissions')}
                    className={`px-4 py-2 ${activeTab === 'permissions' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Permissions
                </button>
            </div>

            {/* Roles Management */}
            {activeTab === 'roles' && (
                <>
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Role Management</h1>
                        <button
                            onClick={() => setIsRoleModalOpen(true)}
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
                                        <td className="px-6 py-4 text-sm flex space-x-2">
                                            <button
                                                onClick={() => setSelectedRole(role)}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                Manage Permissions
                                            </button>
                                            <button
                                                onClick={() => handleDeleteRole(role.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Permissions Management */}
            {activeTab === 'permissions' && (
                <>
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Permission Management</h1>
                        <button
                            onClick={() => setIsPermissionModalOpen(true)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                        >
                            Add New Permission
                        </button>
                    </div>

                    {/* Permissions Table */}
                    <div className="bg-white shadow rounded-lg">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Description</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {permissions.map((permission) => (
                                    <tr key={permission.id}>
                                        <td className="px-6 py-4 text-sm text-gray-900">{permission.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{permission.description}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <button className="text-blue-500 hover:text-blue-700 mr-2">
                                                Edit
                                            </button>
                                            <button className="text-red-500 hover:text-red-700">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Add Role Modal */}
            {isRoleModalOpen && (
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
                                    onClick={() => setIsRoleModalOpen(false)}
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

            {/* Add Permission Modal */}
            {isPermissionModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Add New Permission</h2>
                        <form onSubmit={handleAddPermission}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    value={newPermission.name}
                                    onChange={(e) => setNewPermission({ ...newPermission, name: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    value={newPermission.description}
                                    onChange={(e) => setNewPermission({ ...newPermission, description: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsPermissionModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                                >
                                    {loading ? 'Adding...' : 'Add Permission'}
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
                                        checked={selectedRole.permissions?.some(p => p.id === permission.id)}
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