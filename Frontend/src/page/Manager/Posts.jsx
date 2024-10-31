// src/page/Admin/Posts.jsx
import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  message,
  Pagination,
  Spin,
  Modal,
  Input,
  Image,
} from "antd";
import api from "../../config/axios";
import { Form } from "antd";

const PostsManager = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const pageSize = 8;

  const fetchPosts = async () => {
    try {
      const response = await api.get("Request/GetRequestList/post");
      setTimeout(() => {
        setPosts(response.data.reverse());
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching request: ", error);
      message.error("Failed to load post.");
      setLoading(false);
    }
  };

  const fetchProductDetails = async (productId) => {
    setLoading(true);
    try {
      const response = await api.get(`Product/SearchProduct/${productId}`);
      setProductDetails(response.data);
      setDetailsVisible(true);
    } catch (error) {
      console.error("Error fetching product details:", error);
      message.error("Failed to load product details.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (productId) => {
    fetchProductDetails(productId);
  };

  const handleDetailsCancel = () => {
    setDetailsVisible(false);
    setProductDetails(null);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const renderList = () => {
    const paginatedPosts = posts.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );

    return (
      <>
        <Spin spinning={loading}>
          <Table
            columns={[
              {
                title: "Request ID",
                dataIndex: "requestId",
                key: "requestId",
              },
              {
                title: "User ID",
                dataIndex: "userId",
                key: "userId",
                sorter: (a, b) =>
                  String(a.userId).localeCompare(String(b.userId)),
              },
              {
                title: "Product ID",
                dataIndex: "productId",
                key: "productId",
              },
              {
                title: "Posted At",
                dataIndex: "createdAt",
                key: "createdAt",
              },
              {
                title: "Status",
                dataIndex: "status",
                key: "status",
                render: (status) => (
                  <Tag
                    color={
                      status === "Pending"
                        ? "gold"
                        : status === "Accepted"
                        ? "green"
                        : "red"
                    }
                  >
                    {status.toUpperCase()}
                  </Tag>
                ),
              },
              {
                title: "Actions",
                key: "actions",
                render: (_, record) => (
                  <Space size="middle">
                    <Button onClick={() => handleViewDetails(record.productId)}>
                      View Details
                    </Button>
                  </Space>
                ),
              },
            ]}
            dataSource={paginatedPosts}
            rowKey="id"
            pagination={false}
          />
        </Spin>
        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}
        >
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={posts.length}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      </>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Posts</h1>
      {renderList()}
      <Modal
        title="Product Details"
        visible={detailsVisible}
        onCancel={handleDetailsCancel}
        footer={null}
        width={800}
      >
        {productDetails ? (
          <Form layout="vertical">
            <Form.Item label={<strong>Product Name</strong>}>
              <Input
                value={productDetails.productName}
                disabled
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                }}
              />
            </Form.Item>
            <Form.Item label={<strong>Price</strong>}>
              <Input
                value={productDetails.price}
                disabled
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                }}
              />
            </Form.Item>
            <Form.Item label={<strong>Description</strong>}>
              <Input.TextArea
                value={productDetails.description}
                disabled
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                }}
              />
            </Form.Item>
            <Form.Item label={<strong>Category</strong>}>
              <Input
                value={productDetails.category}
                disabled
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                }}
              />
            </Form.Item>
            <Form.Item label={<strong>Status</strong>}>
              <Input
                value={productDetails.status}
                disabled
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                }}
              />
            </Form.Item>
            <Form.Item label={<strong>Quantity</strong>}>
              <Input
                value={productDetails.quantity}
                disabled
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                }}
              />
            </Form.Item>
            <Form.Item label={<strong>Freshness Duration</strong>}>
              <Input
                value={`${productDetails.freshnessDuration} days`}
                disabled
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                }}
              />
            </Form.Item>
            <Form.Item label={<strong>Combo Type</strong>}>
              <Input
                value={productDetails.comboType}
                disabled
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                }}
              />
            </Form.Item>
            <Form.Item label={<strong>Created At</strong>}>
              <Input
                value={new Date(productDetails.createdAt).toLocaleString()}
                disabled
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                }}
              />
            </Form.Item>
            <Form.Item label={<strong>Expires At</strong>}>
              <Input
                value={new Date(productDetails.expireddAt).toLocaleString()}
                disabled
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                }}
              />
            </Form.Item>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {productDetails.productImage.map((url, index) => (
                <Image
                  key={index}
                  src={url}
                  alt="Product"
                  style={{
                    width: 150,
                    height: 150,
                    margin: 5,
                    objectFit: "cover",
                  }}
                />
              ))}
            </div>
          </Form>
        ) : (
          <p>No details available</p>
        )}
      </Modal>
    </div>
  );
};

export default PostsManager;
