import React, { useState } from 'react';
import { Table, Button, Modal, message, Pagination } from 'antd';
import 'antd/dist/reset.css';

const Transactions = () => {
  const [transactions, setTransactions] = useState([
    {
      id: '1',
      userId: 'U001',
      orderId: 'O001',
      dateTime: '2024-10-14 10:00',
      transactionType: 'Deposit',
      amount: 100,
      status: 'Completed',
      note: '',
    },
    {
      id: '2',
      userId: 'U002',
      orderId: 'O002',
      dateTime: '2024-10-14 11:00',
      transactionType: 'Withdrawal',
      amount: 50,
      status: 'Failed',
      note: 'Insufficient funds',
    },
    {
      id: '3',
      userId: 'U003',
      orderId: 'O003',
      dateTime: '2024-10-14 12:00',
      transactionType: 'Order Payment',
      amount: 75,
      status: 'Processing',
      note: '',
    },
    // Add more sample data if necessary
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const columns = [
    {
      title: 'Transaction ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
      sorter: (a, b) => a.userId.localeCompare(b.userId),
    },
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      sorter: (a, b) => a.orderId.localeCompare(b.orderId),
    },
    {
      title: 'Date/Time',
      dataIndex: 'dateTime',
      key: 'dateTime',
      sorter: (a, b) => new Date(a.dateTime) - new Date(b.dateTime),
    },
    {
      title: 'Transaction Type',
      dataIndex: 'transactionType',
      key: 'transactionType',
      render: (type) => (
        <span style={{ fontWeight: 'bold' }}>{type}</span>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <span style={{
          color: status === 'Completed' ? 'green' : status === 'Failed' ? 'red' : 'orange',
        }}>
          {status} {status === 'Failed' && record.note && <span>(Note: {record.note})</span>}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button type="link" onClick={() => handleViewDetail(record)}>View Detail</Button>
      ),
    },
  ];

  const handleViewDetail = (transaction) => {
    Modal.info({
      title: `Transaction ID: ${transaction.id}`,
      content: (
        <div>
          <p>User ID: {transaction.userId}</p>
          <p>Order ID: {transaction.orderId}</p>
          <p>Date/Time: {transaction.dateTime}</p>
          <p>Transaction Type: {transaction.transactionType}</p>
          <p>Amount: ${transaction.amount.toFixed(2)}</p>
          <p>Status: {transaction.status}</p>
          {transaction.note && <p>Note: {transaction.note}</p>}
        </div>
      ),
      onOk() {},
    });
  };

  const totalTransactions = transactions.length;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>
      <Table
        columns={columns}
        dataSource={transactions.slice((currentPage - 1) * pageSize, currentPage * pageSize)} // Apply pagination
        rowKey="id"
        pagination={false} // Disable default pagination
      />
      <div style={{ marginTop: '16px', marginLeft: '10px', opacity: 0.5, display: 'flex', justifyContent: 'space-between' }}>
        <span>{totalTransactions} transactions in total</span>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalTransactions}
          onChange={page => setCurrentPage(page)}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default Transactions;
