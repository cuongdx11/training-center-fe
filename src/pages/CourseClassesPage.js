import React, { useState, useEffect } from 'react';
import { Calendar, Users, MapPin, AlertCircle,Clock } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClassByCourse } from '../services/courseClassService';
import {getCourseById} from '../services/coursesService';
import { addUserToClass } from '../services/classStudent';
import Swal from 'sweetalert2';

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

        try {
          const classesData = await getClassByCourse(courseId);
          setClasses(classesData);
        } catch (error) {
          if (error.response) {
            // Kiểm tra mã lỗi 404
            if (error.response.status === 404) {
              const message = error.response.data?.message || "Bạn chưa đăng ký khóa học này.";
               Swal.fire({
                      icon: 'warning',
                      title: message,
                      text: 'Vui đăng ký khóa học này trước',
                    });
             
              navigate(`/courses/${courseId}`); // Điều hướng về trang khóa học
            }
            // Kiểm tra mã lỗi 403
            else if (error.response.status === 403) {
              const message = error.response.data?.message || "Bạn chưa kích hoạt khóa học này";
              Swal.fire({
                icon: 'warning',
                title: message,
                text: 'Vui lòng kiểm tra lại lớp họchọc',
              });
              navigate(`/classes`); 
            }
            // Các mã lỗi khác
            else {
              const message = error.response.data?.message || "Không thể tải lớp học.";
              console.error(message, error);
            }
          } else {
            // Nếu không có phản hồi từ backend
            console.error("Lỗi kết nối hoặc không có phản hồi từ server.", error);
          }
        }
        
        
      } catch (error) {
        console.error("Không thể tải thông tin khóa học và lớp học", error);
        navigate('/courses');
      }
    };

    fetchClasses();
  }, [courseId, navigate]);

  const handleClassRegistration = async () => {
    if (!selectedClassId) {
      Swal.fire({
        icon: 'warning',
        title: 'Cảnh báo',
        text: 'Vui lòng chọn một lớp học!',
      });
      return;
    }

    setLoading(true);
    try {
      await addUserToClass({ classId: selectedClassId });
  
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Đăng ký lớp học thành công!',
        confirmButtonText: 'Xem khóa học',
      }).then(() => navigate('/courses'));
    } catch (error) {
      if(error.response) {
        if(error.response.status === 409) {
          const message = error.response.data?.message
          Swal.fire({
            icon: 'error',
            title: 'Thất bại',
            text: message,
          });
        }
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Thất bại',
          text: 'Đã xảy ra lỗi khi đăng ký lớp học.',
        });
      }
      
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
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
                      <span>
                        {formatDate(cls.startDate)} - {formatDate(cls.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2 text-indigo-500" />
                      <span>{cls.studyTime} - {cls.studyDays}</span>
                    </div>
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2 text-indigo-500" />
                    <span>{course.category.type || "Online"}</span>
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