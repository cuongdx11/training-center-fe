import React, { useState, useEffect } from 'react';
import { UserPlusIcon } from 'lucide-react';
import Modal from '../../components/admin/users/Modal';
import UserForm from '../../components/admin/users/UserForm';
import UserTable from '../../components/admin/users/UserTable';
import userService from '../../services/userService';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialFormData = {
  email: '',
  fullName: '',
  phoneNumber: '',
  address: '',
  bio: '',
  birthDate: '',
  gender: '',
  roleIds: []
};

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState({ show: false, type: null });
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
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

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, pagination.size, filters, sortConfig]);

  useEffect(() => {
    if (!showModal.show) {
      setTimeout(() => {
        setFormData(initialFormData);
        setSelectedUser(null);
      }, 300);
    }
  }, [showModal.show]);

  const buildCriteria = () => {
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
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const criteria = buildCriteria();
      const response = await userService.getUsersWithFilters({
        criteria,
        page: pagination.page,
        size: pagination.size,
        sortBy: sortConfig.sortBy,
        sortDirection: sortConfig.sortDirection
      });

      setUsers(response.content);
      setPagination(prev => ({
        ...prev,
        totalElements: response.totalElements,
        totalPages: response.totalPages
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage, newSize) => {
    
    setPagination(prev => ({
      ...prev,
      page: newPage,
      size: newSize
    }));
    
  };
  

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 0 })); // Reset to first page
  };

  const handleSortChange = (field) => {
    setSortConfig(prev => ({
      sortBy: field,
      sortDirection: prev.sortBy === field && prev.sortDirection === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (selectedUser) {
        // Update user
        await userService.updateUser(selectedUser.id, formData);
        toast.success('Cập nhật người dùng thành công!');
      } else {
        // Add new user
        await userService.addUser(formData);
        toast.success('Thêm người dùng mới thành công!');
      }
  
      await fetchUsers(); // Tải lại danh sách người dùng
      setShowModal({ show: false, type: null });
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error('Đã xảy ra lỗi khi lưu thông tin người dùng.');
      // Thêm thông báo lỗi nếu cần
    } finally {
      setLoading(false);
    }
  };
  

  const handleDelete = async (userId) => {
    if (window.confirm('Bạn muốn xóa user này không?')) {
      try {
        setLoading(true);
        const response = await userService.deleteUser(userId);
        console.log(response);
        if (response === true) {
          await fetchUsers();
          // Show success toast notification
          toast.success('Xóa người dùng thành công!');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        // Show error toast notification
        toast.error('Đã xảy ra lỗi khi xóa người dùng.');
      } finally {
        setLoading(false);
      }
    }
  };
  const handleToggleLock = async (user) => {
    try {
      setLoading(true);
      const blockUserRequest = {
        userId: user.id,
        blocked: !user.isLocked 
      };
      const response = await userService.blockUser(blockUserRequest); // Gọi API block user
      if (response) {
        await fetchUsers();
        toast.success(user.isLocked ? 'Mở khóa người dùng thành công!' : 'Khóa người dùng thành công!');
      } else {
        console.error('Failed to toggle lock state');
        toast.error('Không thể thay đổi trạng thái khóa.');
      }
    } catch (error) {
      console.error('Error toggling lock state:', error);
      toast.error('Đã xảy ra lỗi khi thay đổi trạng thái khóa.');
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      address: user.address,
      bio: user.bio,
      profilePicture: user.profilePicture,
      birthDate: user.birthDate,
      gender: user.gender
    });
    setShowModal({ show: true, type: 'edit' });
  };

  const handleAddUser = () => {
    setShowModal({ show: true, type: 'add' });
  };

  const handleCloseModal = () => {
    setShowModal({ show: false, type: null });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 transition-all duration-300">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg transition-shadow hover:shadow-xl">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
              <button
                onClick={handleAddUser}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <UserPlusIcon className="w-5 h-5 mr-2" />
                Thêm Người dùng mới
              </button>
            </div>

            <UserTable
              users={users}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleLock={handleToggleLock}
              pagination={pagination}
              onPageChange={handlePageChange}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              sortConfig={sortConfig}
              onSortChange={handleSortChange}
            />
          </div>
        </div>
      </div>

      <Modal
        show={showModal.show}
        onClose={handleCloseModal}
        title={showModal.type === 'add' ? 'Thêm Người dùng mới' : 'Chỉnh sửa thông tin'}
      >
        <UserForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          selectedUser={selectedUser}
          isSubmitting={loading}
        />
      </Modal>
    </div>
  );
};

export default UserManagementPage;