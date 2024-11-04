import React, { useState, useEffect } from "react";
import { Table, Button, Modal, message, Pagination } from "antd";
import api from "../../config/axios";
import "antd/dist/reset.css";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  // Fetch transactions from API
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await api.get("Transaction/ViewAllTransaction");
        setTransactions(response.data); // Assuming the response data is an array of transactions
      } catch (error) {
        message.error("Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
      sorter: (a, b) => a.userId.localeCompare(b.userId),
    },
    {
      title: "Product ID",
      dataIndex: "productId",
      key: "productId",
      sorter: (a, b) => a.productId.localeCompare(b.productId),
    },
    {
      title: "Date/Time",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => new Date(a.dateTime) - new Date(b.dateTime),
      render: (value) => formatDate(value),
    },

    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (value) => `${formatCurrency(value.toFixed(2))}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        const isCompleted = status === true;

        return (
          <span
            style={{
              color: isCompleted ? "green" : "red",
            }}
          >
            {isCompleted ? "Transferred into the system" : "Transferred out of the system"}
            {!isCompleted && record.note && <span>(Note: {record.note})</span>}
          </span>
        );
      },
    },

    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button type="link" onClick={() => handleViewDetail(record)}>
          View Detail
        </Button>
      ),
    },
  ];

  const handleViewDetail = (transaction) => {
    Modal.info({
      title: `Transaction ID: ${transaction.transactionId}`,
      content: (
        <div>
          <p>User ID: {transaction.userId}</p>
          <p>Order ID: {transaction.orderId}</p>
          <p>Date/Time: {formatDate(transaction.createdAt)}</p>
          <p>
            Transaction Type:{" "}
            {transaction.transactionType === 1
              ? "Deposit"
              : transaction.transactionType === 2
              ? "Withdraw"
              : transaction.transactionType === 3
              ? "Order Payment"
              : "Unknown"}
          </p>
          <p>Amount: {formatCurrency(transaction.amount.toFixed(2))}</p>
          <p>
            Status:{" "}
            {transaction.status === true
              ? "Transferred into the system"
              : "Transferred out the system"}
          </p>
          {transaction.note && <p>Note: {transaction.note}</p>}
        </div>
      ),
      onOk() {},
    });
  };

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

  const totalTransactions = transactions.length;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Transactions</h1>
      <Table
        columns={columns}
        dataSource={transactions.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )} // Apply pagination
        rowKey="id"
        loading={loading}
        pagination={false} // Disable default pagination
      />
      <div
        style={{
          marginTop: "16px",
          marginLeft: "10px",
          opacity: 0.5,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>{totalTransactions} transactions in total</span>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalTransactions}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default Transactions;
