import React, { useState, useEffect } from 'react';
import { Calendar, Users, MapPin, AlertCircle } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClassByCourseId } from '../services/courseClassService';
import {getCourseById} from '../services/coursesService';
import { addUserToClass } from '../services/classStudent';

const CourseClassesPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch classes for the course
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        // You'll need to implement getCourseDetails in your coursesService
        const courseDetails = await getCourseById(courseId);
        setCourse(courseDetails.data);

        const classesData = await getClassByCourseId(courseId);
        setClasses(classesData);
      } catch (error) {
        console.error("Không thể tải thông tin khóa học và lớp học", error);
        navigate('/courses');
      }
    };

    fetchClasses();
  }, [courseId, navigate]);

  const handleClassRegistration = async () => {
    if (!selectedClassId) {
      alert("Vui lòng chọn một lớp học!");
      return;
    }

    setLoading(true);
    try {
      await addUserToClass({ classId: selectedClassId });
      alert("Đăng ký lớp học thành công!");
      navigate('/courses'); // Or redirect to a confirmation page
    } catch (error) {
      console.error("Đăng ký lớp học thất bại", error);
      alert("Đã xảy ra lỗi khi đăng ký lớp học.");
    } finally {
      setLoading(false);
    }
  };

  if (!course) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <AlertCircle className="mx-auto text-yellow-500 mb-4" size={48} />
          <p className="text-gray-600">Đang tải thông tin khóa học...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Chọn Lớp Học: {course.title}
        </h1>

        {classes.length === 0 ? (
          <p className="text-center text-gray-600">
            Không có lớp học nào để hiển thị.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className={`
                  p-6 border rounded-lg cursor-pointer transition 
                  ${selectedClassId === cls.id 
                    ? "border-indigo-500 bg-indigo-50 shadow-md" 
                    : "border-gray-300 hover:border-indigo-300"
                  }
                `}
                onClick={() => setSelectedClassId(cls.id)}
              >
                <h2 className="text-xl font-semibold mb-3">{cls.name}</h2>
                
                <div className="space-y-2 text-gray-600 text-sm">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2 text-indigo-500" />
                    <span>{cls.schedule}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2 text-indigo-500" />
                    <span>{cls.location || "Online"}</span>
                  </div>
                  <div className="flex items-center">
                    <Users size={16} className="mr-2 text-indigo-500" />
                    <span>
                      Còn trống: {cls.availableSeats}/{cls.totalSeats} học viên
                    </span>
                  </div>
                </div>

                {cls.availableSeats === 0 && (
                  <div className="mt-3 text-red-600 font-medium flex items-center">
                    <AlertCircle size={16} className="mr-2" />
                    Hết chỗ
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <button 
            onClick={() => navigate('/my-courses')}
            className="px-6 py-3 border border-gray-300 rounded hover:bg-gray-100 transition"
          >
            Quay lại
          </button>
          
          <button 
            onClick={handleClassRegistration}
            disabled={!selectedClassId || loading}
            className={`
              px-6 py-3 rounded text-white transition
              ${!selectedClassId || loading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-indigo-500 hover:bg-indigo-600"
              }
            `}
          >
            {loading ? "Đang xử lý..." : "Xác Nhận Đăng Ký"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseClassesPage;