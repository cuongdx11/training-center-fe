import React, { useEffect, useState } from "react";
import { paymentService } from '../services/paymentService';

const PaymentResult = () => {
    const [status, setStatus] = useState('processing');
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        const handlePaymentVerification = async () => {
            try {
                const queryParams = new URLSearchParams(window.location.search);
                const paymentData = {};
                queryParams.forEach((value, key) => {
                    paymentData[key] = value;
                });
                
                const amount = parseInt(paymentData.vnp_Amount || 0) / 100;
                
                const paymentDate = paymentData.vnp_PayDate;
                const formattedDate = paymentDate ? 
                    `${paymentDate.slice(6, 8)}/${paymentDate.slice(4, 6)}/${paymentDate.slice(0, 4)} ${paymentDate.slice(8, 10)}:${paymentDate.slice(10, 12)}:${paymentDate.slice(12, 14)}` 
                    : new Date().toLocaleString();

                setOrderDetails({
                    orderId: paymentData.vnp_TxnRef || "Unknown",
                    amount: amount.toLocaleString(),
                    date: formattedDate,
                    bankCode: paymentData.vnp_BankCode,
                    transactionNo: paymentData.vnp_TransactionNo,
                    paymentMethod: paymentData.vnp_CardType,
                    orderInfo: paymentData.vnp_OrderInfo
                });

                if (paymentData.vnp_ResponseCode === "00") {
                    setStatus('success');
                } else {
                    setStatus('error');
                }

                const data = await paymentService.verifyPayment(paymentData);
                if (!data.success) {
                    setStatus('error');
                }
            } catch (error) {
                console.error("Error:", error);
                setStatus('error');
            }
        };
        handlePaymentVerification();
    }, []);

    if (status === 'processing') {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-700">Đang xử lý thanh toán...</h2>
                <p className="text-gray-500 mt-2">Vui lòng không đóng trang này</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    {status === 'success' ? (
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">Thanh toán thành công!</h2>
                            <p className="text-xl text-gray-600">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">Thanh toán thất bại</h2>
                            <p className="text-xl text-gray-600">Vui lòng thử lại sau hoặc liên hệ hỗ trợ</p>
                        </div>
                    )}
                </div>

                {orderDetails && (
                    <div className="border-t border-gray-200 pt-6">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <span className="text-gray-600">Mã đơn hàng:</span>
                                <span className="font-medium">{orderDetails.orderId}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <span className="text-gray-600">Nội dung:</span>
                                <span className="font-medium">{orderDetails.orderInfo}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <span className="text-gray-600">Số tiền:</span>
                                <span className="font-medium">{orderDetails.amount} VNĐ</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <span className="text-gray-600">Ngân hàng:</span>
                                <span className="font-medium">{orderDetails.bankCode}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <span className="text-gray-600">Mã giao dịch:</span>
                                <span className="font-medium">{orderDetails.transactionNo}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <span className="text-gray-600">Phương thức:</span>
                                <span className="font-medium">{orderDetails.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <span className="text-gray-600">Thời gian:</span>
                                <span className="font-medium">{orderDetails.date}</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex gap-4 justify-center mt-8">
                    <button 
                        onClick={() => window.location.href = '/'}
                        className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg"
                    >
                        Về trang chủ
                    </button>
                    <button 
                        onClick={() => window.location.href = `/orders/${orderDetails.orderId}`}
                        className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-lg"
                    >
                        Xem đơn hàng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentResult;