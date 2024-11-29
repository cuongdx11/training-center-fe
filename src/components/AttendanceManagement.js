import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, Check, X } from 'lucide-react';
import { getClass, getStudentOfClass } from '../services/courseClassService';
import {addAttendance} from '../services/attendanceService';


const AttendanceManagement = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch classes on component mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await getClass();
        setClasses(response);
      } catch (err) {
        setError('Failed to fetch classes');
        console.error(err);
      }
    };

    fetchClasses();
  }, []);

  // Fetch students when a class is selected
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClass) return;

      try {
        setLoading(true);
        const data = await getStudentOfClass(selectedClass.id);
        
        // Transform students to include attendance status
        const studentsWithAttendance = data.map(student => ({
          ...student,
          status: null
        }));

        setStudents(studentsWithAttendance);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch students');
        console.error(err);
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedClass]);

  const handleAttendance = async (studentId, status) => {
    // Update local state immediately for responsiveness
    setStudents(students.map(student => 
      student.id === studentId ? { ...student, status } : student
    ));

    try {
      setSaving(true);
      const userData = JSON.parse(localStorage.getItem('user'));
      const userId = userData.id;
      await addAttendance({
        classId: selectedClass.id,
        studentId: studentId,
        createdBy: userId, 
        date: new Date().toISOString().split('T')[0], 
        status: status ? 'PRESENT' : 'ABSENT',
        note: '' 
      })
      setSaving(false);
    } catch (err) {
      console.error('Failed to save attendance', err);
      // Revert local state if API call fails
      setStudents(students.map(student => 
        student.id === studentId ? { ...student, status: null } : student
      ));
      setSaving(false);
      setError('Failed to save attendance');
    }
  };

  const getTotalAttendance = () => {
    const presentCount = students.filter(student => student.status === true).length;
    const absentCount = students.filter(student => student.status === false).length;
    return { presentCount, absentCount };
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600 flex items-center">
            <Calendar className="mr-2" /> Điểm Danh Học Viên
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Users className="mr-2 text-green-500" />
              <span>Tổng SL: {students.length}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 text-blue-500" />
              <span>Ngày: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2">Chọn Lớp Học</label>
          <select 
            className="w-full p-2 border rounded-md"
            onChange={(e) => {
              const selectedClassId = e.target.value;
              const classDetails = classes.find(c => c.id === selectedClassId);
              setSelectedClass(classDetails);
            }}
            value={selectedClass?.id || ''}
          >
            <option value="">Chọn lớp</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>
                {cls.name} - {cls.studyTime}
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="text-center text-blue-600 font-semibold">
            Đang tải danh sách học viên...
          </div>
        )}

        {saving && (
          <div className="text-center text-blue-600 font-semibold">
            Đang lưu điểm danh...
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        {selectedClass && !loading && (
          <div className="bg-blue-50 p-4 rounded-md mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {selectedClass.name} - {selectedClass.studyTime}
            </h2>
            <div className="grid gap-4">
              {students.map(student => (
                <div 
                  key={student.id} 
                  className="flex justify-between items-center bg-white p-3 rounded-md shadow"
                >
                  <div className="flex items-center">
                    {student.profilePicture && (
                      <img 
                        src={student.profilePicture} 
                        alt={student.fullName} 
                        className="w-10 h-10 rounded-full mr-3"
                      />
                    )}
                    <span className="font-medium">{student.fullName}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleAttendance(student.id, true)}
                      disabled={saving}
                      className={`p-2 rounded-full ${
                        student.status === true 
                        ? 'bg-green-500 text-white' 
                        : 'bg-green-100 text-green-600'
                      } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Check size={20} />
                    </button>
                    <button 
                      onClick={() => handleAttendance(student.id, false)}
                      disabled={saving}
                      className={`p-2 rounded-full ${
                        student.status === false 
                        ? 'bg-red-500 text-white' 
                        : 'bg-red-100 text-red-600'
                      } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedClass && students.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-4">Thống Kê Điểm Danh</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-100 p-4 rounded-md text-center">
                <h4 className="font-bold text-green-800 flex items-center justify-center">
                  <Check className="mr-2" /> Có Mặt
                </h4>
                <p className="text-2xl font-bold text-green-600">
                  {getTotalAttendance().presentCount}
                </p>
              </div>
              <div className="bg-red-100 p-4 rounded-md text-center">
                <h4 className="font-bold text-red-800 flex items-center justify-center">
                  <X className="mr-2" /> Vắng Mặt
                </h4>
                <p className="text-2xl font-bold text-red-600">
                  {getTotalAttendance().absentCount}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceManagement;