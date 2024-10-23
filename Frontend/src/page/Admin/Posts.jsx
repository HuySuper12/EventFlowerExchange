import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Space,
  Modal,
  Button,
  Input,
  List,
  Card,
  message,
  Avatar,
  Pagination,
} from "antd";
import {
  ExclamationCircleOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import api from "../../config/axios";

const { confirm } = Modal;

const Posts = () => {
  const [viewMode, setViewMode] = useState("list");
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const showPostDetails = (post) => {
    Modal.info({
      title: post.title,
      width: 800,
      content: (
        <div style={{ textAlign: "center" }}>
          <img
            src={post.images[0]}
            alt="Post"
            style={{ width: "100%", borderRadius: "8px", marginBottom: 16 }}
          />
          <h3>Description:</h3>
          <p style={{ fontSize: "16px", lineHeight: "1.5" }}>
            {post.description}
          </p>
          <p>
            <strong>Posted At:</strong> {post.postedAt}
          </p>
          <p>
            <strong>Price:</strong> ${post.price.toFixed(2)}
          </p>
        </div>
      ),
      onOk() {},
    });
  };

  const showRejectConfirm = (postId) => {
    const inputRef = React.createRef();
    confirm({
      title: `Reject Post ${postId}`,
      icon: <ExclamationCircleOutlined />,
      content: (
        <Input.TextArea
          ref={inputRef}
          placeholder="Please provide a reason for rejection"
          rows={4}
        />
      ),
      onOk() {
        const reason = inputRef.current.resizableTextArea?.textArea.value;
        if (!reason) {
          message.error("You must provide a reason for rejection.");
          return Promise.reject();
        }
        setPosts(
          posts.map((post) =>
            post.id === postId
              ? { ...post, status: "Rejected", rejectionReason: reason }
              : post
          )
        );
        message.success(`Post ${postId} has been rejected.`);
      },
      onCancel() {},
    });
  };

  const showDisableConfirm = (postId) => {
    const inputRef = React.createRef();
    confirm({
      title: `Disable Post ${postId}`,
      icon: <ExclamationCircleOutlined />,
      content: (
        <Input.TextArea
          ref={inputRef}
          placeholder="Please provide a reason for disabling"
          rows={4}
        />
      ),
      onOk() {
        const reason = inputRef.current.resizableTextArea?.textArea.value;
        if (!reason) {
          message.error("You must provide a reason for disabling.");
          return Promise.reject();
        }
        setPosts(
          posts.map((post) =>
            post.id === postId
              ? { ...post, status: "Disabled", rejectionReason: reason }
              : post
          )
        );
        message.success(`Post ${postId} has been disabled.`);
      },
      onCancel() {},
    });
  };

  const renderList = () => {
    const paginatedPosts = posts.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );

    const fetchPost = async () => {
      try {
        const response = await api.get(
          "Request/GetRequestList", {param:{ type: "Post",
            }}
        );
        setPosts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching account data:", error);
      }
    };

    useEffect(() => {
      fetchPost();
    }, []);

    return (
      <>
        <Table
          columns={[
            {
              title: "ID",
              dataIndex: "id",
              key: "id",
            },
            {
              title: "Image",
              dataIndex: "image",
              key: "image",
              render: (image) =>
                image ? (
                  <img src={image} alt="Product" width={50} />
                ) : (
                  <Avatar
                    shape="square"
                    size={50}
                    icon={<ExclamationCircleOutlined />}
                  />
                ),
            },
            {
              title: "Title",
              dataIndex: "title",
              key: "title",
            },
            {
              title: "Posted At",
              dataIndex: "postedAt",
              key: "postedAt",
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
                      : status === "Enable"
                      ? "green"
                      : status === "Disabled"
                      ? "grey"
                      : "red"
                  }
                >
                  {status.toUpperCase()}
                </Tag>
              ),
            },
            {
              title: "Price",
              dataIndex: "price",
              key: "price",
              render: (price) => `$${price.toFixed(2)}`,
            },
            {
              title: "Actions",
              key: "actions",
              render: (_, record) => (
                <Space size="middle">
                  <Button onClick={() => showPostDetails(record)}>
                    View Details
                  </Button>
                  {record.status === "Pending" && (
                    <>
                      <Button
                        type="primary"
                        onClick={() => handleAccept(record.id)}
                      >
                        Accept
                      </Button>
                      <Button
                        danger
                        onClick={() => showRejectConfirm(record.id)}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {record.status === "Enable" && (
                    <Button
                      danger
                      onClick={() => showDisableConfirm(record.id)}
                    >
                      Disable
                    </Button>
                  )}
                  {record.status === "Rejected" && (
                    <Button onClick={() => showReason(record)}>
                      View Reason
                    </Button>
                  )}
                  {record.status === "Disabled" && (
                    <Button onClick={() => showReason(record)}>
                      View Reason
                    </Button>
                  )}
                </Space>
              ),
            },
          ]}
          dataSource={paginatedPosts}
          rowKey="id"
          pagination={false}
        />
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

  const renderKanban = () => {
    const paginatedPosts = posts.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );

    return (
      <>
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={paginatedPosts}
          renderItem={(post) => (
            <List.Item>
              <Card
                hoverable
                cover={
                  post.image ? (
                    <img alt="example" src={post.image} />
                  ) : (
                    <Avatar
                      shape="square"
                      size={150}
                      icon={<ExclamationCircleOutlined />}
                    />
                  )
                }
                actions={[
                  <Button onClick={() => showPostDetails(post)}>
                    View Details
                  </Button>,
                  post.status === "Pending" && (
                    <>
                      <Button
                        type="primary"
                        onClick={() => handleAccept(post.id)}
                      >
                        Accept
                      </Button>
                      <Button danger onClick={() => showRejectConfirm(post.id)}>
                        Reject
                      </Button>
                    </>
                  ),
                  post.status === "Accepted" && (
                    <Button danger onClick={() => showDisableConfirm(post.id)}>
                      Disable
                    </Button>
                  ),
                  post.status === "Rejected" && (
                    <Button onClick={() => showReason(post)}>
                      View Reason
                    </Button>
                  ),
                ]}
              >
                <Card.Meta
                  title={post.title}
                  description={`Price: $${post.price.toFixed(2)}`}
                />
                <div style={{ marginTop: 8 }}>{post.postedAt}</div>
                <Tag
                  color={
                    post.status === "Pending"
                      ? "gold"
                      : post.status === "Accepted"
                      ? "green"
                      : post.status === "Disabled"
                      ? "grey"
                      : "red"
                  }
                >
                  {post.status.toUpperCase()}
                </Tag>
              </Card>
            </List.Item>
          )}
        />
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

  const handleAccept = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, status: "Enable" } : post
      )
    );
    message.success(`Post ${postId} has been accepted.`);
  };

  const showReason = (post) => {
    Modal.info({
      title:
        post.status === "Rejected"
          ? `Rejection Reason for ${post.id}`
          : `Disable Reason for ${post.id}`,
      content: post.rejectionReason,
      onOk() {},
    });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 16,
        }}
      >
        <Button.Group>
          <Button
            icon={<UnorderedListOutlined />}
            onClick={() => setViewMode("list")}
            type={viewMode === "list" ? "primary" : "default"}
          />
          <Button
            icon={<AppstoreOutlined />}
            onClick={() => setViewMode("kanban")}
            type={viewMode === "kanban" ? "primary" : "default"}
          />
        </Button.Group>
      </div>
      {viewMode === "list" ? renderList() : renderKanban()}
    </div>
  );
};

export default Posts;
