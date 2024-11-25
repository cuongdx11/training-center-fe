import React, { useState } from 'react';

const PersonalInfo = ({ userInfo }) => {
  const [isEditing, setIsEditing] = useState(false); 
  const [formData, setFormData] = useState({ ...userInfo }); 
  
  // Hàm xử lý khi người dùng thay đổi dữ liệu trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Hàm xử lý khi người dùng lưu thông tin
  const handleSave = () => {
    // Ở đây bạn sẽ gọi API để lưu thông tin cập nhật
    console.log('Saving data...', formData);
    setIsEditing(false); // Quay lại chế độ chỉ xem sau khi lưu
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6">
      <h1 className="text-2xl font-medium mb-6">Thông tin cá nhân</h1>

      {isEditing ? (
        // Hiển thị form khi đang ở chế độ sửa
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600">Tên</span>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="border rounded-md px-3 py-2"
            />
          </div>
          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600">Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="border rounded-md px-3 py-2"
            />
          </div>
          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600">Số điện thoại</span>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="border rounded-md px-3 py-2"
            />
          </div>
          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600">Mã khách hàng</span>
            <span className="font-medium">{formData.id}</span>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              className="px-6 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-gray-50"
              onClick={() => setIsEditing(false)} // Hủy bỏ chỉnh sửa
            >
              Hủy
            </button>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={handleSave} // Lưu thông tin
            >
              Lưu
            </button>
          </div>
        </div>
      ) : (
        // Hiển thị thông tin khi ở chế độ chỉ xem
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600">Tên</span>
            <span className="font-medium">{userInfo.fullName}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600">Email</span>
            <span className="font-medium">{userInfo.email}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600">Số điện thoại</span>
            <span className="font-medium">{userInfo.phoneNumber}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600">Mã khách hàng</span>
            <span className="font-medium">{userInfo.id}</span>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-gray-50">
              Thay đổi mật khẩu
            </button>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => setIsEditing(true)} // Chuyển sang chế độ sửa khi nhấn nút "Sửa thông tin"
            >
              Sửa thông tin
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfo;
