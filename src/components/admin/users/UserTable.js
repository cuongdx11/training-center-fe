import React, { useState } from "react";
import {
  PencilIcon,
  TrashIcon,
  LockIcon,
  UnlockIcon,
  SearchIcon,
  FilterIcon,
  ChevronUpIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { format } from "date-fns";

const UserTable = ({
  users,
  loading,
  onEdit,
  onDelete,
  onToggleLock,
  pagination,
  onPageChange,
  filters,
  onFiltersChange,
  sortConfig,
  onSortChange,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm");
    } catch {
      return "-";
    }
  };

  const roleOptions = ["ADMIN", "STUDENT", "INSTRUCTOR"];
  const genderOptions = ["MALE", "FEMALE", "OTHER"];
  const statusOptions = ["active", "inactive"];

  const SortIcon = ({ field }) => {
    if (sortConfig.sortBy !== field) {
      return <ChevronUpIcon className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.sortDirection === "asc" ? (
      <ChevronUpIcon className="w-4 h-4 text-blue-500" />
    ) : (
      <ChevronDownIcon className="w-4 h-4 text-blue-500" />
    );
  };

  const StatusIndicator = ({ isEnabled }) => (
    <div className="flex items-center gap-2">
      <div
        className={`w-2.5 h-2.5 rounded-full ${
          isEnabled ? "bg-green-500" : "bg-gray-300"
        }`}
      />
      <span
        className={`text-sm font-medium ${
          isEnabled ? "text-green-700" : "text-gray-600"
        }`}
      >
        {isEnabled ? "Active" : "Inactive"}
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
            placeholder="Tìm kiếm theo tên..."
            value={filters.fullName}
            onChange={(e) =>
              onFiltersChange({ ...filters, fullName: e.target.value })
            }
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
            <span>Bộ lọc</span>
          </button>

          {showFilters && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10 p-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Giới tính
                  </label>
                  <select
                    value={filters.gender}
                    onChange={(e) =>
                      onFiltersChange({ ...filters, gender: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tất cả giới tính</option>
                    {genderOptions.map((gender) => (
                      <option key={gender} value={gender}>
                        {gender}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      onFiltersChange({ ...filters, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tất cả trạng thái</option>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Vai trò
                  </label>
                  <select
                    value={filters.roleNames}
                    onChange={(e) => {
                      const selectedValue = e.target.value;

                     
                        // Nếu không chọn "Chọn tất cả", chỉ chọn vai trò đã chọn
                        const selectedRoles = selectedValue
                          ? [selectedValue]
                          : [];
                        onFiltersChange({
                          ...filters,
                          roleNames: selectedRoles,
                        });
                      
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {/* Thêm tùy chọn "Chọn tất cả" */}
                    <option value="">Chọn tất cả</option>

                    {/* Các vai trò */}
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-4 text-left">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => onSortChange("fullName")}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-blue-500" />
                    </div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thông tin
                    </span>
                  </div>
                  <SortIcon field="fullName" />
                </div>
              </th>
              <th className="px-6 py-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                    <PhoneIcon className="w-5 h-5 text-purple-500" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Liên Hệ
                  </span>
                </div>
              </th>
              <th className="px-6 py-4 text-left">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => onSortChange("createdAt")}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                      <ChevronUpIcon className="w-5 h-5 text-green-500" />
                    </div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </span>
                  </div>
                  <SortIcon field="createdAt" />
                </div>
              </th>
              <th className="px-6 py-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                    <MapPinIcon className="w-5 h-5 text-orange-500" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vai trò
                  </span>
                </div>
              </th>
              <th className="px-6 py-4 text-right">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  Không tìm thấy người dùng nào
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        className="h-12 w-12 rounded-lg object-cover ring-2 ring-gray-100"
                        src={user.profilePicture || "/api/placeholder/48/48"}
                        alt={user.fullName}
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">
                          {user.fullName}
                        </span>
                        <span className="text-sm text-gray-500">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 text-gray-600">
                        <PhoneIcon className="w-4 h-4" />
                        <span className="text-sm">
                          {user.phoneNumber || "-"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 mt-1">
                        <MapPinIcon className="w-4 h-4" />
                        <span className="text-sm">{user.address || "-"}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <StatusIndicator isEnabled={user.isEnabled} />
                      <div className="flex items-center gap-2 text-gray-400">
                        <span className="text-xs">Tạo lúc:</span>
                        <span className="text-xs font-medium">
                          {formatDate(user.createdAt)}
                        </span>
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
                            ? "text-gray-500 hover:text-red-600 hover:bg-red-50"
                            : "text-gray-500 hover:text-green-600 hover:bg-green-50"
                        }`}
                        title={user.isLocked ? "Unlock user" : "Lock user"}
                      >
                        {user.isLocked ? (
                          <LockIcon className="w-5 h-5" />
                        ) : (
                          <UnlockIcon className="w-5 h-5" />
                        )}
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 rounded-lg">
        <div className="flex items-center">
          <select
            value={pagination.size}
            onChange={(e) => onPageChange(0, Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size} mỗi trang
              </option>
            ))}
          </select>
          <span className="ml-3 text-sm text-gray-500">
            Tổng cộng: {pagination.totalElements} người dùng
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(pagination.page - 1,pagination.size)}
            disabled={pagination.page === 0}
            className="p-2 rounded-md border disabled:opacity-50 hover:bg-gray-50 disabled:hover:bg-white"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>

          <div className="text-sm text-gray-500">
            Trang {pagination.page + 1} /{" "}
            {Math.ceil(pagination.totalElements / pagination.size)}
          </div>

          <button
            onClick={() => onPageChange(pagination.page + 1,pagination.size)}
            disabled={
              pagination.page >=
              Math.ceil(pagination.totalElements / pagination.size) - 1
            }
            className="p-2 rounded-md border disabled:opacity-50 hover:bg-gray-50 disabled:hover:bg-white"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
