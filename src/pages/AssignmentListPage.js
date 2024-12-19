import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle } from 'lucide-react';
import { getAssignmentsOfStudent } from '../services/assignmentService';

const AssignmentListPage = () => {
    const [assignments, setAssignments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                setIsLoading(true);
                const response = await getAssignmentsOfStudent();
                setAssignments(response);
                setError(null);
            } catch (err) {
                setError('Không thể tải danh sách bài tập: ' + err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAssignments();
    }, []);

    const getStatusColor = (deadline) => {
        const deadlineDate = new Date(deadline);
        const now = new Date();
        return deadlineDate < now ? 'text-red-600' : 'text-green-600';
    };

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    Danh sách bài tập
                </h1>

                {isLoading ? (
                    <div className="text-center text-gray-500 py-6">Đang tải bài tập...</div>
                ) : error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        {error}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {assignments.map((assignment) => (
                            <div 
                                key={assignment.id} 
                                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-semibold text-gray-800">
                                            {assignment.title}
                                        </h2>
                                        <span 
                                            className={`font-medium ${getStatusColor(assignment.dueDate)}`}
                                        >
                                            <Clock className="inline-block mr-2" size={18} />
                                            Hạn nộp: {new Date(assignment.dueDate).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <p className="text-gray-600 mb-4">
                                        {assignment.description}
                                    </p>

                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-2 text-gray-600">
                                            <FileText size={18} />
                                            <span>{assignment.fileType || 'Tất cả định dạng'}</span>
                                        </div>

                                        <Link 
                                            to={`/assignments/${assignment.id}/submissions`}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                                        >
                                            <CheckCircle className="mr-2" size={18} />
                                            Xem chi tiết & Nộp bài
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssignmentListPage;