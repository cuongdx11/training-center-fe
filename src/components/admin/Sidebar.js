import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  Calendar,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  LogOut,
  List,
  Clock,
  FileText
} from 'lucide-react';

const menuItems = [
  {
    title: 'Dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    path: '/admin/dashboard'
  },
  {
    title: 'Khóa Học',
    icon: <BookOpen className="w-5 h-5" />,
    submenu: [
      {
        title: 'Danh Sách Khóa Học',
        icon: <List className="w-5 h-5" />,
        path: '/admin/courses'
      },
      {
        title: 'Lộ Trình Học',
        icon: <Clock className="w-5 h-5" />,
        path: '/admin/courses/roadmap'
      },
      {
        title: 'Lịch Học',
        icon: <FileText className="w-5 h-5" />,
        path: '/admin/courses/schedules'
      }
    ]
  },
  {
    title: 'Học Viên',
    icon: <Users className="w-5 h-5" />,
    path: '/admin/students'
  },
  {
    title: 'Giảng Viên',
    icon: <GraduationCap className="w-5 h-5" />,
    path: '/admin/teachers'
  },
  {
    title: 'Lịch Học',
    icon: <Calendar className="w-5 h-5" />,
    path: '/admin/schedule'
  },
  {
    title: 'Cài Đặt',
    icon: <Settings className="w-5 h-5" />,
    path: '/admin/settings'
  }
];

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState(false);

  const toggleSubmenu = () => {
    setOpenSubmenu(!openSubmenu);
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
                  onClick={toggleSubmenu}
                  className={`flex items-center justify-between w-full px-4 py-3 ${
                    location.pathname.includes('/admin/courses')
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
                        openSubmenu ? 'rotate-90' : ''
                      }`}
                    />
                  )}
                </button>
                <div
                  className={`${
                    openSubmenu && isSidebarOpen ? 'max-h-64' : 'max-h-0'
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