import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register Roboto font for PDF
Font.register({
  family: 'Roboto',
  src: '/fonts/Roboto-Regular.ttf'
});

// PDF Styles
const pdfStyles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Roboto',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 5,
  },
  transactionCode: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  column: {
    flex: 1,
    paddingRight: 20,
  },
  row: {
    marginBottom: 5,
  },
  label: {
    color: '#666',
    fontSize: 12,
  },
  value: {
    fontSize: 12,
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingBottom: 5,
    backgroundColor: '#f9fafb',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 8,
  },
  tableCell: {
    fontSize: 12,
  },
  col1: { width: '50%' },
  col2: { width: '30%' },
  col3: { width: '20%', textAlign: 'right' },
  total: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  status: {
    fontSize: 12,
    padding: 4,
    borderRadius: 12,
    marginLeft: 5,
  }
});

// PDF Document Component
const InvoicePDF = ({ payment }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.header}>
          <Text style={pdfStyles.title}>HÓA ĐƠN THANH TOÁN</Text>
          <Text style={pdfStyles.transactionCode}>Mã giao dịch: {payment.transactionCode}</Text>
        </View>

        <View style={pdfStyles.grid}>
          <View style={pdfStyles.column}>
            <Text style={pdfStyles.sectionTitle}>Thông tin khách hàng</Text>
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.label}>Họ tên: <Text style={pdfStyles.value}>{payment.order.user.fullName}</Text></Text>
            </View>
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.label}>Email: <Text style={pdfStyles.value}>{payment.order.user.email}</Text></Text>
            </View>
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.label}>Số điện thoại: <Text style={pdfStyles.value}>{payment.order.user.phoneNumber}</Text></Text>
            </View>
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.label}>Địa chỉ: <Text style={pdfStyles.value}>{payment.order.user.address}</Text></Text>
            </View>
          </View>

          <View style={pdfStyles.column}>
            <Text style={pdfStyles.sectionTitle}>Thông tin thanh toán</Text>
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.label}>Phương thức: <Text style={pdfStyles.value}>{payment.paymentMethod.name}</Text></Text>
            </View>
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.label}>
                Trạng thái:{' '}
                <Text style={{
                  ...pdfStyles.status,
                  backgroundColor: payment.status === 'COMPLETED' ? '#dcfce7' : 
                                 payment.status === 'PENDING' ? '#fef9c3' : '#fee2e2',
                  color: payment.status === 'COMPLETED' ? '#166534' :
                         payment.status === 'PENDING' ? '#854d0e' : '#991b1b',
                }}>
                  {payment.status === 'COMPLETED' ? 'Đã thanh toán' :
                   payment.status === 'PENDING' ? 'Chờ thanh toán' : 'Thất bại'}
                </Text>
              </Text>
            </View>
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.label}>Ngày tạo: <Text style={pdfStyles.value}>{formatDate(payment.createdAt)}</Text></Text>
            </View>
            {payment.completedAt && (
              <View style={pdfStyles.row}>
                <Text style={pdfStyles.label}>Ngày hoàn thành: <Text style={pdfStyles.value}>{formatDate(payment.completedAt)}</Text></Text>
              </View>
            )}
          </View>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>Chi tiết khóa học</Text>
          <View style={pdfStyles.table}>
            <View style={pdfStyles.tableHeader}>
              <Text style={[pdfStyles.tableCell, pdfStyles.col1]}>Khóa học</Text>
              <Text style={[pdfStyles.tableCell, pdfStyles.col2]}>Giảng viên</Text>
              <Text style={[pdfStyles.tableCell, pdfStyles.col3]}>Giá tiền</Text>
            </View>
            
            {payment.order.orderItems.map((item) => (
              <View key={item.id} style={pdfStyles.tableRow}>
                <View style={pdfStyles.col1}>
                  <Text style={pdfStyles.tableCell}>{item.course.title}</Text>
                  <Text style={[pdfStyles.tableCell, { color: '#666', fontSize: 10 }]}>{item.course.category.name}</Text>
                </View>
                <Text style={[pdfStyles.tableCell, pdfStyles.col2]}>
                  {item.course.instructors.map(instructor => instructor.fullName).join(', ')}
                </Text>
                <Text style={[pdfStyles.tableCell, pdfStyles.col3]}>{formatCurrency(item.price)}</Text>
              </View>
            ))}
            
            <View style={pdfStyles.total}>
              <Text style={[pdfStyles.tableCell, { fontWeight: 'bold' }]}>Tổng cộng: {formatCurrency(payment.amount)}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;