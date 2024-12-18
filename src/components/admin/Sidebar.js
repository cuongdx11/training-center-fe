import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  LogOut,
  List,
  Clock,
  FileText,
  User,
  ClipboardCheck,
  ListChecks,
  ShoppingBag,
  CirclePlus,
  Bell,
  BookText 
} from 'lucide-react';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();

  // Lấy đối tượng user từ localStorage (hoặc từ state)
  const user = JSON.parse(localStorage.getItem('user'));  // Ví dụ lấy đối tượng user từ localStorage
  const roles = user?.roles || [];

  // Menu items cho Admin
  const adminMenuItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: '/admin/dashboard'
    },
    {
      title: 'Khóa Học',
      icon: <BookOpen className="w-5 h-5" />,
      submenu: [
        { title: 'Danh Sách Khóa Học', icon: <List className="w-5 h-5" />, path: '/admin/courses' },
        { title: 'Lộ Trình Học', icon: <Clock className="w-5 h-5" />, path: '/admin/courses/roadmap' },
        { title: 'Lịch Học', icon: <FileText className="w-5 h-5" />, path: '/admin/courses/schedules' },
        { title: 'Tạo Lịch Học', icon: <FileText className="w-5 h-5" />, path: '/admin/courses/recurring' },
        { title: 'Tạo Lớp Học', icon: <FileText className="w-5 h-5" />, path: '/admin/courses/create-class' }
      ]
    },
    {
      title: 'Người Dùng',
      icon: <Users className="w-5 h-5" />,
      submenu: [
        { title: 'Thông Tin', icon: <List className="w-5 h-5" />, path: '/admin/users' },
        { title: 'Phân Quyền, Vai Trò', icon: <Clock className="w-5 h-5" />, path: '/admin/roles' }
      ]
    },
    {
      title: 'Đơn Hàng',
      icon: <ShoppingBag className="w-5 h-5" />,
      submenu: [
        { title: 'Danh Sách', icon: <List className="w-5 h-5" />, path: '/admin/orders' },
        { title: 'Tạo Đơn Hàng', icon: <CirclePlus  className="w-5 h-5" />, path: '/admin/roles' }
      ]
    },
    {
      title: 'Review',
      icon: <ClipboardCheck className="w-5 h-5" />,
      submenu: [
        { title: 'Danh Sách', icon: <List className="w-5 h-5" />, path: '/admin/reviews' },
      ]
    },
    {
      title: 'Danh Mục',
      icon: <ListChecks className="w-5 h-5" />,
      submenu: [
        { title: 'Danh Sách', icon: <List className="w-5 h-5" />, path: '/admin/categories' },
      ]
    },
    {
      title: 'Thanh Toán',
      icon: <ShoppingBag className="w-5 h-5" />,
      submenu: [
        { title: 'Danh Sách', icon: <List className="w-5 h-5" />, path: '/admin/payments' },
        { title: 'Tạo Thanh Toán', icon: <Clock className="w-5 h-5" />, path: '/admin/roles' }
      ]
    },
    {
      title: 'Hệ Thống',
      icon: <Settings className="w-5 h-5" />,
      submenu: [
        { title: 'Phân Quyền', icon: <List className="w-5 h-5" />, path: '/admin/user-role' },
        { title: 'Quyền Và Vai Trò', icon: <Clock className="w-5 h-5" />, path: '/admin/roles' },
        { title: 'Gửi thông báo', icon: <Bell className="w-5 h-5" />, path: '/admin/create-notification' }
      ]
    }
  ];

  // Menu items cho Instructor
  const instructorMenuItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: '/instructor/dashboard'
    },
    {
      title: 'Khóa Học',
      icon: <BookOpen className="w-5 h-5" />,
      submenu: [
        { title: 'Danh Sách Khóa Học', icon: <List className="w-5 h-5" />, path: '/instructor/courses' },
        { title: 'Lịch Dạy', icon: <FileText className="w-5 h-5" />, path: '/instructor/schedules' }
      ]
    },
    {
      title: 'Học Viên',
      icon: <User className="w-5 h-5" />,
      submenu: [
        { title: 'Tiến Độ Học Tập', icon: <ListChecks className="w-5 h-5" />, path: '/instructor/student-process' },
        { title: 'Điểm Danh', icon: <ClipboardCheck className="w-5 h-5" />, path: '/instructor/create-attendance' },
        { title: 'Gửi thông báo', icon: <Bell className="w-5 h-5" />, path: '/instructor/send-notification' },
        { title: 'Bài tập', icon: <BookText className="w-5 h-5" />, path: '/instructor/assignments' }
      ]
    }
  ];

  // Chọn menu items dựa trên vai trò người dùng
  const menuItems = roles.includes('ROLE_INSTRUCTOR') ? instructorMenuItems : adminMenuItems;

  const [openSubmenus, setOpenSubmenus] = useState({});

  const toggleSubmenu = (title) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <aside
      className={`${
        isSidebarOpen ? 'w-64' : 'w-20'
      } bg-slate-800 text-white transition-all duration-300 ease-in-out fixed h-full overflow-y-auto`}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <h1 className={`${!isSidebarOpen && 'hidden'} font-bold text-xl`}>
          PVCTECH
        </h1>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-slate-700"
        >
          {isSidebarOpen ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      <nav className="mt-4">
        {menuItems.map((item) => (
          <div key={item.title}>
            {item.submenu ? (
              <div>
                <button
                  onClick={() => toggleSubmenu(item.title)}
                  className={`flex items-center justify-between w-full px-4 py-3 ${
                    location.pathname.includes(item.path)
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                  } transition-colors duration-200`}
                >
                  <div className="flex items-center">
                    {item.icon}
                    <span className={`${!isSidebarOpen && 'hidden'} ml-3`}>
                      {item.title}
                    </span>
                  </div>
                  {isSidebarOpen && (
                    <ChevronRight
                      className={`w-4 h-4 transition-transform duration-200 ${
                        openSubmenus[item.title] ? 'rotate-90' : ''
                      }`}
                    />
                  )}
                </button>
                <div
                  className={`${
                    openSubmenus[item.title] && isSidebarOpen ? 'max-h-64' : 'max-h-0'
                  } overflow-hidden transition-all duration-300 ease-in-out`}
                >
                  {item.submenu.map((subItem) => (
                    <Link
                      key={subItem.path}
                      to={subItem.path}
                      className={`flex items-center px-4 py-2 pl-8 ${
                        location.pathname === subItem.path
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-300 hover:bg-slate-700'
                      } transition-colors duration-200`}
                    >
                      {subItem.icon}
                      <span className={`${!isSidebarOpen && 'hidden'} ml-3`}>
                        {subItem.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 ${
                  location.pathname === item.path
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-300 hover:bg-slate-700'
                } transition-colors duration-200`}
              >
                {item.icon}
                <span className={`${!isSidebarOpen && 'hidden'} ml-3`}>
                  {item.title}
                </span>
              </Link>
            )}
          </div>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full border-t border-slate-700">
        <button className="flex items-center w-full px-4 py-3 text-slate-300 hover:bg-slate-700 transition-colors duration-200">
          <LogOut className="w-5 h-5" />
          <span className={`${!isSidebarOpen && 'hidden'} ml-3`}>
            Đăng Xuất
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
