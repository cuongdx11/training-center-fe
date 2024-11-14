import React, { useState, useMemo ,useEffect } from 'react';
import { ChevronDown, Calendar, Clock, Search, X } from 'lucide-react';
import { format, eachDayOfInterval, getDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import { getCourses } from '../../../services/coursesService';
import userService from '../../../services/userService';

// // Giả lập dữ liệu courses và instructors (thực tế sẽ lấy từ API)
// const mockCourses = [
//   { id: '1', name: 'Lập trình Java cơ bản' },
//   { id: '2', name: 'Lập trình Web với React' },
//   { id: '3', name: 'Python cho Data Science' },
//   { id: '4', name: 'JavaScript nâng cao' },
// ];

// const mockInstructors = [
//   { id: '1', name: 'Nguyễn Văn A' },
//   { id: '2', name: 'Trần Thị B' },
//   { id: '3', name: 'Lê Văn C' },
//   { id: '4', name: 'Phạm Thị D' },
// ];

const RecurringScheduleForm = () => {
    // State for courses and instructors from API
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch courses and instructors on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [coursesResponse, instructorsResponse] = await Promise.all([
          getCourses(),
          userService.getInstructors()
        ]);
        setCourses(coursesResponse.data);
        setInstructors(instructorsResponse);
      } catch (err) {
        setError('Error loading data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);




  // State cho form data
  const [scheduleData, setScheduleData] = useState({
    courseId: '',
    instructorId: '',
    description: '',
    duration: 90,
    startDate: '',
    endDate: '',
    startTime: '09:00',
    daysOfWeek: [],
    sessionType: 'ONLINE',
    onlineLink: '',
    location: ''
  });

  // State cho validation
  const [errors, setErrors] = useState({});
  
  // State cho search dropdowns
  const [courseSearch, setCourseSearch] = useState('');
  const [instructorSearch, setInstructorSearch] = useState('');
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [showInstructorDropdown, setShowInstructorDropdown] = useState(false);

  // State cho selected items
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  const daysOfWeek = [
    { id: 2, name: 'Thứ 3' },
    { id: 3, name: 'Thứ 4' },
    { id: 4, name: 'Thứ 5' },
    { id: 5, name: 'Thứ 6' },
    { id: 6, name: 'Thứ 7' },
    { id: 7, name: 'Chủ nhật' },
    { id: 1, name: 'Thứ 2' }
  ];

  const sessionTypes = [
    { value: 'ONLINE', label: 'Trực tuyến' },
    { value: 'OFFLINE', label: 'Tại lớp' },
    { value: 'VIDEO', label: 'Video' }
  ];
  const calculateEndTime = (startTime, duration) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
  };
 // Filtered results for search using actual API data
 const filteredCourses = useMemo(() => {
    return courses.filter(course =>
      course.title.toLowerCase().includes(courseSearch.toLowerCase())
    );
  }, [courseSearch, courses]);

  const filteredInstructors = useMemo(() => {
    return instructors.filter(instructor =>
      instructor.fullName.toLowerCase().includes(instructorSearch.toLowerCase())
    );
  }, [instructorSearch, instructors]);

  // Preview calculations
  const previewDates = useMemo(() => {
    if (!scheduleData.startDate || !scheduleData.endDate || scheduleData.daysOfWeek.length === 0) {
      return [];
    }

    const start = new Date(scheduleData.startDate);
    const end = new Date(scheduleData.endDate);

    return eachDayOfInterval({ start, end })
      .filter(date => {
        const dayOfWeek = getDay(date);
        // Chuyển đổi ngày trong tuần để phù hợp với format của bạn
        const adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek;
        return scheduleData.daysOfWeek.includes(adjustedDay);
      })
      .map(date => ({
        date,
        startTime: scheduleData.startTime,
        endTime: calculateEndTime(scheduleData.startTime, scheduleData.duration)
      }));
  }, [scheduleData.startDate, scheduleData.endDate, scheduleData.daysOfWeek, scheduleData.startTime, scheduleData.duration]);

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!scheduleData.courseId) {
      newErrors.courseId = 'Vui lòng chọn khóa học';
    }
    if (!scheduleData.instructorId) {
      newErrors.instructorId = 'Vui lòng chọn giảng viên';
    }
    if (!scheduleData.description.trim()) {
      newErrors.description = 'Vui lòng nhập mô tả';
    }
    if (!scheduleData.startDate) {
      newErrors.startDate = 'Vui lòng chọn ngày bắt đầu';
    }
    if (!scheduleData.endDate) {
      newErrors.endDate = 'Vui lòng chọn ngày kết thúc';
    }
    if (scheduleData.daysOfWeek.length === 0) {
      newErrors.daysOfWeek = 'Vui lòng chọn ít nhất một ngày trong tuần';
    }
    if (scheduleData.sessionType === 'ONLINE' && !scheduleData.onlineLink) {
      newErrors.onlineLink = 'Vui lòng nhập link học trực tuyến';
    }
    if (scheduleData.sessionType === 'OFFLINE' && !scheduleData.location) {
      newErrors.location = 'Vui lòng nhập địa điểm học';
    }
    if (scheduleData.duration < 30) {
      newErrors.duration = 'Thời lượng tối thiểu là 30 phút';
    }
    if (new Date(scheduleData.startDate) > new Date(scheduleData.endDate)) {
      newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setScheduleData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setScheduleData(prev => ({
      ...prev,
      courseId: course.id
    }));
    setCourseSearch('');
    setShowCourseDropdown(false);
  };

  const handleInstructorSelect = (instructor) => {
    setSelectedInstructor(instructor);
    setScheduleData(prev => ({
      ...prev,
      instructorId: instructor.id
    }));
    setInstructorSearch('');
    setShowInstructorDropdown(false);
  };

  const handleDaySelect = (dayId) => {
    setScheduleData(prev => {
      const updatedDays = prev.daysOfWeek.includes(dayId)
        ? prev.daysOfWeek.filter(id => id !== dayId)
        : [...prev.daysOfWeek, dayId];
      return {
        ...prev,
        daysOfWeek: updatedDays
      };
    });
  };

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/schedule/recurring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleData),
      });
      
      if (response.ok) {
        alert('Tạo lịch học thành công!');
      } else {
        throw new Error('Có lỗi xảy ra');
      }
    } catch (error) {
      alert('Không thể tạo lịch học: ' + error.message);
    }
  };
  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Tạo Lịch Học</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Course Selection */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Khóa học
              </label>
              <div className="relative">
                {selectedCourse ? (
                  <div className="flex items-center justify-between border rounded-md p-2">
                    <span>{selectedCourse.title}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCourse(null);
                        setScheduleData(prev => ({ ...prev, courseId: '' }));
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="text"
                      value={courseSearch}
                      onChange={(e) => {
                        setCourseSearch(e.target.value);
                        setShowCourseDropdown(true);
                      }}
                      onFocus={() => setShowCourseDropdown(true)}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tìm khóa học..."
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                )}
                {showCourseDropdown && filteredCourses.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                    {filteredCourses.map(course => (
                      <div
                        key={course.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleCourseSelect(course)}
                      >
                        {course.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.courseId && (
                <p className="text-red-500 text-sm mt-1">{errors.courseId}</p>
              )}
            </div>

            {/* Instructor Selection */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giảng viên
              </label>
              <div className="relative">
                {selectedInstructor ? (
                  <div className="flex items-center justify-between border rounded-md p-2">
                    <span>{selectedInstructor.fullName}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedInstructor(null);
                        setScheduleData(prev => ({ ...prev, instructorId: '' }));
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="text"
                      value={instructorSearch}
                      onChange={(e) => {
                        setInstructorSearch(e.target.value);
                        setShowInstructorDropdown(true);
                      }}
                      onFocus={() => setShowInstructorDropdown(true)}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tìm giảng viên..."
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                )}
                {showInstructorDropdown && filteredInstructors.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                    {filteredInstructors.map(instructor => (
                      <div
                        key={instructor.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleInstructorSelect(instructor)}
                      >
                        {instructor.fullName}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.instructorId && (
                <p className="text-red-500 text-sm mt-1">{errors.instructorId}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả lớp học
              </label>
              <input
                type="text"
                name="description"
                value={scheduleData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập mô tả lớp học"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Schedule Settings */}
            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="inline-block w-4 h-4 mr-1" />
                  Ngày bắt đầu
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={scheduleData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="inline-block w-4 h-4 mr-1" />
                  Ngày kết thúc
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={scheduleData.endDate}
                  onChange={handleInputChange}
                  min={scheduleData.startDate}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.endDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                )}
              </div>
            </div>

            {/* Time and Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="inline-block w-4 h-4 mr-1" />
                  Giờ bắt đầu
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={scheduleData.startTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.startTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="inline-block w-4 h-4 mr-1" />
                  Thời lượng (phút)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={scheduleData.duration}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="30"
                  step="30"
                />
                {errors.duration && (
                  <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
                )}
              </div>
            </div>

            {/* Days Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn ngày học trong tuần
              </label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map((day) => (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => handleDaySelect(day.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                      ${scheduleData.daysOfWeek.includes(day.id)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {day.name}
                  </button>
                ))}
              </div>
              {errors.daysOfWeek && (
                <p className="text-red-500 text-sm mt-1">{errors.daysOfWeek}</p>
              )}
            </div>

            {/* Session Type and Location */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hình thức học
                </label>
                <div className="relative">
                  <select
                    name="sessionType"
                    value={scheduleData.sessionType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    {sessionTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                </div>
              </div>

              {scheduleData.sessionType === 'ONLINE' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link học trực tuyến
                  </label>
                  <input
                    type="text"
                    name="onlineLink"
                    value={scheduleData.onlineLink}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập link học trực tuyến"
                  />
                  {errors.onlineLink && (
                    <p className="text-red-500 text-sm mt-1">{errors.onlineLink}</p>
                  )}
                </div>
              )}

              {scheduleData.sessionType === 'OFFLINE' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa điểm học
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={scheduleData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập địa điểm học"
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Tạo lịch học
              </button>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Xem trước lịch học</h2>
          
          {previewDates.length > 0 ? (
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Thông tin khóa học</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p><span className="font-medium">Khóa học:</span> {selectedCourse?.title || 'Chưa chọn'}</p>
                  <p><span className="font-medium">Giảng viên:</span> {selectedInstructor?.fullName || 'Chưa chọn'}</p>
                  <p><span className="font-medium">Hình thức:</span> {sessionTypes.find(t => t.value === scheduleData.sessionType)?.label}</p>
                  <p><span className="font-medium">Thời lượng:</span> {scheduleData.duration} phút</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Lịch học dự kiến</h3>
                <div className="max-h-[400px] overflow-y-auto">
                  {previewDates.map((schedule, index) => (
                    <div
                      key={index}
                      className="mb-2 p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            {format(schedule.date, 'EEEE, dd/MM/yyyy', { locale: vi })}
                          </p>
                          <p className="text-gray-600">
                            {schedule.startTime} - {calculateEndTime(schedule.startTime, scheduleData.duration)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-md">
                <p className="text-blue-600">
                  Tổng số buổi học: {previewDates.length} buổi
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p>Chọn ngày và thời gian để xem trước lịch học</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecurringScheduleForm;