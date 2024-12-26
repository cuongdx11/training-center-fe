import React, { useState, useEffect } from 'react';
import { QrCode, Clock, CheckCircle2, XCircle, Plus } from 'lucide-react';
import { getClassOfInstructor } from '../../services/courseClassService';
import { createAttendanceSession, getAttendanceSessionOfClass, getAttendanceSessionDetails } from '../../services/attendanceSessionService';

const CreateAttendanceModal = ({ isOpen, onClose, onSuccess, classList }) => {
  const [classId, setClassId] = useState('');
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreate = async () => {
    if (!classId) {
      setError('Vui lòng chọn lớp học');
      return;
    }

    setLoading(true);
    try {
      const data = await createAttendanceSession({
        classId,
        durationMinutes: duration
      });

      if (data.qrContent) {
        const selectedClass = classList.find(c => c.id === classId);
        const qrPageUrl = `/attendance-qr?${new URLSearchParams({
          qrCodeUrl: data.qrContent,
          className: selectedClass?.name || '',
          duration: duration.toString()
        })}`;
        window.open(qrPageUrl, '_blank');
        onSuccess();
        onClose();
      }
    } catch (err) {
      setError('Không thể tạo phiên điểm danh');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Tạo Phiên Điểm Danh Mới</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Chọn Lớp Học
          </label>
          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
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

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Thời Gian Điểm Danh (phút)
          </label>
          <div className="flex items-center">
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              min="10"
              max="120"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Clock className="ml-2 text-gray-500" size={20} />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            Hủy
          </button>
          <button
            onClick={handleCreate}
            disabled={loading}
            className={`flex items-center px-4 py-2 rounded-md text-white
              ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Đang tạo...' : 'Tạo phiên'}
            <QrCode className="ml-2" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

const AttendanceListPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [classList, setClassList] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [sessionList, setSessionList] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classes = await getClassOfInstructor();
        setClassList(classes);
      } catch (err) {
        setError('Không thể tải danh sách lớp học');
      }
    };
    fetchClasses();
  }, []);

  const fetchAttendanceSessions = async (classId) => {
    if (!classId) return;
    setLoading(true);
    try {
      const sessions = await getAttendanceSessionOfClass(classId);
      setSessionList(sessions);
      setSelectedSessionId('');
      setAttendanceData(null);
    } catch (err) {
      setError('Không thể tải danh sách buổi học');
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClassId(classId);
    fetchAttendanceSessions(classId);
  };

  const handleSessionChange = (e) => {
    const sessionId = e.target.value;
    setSelectedSessionId(sessionId);
    if (sessionId) {
      fetchSessionDetails(sessionId);
    }
  };

  const fetchSessionDetails = async (sessionId) => {
    setLoading(true);
    try {
      const details = await getAttendanceSessionDetails(sessionId);
      setAttendanceData(details);
    } catch (err) {
      setError('Không thể tải chi tiết điểm danh');
    } finally {
      setLoading(false);
    }
  };

  const renderStudentList = (students, status) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {students.map(student => (
        <div key={student.id} className="bg-white shadow-md rounded-lg p-4 flex items-center">
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

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Quản Lý Điểm Danh
          </h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus size={20} className="mr-2" />
            Tạo Điểm Danh
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Chọn Lớp Học
          </label>
          <select
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

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Chọn Buổi Học
          </label>
          <select
            value={selectedSessionId}
            onChange={handleSessionChange}
            disabled={!selectedClassId}
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

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center mt-8">
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : attendanceData ? (
          <div>
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
        ) : null}
      </div>

      <CreateAttendanceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => fetchAttendanceSessions(selectedClassId)}
        classList={classList}
      />
    </div>
  );
};

export default AttendanceListPage;