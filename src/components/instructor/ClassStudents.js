import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudentOfClass } from '../../services/courseClassService';
import { ArrowLeft } from 'lucide-react';

const ClassStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { classId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, [classId]);

  const fetchStudents = async () => {
    try {
      const response = await getStudentOfClass(classId);
      setStudents(response);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg font-semibold text-gray-600">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/instructor/classes')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Quay lại danh sách lớp
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6">Danh sách học viên</h1>

      <div className="bg-white rounded-lg shadow-md">
        {students.map((student) => (
          <div
            key={student.id}
            className="flex items-center justify-between p-4 border-b last:border-b-0"
          >
            <div>
              <p className="font-medium">{student.fullName}</p>
              <p className="text-sm text-gray-600">{student.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassStudents;