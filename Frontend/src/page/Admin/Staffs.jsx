import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Upload, message, Popconfirm } from 'antd';
import { UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

const Staffs = () => {
  const [staffs, setStaffs] = useState([
    {
      id: '1',
      name: 'Tai san',
      image: 'https://source.unsplash.com/100x100/?portrait',
      phone: '123456789',
      address: 'Q1, TPHCM',
      orders: 50,
    },
    
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingStaff, setEditingStaff] = useState(null);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image) => <img src={image} alt="Staff" className="w-10 h-10 rounded-full" />,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Orders',
      dataIndex: 'orders',
      key: 'orders',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <span>
          <Button onClick={() => showEditModal(record)} className="mr-2">Edit</Button>
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

  const showModal = () => {
    setIsModalVisible(true);
    setEditingStaff(null);
    form.resetFields();
  };

  const showEditModal = (staff) => {
    setIsModalVisible(true);
    setEditingStaff(staff);
    form.setFieldsValue(staff);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingStaff) {
        setStaffs(staffs.map(staff => staff.id === editingStaff.id ? { ...staff, ...values } : staff));
        message.success('Staff updated successfully');
      } else {
        const newStaff = {
          id: (staffs.length + 1).toString(),
          ...values,
          orders: 0,
        };
        setStaffs([...staffs, newStaff]);
        message.success('New staff added successfully');
      }
      setIsModalVisible(false);
    }).catch((info) => {
      console.log('Validate Failed:', info);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDeleteStaff = (id) => {
    setStaffs(staffs.filter(staff => staff.id !== id));
    message.success('Staff deleted successfully');
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Staffs</h1>
      <Button onClick={showModal} type="primary" className="mb-4">
        Create New Staff
      </Button>
      <Table columns={columns} dataSource={staffs} rowKey="id" />

      <Modal
        title={editingStaff ? "Edit Staff" : "Add New Staff"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="image"
            label="Image"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload name="image" listType="picture-card" maxCount={1}>
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true, message: 'Please input the phone number!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address" rules={[{ required: true, message: 'Please input the address!' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Staffs;