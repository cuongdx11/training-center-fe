import React, { useState, useEffect } from 'react';
import { getAllCourseClasses, createAssignment, updateAssignment } from '../../../services/assignmentService';

const AssignmentForm = ({ initialData = null, onSubmitSuccess, onCancel }) => {
    const [courseClasses, setCourseClasses] = useState([]);
    const [formData, setFormData] = useState({
        classId: '',
        title: '',
        description: '',
        type: 'EXERCISE',
        dueDate: '',
        file: null,
        fileUrl: ''
    });
    const [error, setError] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState('');

    useEffect(() => {
        const fetchCourseClasses = async () => {
            try {
                const response = await getAllCourseClasses();
                setCourseClasses(response);
            } catch (err) {
                setError('Failed to load course classes');
            }
        };
        fetchCourseClasses();
    
        if (initialData) {
            const dueDateStr = initialData.dueDate
                ? new Date(initialData.dueDate).toLocaleString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' }).replace(' ', 'T')
                : ''; // Chuyển đổi UTC sang local time với múi giờ Asia/Ho_Chi_Minh
            
            setFormData(prevFormData => ({
                ...prevFormData,
                classId: initialData.courseClass?.id || '',
                title: initialData.title || '',
                description: initialData.description || '',
                type: initialData.type || 'EXERCISE',
                dueDate: dueDateStr,
                fileUrl: initialData.fileUrl || ''
            }));
    
            if (initialData.fileUrl) {
                const fileName = initialData.fileUrl.split('/').pop();
                setSelectedFileName(fileName);
            }
        }
    }, [initialData]);
    

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData(prev => ({
                ...prev,
                file: files[0]
            }));
            setSelectedFileName(files[0].name);
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
    
        if (!formData.classId) {
            setError('Please select a course class');
            return;
        }
    
        const submitData = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null && formData[key] !== '') {
                if (key === 'dueDate') {
                    // Chuyển đổi thời gian nhập từ local sang UTC
                    const localDate = new Date(formData[key]);
                    const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000); // Trừ đi offset để chuyển về UTC
                    submitData.append(key, utcDate.toISOString());
                } else if (key !== 'fileUrl') {
                    submitData.append(key, formData[key]);
                }
            }
        });
    
        try {
            const response = initialData 
                ? await updateAssignment(initialData.id, submitData)
                : await createAssignment(submitData);
            onSubmitSuccess(response.data || response);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };
    

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-5xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Lớp học
                        </label>
                        <select
                            name="classId"
                            value={formData.classId}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Chọn lớp học</option>
                            {courseClasses.map((courseClass) => (
                                <option key={courseClass.id} value={courseClass.id}>
                                    {courseClass.course.title} - {courseClass.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Loại bài tập
                        </label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="EXERCISE">Exercise</option>
                            <option value="TEST">TEST</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Tiêu đề bài tập
                        </label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Hạn nộp
                        </label>
                        <input
                            type="datetime-local"
                            name="dueDate"
                            required
                            value={formData.dueDate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Mô tả
                    </label>
                    <textarea
                        name="description"
                        rows="4"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Tệp đính kèm {initialData ? '(Optional)' : ''}
                    </label>
                    <div className="space-y-3">
                        <label className="flex items-center px-4 py-3 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                            <svg className="w-6 h-6 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <span className="text-sm text-gray-500">Click to upload file</span>
                            <input
                                type="file"
                                name="file"
                                onChange={handleInputChange}
                                className="hidden"
                            />
                        </label>
                        
                        {(selectedFileName || formData.fileUrl) && (
                            <div className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-lg">
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                {formData.fileUrl ? (
                                    <a 
                                        href={formData.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        {selectedFileName}
                                    </a>
                                ) : (
                                    <span className="text-sm text-gray-700">{selectedFileName}</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                    >
                        {initialData ? 'Lưu' : 'Tạo'} Bài tập
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AssignmentForm;