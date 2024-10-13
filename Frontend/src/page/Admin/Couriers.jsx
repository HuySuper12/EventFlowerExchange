import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Upload, message, Popconfirm, Rate } from 'antd';
import { UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { confirm } = Modal;

const Couriers = () => {
  const [couriers, setCouriers] = useState([
    {
      id: '1',
      avatar: 'https://www.booska-p.com/wp-content/uploads/2024/03/One-Punch-Man-1024x750.png',
      name: 'Thi san',
      vehicleId: '4884',
      phone: '0123456789',
      rating: 4.5,
      status: 'Active',
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingCourier, setEditingCourier] = useState(null);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar) => <img src={avatar} alt="Courier" className="w-10 h-10 rounded-full" />,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Vehicle ID',
      dataIndex: 'vehicleId',
      key: 'vehicleId',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => <Rate disabled defaultValue={rating} />,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span className={`px-2 py-1 rounded ${status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {status}
        </span>
      ),
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

  const showModal = () => {
    setIsModalVisible(true);
    setEditingCourier(null);
    form.resetFields();
  };

  const showEditModal = (courier) => {
    setIsModalVisible(true);
    setEditingCourier(courier);
    form.setFieldsValue(courier);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingCourier) {
        setCouriers(couriers.map(courier => courier.id === editingCourier.id ? { ...courier, ...values } : courier));
        message.success('Courier updated successfully');
      } else {
        const newCourier = {
          id: (couriers.length + 1).toString(),
          ...values,
          rating: 0,
        };
        setCouriers([...couriers, newCourier]);
        message.success('New courier added successfully');
      }
      setIsModalVisible(false);
    }).catch((info) => {
      console.log('Validate Failed:', info);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDeleteCourier = (id) => {
    setCouriers(couriers.filter(courier => courier.id !== id));
    message.success('Courier deleted successfully');
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Couriers</h1>
      <Button onClick={showModal} type="primary" className="mb-4">
        Add New Courier
      </Button>
      <Table columns={columns} dataSource={couriers} rowKey="id" />

      <Modal
        title={editingCourier ? "Edit Courier" : "Add New Courier"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="avatar"
            label="Avatar"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            
            <Upload name="avatar" listType="picture-card" maxCount={1}>
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the courier name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="vehicleId" label="Vehicle ID" rules={[{ required: true, message: 'Please input the vehicle ID!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true, message: 'Please input the phone number!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select the courier status!' }]}>
            <Select>
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Form.Item>
        </Form>
        
      </Modal>
    </div>
  );
};

export default Couriers;