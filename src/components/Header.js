import React, { useEffect, useState } from "react";
import { FaUser, FaSearch, FaBell, FaShoppingCart, FaBars, FaTimes, FaClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CartService from "../services/cartService";
import { getNotifications } from "../services/notificationService";

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileNotifications, setShowMobileNotifications] = useState(false);
  const navigate = useNavigate();
  const { user, logout: authLogout } = useAuth();

  const toggleDropdown = (dropdownType) => {
    setActiveDropdown(activeDropdown === dropdownType ? null : dropdownType);

    if (dropdownType === "notifications" && notifications.length === 0) {
      fetchNotifications();
    }
  };

  const toggleMobileNotifications = () => {
    setShowMobileNotifications(!showMobileNotifications);
    if (!showMobileNotifications && notifications.length === 0) {
      fetchNotifications();
    }
  };

  const handleLogout = () => {
    authLogout();
    navigate("/login");
    const logoutEvent = new Event("userLogout");
    window.dispatchEvent(logoutEvent);
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setShowMobileNotifications(false);
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
      fetchCartItemCount();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      const sortedNotifications = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(sortedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const fetchCartItemCount = async () => {
    try {
      const cart = await CartService.getCart();
      if (cart?.cartItems?.length >= 0) {
        setCartItemCount(cart.cartItems.length);
      } else {
        console.warn("Invalid cart data format");
        setCartItemCount(0);
      }
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
      setCartItemCount(0);
    }
  };

  const formatRelativeTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Vừa xong";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
  };

  const NotificationsList = ({ isMobile = false }) => (
    <div className={`${isMobile ? 'w-full' : 'w-96'} bg-white text-black rounded-lg shadow-lg py-2 ${isMobile ? '' : 'absolute right-0 top-full mt-2'} z-50 border border-gray-200`}>
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
                  {notification.creator.name}
                </p>
                <p className="text-sm font-semibold text-gray-800 mb-1">
                  Tiêu đề: {notification.title}
                </p>
                <p className="text-xs text-gray-500 mb-1">
                  Nội dung: {notification.message}
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
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white shadow-md">
      {/* Desktop Header */}
      <div className="container mx-auto hidden md:grid md:grid-cols-3 items-center p-4 dropdown-container">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <a href="/" className="hover:text-blue-100">
            Trung Tâm Đào Tạo Lập Trình
          </a>
        </div>

        {/* Search bar */}
        <div className="mx-auto w-full">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm khóa học..."
              className="w-full max-w-96 px-4 py-2 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
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
        <div className="flex justify-end items-center relative user-menu space-x-4">
          {/* Cart Icon */}
          {user && (
            <div
              className="relative cursor-pointer"
              onClick={() => navigate("/my-cart")}
            >
              <FaShoppingCart size={24} />
              {cartItemCount >= 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </div>
          )}

          {/* Notification Icon */}
          {user && (
            <div
              className="relative cursor-pointer"
              onClick={() => toggleDropdown("notifications")}
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
              onClick={() => toggleDropdown("userMenu")}
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
          {activeDropdown === "userMenu" && user && (
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

          {/* Desktop Notifications Dropdown */}
          {activeDropdown === "notifications" && notifications.length > 0 && (
            <NotificationsList />
          )}
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden">
        {/* Mobile Top Bar */}
        <div className="flex justify-between items-center p-4">
          {/* Mobile Logo */}
          <a href="/" className="text-xl font-bold">
            Trung Tâm Đào Tạo Lập Trình
          </a>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <div
                  className="relative cursor-pointer"
                  onClick={() => navigate("/my-cart")}
                >
                  <FaShoppingCart size={24} />
                  {cartItemCount >= 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </div>
                <div
                  className="relative cursor-pointer"
                  onClick={toggleMobileNotifications}
                >
                  <FaBell size={24} />
                  {notifications.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </div>
              </>
            )}
            <button onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Notifications Panel */}
        {showMobileNotifications && notifications.length > 0 && (
          <div className="absolute top-full left-0 w-full z-50">
            <NotificationsList isMobile={true} />
          </div>
        )}

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-blue-600 text-white z-40">
            {/* Mobile Search */}
            <div className="p-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm khóa học..."
                  className="w-full px-4 py-2 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-blue-600 transition duration-200"
                >
                  <FaSearch />
                </button>
              </form>
            </div>

            {/* Mobile User Menu */}
            {user ? (
              <div className="p-4 space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={user.profilePicture}
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full border-2 border-white"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-avatar.png";
                    }}
                  />
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-blue-200">{user.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <a
                    href="/profile"
                    className="block px-4 py-2 bg-blue-500 rounded hover:bg-blue-400 transition duration-200"
                  >
                    Hồ Sơ
                  </a>
                  <a
                    href="/my-courses"
                    className="block px-4 py-2 bg-blue-500 rounded hover:bg-blue-400 transition duration-200"
                  >
                    Khóa Học Của Tôi
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 bg-red-600 rounded hover:bg-red-500 transition duration-200"
                  >
                    Đăng Xuất
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4">
                <a
                  href="/login"
                  className="block w-full px-4 py-2 bg-blue-500 rounded hover:bg-blue-400 transition duration-200 text-center"
                >
                  Đăng Nhập
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;