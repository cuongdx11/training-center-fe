import React, { useState } from 'react';
import { User, LogOut } from 'lucide-react';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="bg-white shadow-sm h-16">
      <div className="px-4 h-full">
        <div className="flex items-center justify-between h-full">
          <h2 className="text-xl font-semibold text-gray-800">
            Training Center Admin
          </h2>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                onClick={toggleDropdown}
                className="focus:outline-none"
              >
                <img
                  src="/api/placeholder/32/32"
                  alt="Admin"
                  className="w-8 h-8 rounded-full hover:ring-2 hover:ring-blue-500 transition-all"
                />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <button
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => {
                        console.log('View Profile');
                        setIsDropdownOpen(false);
                      }}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Thông tin cá nhân
                    </button>
                    <button
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => {
                        console.log('Logout');
                        setIsDropdownOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;