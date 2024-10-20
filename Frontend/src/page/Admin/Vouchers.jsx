import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, message, Popconfirm } from 'antd';
import api from "../../config/axios";

const Vouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingVoucher, setEditingVoucher] = useState(null);

  // Fetch all vouchers
  const fetchVouchers = async () => {
    try {
      const response = await api.get('Voucher/GetAllVoucher'); 
      const data = response.data;
      setVouchers(data);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      message.error('Failed to fetch vouchers');
    }
  };

  useEffect(() => {
    fetchVouchers(); // Fetch vouchers when component mounts
  }, []);

  const columns = [
    {
      title: 'Voucher ID',
      dataIndex: 'voucherId',
      key: 'voucherId',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Discount (%)',
      dataIndex: 'discountValue',
      key: 'discountValue',
    },
    {
      title: 'Min Order Value',
      dataIndex: 'minOrderValue',
      key: 'minOrderValue',
      render: (value) => `$${value}`,
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <span>
          <Button onClick={() => showEditModal(record)} className="mr-2">Edit</Button>
          <Popconfirm
            title="Are you sure you want to delete this voucher?"
            onConfirm={() => handleDeleteVoucher(record.voucherId)}
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
    setEditingVoucher(null);
    form.resetFields();
  };

  const showEditModal = (voucher) => {
    setIsModalVisible(true);
    setEditingVoucher(voucher);
    form.setFieldsValue({
      ...voucher,
      expiryDate: Math.ceil((new Date(voucher.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)),
    });
  };

  const handleOk = async () => {
    form.validateFields().then(async (values) => {
      const daysUntilExpiry = values.expiryDate; 
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + daysUntilExpiry);

      const formattedValues = {
        code: values.code.toUpperCase(),
        description: values.description,
        discountValue: values.discountValue,
        minOrderValue: values.minOrderValue,
        expiryDate: expiryDate.toISOString(),
      };

      try {
        if (editingVoucher) {
          // API to update voucher
          await api.put(`Voucher/UpdateVoucher`, {
            ...formattedValues,
            voucherId: editingVoucher.voucherId,
          });
          message.success('Voucher updated successfully');
          setVouchers(vouchers.map(voucher => voucher.voucherId === editingVoucher.voucherId ? { ...voucher, ...formattedValues } : voucher));
        } else {
          // API to add new voucher
          const response = await api.post('Voucher/CreateVoucher', formattedValues);
          if (response.data === true) {
            message.success('New voucher added successfully');
            setVouchers([...vouchers, response.data]);
          } else {
            message.error('Failed to create voucher. Please try again.');
          }
        }
        setIsModalVisible(false);
      } catch (error) {
        console.error('Error saving voucher:', error);
        message.error('Failed to save voucher. Please check your input and API connection.');
      }
    }).catch((info) => {
      console.log('Validate Failed:', info);
    });
  };

  // Cancel modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Delete voucher
  const handleDeleteVoucher = async (id) => {
    try {
      const response = await api.delete(`Voucher/RemoveVoucher/${id}`);
      if (response.data === true) {
        message.success('Voucher deleted successfully');
        setVouchers(vouchers.filter(voucher => voucher.voucherId !== id));
      } else {
        message.error('Failed to delete voucher. API response was not successful.');
      }
    } catch (error) {
      message.error('Failed to delete voucher');
      console.error('API error:', error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Vouchers</h1>
      <Button onClick={showModal} type="primary" className="mb-4">
        Create New Voucher
      </Button>
      <Table columns={columns} dataSource={vouchers} rowKey="voucherId" />

      <Modal
        title={editingVoucher ? "Edit Voucher" : "Create New Voucher"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="code" label="Voucher Code" rules={[{ required: true, message: 'Please input the voucher code!' }]}>
            <Input style={{ textTransform: 'uppercase' }} />
          </Form.Item>
          <Form.Item name="description" label="Voucher Description" rules={[{ required: true, message: 'Please input the voucher description!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="discountValue" label="Percentage Discount" rules={[{ required: true, message: 'Please input the discount percentage!' }]}>
            <InputNumber min={0} max={100} />
          </Form.Item>
          <Form.Item name="expiryDate" label="Expiry Date (in days)" rules={[{ required: true, message: 'Please input the number of days until expiry!' }]}>
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item name="minOrderValue" label="Minimum Order Value" rules={[{ required: true, message: 'Please input the minimum order value!' }]}>
            <InputNumber min={0} prefix="$" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Vouchers;
