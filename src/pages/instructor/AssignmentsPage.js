import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

import { getAllAssignments } from '../../services/assignmentService';
import AssignmentTable from '../../components/instructor/assignments/AssignmentTable';
import AssignmentForm from '../../components/instructor/assignments/AssignmentForm';
import Modal from '../../components/instructor/assignments/Modal';

const AssignmentsPage = () => {
    const [assignments, setAssignments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Modal and form state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState(null);

    // Fetch assignments
    const fetchAssignments = async () => {
        try {
            setIsLoading(true);
            const response = await getAllAssignments();
            setAssignments(response);
            setError(null);
        } catch (err) {
            setError('Failed to fetch assignments: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchAssignments();
    }, []);

    // Open modal for creating new assignment
    const handleOpenCreateModal = () => {
        setEditingAssignment(null);
        setIsModalOpen(true);
    };

    // Open modal for editing existing assignment
    const handleEditAssignment = (assignment) => {
        setEditingAssignment(assignment);
        setIsModalOpen(true);
    };

    // Handle successful form submission
    const handleSubmitSuccess = (newOrUpdatedAssignment) => {
        setIsModalOpen(false);
        fetchAssignments(); // Refresh the list
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">All Assignments</h1>
                <button 
                    onClick={handleOpenCreateModal}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="mr-2" size={20} />
                    Create Assignment
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="text-center text-gray-500 py-6">Loading assignments...</div>
            ) : (
                <AssignmentTable 
                    assignments={assignments}
                    onEditAssignment={handleEditAssignment}
                    refreshAssignments={fetchAssignments}
                />
            )}

            {/* Assignment Creation/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}
            >
                <AssignmentForm 
                    initialData={editingAssignment}
                    onSubmitSuccess={handleSubmitSuccess}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default AssignmentsPage;