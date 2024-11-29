import React, { useState, useMemo, useEffect } from "react";
import { Calendar, Clock, Search, X } from "lucide-react";
import { format, eachDayOfInterval, getDay } from "date-fns";
import { vi } from "date-fns/locale";
import { getCourses } from "../../../services/coursesService";
import userService from "../../../services/userService";
import { getClassByCourseId } from "../../../services/courseClassService";
import { addRecurringSchedule } from "../../../services/scheduleService";

const RecurringScheduleForm = () => {
  const [courses, setCourses] = useState([]);
  const [courseClasses, setCourseClasses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [scheduleData, setScheduleData] = useState({
    courseClassId: "",
    instructorId: "",
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
  const [instructorSearch, setInstructorSearch] = useState("");
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    { value: "VIDEO", label: "Video" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesResponse, instructorsResponse] = await Promise.all([
          getCourses(),
          userService.getInstructors(),
        ]);
        setCourses(coursesResponse);
        setInstructors(instructorsResponse);
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

  const filteredInstructors = useMemo(
    () =>
      instructors.filter((instructor) =>
        instructor.fullName
          .toLowerCase()
          .includes(instructorSearch.toLowerCase())
      ),
    [instructorSearch, instructors]
  );

  const calculateEndTime = (startTime, duration) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;
    return `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(
      2,
      "0"
    )}`;
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

  const handleInstructorSelect = (instructor) => {
    setSelectedInstructor(instructor);
    setScheduleData((prev) => ({ ...prev, instructorId: instructor.id }));
    setInstructorSearch("");
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
      const response = await addRecurringSchedule(scheduleData);

      if (response.ok) {
        alert("Tạo lịch học thành công!");
      } else {
        throw new Error("Có lỗi xảy ra");
      }
    } catch (error) {
      alert("Không thể tạo lịch học: " + error.message);
    }
  };

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
            Tạo Lịch Học
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
                      >
                        {course.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Class Selection */}
            {selectedCourse && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lớp học
                </label>
                <select
                  onChange={(e) => {
                    const selectedClass = courseClasses.find(
                      (c) => c.id === e.target.value
                    );
                    handleClassSelect(selectedClass);
                  }}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn lớp học</option>
                  {courseClasses.map((courseClass) => (
                    <option key={courseClass.id} value={courseClass.id}>
                      {courseClass.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Instructor Selection */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giảng viên
              </label>
              <input
                type="text"
                value={instructorSearch}
                onChange={(e) => setInstructorSearch(e.target.value)}
                onFocus={() => setIsDropdownOpen(true)}
                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)} // Delay để chọn được item trước khi đóng
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tìm giảng viên..."
              />
              {isDropdownOpen && filteredInstructors.length > 0 && (
                <div className="absolute z-10 w-60 mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredInstructors.map((instructor) => (
                    <div
                      key={instructor.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        handleInstructorSelect(instructor);
                        setInstructorSearch(instructor.fullName); // Cập nhật input khi chọn
                        setIsDropdownOpen(false); // Đóng dropdown
                      }}
                    >
                      {instructor.fullName}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <textarea
                name="description"
                value={scheduleData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Mô tả buổi học..."
                rows={3}
              />

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

            <input
              type="time"
              name="startTime"
              value={scheduleData.startTime}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            />

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
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              Tạo lịch học
            </button>
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
                  <p className="text-gray-600">Lớp: {selectedClass.name}</p>
                )}
              </div>
            )}

            {/* Selected Instructor */}
            {selectedInstructor && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-semibold text-gray-800">Giảng viên</h3>
                <p className="text-gray-600">{selectedInstructor.fullName}</p>
              </div>
            )}

            {/* Session Details */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-semibold text-gray-800 mb-2">
                Chi tiết buổi học
              </h3>
              <div className="space-y-2 text-gray-600">
                <p>Thời lượng: {scheduleData.duration} phút</p>
                <p>
                  Hình thức:{" "}
                  {
                    sessionTypes.find(
                      (t) => t.value === scheduleData.sessionType
                    )?.label
                  }
                </p>
                {scheduleData.sessionType === "ONLINE" &&
                  scheduleData.onlineLink && (
                    <p>Link học: {scheduleData.onlineLink}</p>
                  )}
                {scheduleData.sessionType === "OFFLINE" &&
                  scheduleData.location && (
                    <p>Địa điểm: {scheduleData.location}</p>
                  )}
              </div>
            </div>

            {/* Preview Calendar */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-4">
                Lịch học dự kiến
              </h3>
              <div className="space-y-2">
                {previewDates.map((session, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-2 bg-gray-50 rounded-md"
                  >
                    <Calendar size={16} className="text-gray-500" />
                    <span className="text-gray-700">
                      {format(session.date, "eeee, dd/MM/yyyy", { locale: vi })}
                    </span>
                    <Clock size={16} className="text-gray-500" />
                    <span className="text-gray-700">
                      {session.startTime} - {session.endTime}
                    </span>
                  </div>
                ))}
              </div>

              {previewDates.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  Chọn ngày bắt đầu, kết thúc và các ngày trong tuần để xem
                  trước lịch học
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecurringScheduleForm;
