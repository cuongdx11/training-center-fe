import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle, BookOpen, AlertCircle, Eye } from 'lucide-react';
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
        const diffDays = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
        
        if (deadlineDate < now) return 'text-red-600';
        if (diffDays <= 3) return 'text-orange-500';
        return 'text-green-600';
    };

    const EmptyState = () => (
        <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Chưa có bài tập nào</h3>
            <p className="mt-2 text-sm text-gray-500">
                Hiện tại chưa có bài tập nào được giao. Vui lòng kiểm tra lại sau.
            </p>
        </div>
    );

    const LoadingState = () => (
        <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Đang tải bài tập...</span>
        </div>
    );

    const ErrorState = ({ message }) => (
        <div className="flex items-center p-4 bg-red-50 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
            <p className="text-sm text-red-600">{message}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Danh sách bài tập
                        </h1>
                        <p className="text-gray-600">
                            Quản lý và theo dõi các bài tập của bạn
                        </p>
                    </div>

                    {isLoading ? (
                        <LoadingState />
                    ) : error ? (
                        <ErrorState message={error} />
                    ) : assignments.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="space-y-6">
                            {assignments.map((assignment) => (
                                <div
                                    key={assignment.id}
                                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
                                >
                                    <div className="p-6">
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
                                            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                                <FileText className="mr-2 h-5 w-5 text-blue-600" />
                                                {assignment.title}
                                            </h2>
                                            <span
                                                className={`flex items-center font-medium ${getStatusColor(assignment.dueDate)}`}
                                            >
                                                <Clock className="mr-2 h-5 w-5" />
                                                Hạn nộp: {new Date(assignment.dueDate).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>

                                        <p className="text-gray-600 mb-6 line-clamp-2">
                                            {assignment.description}
                                        </p>

                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center px-3 py-1 bg-gray-50 rounded-full text-sm text-gray-600">
                                                    <FileText className="mr-2 h-4 w-4" />
                                                    <span>{assignment.fileType || 'Tất cả định dạng'}</span>
                                                </div>
                                                
                                                {assignment.fileUrl && (
                                                    <a
                                                        href={assignment.fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm hover:bg-blue-100 transition-colors"
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Xem đề bài
                                                    </a>
                                                )}
                                            </div>

                                            <Link
                                                to={`/assignments/${assignment.id}/submissions`}
                                                className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
                                            >
                                                <CheckCircle className="h-5 w-5" />
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
        </div>
    );
};

export default AssignmentListPage;