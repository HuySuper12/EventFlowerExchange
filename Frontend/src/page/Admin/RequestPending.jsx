import React, { useState, useEffect } from "react";
import { Table, Pagination, Tabs, message, Button } from "antd";
import api from "../../config/axios";
import "antd/dist/reset.css";

const { TabPane } = Tabs;

const RequestPending = () => {
  const [withdrawRequests, setWithdrawRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    fetchWithdrawRequests();
  }, []);

  const fetchWithdrawRequests = async () => {
    setLoading(true);
    try {
      const response = await api.get(`Request/GetRequestList/withdraw`);
      setWithdrawRequests(response.data.reverse());
    } catch (error) {
      message.error("Failed to fetch withdraw requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    const requestToAccept = withdrawRequests.find(
      (req) => req.requestId === requestId
    );

    if (!requestToAccept) {
      message.error("Request not found.");
      return;
    }

    // Extract necessary fields
    const { userId, amount, requestType, createDate } = requestToAccept;

    const paymentLinkBody = {
      requestId: requestId,
      userId: userId,
      amount: amount,
      type: requestType,
      createDate: new Date().toISOString(),
    };

    console.log("Payment Link Request Body:", paymentLinkBody);

    try {
      const response = await api.post(
        "VNPAY/create-payment-link",
        paymentLinkBody
      );

      console.log("Payment Link Response:", response.data); // Log the response

      if (response.data) {
        message.success("Payment link created successfully");
        window.location.href = response.data;
      } else {
        message.error("Failed to create payment link.");
      }
      fetchWithdrawRequests(); // Refresh the list
    } catch (error) {
      console.error("Error creating payment link:", error);
      if (error.response) {
        console.error("Response data:", error.response.data); // Log the response data
        message.error(
          `Failed to create payment link: ${
            error.response.data.message || "Unknown error"
          }`
        );
      } else {
        message.error(
          "Failed to create payment link. Please check your input and API connection."
        );
      }
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
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (value) => (value != null ? `$${value.toFixed(2)}` : "N/A"),
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
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            onClick={() => handleAcceptRequest(record.requestId)}
          >
            Accept
          </Button>
          {/* <Button type="danger" onClick={() => handleRejectRequest(record.requestId)} style={{ marginLeft: 8 }}>
            Reject
          </Button> */}
        </>
      ),
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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Request Pending</h1>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Withdraw Requests" key="1">
          {renderTable(withdrawRequests)}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default RequestPending;
