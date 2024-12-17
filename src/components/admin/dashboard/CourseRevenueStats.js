import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, X } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {getRevenueByCourse} from '../../../services/statisticsService'

const CourseRevenueStats = () => {
    const [revenueData, setRevenueData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState({
        from: new Date(new Date().getFullYear(), 0, 1),
        to: new Date()
    });
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    const fetchRevenueData = async () => {
        try {
            setLoading(true);
            const fromDate = format(dateRange.from, 'yyyy-MM-dd');
            const toDate = format(dateRange.to, 'yyyy-MM-dd');
            
            const response = await getRevenueByCourse(fromDate, toDate);
            
            // Sort data by total revenue in descending order
            const sortedData = response.data.sort((a, b) => b.totalRevenue - a.totalRevenue);
            
            setRevenueData(sortedData);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRevenueData();
    }, [dateRange]);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white border rounded-lg shadow-lg p-4">
                    <p className="font-bold text-gray-700">{data.courseName}</p>
                    <p className="text-blue-600">
                        Doanh thu: {new Intl.NumberFormat('vi-VN', { 
                            style: 'currency', 
                            currency: 'VND' 
                        }).format(data.totalRevenue)}
                    </p>
                </div>
            );
        }
        return null;
    };

    const totalRevenue = revenueData.reduce((sum, course) => sum + course.totalRevenue, 0);

    // Simple date range picker
    const DateRangePicker = () => (
        <div className="absolute right-0 top-full mt-2 bg-white border rounded-lg shadow-lg p-4 z-10 w-64">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Chọn khoảng thời gian</h3>
                <button 
                    onClick={() => setIsDatePickerOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
            {/* Simplified date selection - you might want to replace with a more robust date picker */}
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Từ ngày</label>
                    <input 
                        type="date" 
                        value={format(dateRange.from, 'yyyy-MM-dd')}
                        onChange={(e) => setDateRange(prev => ({
                            ...prev, 
                            from: new Date(e.target.value)
                        }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Đến ngày</label>
                    <input 
                        type="date" 
                        value={format(dateRange.to, 'yyyy-MM-dd')}
                        onChange={(e) => setDateRange(prev => ({
                            ...prev, 
                            to: new Date(e.target.value)
                        }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    />
                </div>
            </div>
            <button 
                onClick={() => setIsDatePickerOpen(false)}
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >
                Áp dụng
            </button>
        </div>
    );

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-center">
                <TrendingUp className="mr-2 animate-pulse text-blue-500" />
                Đang tải thống kê doanh thu...
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6 text-red-500">
                Không thể tải thống kê doanh thu
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 relative">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center">
                    <TrendingUp className="mr-2 text-blue-500" />
                    Thống Kê Doanh Thu Theo Khóa Học
                </h2>
                
                <div className="relative">
                    <button 
                        onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                        className="flex items-center text-sm text-gray-600 hover:text-blue-600 border border-gray-300 rounded-md px-3 py-2"
                    >
                        <Calendar className="mr-2 h-4 w-4" />
                        {format(dateRange.from, 'dd/MM/yyyy')} - {format(dateRange.to, 'dd/MM/yyyy')}
                    </button>
                    {isDatePickerOpen && <DateRangePicker />}
                </div>
            </div>

            {revenueData.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                    Không có dữ liệu doanh thu trong khoảng thời gian này
                </div>
            ) : (
                <>
                    <div className="mb-4 text-sm text-gray-600">
                        Tổng doanh thu: {new Intl.NumberFormat('vi-VN', { 
                            style: 'currency', 
                            currency: 'VND' 
                        }).format(totalRevenue)}
                    </div>

                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart 
                            data={revenueData} 
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="courseName" 
                                interval={0} 
                                angle={-45} 
                                textAnchor="end" 
                                height={70}
                            />
                            <YAxis 
                                tickFormatter={(value) => 
                                    new Intl.NumberFormat('vi-VN').format(value)
                                } 
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar 
                                dataKey="totalRevenue" 
                                fill="#3b82f6" 
                                name="Doanh Thu" 
                                barSize={50}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </>
            )}
        </div>
    );
};

export default CourseRevenueStats;