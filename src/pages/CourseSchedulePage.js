import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Loader2, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { getCourseSchedule } from '../services/coursesService';
const TIME_SLOTS = Array.from({ length: 15 }, (_, i) => i + 7); // 7:00 -> 21:00

const CourseSchedulePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  useEffect(() => {
    const fetchScheduleData = async () => {
      if (!courseId) {
        setError('Không tìm thấy mã khóa học');
        return;
      }

      try {
        setLoading(true);
        const scheduleData = await getCourseSchedule(courseId);

        if (scheduleData && scheduleData.data.length > 0) {
          setCourseDetails(scheduleData.data[0].course);
          setSessions(scheduleData.data);
        } else {
          setError('Hiện chưa có lịch học nào được đăng ký cho khóa học này.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleData();
  }, [courseId]);

  const getWeekDays = (current) => {
    const week = [];
    const first = current.getDate() - current.getDay();
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(current.getFullYear(), current.getMonth(), first + i);
      week.push(day);
    }
    return week;
  };

  const weekDays = getWeekDays(currentWeek);

  const handlePrevWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeek(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeek(newDate);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      weekday: 'long',
      day: 'numeric',
      month: 'numeric'
    }).format(date);
  };

  const formatTime = (timeString) => {
    const time = new Date(timeString);
    return time.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSessionsForDateAndHour = (date, hour) => {
    return sessions.filter(session => {
      const sessionDate = new Date(session.sessionDate);
      const sessionStartHour = new Date(session.startTime).getHours();
      return sessionDate.toDateString() === date.toDateString() && sessionStartHour === hour;
    });
  };

  const handleBack = () => navigate(-1);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button onClick={handleBack} className="mb-4 flex items-center text-gray-700 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </button>
        <div className="max-w-lg mx-auto bg-red-100 border border-red-200 rounded-lg p-4">
          <h3 className="font-bold text-red-600">Lỗi</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={handleBack} className="mb-4 flex items-center text-gray-700 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Quay lại
      </button>

      {courseDetails && (
        <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-4">{courseDetails.title}</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Cấp độ</p>
              <p className="font-semibold">{courseDetails.level}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Thời lượng</p>
              <p className="font-semibold">{courseDetails.duration} giờ</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Số lượng học viên</p>
              <p className="font-semibold">{courseDetails.studentCount}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Học phí</p>
              <p className="font-semibold">{courseDetails.price?.toLocaleString('vi-VN')}đ</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Lịch học theo tuần</h2>
          <div className="flex items-center gap-4">
            <button onClick={handlePrevWeek} className="p-2 hover:bg-gray-100 rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-medium">
              Tuần {weekDays[0].getDate()}/{weekDays[0].getMonth() + 1} - {weekDays[6].getDate()}/{weekDays[6].getMonth() + 1}
            </span>
            <button onClick={handleNextWeek} className="p-2 hover:bg-gray-100 rounded-full">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="min-w-[800px]">
          {/* Header */}
          <div className="grid grid-cols-8 gap-1">
            <div className="w-20" /> {/* Empty corner */}
            {weekDays.map((day, index) => (
              <div 
                key={index} 
                className={`p-2 text-center border-b ${
                  day.toDateString() === new Date().toDateString() 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-50'
                }`}
              >
                <div className="font-medium">{formatDate(day).split(',')[0]}</div>
                <div className="text-sm">{day.getDate()}</div>
              </div>
            ))}
          </div>

          {/* Time slots */}
          {TIME_SLOTS.map(hour => (
            <div key={hour} className="grid grid-cols-8 gap-1 border-b">
              <div className="w-20 py-2 px-1 text-right text-sm text-gray-500">
                {`${hour}:00`}
              </div>
              {weekDays.map((day, dayIndex) => (
                <div 
                  key={`${hour}-${dayIndex}`} 
                  className="relative h-12 bg-gray-50 border-l"
                >
                  {getSessionsForDateAndHour(day, hour).map((session, idx) => (
                    <div 
                      key={idx}
                      className="absolute inset-0 m-1 p-1 bg-blue-100 rounded text-xs overflow-hidden cursor-pointer hover:bg-blue-200"
                      title={`${session.instructorName} - ${formatTime(session.startTime)} - ${session.sessionType}`}
                    >
                      <div className="font-medium truncate">{session.instructorName}</div>
                      <div className="text-gray-600 truncate">
                        {session.sessionType === 'OFFLINE' ? 'Trực tiếp' : 'Trực tuyến'}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Chi tiết các buổi học */}
      <div className="grid gap-6">
        {sessions.map((session) => (
          <div key={session.id} className="bg-white shadow-lg rounded-lg p-6">
            <div className="border-b pb-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-lg">{formatDate(new Date(session.sessionDate))}</h3>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{formatTime(session.startTime)} - {formatTime(session.endTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{session.location}</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Giảng viên</h4>
                  <p>{session.instructorName}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Hình thức học</h4>
                  <p>{session.sessionType === 'OFFLINE' ? 'Học trực tiếp' : 'Học trực tuyến'}</p>
                  {session.onlineLink && (
                    <a 
                      href={session.onlineLink}
                      className="mt-2 inline-block text-blue-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Tham gia lớp học trực tuyến
                    </a>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Nội dung buổi học</h4>
                <p className="text-gray-600">{session.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseSchedulePage;