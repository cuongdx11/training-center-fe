import React, { useState, useEffect } from 'react';
import {
  Clock,
  Users,
  GraduationCap,
  Plus,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { getAllSchedule } from '../../services/scheduleService';
import userService from '../../services/userService';
import { getCourses } from '../../services/coursesService';
import api from "../../services/api"; 

const ScheduleManagementPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    courseId: '',
    instructorId: '',
    date: '',
    time: '',
    room: '',
    maxStudents: '',
    notes: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all required data in parallel
        const [scheduleResponse, coursesResponse, instructorsResponse] = await Promise.all([
          getAllSchedule(),
          getCourses(),
          userService.getInstructors()
        ]);

        setSchedules(scheduleResponse.data);
        console.log(scheduleResponse.data);
        setCourses(coursesResponse.data);
        setInstructors(instructorsResponse);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/schedule', formData);
      setSchedules(prev => [...prev, response.data]);
      setIsModalOpen(false);
      // Reset form
      setFormData({
        courseId: '',
        instructorId: '',
        date: '',
        time: '',
        room: '',
        maxStudents: '',
        notes: ''
      });
    } catch (err) {
      console.error('Error creating schedule:', err);
      setError('Có lỗi xảy ra khi tạo lịch học. Vui lòng thử lại.');
    }
  };

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
    
    calendar.push(
      <div key="header" className="grid grid-cols-7 gap-1 mb-2">
        {daysInWeek.map(day => (
          <div key={day} className="text-center font-semibold p-2">
            {day}
          </div>
        ))}
      </div>
    );

    let cells = [];
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="p-4"></div>);
    }

    for (let day = 1; day <= days; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isToday = new Date().toDateString() === date.toDateString();
      const hasSchedule = schedules.some(schedule => 
        new Date(schedule.startTime).toDateString() === date.toDateString()
      );

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Khóa học</label>
          <select 
            name="courseId"
            value={formData.courseId}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Chọn khóa học</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Giảng viên</label>
          <select 
            name="instructorId"
            value={formData.instructorId}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Chọn giảng viên</option>
            {instructors.map(instructor => (
              <option key={instructor.id} value={instructor.id}>
                {instructor.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ngày học</label>
          <input 
            type="date" 
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian</label>
          <input 
            type="time" 
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phòng học</label>
          <input 
            type="text"
            name="room"
            value={formData.room}
            onChange={handleInputChange}
            placeholder="Nhập phòng học"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sĩ số tối đa</label>
          <input 
            type="number" 
            name="maxStudents"
            value={formData.maxStudents}
            onChange={handleInputChange}
            placeholder="Nhập sĩ số" 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
        <input 
          type="text" 
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="Nhập ghi chú nếu có" 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button 
          type="button"
          onClick={() => setIsModalOpen(false)}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Hủy
        </button>
        <button 
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Tạo lịch học
        </button>
      </div>
    </form>
  );

  if (loading) {
    return <div className="p-6 text-center">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  const getSelectedDateSchedules = () => {
    if (!selectedDate) return [];
    return schedules.filter(schedule => 
      new Date(schedule.startTime).toDateString() === selectedDate.toDateString()
    );
  };

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

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Lịch học trong ngày</h2>
          <div className="space-y-4">
            {selectedDate ? (
              getSelectedDateSchedules().length > 0 ? (
                getSelectedDateSchedules().map(schedule => (
                  <div
                    key={schedule.id}
                    className="p-4 border border-gray-200 rounded-lg space-y-2 hover:shadow-md transition-shadow"
                  >
                    <div className="font-medium text-gray-900">
                      {courses.find(c => c.id === schedule.course.id)?.title}
                    </div>
                    <div className="text-sm text-gray-500 space-y-1">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {schedule.startTime}
                      </div>
                      <div className="flex items-center">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        {instructors.find(i => i.id === schedule.instructor.id)?.fullName}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        {schedule.maxStudents} học viên
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Không có lịch học nào trong ngày này
                </div>
              )
            ) : (
              <div className="text-center text-gray-500 py-8">
                Chọn một ngày để xem lịch học
              </div>
            )}
          </div>
        </div>
      </div>

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