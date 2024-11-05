import React, { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logout: authLogout } = useAuth();

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        authLogout();
        navigate('/login');
        // Dispatch logout event if needed
        const logoutEvent = new Event('userLogout');
        window.dispatchEvent(logoutEvent);
    };

    // Click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isDropdownOpen && !event.target.closest('.user-menu')) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white shadow-md">
            <div className="container mx-auto flex justify-between items-center p-4">
                <div className="text-2xl font-bold">
                    <a href="/" className="hover:text-blue-100">
                        Trung Tâm Đào Tạo Lập Trình
                    </a>
                </div>
                <nav className="hidden md:block">
                    <ul className="flex space-x-6">
                        <li>
                            <a href="/" className="hover:text-blue-300 transition duration-200">
                                Trang Chủ
                            </a>
                        </li>
                        <li>
                            <a href="/courses" className="hover:text-blue-300 transition duration-200">
                                Khóa Học
                            </a>
                        </li>
                        <li>
                            <a href="/about" className="hover:text-blue-300 transition duration-200">
                                Giới Thiệu
                            </a>
                        </li>
                        <li>
                            <a href="/contact" className="hover:text-blue-300 transition duration-200">
                                Liên Hệ
                            </a>
                        </li>
                    </ul>
                </nav>

                <div className="relative user-menu">
                    {user ? (
                        <div
                            onClick={handleDropdownToggle}
                            className="cursor-pointer flex items-center space-x-2"
                        >
                            <img
                                src={user.profilePicture || '/default-avatar.png'}
                                alt="User Avatar"
                                className="w-10 h-10 rounded-full border-2 border-white"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/default-avatar.png';
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

                    {isDropdownOpen && user && (
                        <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg py-1 z-50">
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