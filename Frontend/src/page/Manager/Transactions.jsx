import React, { useState, useEffect } from "react";
import { Table, message, Pagination, Tabs, Button } from "antd";
import api from "../../config/axios";
import "antd/dist/reset.css";
import TabPane from "antd/es/tabs/TabPane";
import { ExportOutlined } from "@ant-design/icons";

const TransactionsManager = () => {
  const [deposit, setDeposit] = useState([]);
  const [withdraw, setWithdraw] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 8;

  useEffect(() => {
    fetchDeposit();
    fetchWithdraw();
  }, []);

  const fetchDeposit = async () => {
    setLoading(true);
    try {
      const response = await api.get(`VNPAY/GetPaymentListBy/1`);
      setDeposit(response.data.reverse());
    } catch (error) {
      message.error(`Failed to fetch deposit requests`);
    } finally {
      setLoading(false);
    }
  };

  const fetchWithdraw = async () => {
    setLoading(true);
    try {
      const response = await api.get(`VNPAY/GetPaymentListBy/2`);
      setWithdraw(response.data.reverse());
    } catch (error) {
      message.error(`Failed to fetch withdraw requests`);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Payment ID",
      dataIndex: "paymentId",
      key: "paymentId",
      sorter: (a, b) => a.paymentId - b.paymentId,
    },

    {
      title: "Payment Code",
      dataIndex: "paymentCode",
      key: "paymentCode",
      sorter: (a, b) => a.paymentCode - b.paymentCode,
    },
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
      sorter: (a, b) => a.userId.localeCompare(b.userId),
    },
    {
      title: "Payment Type",
      dataIndex: "paymentType",
      key: "paymentType",
      render: (type) => (
        <span style={{ fontWeight: "bold" }}>
          {type === 1 ? "Deposit" : type === 2 ? "Withdraw" : "Unknown"}
        </span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount,
      render: (amount) => formatCurrency(amount),
    },
    {
      title: "Payment Content",
      dataIndex: "paymentContent",
      key: "paymentContent",
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          style={{
            color:
              status === true ? "green" : status === false ? "orange" : "red",
          }}
        >
          {status === true
            ? "Successful"
            : status === false
            ? "Failed"
            : "Unknown"}
        </span>
      ),
    },
    {
      title: "Date/Time",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (date) => formatDate(date),
    },
  ];

  const renderTable = (data) => {
    return (
      <>
        <Table
          columns={columns}
          dataSource={data.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )}
          rowKey="requestId"
          loading={loading}
          pagination={false}
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
          <span>{data.length} requests in total</span>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={data.length}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
        </div>
      </>
    );
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

  const exportToCSV = (data, filename) => {
    const headers = [
      "Payment ID",
      "Payment Code",
      "User ID",
      "Payment Type",
      "Amount",
      "Payment Content",
      "Status",
      "Date/Time",
    ];

    const csvRows = [
      headers.join(","), // Add headers as the first row
      ...data.map(transaction => [
        transaction.paymentId,
        transaction.paymentCode,
        transaction.userId,
        transaction.paymentType === 1 ? "Deposit" : "Withdraw",
        transaction.amount,
        transaction.paymentContent,
        transaction.status ? "Successful" : "Failed",
        formatDate(transaction.createdAt),
      ].join(","))
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Transaction</h1>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Deposit" key="1">
          <Button
            icon={<ExportOutlined />}
            onClick={() => exportToCSV(deposit, "deposit_transactions.csv")}
            style={{ marginBottom: "16px" }}
          >
            Export CSV
          </Button>
          {renderTable(deposit)}
        </TabPane>
        <TabPane tab="Withdraw" key="2">
          <Button
            icon={<ExportOutlined />}
            onClick={() => exportToCSV(withdraw, "withdraw_transactions.csv")}
            style={{ marginBottom: "16px" }}
          >
            Export CSV
          </Button>
          {renderTable(withdraw)}
        </TabPane>
      </Tabs>
    </div>
  );
};
export default TransactionsManager;
