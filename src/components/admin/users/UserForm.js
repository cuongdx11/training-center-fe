import React, { useRef, useState, useEffect } from 'react';
import { Camera, X } from 'lucide-react';
import { roleService } from '../../../services/roleService';

const UserForm = ({ formData, setFormData, onSubmit, onCancel, selectedUser }) => {
  const [roles, setRoles] = useState([]);
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    const initializeForm = () => {
      if (selectedUser && selectedUser.profilePicture) {
        setPreviewUrl(selectedUser.profilePicture);
      }
    };

    initializeForm();
  }, [selectedUser]);

  useEffect(() => {
    const loadRoles = async () => {
      if (!selectedUser) {  // Only load roles for new user creation
        try {
          const rolesData = await roleService.getAllRoles();
          setRoles(rolesData);
        } catch (error) {
          console.error('Error fetching roles:', error);
        }
      }
    };

    loadRoles();
  }, [selectedUser]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        setFormData({ ...formData, profilePicture: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl('');
    setFormData({ ...formData, profilePicture: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRoleChange = (roleId) => {
    const updatedRoles = formData.roleIds?.includes(roleId)
      ? formData.roleIds.filter(id => id !== roleId)
      : [...(formData.roleIds || []), roleId];
    
    setFormData({ ...formData, roleIds: updatedRoles });
  };

  return (
    <form onSubmit={onSubmit} className="p-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <div className="space-y-6 lg:col-span-2">
          <div className="bg-gray-50 p-6 rounded-lg space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Full Name *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  placeholder="Enter email address"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 p-6 rounded-lg space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter address"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-gray-50 p-6 rounded-lg space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Birth Date</label>
                <input
                  type="date"
                  value={formData.birthDate || ''}
                  onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Gender</label>
                <select
                  value={formData.gender || ''}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
            <div className="space-y-6">
              {selectedUser && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Camera className="w-4 h-4 text-gray-500" />
                    <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                  </div>
                  
                  {previewUrl ? (
                    <div className="relative w-full h-48">
                      <img
                        src={previewUrl}
                        alt="Profile preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full hover:bg-red-200"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500"
                    >
                      <Camera className="w-8 h-8 text-gray-400" />
                      <span className="mt-2 text-sm text-gray-500">Click to upload</span>
                    </div>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Bio</label>
                <textarea
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows="4"
                  placeholder="Write a few sentences about the user..."
                />
              </div>
              {!selectedUser && (  // Only show roles section for new user creation
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Roles *</label>
                  <div className="space-y-2">
                    {roles.map((role) => (
                      <label key={role.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={formData.roleIds?.includes(role.id)}
                          onChange={() => handleRoleChange(role.id)}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{role.name}</p>
                          <p className="text-sm text-gray-500">{role.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="mt-6 flex items-center justify-end space-x-4 border-t border-gray-200 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
        >
          {selectedUser ? 'Update' : 'Create'} User
        </button>
      </div>
    </form>
  );
};

export default UserForm;