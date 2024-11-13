import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
} from "antd";
import api from "../../config/axios";
import { ExportOutlined } from "@ant-design/icons";

const VouchersManager = () => {
  const [vouchers, setVouchers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Fetch all vouchers from the API
  const fetchVouchers = async () => {
    try {
      const response = await api.get("Voucher/GetAllVoucher");
      setVouchers(response.data);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      message.error("Failed to fetch vouchers");
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const columns = [
    {
      title: "Voucher ID",
      dataIndex: "voucherId",
      key: "voucherId",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Discount (%)",
      dataIndex: "discountValue",
      key: "discountValue",
    },
    {
      title: "Min Order Value",
      dataIndex: "minOrderValue",
      key: "minOrderValue",
      render: (value) => formatCurrency(value),
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <span>
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
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        code: values.code,
        description: values.description,
        minOrderValue: values.minOrderValue,
        expiryDate: values.expiryDate,
        discountValue: values.discountValue / 100,
      };

      console.log("Formatted values before sending:", formattedValues);

      const response = await api.post("Voucher/CreateVoucher", formattedValues);
      if (response.data === true) {
        message.success("New voucher added successfully");
        fetchVouchers();
      } else {
        message.error("Failed to create voucher. Please try again.");
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error saving voucher:", error);
      message.error(
        "Failed to save voucher. Please check your input and API connection."
      );
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDeleteVoucher = async (id) => {
    try {
      const response = await api.delete(`Voucher/RemoveVoucher/${id}`);
      if (response.data === true) {
        message.success("Voucher deleted successfully");
        fetchVouchers();
      } else {
        message.error(
          "Failed to delete voucher. API response was not successful."
        );
      }
    } catch (error) {
      message.error("Failed to delete voucher");
      console.error("API error:", error);
    }
  };

  const formatCurrency = (amount) => {
    const validAmount = amount !== undefined ? amount : 0;
    return (
      validAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ"
    );
  };

  const exportToCSV = () => {
    const headers = [
      "Voucher ID",
      "Code",
      "Description",
      "Discount (%)",
      "Min Order Value",
      "Expiry Date",
    ];

    const csvRows = [
      headers.join(","), // Add headers as the first row
      ...vouchers.map((voucher) =>
        [
          voucher.voucherId,
          voucher.code,
          voucher.description,
          voucher.discountValue,
          voucher.minOrderValue,
          new Date(voucher.expiryDate).toLocaleDateString(),
        ].join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "vouchers.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Vouchers</h1>
      <Button
        icon={<ExportOutlined />}
        onClick={exportToCSV}
        type="primary"
        className="mb-4"
      >
        Export CSV
      </Button>
      <Table columns={columns} dataSource={vouchers} rowKey="voucherId" />

      <Modal
        title="Create New Voucher"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="code"
            label="Voucher Code"
            rules={[
              { required: true, message: "Please input the voucher code!" },
            ]}
          >
            <Input style={{ textTransform: "uppercase" }} />
          </Form.Item>
          <Form.Item
            name="description"
            label="Voucher Description"
            rules={[
              {
                required: true,
                message: "Please input the voucher description!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="discountValue"
            label="Percentage Discount"
            rules={[
              {
                required: true,
                message: "Please input the discount percentage!",
              },
            ]}
          >
            <InputNumber min={0} max={100} />
          </Form.Item>
          <Form.Item
            name="expiryDate"
            label="Expiry Date (in days)"
            rules={[
              {
                required: true,
                message: "Please input the number of days until expiry!",
              },
            ]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            name="minOrderValue"
            label="Minimum Order Value"
            rules={[
              {
                required: true,
                message: "Please input the minimum order value!",
              },
            ]}
          >
            <InputNumber min={0} prefix="$" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VouchersManager;
