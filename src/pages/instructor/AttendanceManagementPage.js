import React, { useState, useEffect } from 'react';
import {CheckCircle2, XCircle } from 'lucide-react';
import { getClassOfInstructor } from '../../services/courseClassService';
import { getAttendanceSessionOfClass } from '../../services/attendanceSessionService';
import { getAttendanceSessionDetails } from '../../services/attendanceSessionService';

const AttendanceListPage = () => {
  // State for class and session selection
  const [classList, setClassList] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [sessionList, setSessionList] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  
  // State for attendance data
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch classes on component mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classes = await getClassOfInstructor();
        setClassList(classes);
      } catch (err) {
        setError('Không thể tải danh sách lớp học');
        console.error('Error fetching classes:', err);
      }
    };

    fetchClasses();
  }, []);

  // Fetch attendance sessions when a class is selected
  const fetchAttendanceSessions = async (classId) => {
    if (!classId) {
      setError('Vui lòng chọn lớp học');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const sessions = await getAttendanceSessionOfClass(classId);
      setSessionList(sessions);
      setSelectedSessionId(''); // Reset session selection
      setAttendanceData(null);
    } catch (err) {
      setError('Không thể tải danh sách buổi học');
      console.error('Error fetching attendance sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch details for a specific session
  const fetchSessionDetails = async (sessionId) => {
    if (!sessionId) {
      setError('Vui lòng chọn buổi học');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const sessionDetails = await getAttendanceSessionDetails(sessionId);
      setAttendanceData(sessionDetails);
    } catch (err) {
      setError('Không thể tải chi tiết điểm danh');
      console.error('Error fetching session details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle class selection
  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClassId(classId);
    fetchAttendanceSessions(classId);
  };

  // Handle session selection
  const handleSessionChange = (e) => {
    const sessionId = e.target.value;
    setSelectedSessionId(sessionId);
    fetchSessionDetails(sessionId);
  };

  // Render student list
  const renderStudentList = (students, status) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student) => (
          <div 
            key={student.id} 
            className="bg-white shadow-md rounded-lg p-4 flex items-center"
          >
            <div className="flex-shrink-0 mr-4">
              {status === 'attended' ? (
                <CheckCircle2 className="text-green-500" size={24} />
              ) : (
                <XCircle className="text-red-500" size={24} />
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{student.name}</p>
              {status === 'attended' && student.attendanceTime && (
                <p className="text-xs text-gray-500 mt-1">
                  Điểm danh lúc: {new Date(student.attendanceTime).toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Danh Sách Điểm Danh
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="classId" className="block text-gray-700 font-semibold mb-2">
              Chọn Lớp Học
            </label>
            <select
              id="classId"
              value={selectedClassId}
              onChange={handleClassChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Chọn Lớp Học --</option>
              {classList.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sessionId" className="block text-gray-700 font-semibold mb-2">
              Chọn Buổi Học
            </label>
            <select
              id="sessionId"
              value={selectedSessionId}
              onChange={handleSessionChange}
              disabled={!selectedClassId || sessionList.length === 0}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">
                {selectedClassId 
                  ? (sessionList.length > 0 ? '-- Chọn Buổi Học --' : 'Không có buổi học') 
                  : '-- Chọn Lớp Trước --'}
              </option>
              {sessionList.map((session) => (
                <option key={session.id} value={session.id}>
                  {new Date(session.createdAt).toLocaleString()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center mt-8">
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : attendanceData ? (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Chi Tiết Điểm Danh Lớp: {attendanceData.className}
            </h3>

            <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow-inner">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-green-600 font-bold text-2xl">
                    {attendanceData.attendedStudents.length}
                  </p>
                  <p className="text-gray-600">Đã Điểm Danh</p>
                </div>
                <div>
                  <p className="text-red-600 font-bold text-2xl">
                    {attendanceData.notAttendedStudents.length}
                  </p>
                  <p className="text-gray-600">Chưa Điểm Danh</p>
                </div>
              </div>
              <p className="text-center text-gray-500 mt-2">
                Thời gian: {new Date(attendanceData.startTime).toLocaleString()}
              </p>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-4">
                Danh Sách Sinh Viên Đã Điểm Danh
              </h4>
              {renderStudentList(attendanceData.attendedStudents, 'attended')}
            </div>

            {attendanceData.notAttendedStudents.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-4">
                  Danh Sách Sinh Viên Chưa Điểm Danh
                </h4>
                {renderStudentList(attendanceData.notAttendedStudents, 'not-attended')}
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center items-center mt-8">
            <p className="text-gray-500 text-center">
              {selectedClassId 
                ? 'Vui lòng chọn buổi học' 
                : 'Vui lòng chọn lớp học'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceListPage;