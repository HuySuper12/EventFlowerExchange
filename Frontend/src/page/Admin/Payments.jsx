import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, message, Pagination } from 'antd';
import api from "../../config/axios";
import 'antd/dist/reset.css';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 8;

  // Fetch payments from API
  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const response = await api.get('Transaction/ViewAllTransaction');
        setPayments(response.data);
      } catch (error) {
        message.error('Failed to fetch payments');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const columns = [
    {
      title: 'Payment ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
      sorter: (a, b) => a.paymentId - b.paymentId,
    },
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
      sorter: (a, b) => a.userId.localeCompare(b.userId),
    },
    
    {
      title: 'Payment Type',
      dataIndex: 'transactionType',
      key: 'transactionType',
      render: (type) => <span style={{ fontWeight: 'bold' }}>{type}</span>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (value) => formatCurrency(value),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {
        const isCompleted = status === true; 
    
        return (
          <span style={{
            color: isCompleted ? 'green' : 'red', 
          }}>
            {isCompleted ? 'In' : 'Out'} 
            {!isCompleted && record.note && <span>(Note: {record.note})</span>}
          </span>
        );
      },
    },
    {
      title: 'Date/Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (value) => formatDate(value),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button type="link" onClick={() => handleViewDetail(record)}>View Detail</Button>
      ),
    },
  ];

  const handleViewDetail = (payment) => {
    Modal.info({
      title: `Payment ID: ${payment.paymentId}`,
      content: (
        <div>
          <p>User ID: {payment.userId}</p>
          <p>Payment Type: {payment.paymentType}</p>
          <p>Amount: {formatCurrency(payment.amount.toFixed(2))}</p>
          <p>Status: {payment.status}</p>
          <p>Date/Time: {new Date(payment.createdAt).toLocaleString()}</p>
        </div>
      ),
      onOk() {},
    });
  };

  const totalPayments = payments.length;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date";
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    return date.toLocaleDateString("en-US", options);
  };

  const formatCurrency = (amount) => {
    const validAmount = amount !== undefined ? amount : 0;
    return (
      validAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ"
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Payments</h1>
      <Table
        columns={columns}
        dataSource={payments.slice((currentPage - 1) * pageSize, currentPage * pageSize)} // Apply pagination
        rowKey="paymentId"
        loading={loading}
        pagination={false} // Disable default pagination
      />
      <div style={{ marginTop: '16px', marginLeft: '10px', opacity: 0.5, display: 'flex', justifyContent: 'space-between' }}>
        <span>{totalPayments} payments in total</span>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalPayments}
          onChange={page => setCurrentPage(page)}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default Payments;
