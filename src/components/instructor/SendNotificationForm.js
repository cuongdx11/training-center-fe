import React, { useState, useEffect } from 'react';
import { getClassOfInstructor, getStudentOfClass } from '../../services/courseClassService';
import { createNotification } from '../../services/notificationService';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const SendNotificationForm = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [message, setMessage] = useState('');
    const [title, setTitle] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const instructorClasses = await getClassOfInstructor();
                setClasses(instructorClasses);
            } catch (err) {
                setError('Không thể tải danh sách lớp học');
            }
        };
        fetchClasses();
    }, []);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const allStudents = await Promise.all(
                    selectedClasses.map(classId => getStudentOfClass(classId))
                );
                // Loại bỏ sinh viên trùng lặp
                const uniqueStudents = [...new Set(allStudents.flat().map(s => s.id))];
                setStudents(uniqueStudents);
            } catch (err) {
                setError('Không thể tải danh sách sinh viên');
            }
        };

        if (selectedClasses.length > 0) {
            fetchStudents();
        } else {
            setStudents([]);
        }
    }, [selectedClasses]);

    const handleClassToggle = (classId) => {
        setSelectedClasses(prev => 
            prev.includes(classId) 
                ? prev.filter(id => id !== classId)
                : [...prev, classId]
        );
    };

    const handleSelectAllClasses = () => {
        setSelectedClasses(classes.map(cls => cls.id));
    };

    const handleClearClasses = () => {
        setSelectedClasses([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await createNotification({
                title,
                message,
                type: 'COURSE',
                status: 'ACTIVE',
                creatorId: localStorage.getItem('userId'), // Giả định đã lưu userId
                recipientIds: students
            });

            setSuccess(true);
            setTitle('');
            setMessage('');
            setSelectedClasses([]);
        } catch (err) {
            setError('Gửi thông báo thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Gửi Thông Báo Lớp Học</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Chọn lớp */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chọn Lớp</label>
                    <div className="grid grid-cols-3 gap-2">
                        {classes.map(cls => (
                            <label 
                                key={cls.id} 
                                className={`
                                    flex items-center space-x-2 p-2 rounded-md cursor-pointer 
                                    ${selectedClasses.includes(cls.id) 
                                        ? 'bg-blue-100 border-2 border-blue-500' 
                                        : 'bg-gray-100 border-2 border-transparent'}
                                `}
                            >
                                <input 
                                    type="checkbox" 
                                    checked={selectedClasses.includes(cls.id)}
                                    onChange={() => handleClassToggle(cls.id)}
                                    className="form-checkbox h-4 w-4 text-blue-600"
                                />
                                <span className="text-sm">{cls.name}</span>
                            </label>
                        ))}
                    </div>
                    <div className="mt-2 space-x-2 flex justify-end">
                        <button
                            type="button"
                            onClick={handleSelectAllClasses}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Chọn tất cả
                        </button>
                        <button
                            type="button"
                            onClick={handleClearClasses}
                            className="text-sm text-red-600 hover:underline"
                        >
                            Bỏ chọn
                        </button>
                    </div>
                </div>

                {/* Thông tin thông báo */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Tiêu Đề
                    </label>
                    <input
                        id="title"
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Nội Dung Thông Báo
                    </label>
                    <textarea
                        id="message"
                        rows={4}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Trạng thái gửi */}
                {error && (
                    <div className="flex items-center text-red-600 space-x-2 bg-red-50 p-2 rounded-md">
                        <AlertCircle className="w-5 h-5" />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="flex items-center text-green-600 space-x-2 bg-green-50 p-2 rounded-md">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Gửi thông báo thành công!</span>
                    </div>
                )}

                {/* Nút gửi */}
                <button
                    type="submit"
                    disabled={loading || students.length === 0}
                    className={`w-full py-2 rounded-md text-white font-semibold ${
                        loading || students.length === 0
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 transition-colors'
                    }`}
                >
                    {loading ? 'Đang gửi...' : 'Gửi Thông Báo'}
                </button>
            </form>
        </div>
    );
};

export default SendNotificationForm;