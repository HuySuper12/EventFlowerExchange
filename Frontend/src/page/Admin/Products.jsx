import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Upload, message, Popconfirm } from 'antd';
import { UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { confirm } = Modal;

const Products = () => {
  const [products, setProducts] = useState([
    {
      id: '1',
      image: 'https://source.unsplash.com/100x100/?flower',
      name: 'Red Rose Bouquet',
      description: 'Beautiful bouquet of red roses',
      price: 49.99,
      categories: ['Birthday flowers', 'Wedding flowers'],
      status: 'Available',
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingProduct, setEditingProduct] = useState(null);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key:'id',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image) => <img src={image} alt="Product" className="w-16 h-16 object-cover" />,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Categories',
      dataIndex: 'categories',
      key: 'categories',
      render: (categories) => categories.join(', '),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span className={`px-2 py-1 rounded ${status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
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
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDeleteProduct(record.id)}
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
    setEditingProduct(null);
    form.resetFields();
  };

  const showEditModal = (product) => {
    setIsModalVisible(true);
    setEditingProduct(product);
    form.setFieldsValue(product);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingProduct) {
        setProducts(products.map(product => product.id === editingProduct.id ? { ...product, ...values } : product));
        message.success('Product updated successfully');
      } else {
        const newProduct = {
          id: (products.length + 1).toString(),
          ...values,
        };
        setProducts([...products, newProduct]);
        message.success('New product added successfully');
      }
      setIsModalVisible(false);
    }).catch((info) => {
      console.log('Validate Failed:', info);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
    message.success('Product deleted successfully');
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
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
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <Button onClick={showModal} type="primary" className="mb-4">
        Add New Product
      </Button>
      <Table columns={columns} dataSource={products} rowKey="id" />

      <Modal
        title={editingProduct ? "Edit Product" : "Add New Product"}
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
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the product name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please input the product description!' }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please input the product price!' }]}>
            <InputNumber min={0} step={0.01} prefix="$" />
          </Form.Item>
          <Form.Item name="categories" label="Categories" rules={[{ required: true, message: 'Please select at least one category!' }]}>
            <Select mode="multiple" placeholder="Select categories">
              {categoryOptions.map(category => (
                <Option key={category.id} value={category}>{category}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select the product status!' }]}>
            <Select>
              <Option value="Available">Available</Option>
              <Option value="Unavailable">Unavailable</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;