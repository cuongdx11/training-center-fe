import React, { useState, useEffect } from 'react';
import { deleteAssignment } from '../services/assignmentService';
import { format } from 'date-fns';

const AssignmentList = ({ assignments, refreshAssignments }) => {
    const [deleteError, setDeleteError] = useState(null);

    const handleDeleteAssignment = async (assignmentId) => {
        if (window.confirm('Are you sure you want to delete this assignment?')) {
            try {
                await deleteAssignment(assignmentId);
                refreshAssignments(); // Callback to refresh the list in parent component
            } catch (error) {
                setDeleteError('Failed to delete assignment: ' + error.message);
            }
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {deleteError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    {deleteError}
                </div>
            )}

            {assignments.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                    No assignments found
                </div>
            ) : (
                <table className="w-full">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {assignments.map((assignment) => (
                            <tr key={assignment.id} className="hover:bg-gray-50">
                                <td className="p-3">
                                    <div className="text-sm font-medium text-gray-900">
                                        {assignment.title}
                                    </div>
                                </td>
                                <td className="p-3">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        {assignment.type}
                                    </span>
                                </td>
                                <td className="p-3 text-sm text-gray-500">
                                    {format(new Date(assignment.dueDate), 'PPp')}
                                </td>
                                <td className="p-3 text-sm font-medium">
                                    <div className="flex space-x-2">
                                        {assignment.fileUrl && (
                                            <a 
                                                href={assignment.fileUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                View File
                                            </a>
                                        )}
                                        <button 
                                            onClick={() => handleDeleteAssignment(assignment.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AssignmentList;