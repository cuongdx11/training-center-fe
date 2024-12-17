import React, { useEffect, useState } from "react";
import { getScheduleByInstructor } from "../../services/scheduleService";
import moment from "moment";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin 
} from 'lucide-react';

const DAYS_OF_WEEK = [
  "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"
];

const InstructorSchedule = ({ instructorId }) => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedWeek, setSelectedWeek] = useState(moment());

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                setLoading(true);
                const data = await getScheduleByInstructor(instructorId);
                setSchedules(data);
            } catch (err) {
                setError("Không thể tải lịch dạy.");
            } finally {
                setLoading(false);
            }
        };

        fetchSchedules();
    }, [instructorId]);

    const generateTimeSlots = () => {
        return Array.from({length: 15}, (_, i) => 7 + i);
    };

    const renderWeeklySchedule = () => {
        const timeSlots = generateTimeSlots();
        const weekStart = selectedWeek.clone().startOf('week');

        return (
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <div className="grid grid-cols-8 border-b">
                    {/* Time slots column */}
                    <div className="col-span-1 bg-gray-50 border-r">
                        <div className="h-12 flex items-center justify-center font-bold text-gray-700">
                            <Clock className="mr-2 w-5 h-5" /> Giờ
                        </div>
                        {timeSlots.map(hour => (
                            <div 
                                key={hour} 
                                className="h-16 border-t flex items-center justify-center text-sm text-gray-600"
                            >
                                {hour}:00 - {hour+1}:00
                            </div>
                        ))}
                    </div>

                    {/* Days columns */}
                    {DAYS_OF_WEEK.map((day, dayIndex) => (
                        <div key={day} className="col-span-1 border-l">
                            <div className="h-12 flex flex-col items-center justify-center font-bold bg-gray-50">
                                <span className="text-sm text-gray-700">{day}</span>
                                <span className="text-xs text-gray-500">
                                    {weekStart.clone().add(dayIndex, 'days').format('DD/MM')}
                                </span>
                            </div>
                            
                            {/* Time slots for each day */}
                            {timeSlots.map(startHour => {
                                const daySchedules = schedules.filter(schedule => {
                                    const scheduleDate = moment(schedule.sessionDate);
                                    const scheduleDay = scheduleDate.day();
                                    const scheduleStartHour = moment(schedule.startTime).hour();
                                    const scheduleEndHour = moment(schedule.endTime).hour();
                                    
                                    return (
                                        scheduleDay === dayIndex + 1 && 
                                        scheduleStartHour <= startHour && 
                                        scheduleEndHour > startHour
                                    );
                                });

                                return (
                                    <div 
                                        key={startHour} 
                                        className="h-16 border-t relative"
                                    >
                                        {daySchedules.map((schedule) => (
                                            <div 
                                                key={schedule.id}
                                                className="absolute inset-0 bg-blue-50 border-l-4 border-blue-500 p-2 overflow-hidden hover:bg-blue-100 transition-colors"
                                                title={`${schedule.courseClass.name} - ${moment(schedule.startTime).format('HH:mm')} - ${moment(schedule.endTime).format('HH:mm')}`}
                                            >
                                                <div className="text-xs font-semibold text-blue-800 truncate">
                                                    {schedule.courseClass.name}
                                                </div>
                                                <div className="text-xs text-gray-600 flex items-center">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {moment(schedule.startTime).format('HH:mm')} - {moment(schedule.endTime).format('HH:mm')}
                                                </div>
                                                {schedule.location && (
                                                    <div className="text-xs text-gray-500 flex items-center">
                                                        <MapPin className="w-3 h-3 mr-1" />
                                                        {schedule.location}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (loading) return (
        <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            {error}
        </div>
    );

    return (
        <div className="p-4 space-y-4">
            <div className="flex justify-between items-center bg-white shadow-sm rounded-lg p-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <Calendar className="mr-2 w-6 h-6 text-blue-500" />
                    Lịch Dạy Hàng Tuần
                </h2>
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => setSelectedWeek(prev => prev.clone().subtract(1, 'week'))}
                        className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-medium text-gray-700">
                        {selectedWeek.format('Tuần: DD/MM/YYYY')}
                    </span>
                    <button 
                        onClick={() => setSelectedWeek(prev => prev.clone().add(1, 'week'))}
                        className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {schedules.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-3 rounded text-center">
                    Không có lịch dạy trong tuần này.
                </div>
            ) : (
                renderWeeklySchedule()
            )}
        </div>
    );
};

export default InstructorSchedule;