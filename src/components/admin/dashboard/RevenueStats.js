import React, { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import { Calendar, TrendingUp, ChevronDown } from 'lucide-react';

import { getMonthlyRevenue } from '../../../services/statisticsService';

const RevenueStats = () => {
    const [period, setPeriod] = useState('month');
    const [isOpenPeriodDropdown, setIsOpenPeriodDropdown] = useState(false);
    const [revenue, setRevenue] = useState(null);
    const [loading, setLoading] = useState(true);

    const periodOptions = [
        { value: 'day', label: 'Ngày', days: 1 },
        { value: 'month', label: 'Tháng', days: 30 },
        { value: 'year', label: 'Năm', days: 365 }
    ];

    useEffect(() => {
        const fetchRevenueData = async () => {
            setLoading(true);
            try {
                const selectedPeriod = periodOptions.find(p => p.value === period);
                const toDate = new Date();
                const fromDate = subDays(toDate, selectedPeriod.days);

                const response = await getMonthlyRevenue(
                    format(fromDate, 'yyyy-MM-dd'), 
                    format(toDate, 'yyyy-MM-dd')
                );

                setRevenue(response.data.revenue);
            } catch (error) {
                console.error('Lỗi tải dữ liệu:', error);
                setRevenue(0);
            } finally {
                setLoading(false);
            }
        };

        fetchRevenueData();
    }, [period]);

    const selectedPeriodLabel = periodOptions.find(p => p.value === period)?.label;

    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                    <TrendingUp className="h-6 w-6 text-gray-500" />
                    <h2 className="text-xl font-semibold text-gray-800">Thống Kê Doanh Thu</h2>
                </div>
                
                <div className="relative">
                    <button 
                        onClick={() => setIsOpenPeriodDropdown(!isOpenPeriodDropdown)}
                        className="flex items-center justify-between w-40 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                    >
                        {selectedPeriodLabel}
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </button>
                    
                    {isOpenPeriodDropdown && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-10">
                            {periodOptions.map(option => (
                                <div 
                                    key={option.value}
                                    onClick={() => {
                                        setPeriod(option.value);
                                        setIsOpenPeriodDropdown(false);
                                    }}
                                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${period === option.value ? 'bg-blue-50 text-blue-600' : ''}`}
                                >
                                    {option.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <span className="text-gray-500">Đang tải dữ liệu...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-500 font-medium">Tổng Doanh Thu ({selectedPeriodLabel})</span>
                                <Calendar className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="text-2xl font-bold text-blue-600">
                                {revenue ? revenue.toLocaleString() : '0'} VND
                            </div>
                        </div>
                        
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-500 font-medium">Xu Hướng</span>
                                <TrendingUp className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="text-xl font-bold text-green-600">
                                {revenue > 0 ? 'Tăng trưởng' : 'Không có dữ liệu'}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RevenueStats;