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

const AssignmentTable = ({ 
    assignments, 
    onEditAssignment, 
    refreshAssignments 
}) => {
    const handleDeleteAssignment = async (assignmentId) => {
        if (window.confirm('Are you sure you want to delete this assignment?')) {
            try {
                await deleteAssignment(assignmentId);
                refreshAssignments();
            } catch (error) {
                alert('Failed to delete assignment: ' + error.message);
            }
        }
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
                            Title
                        </th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                        </th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Due Date
                        </th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {assignments.map((assignment) => (
                        <tr 
                            key={assignment.id} 
                            className="hover:bg-gray-50 relative"
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
                                    onClick={() => onEditAssignment(assignment)}
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
                                    >
                                        <File  size={18} />
                                    </a>
                                )}
                                
                                <button
                                    onClick={() => handleDeleteAssignment(assignment.id)}
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
                    No assignments found
                </div>
            )}
        </div>
    );
};

export default AssignmentTable;