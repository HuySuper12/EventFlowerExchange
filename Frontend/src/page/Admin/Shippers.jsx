import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Popconfirm } from "antd";
import api from "../../config/axios";

const Shippers = () => {
  const [shippers, setShippers] = useState([]);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingShipper, setEditingShipper] = useState(null);

  // Fetch shippers list from API
  const fetchShippers = async () => {
    const role = "shipper";
    try {
      const response = await api.get(`Account/ViewAllAccount/${role}`);
      setShippers(response.data);
    } catch (error) {
      message.error("Failed to fetch shippers list");
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    fetchShippers();
  }, []);

  // Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <span>
          <Button onClick={() => showEditModal(record)} className="mr-2">
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this shipper?"
            onConfirm={() => handleDeleteShipper(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  // Show modal for creating a new shipper
  const showCreateModal = () => {
    setIsCreateModalVisible(true);
    form.resetFields();
  };

  // Show modal for editing an existing shipper
  const showEditModal = (shipper) => {
    setIsEditModalVisible(true);
    setEditingShipper(shipper);
    form.setFieldsValue(shipper);
  };

  // Handle creating a new shipper
  const handleCreateShipper = async () => {
    form
      .validateFields()
      .then(async (values) => {
        try {
          await api.post(`Account/CreateAccount/Shipper`, values);

          message.success("New shipper added successfully");
          setIsCreateModalVisible(false);
          fetchShippers();
        } catch (error) {
          message.error("Failed to add new shipper");
          console.error("API error:", error);
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleEditShipper = async () => {
    form
      .validateFields()
      .then(async (values) => {
        try {
          await api.put(`Account/UpdateAccount`, {
            ...values,
            id: editingShipper.id,
          });
          message.success("Shipper updated successfully");
          setIsEditModalVisible(false);
          fetchShippers();
        } catch (error) {
          message.error("Failed to update shipper");
          console.error("API error:", error);
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleDeleteShipper = async (id) => {
    try {
      const response = await api.delete(`Account/RemoveAccount/${id}`);
      if (response.data === true) {
        message.success("Shipper deleted successfully");
        setShippers(shippers.filter((shipper) => shipper.id !== id));
      } else {
        message.error("Failed to delete shipper");
      }
    } catch (error) {
      message.error("Failed to delete shipper");
      console.error("API error:", error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Shippers</h1>
      <Button onClick={showCreateModal} type="primary" className="mb-4">
        Create New Shipper
      </Button>
      <Table columns={columns} dataSource={shippers} rowKey="id" />

      {/* Modal for creating new shipper */}
      <Modal
        title="Add New Shipper"
        visible={isCreateModalVisible}
        onOk={handleCreateShipper}
        onCancel={() => setIsCreateModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="salary"
            label="Salary"
            rules={[{ required: true, message: "Please input the salary!" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please input the email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Phone"
            rules={[
              { required: true, message: "Please input the phone number!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Location"
            rules={[
              { required: true, message: "Please input the address!" },
              {
                pattern: /^[^@*?;]+$/,
                message:
                  "Address cannot contain special characters like @, *, ?, ;",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input the password!" }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for editing shipper */}
      <Modal
        title="Edit Shipper"
        visible={isEditModalVisible}
        onOk={handleEditShipper}
        onCancel={() => setIsEditModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="salary" label="Salary">
            <Input disabled value={editingShipper?.salary} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ message: "Please input the email!" }]}
          >
            <Input disabled value={editingShipper?.email} />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: "Please input the phone number!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Location"
            rules={[
              { required: true, message: "Please input the address!" },
              {
                pattern: /^[^@*?;]+$/,
                message:
                  "Address cannot contain special characters like @, *, ?, ;",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Shippers;
