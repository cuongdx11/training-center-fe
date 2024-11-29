import React, { useState, useEffect } from "react";
import axios from "axios";

const SelectClassPage = ({ courseId, onClassSelected }) => {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(`/courses/${courseId}/classes`);
        setClasses(response.data);
      } catch (error) {
        console.error("Failed to fetch classes", error);
      }
    };

    fetchClasses();
  }, [courseId]);

  const handleClassSelection = async () => {
    if (!selectedClassId) return alert("Vui lòng chọn một lớp học!");

    setLoading(true);
    try {
      await axios.post(`/classes/select-class`, {
        classId: selectedClassId,
      });
      alert("Lớp học đã được chọn thành công!");
      if (onClassSelected) onClassSelected(selectedClassId);
    } catch (error) {
      console.error("Failed to select class", error);
      alert("Đã xảy ra lỗi khi chọn lớp học.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold text-center mb-6">
        Chọn Lớp Học Cho Khóa Học
      </h1>
      {classes.length === 0 ? (
        <p className="text-center text-gray-600">Không có lớp học nào để hiển thị.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className={`p-4 border rounded-lg cursor-pointer hover:shadow-lg transition ${
                selectedClassId === cls.id ? "border-indigo-500 bg-indigo-100" : "border-gray-300"
              }`}
              onClick={() => setSelectedClassId(cls.id)}
            >
              <h2 className="text-lg font-semibold">{cls.name}</h2>
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
      <div className="mt-6 text-center">
        <button
          className={`px-6 py-2 font-semibold text-white rounded ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-500 hover:bg-indigo-600"
          }`}
          onClick={handleClassSelection}
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Xác nhận lựa chọn"}
        </button>
      </div>
    </div>
  );
};

export default SelectClassPage;
