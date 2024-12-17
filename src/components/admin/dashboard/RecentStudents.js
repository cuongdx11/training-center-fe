import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

import {getNewestEnrollments} from '../../../services/statisticsService'

const RecentStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNewestEnrollments = async () => {
            try {
                // Assuming you have an API call similar to the example provided
                const response = await getNewestEnrollments();
                setStudents(response);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchNewestEnrollments();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-center text-gray-500">
                    <Users className="mr-2" />
                    Đang tải học viên...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-red-500">
                    Không thể tải danh sách học viên
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="mr-2 text-blue-500" />
                Học Viên Mới Đăng Ký
            </h2>
            {students.length === 0 ? (
                <div className="text-gray-500 text-center py-4">
                    Chưa có học viên mới đăng ký
                </div>
            ) : (
                <div className="space-y-4">
                    {students.map((enrollment) => (
                        <div 
                            key={enrollment.id} 
                            className="flex items-center space-x-4 py-2 border-b last:border-b-0"
                        >
                          
                            <div>
                                <h3 className="font-medium">
                                    {enrollment.user.name || 'Học viên'}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Đăng ký: {enrollment.courses.title}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecentStudents;