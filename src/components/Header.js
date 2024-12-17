import React, { useEffect, useState } from "react";
import { FaUser, FaSearch, FaBell, FaClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getNotifications } from "../services/notificationService";

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const { user, logout: authLogout } = useAuth();

  const toggleDropdown = (dropdownType) => {
    setActiveDropdown(activeDropdown === dropdownType ? null : dropdownType);
    
    // Fetch notifications when notification dropdown is opened
    if (dropdownType === 'notifications' && notifications.length === 0) {
      fetchNotifications();
    }
  };

  const handleLogout = () => {
    authLogout();
    navigate("/login");
    const logoutEvent = new Event("userLogout");
    window.dispatchEvent(logoutEvent);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown && !event.target.closest(".dropdown-container")) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [activeDropdown]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      // Sort notifications by timestamp in descending order (newest first)
      const sortedNotifications = data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setNotifications(sortedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Function to format relative time
  const formatRelativeTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white shadow-md">
      <div className="container mx-auto grid grid-cols-3 items-center p-4 dropdown-container">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <a href="/" className="hover:text-blue-100">
            Trung Tâm Đào Tạo Lập Trình
          </a>
        </div>

        {/* Search bar */}
        <div className="mx-auto">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm khóa học..."
              className="w-96 px-4 py-2 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-blue-600 transition duration-200"
            >
              <FaSearch />
            </button>
          </form>
        </div>

        {/* User menu */}
        <div className="flex justify-end items-center relative space-x-4">
          {/* Notification Icon */}
          {user && (
            <div 
              className="relative cursor-pointer" 
              onClick={() => toggleDropdown('notifications')}
            >
              <FaBell size={24} />
              {notifications.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </div>
          )}

          {/* User Avatar */}
          {user ? (
            <div
              onClick={() => toggleDropdown('userMenu')}
              className="cursor-pointer flex items-center space-x-2"
            >
              <img
                src={user.profilePicture}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border-2 border-white"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-avatar.png";
                }}
              />
            </div>
          ) : (
            <a
              href="/login"
              className="flex items-center space-x-2 hover:text-blue-300 transition duration-200"
            >
              <FaUser size={24} />
            </a>
          )}

          {/* User Menu Dropdown */}
          {activeDropdown === 'userMenu' && user && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white text-black rounded-lg shadow-lg py-1 z-50">
              <a
                href="/profile"
                className="block px-4 py-2 hover:bg-gray-100 transition duration-200"
              >
                Hồ Sơ
              </a>
              <a
                href="/my-courses"
                className="block px-4 py-2 hover:bg-gray-100 transition duration-200"
              >
                Khóa Học Của Tôi
              </a>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition duration-200 text-red-600"
              >
                Đăng Xuất
              </button>
            </div>
          )}

          {/* Notification Dropdown */}
          {activeDropdown === 'notifications' && notifications.length > 0 && (
            <div className="absolute right-0 top-full mt-2 w-96 bg-white text-black rounded-lg shadow-lg py-2 z-50 border border-gray-200">
              <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Thông Báo</h3>
                <span className="text-sm text-gray-500">
                  {notifications.length} thông báo mới
                </span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 hover:bg-gray-100 transition duration-200 border-b border-gray-100 last:border-b-0 group"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        <FaClock className="text-gray-400 group-hover:text-blue-500 transition" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 mb-1">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 mb-1">
                          {notification.message}
                        </p>
                        <div className="text-xs text-gray-400 flex items-center space-x-1">
                          <span>{formatRelativeTime(notification.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;