import React, { useState } from 'react';
import {
  Clock,
  Users,
  GraduationCap,
  Plus,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

const ScheduleManagementPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data - thay thế bằng data thật từ API
  const mockSchedules = [
    {
      id: 1,
      courseName: "Khóa học React JS",
      teacher: "Nguyễn Văn A",
      time: "18:00 - 21:00",
      room: "P301",
      students: 15
    },
    {
      id: 2,
      courseName: "Khóa học Java Spring Boot",
      teacher: "Trần Thị B",
      time: "14:00 - 17:00",
      room: "P302",
      students: 12
    }
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const { days, firstDay } = getDaysInMonth(currentDate);

  const renderCalendar = () => {
    const calendar = [];
    const daysInWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    
    // Render header
    calendar.push(
      <div key="header" className="grid grid-cols-7 gap-1 mb-2">
        {daysInWeek.map(day => (
          <div key={day} className="text-center font-semibold p-2">
            {day}
          </div>
        ))}
      </div>
    );

    // Render days
    let cells = [];
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="p-4"></div>);
    }

    for (let day = 1; day <= days; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isToday = new Date().toDateString() === date.toDateString();
      const hasSchedule = mockSchedules.some(schedule => true); // Logic kiểm tra lịch học

      cells.push(
        <div
          key={day}
          className={`p-2 border rounded-lg cursor-pointer transition-all duration-200
            ${isToday ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50 border-gray-200'}
            ${hasSchedule ? 'border-blue-400' : ''}
            ${selectedDate?.toDateString() === date.toDateString() ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setSelectedDate(date)}
        >
          <div className="text-right mb-1">{day}</div>
          {hasSchedule && (
            <div className="text-xs bg-blue-500 text-white rounded px-1 py-0.5 text-center">
              Có lịch học
            </div>
          )}
        </div>
      );
    }

    calendar.push(
      <div key="days" className="grid grid-cols-7 gap-1">
        {cells}
      </div>
    );

    return calendar;
  };

  const CreateScheduleForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Khóa học</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Chọn khóa học</option>
            <option value="react">Khóa học React JS</option>
            <option value="java">Khóa học Java Spring Boot</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Giảng viên</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Chọn giảng viên</option>
            <option value="teacher1">Nguyễn Văn A</option>
            <option value="teacher2">Trần Thị B</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ngày học</label>
          <input 
            type="date" 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian</label>
          <input 
            type="time" 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phòng học</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Chọn phòng học</option>
            <option value="p301">P301</option>
            <option value="p302">P302</option>
            <option value="p303">P303</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sĩ số tối đa</label>
          <input 
            type="number" 
            placeholder="Nhập sĩ số" 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
        <input 
          type="text" 
          placeholder="Nhập ghi chú nếu có" 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button 
          onClick={() => setIsModalOpen(false)}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Hủy
        </button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Tạo lịch học
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý lịch học</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tạo lịch học mới
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Lịch học tháng {currentDate.getMonth() + 1}/{currentDate.getFullYear()}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setMonth(currentDate.getMonth() - 1);
                  setCurrentDate(newDate);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setMonth(currentDate.getMonth() + 1);
                  setCurrentDate(newDate);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          {renderCalendar()}
        </div>

        {/* Schedule List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Lịch học trong ngày</h2>
          <div className="space-y-4">
            {selectedDate ? (
              mockSchedules.map(schedule => (
                <div
                  key={schedule.id}
                  className="p-4 border border-gray-200 rounded-lg space-y-2 hover:shadow-md transition-shadow"
                >
                  <div className="font-medium text-gray-900">{schedule.courseName}</div>
                  <div className="text-sm text-gray-500 space-y-1">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {schedule.time}
                    </div>
                    <div className="flex items-center">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      {schedule.teacher}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      {schedule.students} học viên
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                Chọn một ngày để xem lịch học
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Create Schedule */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Tạo lịch học mới</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <CreateScheduleForm />
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleManagementPage;