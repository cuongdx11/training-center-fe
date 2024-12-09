import React from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Import Roboto font
import { Font } from '@react-pdf/renderer';
Font.register({
  family: 'Roboto',
  src: '/fonts/Roboto-Regular.ttf', // Path to your font file
});

const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  section: {
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    lineHeight: 1.5,
    fontFamily: 'Roboto', // Apply the Roboto font here
  },
});

const InvoicePDF = () => {
  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.text}>Hóa đơn thanh toán</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.text}>Mã hóa đơn: 123456</Text>
          <Text style={styles.text}>Khách hàng: Nguyễn Văn A</Text>
          <Text style={styles.text}>Số tiền: 500,000 VNĐ</Text>
          <Text style={styles.text}>Ngày thanh toán: 04/12/2024</Text>
        </View>
      </Page>
    </Document>
  );
};

const InvoiceDownload = () => (
  <div>
    <PDFDownloadLink document={<InvoicePDF />} fileName="hoa_don.pdf">
      {({ loading }) => (loading ? 'Đang tạo PDF...' : 'Tải hóa đơn')}
    </PDFDownloadLink>
  </div>
);

export default InvoiceDownload;
