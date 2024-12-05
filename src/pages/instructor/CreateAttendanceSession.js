import React, { useState, useEffect } from 'react';
import { QrCode, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getClassOfInstructor } from '../../services/courseClassService'; 
import { createAttendanceSession } from '../../services/attendanceSessionService'

const CreateAttendanceSession = () => {
  const navigate = useNavigate();
  const [classId, setClassId] = useState('');
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [classList, setClassList] = useState([]);
  const [classLoading, setClassLoading] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      setClassLoading(true);
      try {
        const classes = await getClassOfInstructor();
        setClassList(classes);
      } catch (err) {
        setError('Không thể tải danh sách lớp học');
        console.error('Error fetching classes:', err);
      } finally {
        setClassLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleCreateSession = async () => {
    if (!classId) {
      setError('Vui lòng chọn lớp học');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await createAttendanceSession({
        classId: classId,
        durationMinutes: duration
      });

      // Chuyển hướng đến trang hiển thị QR với thông tin phiên điểm danh
      if (data.qrContent) {
        const selectedClass = classList.find(c => c.id === classId);
        navigate('/attendance-qr', { 
          state: { 
            qrCodeUrl: data.qrContent,
            className: selectedClass?.name,
            duration: duration
          } 
        });
      }
    } catch (err) {
      setError('Không thể tạo phiên điểm danh. Vui lòng thử lại.');
      console.error('Error creating attendance session:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Tạo Phiên Điểm Danh</h2>
      
      <div className="mb-4">
        <label htmlFor="classId" className="block text-gray-700 font-semibold mb-2">
          Chọn Lớp Học
        </label>
        <select
          id="classId"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          disabled={classLoading}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Chọn Lớp Học --</option>
          {classLoading ? (
            <option disabled>Đang tải danh sách lớp...</option>
          ) : (
            classList.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.name}
              </option>
            ))
          )}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="duration" className="block text-gray-700 font-semibold mb-2">
          Thời Gian Điểm Danh (phút)
        </label>
        <div className="flex items-center">
          <input
            type="number"
            id="duration"
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

      <button
        onClick={handleCreateSession}
        disabled={loading || classLoading}
        className={`w-full flex items-center justify-center py-2 px-4 rounded-md text-white font-semibold 
          ${(loading || classLoading)
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
          }`}
      >
        {loading ? 'Đang Tạo...' : 'Tạo Phiên Điểm Danh'}
        <QrCode className="ml-2" size={20} />
      </button>
    </div>
  );
};

export default CreateAttendanceSession;