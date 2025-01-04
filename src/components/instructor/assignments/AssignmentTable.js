import React from 'react';
import { format } from 'date-fns';
import { 
    Edit2, 
    Trash2, 
    FileText, 
    CalendarCheck, 
    File 
} from 'lucide-react';
import { deleteAssignment } from '../../../services/assignmentService';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AssignmentTable = ({ 
    assignments, 
    onEditAssignment, 
    refreshAssignments 
}) => {
    const navigate = useNavigate();

    const handleDeleteAssignment = async (assignmentId, e) => {
        // Ngăn chặn sự kiện click lan truyền lên phần tử cha
        e.stopPropagation();
        
        try {
            const result = await Swal.fire({
                title: 'Bạn có chắc chắn?',
                text: 'Thao tác này sẽ xóa bài tập và không thể hoàn tác!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Xóa',
                cancelButtonText: 'Hủy',
            });
    
            if (result.isConfirmed) {
                await deleteAssignment(assignmentId);
                refreshAssignments();
    
                Swal.fire({
                    title: 'Đã xóa!',
                    text: 'Bài tập đã được xóa thành công.',
                    icon: 'success',
                    timer: 3000,
                    showConfirmButton: false,
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Không thể xóa bài tập. Vui lòng thử lại.',
                icon: 'error',
                timer: 3000,
                showConfirmButton: false,
            });
        }
    };

    const handleEditClick = (assignment, e) => {
        e.stopPropagation();
        onEditAssignment(assignment);
    };

    const handleRowClick = (assignmentId) => {
        navigate(`/instructor/assignments/${assignmentId}/submissions`);
    };

    const renderAssignmentTypeTag = (type) => {
        const typeColors = {
            EXERCISE: 'bg-blue-100 text-blue-800',
            QUIZ: 'bg-green-100 text-green-800',
            PROJECT: 'bg-purple-100 text-purple-800',
            MIDTERM_EXAM: 'bg-yellow-100 text-yellow-800',
            FINAL_EXAM: 'bg-red-100 text-red-800'
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[type] || 'bg-gray-100 text-gray-800'}`}>
                {type.replace('_', ' ')}
            </span>
        );
    };

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="w-full">
                <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tiêu đề
                        </th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Loại bài tập
                        </th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Hạn nộp
                        </th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Thao tác
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {assignments.map((assignment) => (
                        <tr 
                            key={assignment.id} 
                            className="hover:bg-gray-50 relative cursor-pointer"
                            onClick={() => handleRowClick(assignment.id)}
                        >
                            <td className="p-3">
                                <div className="flex items-center">
                                    <FileText className="mr-2 text-gray-500" size={20} />
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {assignment.title}
                                        </div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs">
                                            {assignment.description}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="p-3">
                                {renderAssignmentTypeTag(assignment.type)}
                            </td>
                            <td className="p-3 text-sm text-gray-500">
                                <div className="flex items-center">
                                    <CalendarCheck className="mr-2 text-gray-500" size={16} />
                                    {format(new Date(assignment.dueDate), 'PPp')}
                                </div>
                            </td>
                            <td className="p-3 flex items-center space-x-2">
                                <button 
                                    onClick={(e) => handleEditClick(assignment, e)}
                                    className="text-gray-500 hover:text-blue-600"
                                    title="Edit Assignment"
                                >
                                    <Edit2 size={18} />
                                </button>
                                
                                {assignment.fileUrl && (
                                    <a 
                                        href={assignment.fileUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-gray-500 hover:text-green-600"
                                        title="View File"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <File size={18} />
                                    </a>
                                )}
                                
                                <button
                                    onClick={(e) => handleDeleteAssignment(assignment.id, e)}
                                    className="text-gray-500 hover:text-red-600"
                                    title="Delete Assignment"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {assignments.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                    Không tìm thấy bài tập
                </div>
            )}
        </div>
    );
};

export default AssignmentTable;