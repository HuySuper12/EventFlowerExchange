// src/page/Admin/Posts.jsx
import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Space,
  Modal,
  Button,
  message,
  Pagination,
  Spin,
  Image,
  Form,
  Input,
} from "antd";
import api from "../../config/axios";

const ReportManager = () => {
  const [report, setReport] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const pageSize = 8;

  const fetchReport = async () => {
    try {
      const response = await api.get("Request/GetRequestList/Report");
      setTimeout(() => {
        setReport(response.data.reverse());
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
      const response = await api.get(`Product/SearchProduct`, {
        params: {
          id: productId,
        },
      });
      console.log("Product details:", response.data);
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
    fetchReport();
  }, []);

  const handleAccept = async (post) => {
    setLoading(true);
    try {
      const payload = {
        requestId: post.requestId,
        userId: post.userId,
        requestType: "Report",
        productId: post.productId,
        status: "Accepted",
      };
      console.log("Payload being sent:", payload);

      const response = await api.put("Request/UpdateRequest", payload);

      if (response.data === true) {
        message.success(`Post ${post.productId} has been banned.`);
      } else {
        throw new Error("Failed to update post status");
      }
    } catch (error) {
      console.error("Error ban post: ", error);
      message.error(
        "Failed to ban post. Please check server logs for details."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderList = () => {
    const paginatedPosts = report.slice(
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
                title: "Reason",
                dataIndex: "reason",
                key: "reason",
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
                    {status ? status.toUpperCase() : "Pending"}
                  </Tag>
                ),
              },
              {
                title: "Actions",
                key: "actions",
                render: (_, record) => (
                  <Space size="middle">
                    {record.status === "Pending" && (
                      <>
                        <Button
                          type="primary"
                          onClick={() => handleAccept(record)}
                        >
                          Disable Post
                        </Button>
                      </>
                    )}
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
            total={report.length}
            onChange={(page) => setCurrentPage(page)}
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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Report</h1>
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
              {Array.isArray(productDetails.productImage) ? (
                productDetails.productImage.map((url, index) => (
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
                ))
              ) : (
                <p>No images available</p>
              )}
            </div>
          </Form>
        ) : (
          <p>No details available</p>
        )}
      </Modal>
    </div>
  );
};

export default ReportManager;
