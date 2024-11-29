import React, { useState, useEffect } from "react";
import {getCourseByUserRegister} from '../services/coursesService';
import {getClassByCourseId} from '../services/courseClassService';
import {addUserToClass} from '../services/classStudent';
const RegisteredCoursesClassPage = () => {
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch registered courses
  useEffect(() => {
    const fetchRegisteredCourses = async () => {
      try {
        const response = await getCourseByUserRegister();
        setRegisteredCourses(response);
      } catch (error) {
        console.error("Không thể tải danh sách khóa học đã đăng ký", error);
      }
    };

    fetchRegisteredCourses();
  }, []);

  // Fetch classes for selected course
  useEffect(() => {
    const fetchClasses = async () => {
      if (selectedCourse) {
        try {
          const data = await getClassByCourseId(selectedCourse.id)
          setClasses(data);
        } catch (error) {
          console.error("Không thể tải danh sách lớp học", error);
        }
      }
    };

    fetchClasses();
  }, [selectedCourse]);

  const handleClassSelection = async () => {
    if (!selectedClassId) {
      return alert("Vui lòng chọn một lớp học!");
    }

    setLoading(true);
    try {
      await addUserToClass({classId: selectedClassId})
      alert("Đăng ký lớp học thành công!");
      
      // Cập nhật trạng thái sau khi đăng ký thành công
      setRegisteredCourses(prevCourses => 
        prevCourses.map(course => 
          course.id === selectedCourse.id 
            ? { ...course, selectedClassId: selectedClassId } 
            : course
        )
      );

      // Reset trạng thái
      setSelectedCourse(null);
      setSelectedClassId(null);
      setClasses([]);
    } catch (error) {
      console.error("Đăng ký lớp học thất bại", error);
      alert("Đã xảy ra lỗi khi đăng ký lớp học.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        Các Khóa Học Đã Đăng Ký
      </h1>

      {registeredCourses.length === 0 ? (
        <p className="text-center text-gray-600">
          Bạn chưa đăng ký khóa học nào.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {registeredCourses.map((course) => (
            <div 
              key={course.id} 
              className={`border rounded-lg shadow-md p-6 transition ${
                selectedCourse?.id === course.id 
                  ? "border-indigo-500 border-2" 
                  : "border-gray-300"
              }`}
            >
              <h2 className="text-xl font-semibold mb-3">{course.title}</h2>
              <p className="text-sm text-gray-600 mb-4">
                {course.description}
              </p>
              {course.selectedClassId ? (
                <div className="bg-green-100 p-3 rounded">
                  <p className="text-green-700">
                    Đã chọn lớp: {course.selectedClassName}
                  </p>
                </div>
              ) : (
                <button 
                  onClick={() => setSelectedCourse(course)}
                  className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 transition"
                >
                  Chọn Lớp
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-6">
              Chọn Lớp Cho Khóa: {selectedCourse.title}
            </h2>
            
            {classes.length === 0 ? (
              <p className="text-center text-gray-600">
                Không có lớp học nào để hiển thị.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {classes.map((cls) => (
                  <div
                    key={cls.id}
                    className={`p-4 border rounded-lg cursor-pointer hover:shadow-lg transition ${
                      selectedClassId === cls.id 
                        ? "border-indigo-500 bg-indigo-100" 
                        : "border-gray-300"
                    }`}
                    onClick={() => setSelectedClassId(cls.id)}
                  >
                    <h3 className="text-lg font-semibold">{cls.name}</h3>
                    <p className="text-sm text-gray-600">{cls.description}</p>
                    <p className="mt-2 text-sm">
                      <strong>Thời gian:</strong> {cls.schedule}
                    </p>
                    <p className="mt-1 text-sm">
                      <strong>Địa điểm:</strong> {cls.location || "Online"}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-between">
              <button 
                onClick={() => {
                  setSelectedCourse(null);
                  setSelectedClassId(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
              >
                Hủy
              </button>
              <button 
                onClick={handleClassSelection}
                disabled={!selectedClassId || loading}
                className={`px-4 py-2 rounded text-white ${
                  !selectedClassId || loading 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-indigo-500 hover:bg-indigo-600"
                }`}
              >
                {loading ? "Đang xử lý..." : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisteredCoursesClassPage;