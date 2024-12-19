import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, Upload, CheckCircle } from 'lucide-react';
import { 
    getAssignmentDetails
    
     
} from '../services/assignmentService';

import {createStudentSubmission,getStudentSubmissionForAssignment} from '../services/studentSubmissions'
const AssignmentDetailPage = () => {
    const { assignmentId } = useParams();

    const [assignment, setAssignment] = useState(null);
    const [submission, setSubmission] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAssignmentDetails = async () => {
            try {
                setIsLoading(true);
                // Fetch assignment details
                const assignmentResponse = await getAssignmentDetails(assignmentId);
                setAssignment(assignmentResponse);

                // Fetch student's submission for this assignment
                const submissionResponse = await getStudentSubmissionForAssignment(assignmentId);
                setSubmission(submissionResponse);
            } catch (err) {
                setError('Không thể tải chi tiết bài tập: ' + err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAssignmentDetails();
    }, [assignmentId]);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmission = async () => {
        if (!selectedFile) {
            alert('Vui lòng chọn file để nộp');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('assignmentId', assignmentId);

            const response = await createStudentSubmission(formData);
            
            alert('Nộp bài thành công');
            // Refresh submission status
            setSubmission(response);
            setSelectedFile(null);
        } catch (err) {
            alert('Lỗi khi nộp bài: ' + err.message);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                Đang tải...
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
            <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
                {/* Assignment Details Section */}
                <div className="p-6 bg-gray-100 border-b">
                    <h1 className="text-2xl font-bold text-gray-800">{assignment.title}</h1>
                    <div className="mt-2 text-gray-600">
                        <p>{assignment.description}</p>
                    </div>
                </div>

                <div className="p-6">
                    {/* Assignment Metadata */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <p className="text-sm text-gray-600">Ngày giao</p>
                            <p className="font-medium">
                                {new Date(assignment.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Hạn nộp</p>
                            <p className="font-medium text-red-600">
                                {new Date(assignment.deadline).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {/* Submission Status */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                        <div className="flex items-center">
                            <CheckCircle 
                                className={`mr-3 ${submission ? 'text-green-600' : 'text-gray-400'}`} 
                                size={24} 
                            />
                            <p className="text-gray-800">
                                {submission 
                                    ? `Đã nộp vào ${new Date(submission.submissionDate).toLocaleString()}` 
                                    : 'Chưa nộp bài'}
                            </p>
                        </div>
                        {submission && (
                            <div className="mt-2">
                                <a 
                                    href={submission.fileUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline flex items-center"
                                >
                                    <FileText className="mr-2" size={18} />
                                    Xem bài nộp
                                </a>
                            </div>
                        )}
                    </div>

                    {/* File Upload Section */}
                    <div className="border-2 border-dashed border-gray-300 p-6 text-center">
                        <input 
                            type="file" 
                            onChange={handleFileChange} 
                            className="hidden" 
                            id="file-upload"
                        />
                        <label 
                            htmlFor="file-upload" 
                            className="cursor-pointer flex flex-col items-center"
                        >
                            <Upload className="text-gray-500 mb-4" size={48} />
                            <p className="text-gray-600 mb-2">
                                {selectedFile 
                                    ? `Đã chọn: ${selectedFile.name}` 
                                    : 'Chọn file để nộp bài'}
                            </p>
                            <span className="text-sm text-gray-500">
                                Định dạng cho phép: {assignment.fileType || 'Tất cả'}
                            </span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6">
                        <button
                            onClick={handleSubmission}
                            disabled={!selectedFile}
                            className={`w-full py-3 rounded-md transition-colors ${
                                selectedFile 
                                    ? 'bg-green-600 text-white hover:bg-green-700' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            Nộp bài
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignmentDetailPage;