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
  Select,
} from "antd";
import api from "../../config/axios";

const { CheckableTag } = Tag;

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [rejectVisible, setRejectVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedTags, setSelectedTags] = useState(["All"]);
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
    fetchPosts();
  }, []);

  const handleAccept = async (post) => {
    setLoading(true);
    try {
      const payload = {
        requestId: post.requestId,
        userId: post.userId,
        requestType: "Post",
        productId: post.productId,
        status: "Accepted",
      };
      console.log("Payload being sent:", payload);

      const response = await api.put("Request/UpdateRequest", payload);

      if (response.data === true) {
        setPosts(
          posts.map((p) =>
            p.productId === post.productId ? { ...p, status: "Accepted" } : p
          )
        );
        message.success(`Post ${post.productId} has been accepted.`);
      } else {
        throw new Error("Failed to update post status");
      }
    } catch (error) {
      console.error("Error accepting post: ", error);
      message.error(
        "Failed to accept post. Please check server logs for details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (post, reason) => {
    setLoading(true);
    try {
      const response = await api.put("Request/UpdateRequest", {
        userId: post.userId,
        requestType: "Post",
        productId: post.productId,
        status: "Rejected",
        reason: reason,
      });

      if (response.data === true) {
        setPosts(
          posts.map((p) =>
            p.productId === post.productId ? { ...p, status: "Rejected" } : p
          )
        );
        message.success(`Post ${post.productId} has been rejected.`);
      } else {
        throw new Error("Failed to update post status");
      }
    } catch (error) {
      console.error("Error rejecting post: ", error);
      message.error("Failed to reject post.");
    } finally {
      setLoading(false);
    }
  };

  const showRejectModal = (post) => {
    setSelectedPost(post);
    setRejectVisible(true);
  };

  const handleRejectOk = () => {
    if (selectedPost) {
      handleReject(selectedPost, rejectReason);
    }
    setRejectVisible(false);
    setRejectReason("");
  };

  const handleRejectCancel = () => {
    setRejectVisible(false);
    setRejectReason("");
  };

  const handleTagChange = (tag, checked) => {
    let nextSelectedTags;

    if (tag === "All") {
      nextSelectedTags = checked ? ["All"] : [];
    } else {
      nextSelectedTags = checked
        ? [...selectedTags.filter((t) => t !== "All"), tag]
        : selectedTags.filter((t) => t !== tag);

      if (nextSelectedTags.length === 0) {
        nextSelectedTags = ["All"];
      }
    }

    setSelectedTags(nextSelectedTags);
  };

  const renderList = () => {
    const filteredPosts = selectedTags.includes("All")
      ? posts
      : posts.filter((post) => selectedTags.includes(post.status));

    const paginatedPosts = filteredPosts.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );

    return (
      <>
        <div className="mb-4">
          {["All", "Pending", "Accepted", "Rejected"].map((tag) => (
            <CheckableTag
              key={tag}
              checked={selectedTags.includes(tag)}
              onChange={(checked) => handleTagChange(tag, checked)}
              className={`px-3 py-1 mr-2 mb-2 border rounded-full cursor-pointer bg-white ${
                tag === "Pending"
                  ? "text-yellow-500 border-yellow-500 hover:text-yellow-600"
                  : tag === "Accepted"
                  ? "text-green-500 border-green-500 hover:text-green-600"
                  : tag === "Rejected"
                  ? "text-red-500 border-red-500 hover:text-red-600"
                  : "text-gray-500 border-gray-500"
              }`}
            >
              {tag}
              {selectedTags.includes(tag) && (
                <span className="ml-2 text-sm">x</span>
              )}
            </CheckableTag>
          ))}
        </div>
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
                render: (value) => formatDate(value),
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
                    {record.status === "Pending" && (
                      <>
                        <Button
                          type="primary"
                          onClick={() => handleAccept(record)}
                        >
                          Accept
                        </Button>
                        <Button danger onClick={() => showRejectModal(record)}>
                          Reject
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
            total={filteredPosts.length}
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
      <Modal
        title="Reject Reason"
        visible={rejectVisible}
        onOk={handleRejectOk}
        onCancel={handleRejectCancel}
      >
        <Input.TextArea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Enter reason for rejection"
        />
      </Modal>
    </div>
  );
};

export default Posts;
