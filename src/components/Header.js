import React, { useEffect, useState } from "react";
import { FaUser, FaSearch, FaBell, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CartService from "../services/cartService";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications] = useState(5); // Giả sử có 5 thông báo
  const navigate = useNavigate();
  const { user, logout: authLogout } = useAuth();
  const [cartItemCount, setCartItemCount] =useState(0);

  
  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
      if (isDropdownOpen && !event.target.closest(".user-menu")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    const fetchCartItemCount = async () => {
      try {
        const cart = await CartService.getCart();
        if (cart?.cartItems?.length >= 0) {
          setCartItemCount(cart.cartItems.length);
        } else {
          console.warn("Invalid cart data format");
          setCartItemCount(0); // Nếu dữ liệu không hợp lệ, đặt giá trị mặc định
        }
      } catch (error) {
        console.error("Failed to fetch cart items:", error);
        setCartItemCount(0);
      }
    };

    if(user) {
      fetchCartItemCount();
    }
  }, [user]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white shadow-md">
      <div className="container mx-auto grid grid-cols-3 items-center p-4">
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
        <div className="flex justify-end items-center relative user-menu space-x-4">

          {/* Thêm biểu tượng giỏ hàng */}
          {user && (
            <div
              className="relative cursor-pointer"
              onClick={() => navigate("/my-cart")} // Điều hướng đến trang giỏ hàng
            >
            <FaShoppingCart size={24} />
            {cartItemCount >= 0 && ( // Hiển thị số lượng sản phẩm nếu có
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {cartItemCount}
            </span>
            )}
            </div>
          )}

          {/* Notification Icon */}
          {user && (
            <div className="relative cursor-pointer">
              <FaBell size={24} />
              {notifications > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </div>
          )}

          {/* User Avatar */}
          {user ? (
            <div
              onClick={handleDropdownToggle}
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

          {/* Dropdown menu */}
          {isDropdownOpen && user && (
            <div className="absolute right-0 mt-48 w-48 bg-white text-black rounded-lg shadow-lg py-1 z-50">
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
        </div>
      </div>
    </header>
  );
};

export default Header;
