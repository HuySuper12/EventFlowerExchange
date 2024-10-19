import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm } from 'antd';
import api from "../../config/axios";

const Couriers = () => {
  const [couriers, setCouriers] = useState([]);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingCourier, setEditingCourier] = useState(null);

  // Fetch couriers list from API
  const fetchCouriers = async () => {
    const role = "shipper"; 
    try {
      const response = await api.get(`Account/ViewAllAccount/${role}`);
      setCouriers(response.data);
    } catch (error) {
      message.error('Failed to fetch couriers list');
      console.error('API error:', error);
    }
  };

  useEffect(() => {
    fetchCouriers(); 
  }, []);

  // Table columns
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phone',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <span>
          <Button onClick={() => showEditModal(record)} className="mr-2">Edit</Button>
          <Popconfirm
            title="Are you sure you want to delete this courier?"
            onConfirm={() => handleDeleteCourier(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  // Show modal for creating a new courier
  const showCreateModal = () => {
    setIsCreateModalVisible(true);
    form.resetFields(); 
  };

  // Show modal for editing an existing courier
  const showEditModal = (courier) => {
    setIsEditModalVisible(true);
    setEditingCourier(courier);
    form.setFieldsValue(courier); 
  };

  // Handle creating a new courier
  const handleCreateCourier = async () => {
    form.validateFields().then(async (values) => {
      try {
        await api.post(`Account/CreateAccount/Shipper`, values);
        
        message.success('New shipper added successfully');
        setIsCreateModalVisible(false);
        fetchCouriers();
      } catch (error) {
        message.error('Failed to add new shipper');
        console.error('API error:', error);
      }
    }).catch((info) => {
      console.log('Validate Failed:', info);
    });
  };

  const handleEditCourier = async () => {
    form.validateFields().then(async (values) => {
      try {
        await api.put(`Account/UpdateAccount`, { ...values, id: editingCourier.id });
        message.success('Courier updated successfully');
        setIsEditModalVisible(false);
        fetchCouriers(); 
      } catch (error) {
        message.error('Failed to update courier');
        console.error('API error:', error);
      }
    }).catch((info) => {
      console.log('Validate Failed:', info);
    });
  };

  const handleDeleteCourier = async (id) => {
    try {
      const response = await api.delete(`Account/RemoveAccount/${id}`);
      if (response.data === true) {
        message.success('Courier deleted successfully');
        setCouriers(couriers.filter(courier => courier.id !== id));
      } else {
        message.error('Failed to delete courier');
      }
    } catch (error) {
      message.error('Failed to delete courier');
      console.error('API error:', error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Couriers</h1>
      <Button onClick={showCreateModal} type="primary" className="mb-4">
        Create New Courier
      </Button>
      <Table columns={columns} dataSource={couriers} rowKey="id" />

      {/* Modal for creating new courier */}
      <Modal
        title="Add New Courier"
        visible={isCreateModalVisible}
        onOk={handleCreateCourier}
        onCancel={() => setIsCreateModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input the name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="salary"
            label="Salary"
            rules={[{ required: true, message: 'Please input the salary!' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please input the email!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Phone"
            rules={[{ required: true, message: 'Please input the phone number!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Please input the address!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input the password!' }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for editing courier */}
      <Modal
        title="Edit Courier"
        visible={isEditModalVisible}
        onOk={handleEditCourier}
        onCancel={() => setIsEditModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input the name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="salary"
            label="Salary"
            rules={[{ required: true, message: 'Please input the salary!' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please input the email!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Phone"
            rules={[{ required: true, message: 'Please input the phone number!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Please input the address!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Couriers;
