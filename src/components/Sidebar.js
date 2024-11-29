import React, { useState } from 'react';
import { UserCircle2, PlayCircle, ShoppingBag, Gift, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ userName, userImage }) => {
  const [image, setImage] = useState(userImage);
  const navigate = useNavigate();
  const location = useLocation();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-72 bg-white min-h-screen shadow-sm sticky top-0">
      <div className="flex flex-col items-center p-6">
        <div className="relative mb-3">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            {image ? (
              <img src={image} alt="User Avatar" className="w-full h-full object-cover" />
            ) : (
              <UserCircle2 size={64} className="text-gray-400" />
            )}
          </div>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageChange}
            className="absolute bottom-0 right-0 opacity-0 cursor-pointer w-full h-full"
            id="file-input" 
          />
          <label 
            htmlFor="file-input" 
            className="absolute bottom-0 right-0 bg-white text-gray-600 px-2 py-1 text-sm rounded-md shadow-sm border cursor-pointer"
          >
            Sửa
          </label>
        </div>
        <h2 className="text-lg font-medium">{userName}</h2>
      </div>

      <div className="px-6 space-y-1">
        <h3 className="font-medium mb-4">Tài khoản của tôi</h3>
        <button 
          className={`w-full flex items-center space-x-3 py-3 px-4 ${isActive('/profile') ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-50'} rounded-md`}
          onClick={() => navigate('/profile')}
        >
          <UserCircle2 size={20} />
          <span>Thông tin cá nhân</span>
        </button>
        <button 
          className={`w-full flex items-center space-x-3 py-3 px-4 ${isActive('/my-courses') ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-50'} rounded-md`}
          onClick={() => navigate('/my-courses')}
        >
          <PlayCircle size={20} />
          <span>Khóa học đã mua</span>
        </button>
        <button 
          className={`w-full flex items-center space-x-3 py-3 px-4 ${isActive('/calendar') ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-50'} rounded-md`}
          onClick={() => navigate('/calendar')}
        >
          <ShoppingBag size={20} />
          <span>Lịch học</span>
        </button>
        <button 
          className={`w-full flex items-center space-x-3 py-3 px-4 ${isActive('/orders') ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-50'} rounded-md`}
          onClick={() => navigate('/orders')}
        >
          <ShoppingBag size={20} />
          <span>Đơn hàng</span>
        </button>
      </div>

      <div className="px-6 mt-8 space-y-1">
        <h3 className="font-medium mb-4">Quà tặng</h3>
        <button 
          className={`w-full flex items-center space-x-3 py-3 px-4 ${isActive('/coupons') ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-50'} rounded-md`}
          onClick={() => navigate('/coupons')}
        >
          <Gift size={20} />
          <span>Phiếu giảm giá</span>
        </button>
      </div>

      <div className="px-6 mt-8">
        <button 
          className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-600 text-white rounded-md"
          onClick={() => navigate('/logout')}
        >
          <LogOut size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
