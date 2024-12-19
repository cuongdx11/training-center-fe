import React, { useState, useEffect } from 'react';
import { getAllCourseClasses, createAssignment, updateAssignment } from '../../../services/assignmentService';

const AssignmentForm = ({ 
    initialData = null, 
    onSubmitSuccess, 
    onCancel 
}) => {
    const [courseClasses, setCourseClasses] = useState([]);
    const [formData, setFormData] = useState({
        classId: '',
        title: '',
        description: '',
        type: 'EXERCISE',
        dueDate: '',
        file: null
    });
    const [error, setError] = useState(null);

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
    
        // Populate form if editing existing assignment
        if (initialData) {
            setFormData(prevFormData => ({
                ...prevFormData,
                classId: initialData.courseClass?.id || '',
                title: initialData.title || '',
                description: initialData.description || '',
                type: initialData.type || 'EXERCISE',
                dueDate: initialData.dueDate 
                    ? new Date(initialData.dueDate).toISOString().slice(0, 16) 
                    : ''
            }));
        }
    }, [initialData]); 

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validate class selection
        if (!formData.classId) {
            setError('Please select a course class');
            return;
        }

        // Create FormData object
        const submitData = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null && formData[key] !== '') {
                submitData.append(key, formData[key]);
            }
        });

        try {
            // Determine if we're creating or updating
            const submitFunction = initialData 
                ? () => updateAssignment(initialData.id, submitData)
                : () => createAssignment(submitData);

            const response = await submitFunction();
            
            // Reset form or close modal
            onSubmitSuccess(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                </div>
            )}

            <div>
                <label htmlFor="classId" className="block text-sm font-medium text-gray-700">
                    Course Class
                </label>
                <select
                    name="classId"
                    id="classId"
                    value={formData.classId}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                    <option value="">Select a Course Class</option>
                    {courseClasses.map((courseClass) => (
                        <option key={courseClass.id} value={courseClass.id}>
                            {courseClass.course.title} - {courseClass.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Assignment Title
                </label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    name="description"
                    id="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                ></textarea>
            </div>

            <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Assignment Type
                </label>
                <select
                    name="type"
                    id="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                    <option value="EXERCISE">Exercise</option>
                    <option value="QUIZ">Quiz</option>
                    <option value="PROJECT">Project</option>
                    <option value="MIDTERM_EXAM">Midterm Exam</option>
                    <option value="FINAL_EXAM">Final Exam</option>
                </select>
            </div>

            <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                    Due Date
                </label>
                <input
                    type="datetime-local"
                    name="dueDate"
                    id="dueDate"
                    required
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>

            <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                    Attachment {initialData ? '(Optional)' : ''}
                </label>
                <input
                    type="file"
                    name="file"
                    id="file"
                    onChange={handleInputChange}
                    className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-violet-50 file:text-violet-700
                    hover:file:bg-violet-100"
                />
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {initialData ? 'Update' : 'Create'} Assignment
                </button>
            </div>
        </form>
    );
};

export default AssignmentForm;