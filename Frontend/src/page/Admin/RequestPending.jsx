import React, { useState, useEffect } from 'react';
import { Table, Pagination, Tabs, message, Button } from 'antd';
import api from "../../config/axios";  
import 'antd/dist/reset.css';

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
      setWithdrawRequests(response.data);
    } catch (error) {
      message.error('Failed to fetch withdraw requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    const requestBody = {
      userId: "user_id_here", // Replace with actual user ID if needed
      requestType: "withdraw", // Adjust based on your request type
      paymentId: 0, // Set as needed
      amount: 0, // Set as needed
      productId: 0, // Set as needed
      status: 'Accepted', // Update the status
      createdAt: new Date().toISOString(), // Current timestamp
    };
  
    try {
      const response = await api.put('/Request/UpdateRequest', requestBody);
      if (response.data === true) {
        message.success('Request accepted successfully');
        fetchWithdrawRequests(); // Refresh the list
      } else {
        message.error('Failed to accept request. Please try again.');
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      message.error('Failed to accept request. Please check your input and API connection.');
    }
  };

  const columns = [
    {
      title: 'Request ID',
      dataIndex: 'requestId',
      key: 'requestId',
      sorter: (a, b) => a.requestId - b.requestId,
    },
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
      sorter: (a, b) => a.userId.localeCompare(b.userId),
    },
    {
      title: 'Request Type',
      dataIndex: 'requestType',
      key: 'requestType',
      render: (type) => <span style={{ fontWeight: 'bold' }}>{type}</span>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (value) => value != null ? `$${value.toFixed(2)}` : 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ color: status === 'Completed' ? 'green' : status === 'Pending' ? 'orange' : 'red' }}>
          {status}
        </span>
      ),
    },
    {
      title: 'Date/Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button type="primary" onClick={() => handleAcceptRequest(record.requestId)}>
          Accept
        </Button>
      ),
    },
  ];

  const renderTable = (data) => {
    return (
      <>
        <Table
          columns={columns}
          dataSource={data.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
          rowKey="requestId"
          loading={loading}
          pagination={false}
        />
        <div style={{ marginTop: '16px', marginLeft: '10px', opacity: 0.5, display: 'flex', justifyContent: 'space-between' }}>
          <span>{data.length} requests in total</span>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={data.length}
            onChange={page => setCurrentPage(page)}
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