import React, { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  isSameMonth,
} from "date-fns";
import { vi } from "date-fns/locale";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Link2 
} from "lucide-react";

const UserCalendar = ({ schedules }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const startMonth = startOfMonth(currentDate);
  const endMonth = endOfMonth(currentDate);
  const startWeek = startOfWeek(startMonth, { weekStartsOn: 1 });
  const endWeek = endOfWeek(endMonth, { weekStartsOn: 1 });

  const getDatesInMonthView = () => {
    let days = [];
    let current = startWeek;

    while (current <= endWeek) {
      days.push(current);
      current = addDays(current, 1);
    }

    return days;
  };

  const handlePreviousMonth = () => {
    setCurrentDate(addDays(startOfMonth(currentDate), -1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addDays(endOfMonth(currentDate), 1));
  };

  const renderSchedulesForDate = (date) => {
    return schedules
      .filter((schedule) => isSameDay(new Date(schedule.sessionDate), date))
      .map((schedule, index) => (
        <div
          key={index}
          className="bg-indigo-600 text-white text-xs rounded-md px-2 py-1 mt-1 truncate hover:bg-indigo-700 transition-colors"
          title={schedule.description}
        >
          {schedule.courseClassName}
        </div>
      ));
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Thanh điều hướng tháng */}
        <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
          <button
            className="hover:bg-indigo-700 p-2 rounded-full transition-colors"
            onClick={handlePreviousMonth}
          >
            <ChevronLeft />
          </button>
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-6 h-6" />
            <h2 className="text-xl font-bold">
              {format(currentDate, "MMMM yyyy", { locale: vi })}
            </h2>
          </div>
          <button
            className="hover:bg-indigo-700 p-2 rounded-full transition-colors"
            onClick={handleNextMonth}
          >
            <ChevronRight />
          </button>
        </div>

        {/* Hiển thị ngày trong tuần */}
        <div className="grid grid-cols-7 gap-2 p-4 bg-gray-100 text-center font-semibold text-gray-700">
          {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
            <div key={day} className="uppercase">{day}</div>
          ))}
        </div>

        {/* Hiển thị ngày trong tháng */}
        <div className="grid grid-cols-7 gap-2 p-4">
          {getDatesInMonthView().map((date, index) => (
            <div
              key={index}
              className={`
                border rounded-lg p-2 text-center cursor-pointer
                transition-all duration-200 ease-in-out
                ${!isSameMonth(date, currentDate) ? 'text-gray-300 bg-gray-50' : 'hover:shadow-md'}
                ${isSameDay(date, new Date()) ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}
                ${isSameDay(date, selectedDate) ? 'bg-indigo-100 ring-2 ring-indigo-500' : ''}
              `}
              onClick={() => setSelectedDate(date)}
            >
              <div className="text-sm font-medium">
                {format(date, "d", { locale: vi })}
              </div>
              <div className="mt-1">{renderSchedulesForDate(date)}</div>
            </div>
          ))}
        </div>

        {/* Hiển thị chi tiết lịch học khi chọn ngày */}
        {selectedDate && (
          <div className="bg-white p-6 border-t">
            <h3 className="text-xl font-bold text-indigo-600 mb-4 flex items-center">
              <CalendarIcon className="mr-2 w-6 h-6" />
              Lịch học ngày {format(selectedDate, "dd/MM/yyyy", { locale: vi })}
            </h3>
            <div className="space-y-4">
              {schedules
                .filter((schedule) => isSameDay(new Date(schedule.sessionDate), selectedDate))
                .map((schedule, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <h4 className="text-lg font-semibold text-indigo-600 mb-2">
                      {schedule.courseClassName}
                    </h4>
                    <p className="text-gray-700 mb-2">{schedule.description}</p>
                    
                    <div className="flex items-center text-gray-600 mb-2">
                      <Clock className="mr-2 w-4 h-4" />
                      <span>{schedule.startTime} - {schedule.endTime}</span>
                    </div>
                    
                    {schedule.location && (
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="mr-2 w-4 h-4" />
                        <span>{schedule.location}</span>
                      </div>
                    )}
                    
                    {schedule.onlineLink && (
                      <div className="flex items-center text-blue-600">
                        <Link2 className="mr-2 w-4 h-4" />
                        <a
                          href={schedule.onlineLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          Link học online
                        </a>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCalendar;