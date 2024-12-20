import React, { useEffect, useState } from 'react';
import { ChevronRight, GraduationCap, FileText, CalendarDays } from 'lucide-react';
import { getInstructorStatistics } from '../../services/statisticsService';
import { getClassOfInstructor } from '../../services/courseClassService';
import { getAssignmentsOfInstructor } from '../../services/assignmentService';

const DashboardInstructorPage = () => {
  const [stats, setStats] = useState({
    totalSchedulesThisWeek: 0,
    totalActiveCourseClasses: 0,
    totalAssignments: 0,
  });

  const [recentClasses, setRecentClasses] = useState([]);
  const [recentAssignments, setRecentAssignments] = useState([]);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const data = await getInstructorStatistics();
        setStats(data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    const fetchClasses = async () => {
      try {
        const data = await getClassOfInstructor();
        setRecentClasses(data);
      } catch (error) {
        console.error('Error fetching active classes:', error);
      }
    };

    const fetchRecentAssignments = async () => {
      try {
        const data = await getAssignmentsOfInstructor();
        setRecentAssignments(data);
      } catch (error) {
        console.error('Error fetching recent assignments:', error);
      }
    };

    fetchStatistics();
    fetchClasses();
    fetchRecentAssignments();
  }, []);

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Giảng Viên</h1>
        </div>
        <div className="text-sm text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm">
          {new Date().toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center">
            <div className="p-3 bg-white bg-opacity-30 rounded-lg">
              <CalendarDays className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-100">Lịch Dạy</p>
              <p className="text-3xl font-bold">{stats.totalSchedulesThisWeek}</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-blue-100">Số buổi dạy trong tuần</div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center">
            <div className="p-3 bg-white bg-opacity-30 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-100">Lớp Học Đang Dạy</p>
              <p className="text-3xl font-bold">{stats.totalActiveCourseClasses}</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-purple-100">Các lớp học đang diễn ra</div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center">
            <div className="p-3 bg-white bg-opacity-30 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-100">Bài Tập Đã Giao</p>
              <p className="text-3xl font-bold">{stats.totalAssignments}</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-green-100">Bài nộp đã giao cho học viên</div>
        </div>
      </div>

      {/* Sections Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Classes Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Lớp Học Đang Dạy</h2>
            <button className="text-blue-600 hover:text-blue-700 flex items-center">
              Xem tất cả
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="space-y-4">
            {recentClasses.map(course => (
              <div
                key={course.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">{course.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Assignments Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Bài Tập Gần Đây</h2>
            <button className="text-blue-600 hover:text-blue-700 flex items-center">
              Xem tất cả
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="space-y-4">
            {recentAssignments.map(assignment => (
              <div
                key={assignment.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{assignment.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {assignment.dueDate} • {assignment.courseClass.name}
                    </p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm">Chi tiết</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardInstructorPage;
