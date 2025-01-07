import React, { useState, useMemo, useEffect } from "react";
import { Calendar, Clock, Search, X } from "lucide-react";
import { format, eachDayOfInterval, getDay, addMinutes } from "date-fns";
import { vi } from "date-fns/locale";
import { getAllCourses } from "../../../services/coursesService";
import { getClassByCourseId, getClassById } from "../../../services/courseClassService";
import { addRecurringSchedule, updateSchedule } from "../../../services/scheduleService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RecurringScheduleForm = ({scheduleDataOfClass, isEditing, onClose, onSuccess}) => {
  const [courses, setCourses] = useState([]);
  const [courseClasses, setCourseClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [scheduleData, setScheduleData] = useState({
    courseClassId: "",
    description: "",
    duration: 90,
    startDate: "",
    endDate: "",
    startTime: "09:00",
    daysOfWeek: [],
    sessionType: "ONLINE",
    onlineLink: "",
    location: "",
  });

  const [courseSearch, setCourseSearch] = useState("");
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  const daysOfWeek = [
    { id: 2, name: "Thứ 3" },
    { id: 3, name: "Thứ 4" },
    { id: 4, name: "Thứ 5" },
    { id: 5, name: "Thứ 6" },
    { id: 6, name: "Thứ 7" },
    { id: 7, name: "Chủ nhật" },
    { id: 1, name: "Thứ 2" },
  ];

  const sessionTypes = [
    { value: "ONLINE", label: "Trực tuyến" },
    { value: "OFFLINE", label: "Tại lớp" },
  ];

  useEffect(() => {
    if (scheduleDataOfClass) {
  
      const days = scheduleDataOfClass.scheduleList.map(item => {
        const startDate = new Date(item.startTime);
        const dayIndex = startDate.getDay();
        return dayIndex === 0 ? 7 : dayIndex;
      });
  
      const uniqueDayIds = [...new Set(days)];
  
      setScheduleData({
        courseClassId: scheduleDataOfClass.courseClass.id || '',
        description: scheduleDataOfClass.scheduleList[0].description || '',
        duration: scheduleDataOfClass.scheduleList[0].duration || '',
        startDate: format(new Date(scheduleDataOfClass.courseClass.startDate), 'yyyy-MM-dd') || '',
        endDate: format(new Date(scheduleDataOfClass.courseClass.endDate), 'yyyy-MM-dd') || '',
        startTime: format(new Date(scheduleDataOfClass.scheduleList[0].startTime), 'HH:mm') || '',
        daysOfWeek: uniqueDayIds, 
        sessionType: scheduleDataOfClass.scheduleList[0].sessionType || '',
        onlineLink: scheduleDataOfClass.scheduleList[0].onlineLink || '',
        location: scheduleDataOfClass.scheduleList[0].location || '',
      });
  
      if (isEditing) {
        const fecthCourseClass = async () => {
          try {
            const response = await getClassById(scheduleDataOfClass.courseClass.id);
            setSelectedClass(response);
            setSelectedCourse(response.course);
          } catch (error) {
            throw error;
          }
        }
        fecthCourseClass();
      }
    }
  }, [scheduleDataOfClass, isEditing]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesResponse = await getAllCourses();
        setCourses(coursesResponse);
      } catch (err) {
        setError("Error loading data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchCourseClasses = async () => {
      if (selectedCourse?.id) {
        try {
          const data = await getClassByCourseId(selectedCourse.id);
          setCourseClasses(data);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchCourseClasses();
  }, [selectedCourse]);

  const filteredCourses = useMemo(
    () =>
      courses.filter((course) =>
        course.title.toLowerCase().includes(courseSearch.toLowerCase())
      ),
    [courseSearch, courses]
  );

  const calculateEndTime = (startTime, duration) => {
    // Convert start time to date object for easier manipulation
    const [hours, minutes] = startTime.split(":").map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0);
    
    // Add duration minutes
    const endDate = addMinutes(startDate, duration);
    
    // Format the end time
    const endHours = String(endDate.getHours()).padStart(2, "0");
    const endMinutes = String(endDate.getMinutes()).padStart(2, "0");
    
    return `${endHours}:${endMinutes}`;
  };

  const previewDates = useMemo(() => {
    if (
      !scheduleData.startDate ||
      !scheduleData.endDate ||
      !scheduleData.daysOfWeek.length
    ) {
      return [];
    }

    const start = new Date(scheduleData.startDate);
    const end = new Date(scheduleData.endDate);

    return eachDayOfInterval({ start, end })
      .filter((date) => {
        const dayOfWeek = getDay(date);
        const adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek;
        return scheduleData.daysOfWeek.includes(adjustedDay);
      })
      .map((date) => ({
        date,
        startTime: scheduleData.startTime,
        endTime: calculateEndTime(
          scheduleData.startTime,
          scheduleData.duration
        ),
      }));
  }, [
    scheduleData.startDate,
    scheduleData.endDate,
    scheduleData.daysOfWeek,
    scheduleData.startTime,
    scheduleData.duration,
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setScheduleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setSelectedClass(null);
    setScheduleData((prev) => ({ ...prev, courseClassId: "" }));
    setCourseSearch("");
    setShowCourseDropdown(false);
  };

  const handleClassSelect = (courseClass) => {
    setSelectedClass(courseClass);
    setScheduleData((prev) => ({ ...prev, courseClassId: courseClass.id }));
  };

  const handleDaySelect = (dayId) => {
    setScheduleData((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(dayId)
        ? prev.daysOfWeek.filter((id) => id !== dayId)
        : [...prev.daysOfWeek, dayId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (isEditing) {
        // Cập nhật lịch học
        response = await updateSchedule(scheduleData);
      } else {
        // Tạo lịch học mới
        response = await addRecurringSchedule(scheduleData);
      }
  
      if (response.statusCode === 201 || response.statusCode === 200) {
        toast.success(response.message);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        // Xử lý khi API trả về mã trạng thái lỗi
        const errorMessage = response.message || "Đã xảy ra lỗi không xác định.";
        throw new Error(`Lỗi ${response.statusCode}: ${errorMessage}`);
      }
    } catch (error) {
      // Xử lý lỗi ngoại lệ
      console.error("Error during schedule submission:", error);
      if (error.response && error.response.status === 409) {
        toast.error(error.response.data.message);
      } else {
        const userFriendlyMessage = error.message || "Có lỗi xảy ra. Vui lòng thử lại sau.";
        toast.error(userFriendlyMessage);
      }
    }
  };
  

  const handleCancle = (e) => {
    e.preventDefault();
    if (onClose) {
      onClose();
    }
  }
  

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

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
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {isEditing? 'Cập Nhật lịch học':'Tạo lịch học'}
          </h2>

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
                        setSelectedClass(null);
                        setScheduleData((prev) => ({
                          ...prev,
                          courseClassId: "",
                        }));
                      }}
                      className="text-gray-400 hover:text-gray-600"
                      disabled = {isEditing}
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
                      disabled={isEditing}
                    />
                    <Search
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                  </div>
                )}
                
                {showCourseDropdown && filteredCourses.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredCourses.map((course) => (
                      <div
                        key={course.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleCourseSelect(course)}
                        disabled={isEditing}
                      >
                        {course.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chọn lớp học */}
            {selectedCourse && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lớp học
                </label>
                <select
                  value={selectedClass ? selectedClass.id : ""}
                  onChange={(e) => {
                    const selectedClass = courseClasses.find(
                      (c) => c.id === e.target.value
                    );
                    handleClassSelect(selectedClass);
                  }}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isEditing} // Vô hiệu hóa nếu đang chỉnh sửa
                >
                  {!isEditing && <option value="" disabled selected>Chọn lớp chưa có lịch học</option>}
                  {courseClasses
                  .filter((courseClass) => {
                    // Nếu đang edit thì hiện tất cả các lớp
                    if (isEditing) return true;
                    // Nếu đang tạo mới thì chỉ hiện lớp PENDING
                    return courseClass.status === "PENDING";
                  })
                  .map((courseClass) => (
                    <option key={courseClass.id} value={courseClass.id}>
                      {courseClass.name}
                    </option>
                  ))}
                </select>
              </div>
            )}


            {/* Basic Info */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả buổi học
            </label>
            <div className="space-y-4">
              <textarea
                name="description"
                value={scheduleData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Mô tả buổi học..."
                rows={3}
              />
               <label className="block text-sm font-medium text-gray-700 mb-1">
               Thời lượng buổi học (Phút)
              </label>
              <input
                type="number"
                name="duration"
                value={scheduleData.duration}
                onChange={handleInputChange}
                min="30"
                step="15"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Thời lượng (phút)"
              />
            </div>

            {/* Dates and Time */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
               Thời gian bắt đầu và kết thúc
              </label>
            <div className="grid grid-cols-2 gap-4">
           
              <div>
                <input
                  type="date"
                  name="startDate"
                  value={scheduleData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <input
                  type="date"
                  name="endDate"
                  value={scheduleData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
               Thời gian bắt đầu buổi học
              </label>
            <input
              type="time"
              name="startTime"
              value={scheduleData.startTime}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            />

              <label className="block text-sm font-medium text-gray-700 mb-1">
               Chọn ngày học
              </label>
            {/* Days Selection */}
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map((day) => (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => handleDaySelect(day.id)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    scheduleData.daysOfWeek.includes(day.id)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {day.name}
                </button>
              ))}
            </div>

            {/* Session Type */}
            <div className="space-y-4">
              <select
                name="sessionType"
                value={scheduleData.sessionType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                {sessionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              {scheduleData.sessionType === "ONLINE" && (
                <input
                  type="text"
                  name="onlineLink"
                  value={scheduleData.onlineLink}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Link học trực tuyến"
                />
              )}

              {scheduleData.sessionType === "OFFLINE" && (
                <input
                  type="text"
                  name="location"
                  value={scheduleData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Địa điểm học"
                />
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-between items-center mt-6">
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                {isEditing ? "Cập nhật Lịch Học" : "Tạo Lịch Học"}
              </button>

              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancle}
                  className="ml-4 px-6 py-2 text-gray-700 font-medium rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Hủy
                </button>
              )}
            </div>

          </form>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Xem trước lịch học
          </h2>

          <div className="space-y-4">
            {/* Selected Course & Class Info */}
            {selectedCourse && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-semibold text-gray-800">
                  {selectedCourse.title}
                </h3>
                {selectedClass && (
                  <p className="text-gray-600 mt-1">{selectedClass.name}</p>
                )}
              </div>
            )}

            {/* Schedule Details */}
            {scheduleData.startDate && scheduleData.endDate && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar size={18} />
                <span>
                  {format(new Date(scheduleData.startDate), "dd/MM/yyyy", {
                    locale: vi,
                  })}{" "}
                  -{" "}
                  {format(new Date(scheduleData.endDate), "dd/MM/yyyy", {
                    locale: vi,
                  })}
                </span>
              </div>
            )}

          {scheduleData.startTime && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock size={18} />
                    <span>
                      {scheduleData.startTime} - {calculateEndTime(scheduleData.startTime, scheduleData.duration)}
                    </span>
                  </div>
                )}

            {/* Selected Days */}
            {scheduleData.daysOfWeek.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {scheduleData.daysOfWeek
                  .sort((a, b) => a - b)
                  .map((dayId) => (
                    <span
                      key={dayId}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {daysOfWeek.find((day) => day.id === dayId)?.name}
                    </span>
                  ))}
              </div>
            )}

            {/* Session Type Info */}
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="font-medium text-gray-700">
                {sessionTypes.find((type) => type.value === scheduleData.sessionType)?.label}
              </p>
              {scheduleData.sessionType === "ONLINE" && scheduleData.onlineLink && (
                <p className="text-gray-600 mt-1">{scheduleData.onlineLink}</p>
              )}
              {scheduleData.sessionType === "OFFLINE" && scheduleData.location && (
                <p className="text-gray-600 mt-1">{scheduleData.location}</p>
              )}
            </div>

            {/* Preview Calendar */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-4">Lịch học dự kiến</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {previewDates.map((session, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                  >
                    <div>
                      <p className="font-medium">
                        {format(session.date, "EEEE, dd/MM/yyyy", { locale: vi })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {session.startTime} - {session.endTime}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default RecurringScheduleForm;
