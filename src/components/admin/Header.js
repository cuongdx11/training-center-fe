import React, { useState } from "react";
import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout: authLogout } = useAuth();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    authLogout();
    navigate("/admin/login");
    const logoutEvent = new Event("userLogout");
    window.dispatchEvent(logoutEvent);
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-white shadow-sm h-16">
      <div className="px-4 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <h2 className="text-xl font-semibold text-gray-800">
            Training Center Admin
          </h2>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                {/* User Avatar */}
                <button onClick={toggleDropdown} className="focus:outline-none">
                  <img
                    src={user.profilePicture || "/default-avatar.png"}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full hover:ring-2 hover:ring-blue-500 transition-all"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-avatar.png";
                    }}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <button
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={() => {
                          navigate("/admin/profile");
                          setIsDropdownOpen(false);
                        }}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Thông tin cá nhân
                      </button>
                      <button
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="/login"
                className="text-sm text-gray-700 hover:text-blue-500 transition-all"
              >
                Đăng nhập
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
