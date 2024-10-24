// src/page/Admin/Posts.jsx
import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Modal, Button, Input, message, Pagination, Spin } from 'antd';
import api from "../../config/axios";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); 
  const pageSize = 8;

  const fetchPosts = async () => {
    try {
      const response = await api.get('Request/GetRequestList/post');
      setTimeout(() => {
        setPosts(response.data);
        setLoading(false); 
      }, 1000); 
    } catch (error) {
      console.error("Error fetching request: ", error);
      message.error("Failed to load post.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleAccept = async (post) => {
    setLoading(true);
    try {
      const response = await api.put('Request/UpdateRequest', {
        userId: post.userId,
        requestType: post.requestType,
        productId: post.productId,
        status: 'Accepted',
      });

      if (response.data === true) {
        setPosts(posts.map(p =>
          p.productId === post.productId ? { ...p, status: 'Accepted' } : p
        ));
        message.success(`Post ${post.productId} has been accepted.`);
      } else {
        throw new Error('Failed to update post status');
      }
    } catch (error) {
      console.error("Error accepting post: ", error);
      message.error("Failed to accept post. Please check server logs for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (post) => {
    setLoading(true);
    try {
      const response = await api.put('Request/UpdateRequest', {
        userId: post.userId,
        requestType: post.requestType,
        productId: post.productId,
        status: 'Rejected',
      });

      if (response.data === true) {
        setPosts(posts.map(p =>
          p.productId === post.productId ? { ...p, status: 'Rejected' } : p
        ));
        message.success(`Post ${post.productId} has been rejected.`);
      } else {
        throw new Error('Failed to update post status');
      }
    } catch (error) {
      console.error("Error rejecting post: ", error);
      message.error("Failed to reject post.");
    } finally {
      setLoading(false);
    }
  };


  const renderList = () => {
    const paginatedPosts = posts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
      <>
      <Spin spinning={loading}>
        <Table 
          columns={[
            {
              title: 'Request ID',
              dataIndex: 'requestId',
              key: 'requestId',
            },
            {
              title: 'User ID',
              dataIndex: 'userId',
              key: 'userId',
            },
            {
              title: 'Product ID',
              dataIndex: 'productId',
              key: 'productId',
              sorter: (a, b) => a.productId.localeCompare(b.productId),
            },
            {
              title: 'Posted At',
              dataIndex: 'createdAt',
              key: 'createdAt',
            },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              render: (status) => (
                <Tag color={status === 'Pending' ? 'gold' : status === 'Accepted' ? 'green' : status === 'Disabled' ? 'grey' : 'red'}>
                  {status.toUpperCase()}
                </Tag>
              ),
            },
            {
              title: 'Price',
              dataIndex: 'amount',
              key: 'amount',
              render: (price) => price !== null && price !== undefined ? `$${price.toFixed(2)}` : 'N/A',
            },
            {
              title: 'Actions',
              key: 'actions',
              render: (_, record) => (
                <Space size="middle">
                  {record.status === 'Pending' && (
                    <>
                      <Button type="primary" onClick={() => handleAccept(record)}>Accept</Button>
                      <Button danger onClick={() => handleReject(record)}>Reject</Button>
                    </>
                  )}
                  {/* {record.status === 'Accepted' && (
                    <Button danger onClick={() => handleReject(record)}>Disable</Button>
                  )}
                  {record.status === 'Rejected' && (
                    <Button onClick={() => handleAccept(record)}>View Reason</Button>
                  )} */}
                </Space>
              ),
            },
          ]}
          dataSource={paginatedPosts} 
          rowKey="id" 
          pagination={false}
        />
        </Spin>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={posts.length}
            onChange={page => setCurrentPage(page)} 
          />
        </div>
      </>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Posts</h1>
        {renderList()}
    </div>
  );
};

export default Posts;