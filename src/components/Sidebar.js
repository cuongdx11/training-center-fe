import React, { useState } from 'react';
import { UserCircle2, PlayCircle, ShoppingBag, Gift, LogOut, Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ userName, userImage }) => {
  const [image, setImage] = useState(userImage);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout: authLogout } = useAuth();

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

  const handleLogout = () => {
    authLogout();
    navigate("/login");
    const logoutEvent = new Event("userLogout");
    window.dispatchEvent(logoutEvent);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const MenuButton = ({ icon: Icon, text, path, onClick }) => (
    <button 
      className={`w-full flex items-center space-x-3 py-3 px-4 ${isActive(path) ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-50'} rounded-md`}
      onClick={() => {
        onClick();
        setIsMobileMenuOpen(false);
      }}
    >
      <Icon size={20} />
      <span>{text}</span>
    </button>
  );

  const SidebarContent = () => (
    <>
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
        <MenuButton 
          icon={UserCircle2} 
          text="Thông tin cá nhân" 
          path="/profile"
          onClick={() => navigate('/profile')}
        />
        <MenuButton 
          icon={PlayCircle} 
          text="Khóa học của tôi" 
          path="/my-courses"
          onClick={() => navigate('/my-courses')}
        />
        <MenuButton 
          icon={ShoppingBag} 
          text="Lịch học" 
          path="/calendar"
          onClick={() => navigate('/calendar')}
        />
        <MenuButton 
          icon={ShoppingBag} 
          text="Đơn hàng" 
          path="/orders"
          onClick={() => navigate('/orders')}
        />
      </div>

      <div className="px-6 mt-8 space-y-1">
        <h3 className="font-medium mb-4">Quà tặng</h3>
        <MenuButton 
          icon={Gift} 
          text="Phiếu giảm giá" 
          path="/coupons"
          onClick={() => navigate('/coupons')}
        />
      </div>

      <div className="px-6 mt-8">
        <button 
          className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-600 text-white rounded-md"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-full shadow"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-72 bg-white min-h-screen shadow-sm sticky top-0">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="absolute inset-0 bg-black opacity-50" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 w-72 h-full bg-white shadow-lg overflow-y-auto">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;