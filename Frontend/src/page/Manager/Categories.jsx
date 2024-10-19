import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Upload, message, Popconfirm, Tooltip } from 'antd';
import { UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

const Categories = () => {
  const [categories, setCategories] = useState([
    {
      id: '1',
      title: 'Birthday flowers',
      image: 'https://ganhhanghoa.vn/wp-content/uploads/2021/11/39-300x300.png',
      products: ['Red Rose Bouquet', 'Sunflower Arrangement'],
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingCategory, setEditingCategory] = useState(null);

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image) => <img src={image} alt="Category" className="w-16 h-16 object-cover" />,
    },
    {
      title: 'Products',
      dataIndex: 'products',
      key: 'products',
      render: (products) => (
        <Tooltip title={products.join(', ')}>
          <span>{products.length} products</span>
        </Tooltip>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <span>
          <Button onClick={() => showEditModal(record)} className="mr-2">Edit</Button>
          <Popconfirm
            title="Are you sure you want to delete this category?"
            onConfirm={() => handleDeleteCategory(record.id)}
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
    setEditingCategory(null);
    form.resetFields();
  };

  const showEditModal = (category) => {
    setIsModalVisible(true);
    setEditingCategory(category);
    form.setFieldsValue(category);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingCategory) {
        setCategories(categories.map(category => category.id === editingCategory.id ? { ...category, ...values } : category));
        message.success('Category updated successfully');
      } else {
        const newCategory = {
          id: (categories.length + 1).toString(),
          ...values,
          products: [],
        };
        setCategories([...categories, newCategory]);
        message.success('New category added successfully');
      }
      setIsModalVisible(false);
    }).catch((info) => {
      console.log('Validate Failed:', info);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter(category => category.id !== id));
    message.success('Category deleted successfully');
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <Button onClick={showModal} type="primary" className="mb-4">
        Add New Category
      </Button>
      <Table columns={columns} dataSource={categories} rowKey="id" />

      <Modal
        title={editingCategory ? "Edit Category" : "Add New Category"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input the category title!' }]}>
            <Input />
          </Form.Item>
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
        </Form>
      </Modal>
    </div>
  );
};

export default Categories;