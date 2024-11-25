import { useEffect } from "react";

const PaymentResult = () => {
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);

        // Chuyển tham số thành object
        const paymentData = {};
        queryParams.forEach((value, key) => {
            paymentData[key] = value;
        });

        // Gửi tới backend để xác thực
        fetch("http://localhost:8080/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(paymentData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    alert("Thanh toán thành công!");
                } else {
                    alert("Thanh toán thất bại!");
                }
            })
            .catch((error) => console.error("Error:", error));
    }, []);

    return <div>Đang xử lý thanh toán...</div>;
};

export default PaymentResult;
