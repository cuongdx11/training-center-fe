import React, { useState } from 'react';
import { PencilIcon, TrashIcon, LockIcon, UnlockIcon, SearchIcon, FilterIcon, ChevronUpIcon, UserIcon, PhoneIcon, MapPinIcon } from 'lucide-react';
import { format } from 'date-fns';

const UserTable = ({ users, onEdit, onDelete, onToggleLock }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch {
      return '-';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.isEnabled) ||
                         (statusFilter === 'inactive' && !user.isEnabled);
    return matchesSearch && matchesStatus;
  });

  // Status Component
  const StatusIndicator = ({ isEnabled }) => (
    <div className="flex items-center gap-2">
      <div className={`w-2.5 h-2.5 rounded-full ${isEnabled ? 'bg-green-500' : 'bg-gray-300'}`} />
      <span className={`text-sm font-medium ${isEnabled ? 'text-green-700' : 'text-gray-600'}`}>
        {isEnabled ? 'Active' : 'Inactive'}
      </span>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="relative flex-1 min-w-[300px]">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
          <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FilterIcon className="w-5 h-5" />
            <span>Filter</span>
          </button>
          
          {showFilters && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <div className="p-2">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Status</h3>
                <div className="space-y-2">
                  {['all', 'active', 'inactive'].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setShowFilters(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        statusFilter === status
                          ? 'bg-blue-50 text-blue-700'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">User Info</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                    <PhoneIcon className="w-5 h-5 text-purple-500" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                    <ChevronUpIcon className="w-5 h-5 text-green-500" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                    <MapPinIcon className="w-5 h-5 text-orange-500" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</span>
                </div>
              </th>
              <th className="px-6 py-4 text-right">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img
                      className="h-12 w-12 rounded-lg object-cover ring-2 ring-gray-100"
                      src={user.profilePicture || "/api/placeholder/48/48"}
                      alt={user.fullName}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">{user.fullName}</span>
                      <span className="text-sm text-gray-500">{user.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-gray-600">
                      <PhoneIcon className="w-4 h-4" />
                      <span className="text-sm">{user.phoneNumber || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 mt-1">
                      <MapPinIcon className="w-4 h-4" />
                      <span className="text-sm">{user.address || '-'}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-2">
                    <StatusIndicator isEnabled={user.isEnabled} />
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="text-xs">Created:</span>
                      <span className="text-xs font-medium">{formatDate(user.createdAt)}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {user.roles.map((role) => (
                      <span
                        key={role.id}
                        className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700"
                      >
                        {role.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Edit user"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onToggleLock(user)}
                      className={`p-2 rounded-lg transition-all ${
                        user.isLocked 
                          ? 'text-gray-500 hover:text-red-600 hover:bg-red-50' 
                          : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                      }`}
                      title={user.isLocked ? 'Unlock user' : 'Lock user'}
                    >
                      {user.isLocked ? <LockIcon className="w-5 h-5" /> : <UnlockIcon className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete user"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;