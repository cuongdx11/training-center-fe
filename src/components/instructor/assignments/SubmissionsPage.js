import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getStudentSubmissions, updateStudentSubmissionByInstructor } from '../../../services/studentSubmissions';
import { FileText, Check } from 'lucide-react';

const SubmissionsPage = () => {
    const { assignmentId } = useParams();
    const [submissions, setSubmissions] = useState([]);
    const [assignment, setAssignment] = useState([]);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [score, setScore] = useState('');
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await getStudentSubmissions(assignmentId);
                setSubmissions(response.studentSubmissions);
                setAssignment(response.assignment)
            } catch (error) {
                console.error('Failed to load submissions', error);
            }
        };
        fetchSubmissions();
    }, [assignmentId]);

    const handleGradeSubmission = (submission) => {
        // Only allow grading if not already graded
        if (submission.status !== 'GRADED') {
            setSelectedSubmission(submission);
            setModalVisible(true);
        }
    };

    const handleSubmitGrade = async () => {
        if (!score || isNaN(score)) {
            alert('Vui lòng nhập điểm hợp lệ.');
            return;
        }
        try {
            await updateStudentSubmissionByInstructor({
                submissionId: selectedSubmission.id,
                score: parseFloat(score),
                feedBack :feedback,
                status: 'GRADED',
            });
            
            // Update local state to reflect grading
            const updatedSubmissions = submissions.map(submission => 
                submission.id === selectedSubmission.id 
                    ? {...submission, status: 'GRADED', score: parseFloat(score), feedback} 
                    : submission
            );
            
            setSubmissions(updatedSubmissions);
            setModalVisible(false);
            setScore('');
            setFeedback('');
        } catch (error) {
            alert('Không thể nộp điểm: ' + error.message);
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'GRADED': return 'bg-green-100 text-green-800';
            case 'SUBMITTED': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    Bài nộp của Assignment {assignment.title}
                </h1>
                
                <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
                    <table className="w-full">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Sinh viên
                                </th>
                                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ngày nộp
                                </th>
                                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {submissions.map((submission) => (
                                <tr key={submission.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-gray-900">
                                        {submission.student.name}
                                    </td>
                                    <td className="p-4 text-gray-600">
                                        {new Date(submission.submissionDate).toLocaleString()}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(submission.status)}`}>
                                            {submission.status === 'GRADED' ? 'Đã chấm' : 'Chưa chấm'}
                                        </span>
                                    </td>
                                    <td className="p-4 flex space-x-3">
                                        <a
                                            href={submission.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 flex items-center"
                                        >
                                            <FileText className="mr-2" size={18} />
                                            Xem bài nộp
                                        </a>
                                        {submission.status !== 'GRADED' && (
                                            <button
                                                onClick={() => handleGradeSubmission(submission)}
                                                className="text-green-600 hover:text-green-800 flex items-center"
                                            >
                                                <Check className="mr-2" size={18} />
                                                Chấm điểm
                                            </button>
                                        )}
                                        {submission.status === 'GRADED' && (
                                            <div className="text-gray-600 flex items-center">
                                                <span className="font-semibold mr-2">Điểm: {submission.score}</span>
                                                <button 
                                                    onClick={() => {
                                                        setSelectedSubmission(submission);
                                                        setModalVisible(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    Xem chi tiết
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {modalVisible && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto overflow-hidden">
                            <div className="p-6 bg-gray-100 border-b">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {selectedSubmission.status === 'GRADED' ? 'Chi tiết điểm' : 'Chấm điểm'}
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="mb-4">
                                    <p className="text-sm text-gray-600 mb-1">Sinh viên</p>
                                    <p className="font-semibold">{selectedSubmission.student.fullName}</p>
                                </div>
                                <div className="mb-4">
                                    <p className="text-sm text-gray-600 mb-1">Ngày nộp</p>
                                    <p>{new Date(selectedSubmission.submissionDate).toLocaleString()}</p>
                                </div>

                                {selectedSubmission.status === 'GRADED' ? (
                                    <>
                                        <div className="mb-4">
                                            <p className="text-sm text-gray-600 mb-1">Điểm</p>
                                            <p className="text-2xl font-bold text-green-600">{selectedSubmission.score}</p>
                                        </div>
                                        <div className="mb-4">
                                            <p className="text-sm text-gray-600 mb-1">Nhận xét</p>
                                            <p className="text-gray-800">{selectedSubmission.feedback || 'Không có nhận xét'}</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Điểm</label>
                                            <input
                                                type="number"
                                                value={score}
                                                onChange={(e) => setScore(e.target.value)}
                                                className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Nhập điểm"
                                                min="0"
                                                max="10"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Nhận xét</label>
                                            <textarea
                                                value={feedback}
                                                onChange={(e) => setFeedback(e.target.value)}
                                                className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Nhập nhận xét"
                                                rows="4"
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        onClick={() => setModalVisible(false)}
                                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                                    >
                                        Đóng
                                    </button>
                                    {selectedSubmission.status !== 'GRADED' && (
                                        <button
                                            onClick={handleSubmitGrade}
                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                        >
                                            Nộp điểm
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubmissionsPage;