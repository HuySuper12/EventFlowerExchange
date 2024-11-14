import React, { useState, useEffect } from "react";
import { Table, message, Pagination, Tabs, Button } from "antd";
import api from "../../config/axios";
import "antd/dist/reset.css";
import { ExportOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;

const RequestsManager = () => {
  const [postRequests, setPostRequests] = useState([]);
  const [withdrawRequests, setWithdrawRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    fetchRequests("post", setPostRequests);
    fetchRequests("withdraw", setWithdrawRequests);
  }, []);

  const fetchRequests = async (type, setter) => {
    setLoading(true);
    try {
      const response = await api.get(`Request/GetRequestList/${type}`);
      setter(response.data.reverse());
    } catch (error) {
      message.error(`Failed to fetch ${type} requests`);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Request ID",
      dataIndex: "requestId",
      key: "requestId",
      sorter: (a, b) => a.requestId - b.requestId,
    },
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
      sorter: (a, b) => a.userId.localeCompare(b.userId),
    },
    {
      title: "Request Type",
      dataIndex: "requestType",
      key: "requestType",
      render: (type) => <span style={{ fontWeight: "bold" }}>{type}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          style={{
            color:
              status === "Completed"
                ? "green"
                : status === "Pending"
                ? "orange"
                : "red",
          }}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Date/Time",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
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

  const exportToCSV = (data, filename) => {
    const headers = [
      "Request ID",
      "User ID",
      "Request Type",
      "Status",
      "Date/Time",
    ];

    const csvRows = [
      headers.join(","), // Add headers as the first row
      ...data.map(request => [
        request.requestId,
        request.userId,
        request.requestType,
        request.status,
        new Date(request.createdAt).toLocaleString(),
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
      <h1 className="text-3xl font-bold mb-4">Requests</h1>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Post Requests" key="1">
          <Button
            icon={<ExportOutlined />}
            onClick={() => exportToCSV(postRequests, "post_requests.csv")}
            style={{ marginBottom: "16px" }}
          >
            Export CSV
          </Button>
          {renderTable(postRequests)}
        </TabPane>
        <TabPane tab="Withdraw Requests" key="2">
          <Button
            icon={<ExportOutlined />}
            onClick={() => exportToCSV(withdrawRequests, "withdraw_requests.csv")}
            style={{ marginBottom: "16px" }}
          >
            Export CSV
          </Button>
          {renderTable(withdrawRequests)}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default RequestsManager;
