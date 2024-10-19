import React from 'react';
import { Form, Input, Upload, Button, message } from 'antd'; // Added Button here
import { UploadOutlined } from '@ant-design/icons';

const AdminProfileEdit = ({ adminInfo, onUpdate }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    // Optional: Show a success message after updating
    message.success('Profile updated successfully');
    onUpdate(values);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={adminInfo}
      onFinish={onFinish}
    >
      <Form.Item
        name="avatar"
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
      <Form.Item name="name" label="Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Update Profile
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AdminProfileEdit;
