import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Popconfirm } from "antd";
import api from "../../config/axios";
import { ExportOutlined } from "@ant-design/icons";

const StaffsManager = () => {
  const [staffs, setStaffs] = useState([]);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingStaff, setEditingStaff] = useState(null);

  // Fetch staff list from API
  const fetchStaffs = async () => {
    const role = "staff";
    try {
      const response = await api.get(`Account/ViewAllAccount/${role}`);
      setStaffs(response.data);
    } catch (error) {
      message.error("Failed to fetch staff list");
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    fetchStaffs();
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
            title="Are you sure you want to delete this staff?"
            onConfirm={() => handleDeleteStaff(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  // Show modal for creating a new staff
  const showCreateModal = () => {
    setIsCreateModalVisible(true);
    form.resetFields();
  };

  // Show modal for editing an existing staff
  const showEditModal = (staff) => {
    setIsEditModalVisible(true);
    setEditingStaff(staff);
    form.setFieldsValue(staff);
  };

  // Handle creating a new staff
  const handleCreateStaff = async () => {
    form
      .validateFields()
      .then(async (values) => {
        try {
          await api.post(`Account/CreateAccount/Staff`, values);
          message.success("New staff added successfully");
          setIsCreateModalVisible(false);
          fetchStaffs();
        } catch (error) {
          message.error("Failed to add new staff");
          console.error("API error:", error);
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  // Handle editing an existing staff
  const handleEditStaff = async () => {
    form
      .validateFields()
      .then(async (values) => {
        try {
          await api.put(`Account/UpdateAccount`, {
            ...values,
            id: editingStaff.id,
          });
          message.success("Staff updated successfully");
          setIsEditModalVisible(false);
          fetchStaffs();
        } catch (error) {
          message.error("Failed to update staff");
          console.error("API error:", error);
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  // Handle deleting a staff
  const handleDeleteStaff = async (id) => {
    try {
      const response = await api.delete(`Account/RemoveAccount/${id}`);
      if (response.data === true) {
        message.success("Staff deleted successfully");
        setStaffs(staffs.filter((staff) => staff.id !== id));
      } else {
        message.error("Failed to delete staff");
      }
    } catch (error) {
      message.error("Failed to delete staff");
      console.error("API error:", error);
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Staff ID",
      "Name",
      "Email",
      "Phone Number",
      "Address",
    ];

    const csvRows = [
      headers.join(","), // Add headers as the first row
      ...staffs.map(staff => [
        staff.id,
        staff.name,
        staff.email,
        staff.phoneNumber,
        staff.address,
      ].join(","))
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "staffs.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Staffs</h1>
      <div className="flex justify-between">
        <Button onClick={showCreateModal} type="primary" className="mb-4">Add New Staff</Button>
      <Button
        icon={<ExportOutlined />}
        onClick={exportToCSV}
        type="primary"
        className="mb-4"
      >
        Export CSV
      </Button>
      </div>
      
      
      
      <Table columns={columns} dataSource={staffs} rowKey="id" />

      {/* Modal for creating new staff */}
      <Modal
        title="Add New Staff"
        visible={isCreateModalVisible}
        onOk={handleCreateStaff}
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
            label="Address"
            rules={[{ required: true, message: "Please input the address!" }]}
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

      {/* Modal for editing staff */}
      <Modal
        title="Edit Staff"
        visible={isEditModalVisible}
        onOk={handleEditStaff}
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
          <Form.Item
            name="salary"
            label="Salary"
            rules={[{ message: "Please input the salary!" }]}
          >
            <Input disabled value={editingStaff?.salary} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ message: "Please input the email!" }]}
          >
            <Input disabled value={editingStaff?.email} />
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
            label="Address"
            rules={[{ required: true, message: "Please input the address!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffsManager;
