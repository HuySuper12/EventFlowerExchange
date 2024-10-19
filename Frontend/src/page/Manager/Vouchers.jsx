import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, DatePicker, Select, message, Popconfirm } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { confirm } = Modal;

const Vouchers = () => {
  const [vouchers, setVouchers] = useState([
    {
      id: '1',
      name: 'Summer Sale',
      description: '20% off on all summer flowers',
      code: 'SUMMER20',
      discount: 20,
      expiryDate: '2024-08-31',
      minOrderValue: 50,
      productLimit: ['Birthday flowers', 'Wedding flowers'],
    },
    
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingVoucher, setEditingVoucher] = useState(null);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Discount (%)',
      dataIndex: 'discount',
      key: 'discount',
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
    },
    {
      title: 'Min Order Value',
      dataIndex: 'minOrderValue',
      key: 'minOrderValue',
      render: (value) => `$${value}`,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <span>
          <Button onClick={() => showEditModal(record)} className="mr-2">Edit</Button>
          <Popconfirm
            title="Are you sure you want to delete this voucher?"
            onConfirm={() => handleDeleteVoucher(record.id)}
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
      expiryDate: moment(voucher.expiryDate),
    });
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const formattedValues = {
        ...values,
        code: values.code.toUpperCase(),
        expiryDate: values.expiryDate.format('YYYY-MM-DD'),
      };

      if (editingVoucher) {
        setVouchers(vouchers.map(voucher => voucher.id === editingVoucher.id ? { ...voucher, ...formattedValues } : voucher));
        message.success('Voucher updated successfully');
      } else {
        const newVoucher = {
          id: (vouchers.length + 1).toString(),
          ...formattedValues,
        };
        setVouchers([...vouchers, newVoucher]);
        message.success('New voucher added successfully');
      }
      setIsModalVisible(false);
    }).catch((info) => {
      console.log('Validate Failed:', info);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDeleteVoucher = (id) => {
    setVouchers(vouchers.filter(voucher => voucher.id !== id));
    message.success('Voucher deleted successfully');
  };

  const categoryOptions = [
    'Birthday flowers',
    'Wedding flowers',
    'Funeral flowers',
    'Event decoration flowers',
    'Holiday flowers',
    'Tet flowers',
    'Decorative flowers',
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Vouchers</h1>
      <Button onClick={showModal} type="primary" className="mb-4">
        Create New Voucher
      </Button>
      <Table columns={columns} dataSource={vouchers} rowKey="id" />

      <Modal
        title={editingVoucher ? "Edit Voucher" : "Create New Voucher"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Voucher Name" rules={[{ required: true, message: 'Please input the voucher name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Voucher Description" rules={[{ required: true, message: 'Please input the voucher description!' }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="code" label="Voucher Code" rules={[{ required: true, message: 'Please input the voucher code!', transform: (value) => value.toUpperCase() }]}>
            <Input style={{ textTransform: 'uppercase' }} />
          </Form.Item>
          <Form.Item name="discount" label="Percentage Discount" rules={[{ required: true, message: 'Please input the discount percentage!' }]}>
            <InputNumber min={0} max={100} />
          </Form.Item>
          <Form.Item name="expiryDate" label="Expiry Date" rules={[{ required: true, message: 'Please select the expiry date!' }]}>
            <DatePicker />
          </Form.Item>
          <Form.Item name="minOrderValue" label="Minimum Order Value" rules={[{ required: true, message: 'Please input the minimum order value!' }]}>
            <InputNumber min={0} prefix="$" />
          </Form.Item>
          <Form.Item name="productLimit" label="Product Limit" rules={[{ required: true, message: 'Please select at least one category!' }]}>
            <Select mode="multiple" placeholder="Select categories">
              {categoryOptions.map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Vouchers;