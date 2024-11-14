import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Avatar,
  Button,
  message,
  Tabs,
  Pagination,
  Spin,
} from "antd";
import { UserOutlined, ExportOutlined } from "@ant-design/icons";
import api from "../../config/axios";
import { Modal } from "antd";

const { confirm } = Modal;
const CustomersManager = () => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // Loading state
  const pageSize = 8;

  const fetchCustomer = async () => {
    const role = "Buyer";

    try {
      const response = await api.get(`Account/ViewAllAccount/${role}`);
      setTimeout(() => {
        setCustomers(response.data);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching customer data:", error);
      message.error("Failed to fetch customer data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, []);

  const toggleStatus = async (id, checked) => {
    confirm({
      title: `Are you sure you want to ${
        checked ? "activate" : "disable"
      } this customer?`,
      content: checked
        ? `This will activate the customer with ID ${id}.`
        : `This will disable the customer with ID ${id}.`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          if (!checked) {
            const response = await api.delete(`/Account/DisableAccount/${id}`);

            if (response.data === true) {
              setCustomers(
                customers.map((customer) =>
                  customer.id === id
                    ? { ...customer, status: checked }
                    : customer
                )
              );
              message.success(`Customer ${id} has been locked.`);
              console.log(response.data);
            } else {
              message.error("Failed to update status.");
              console.log(response.data);
            }
          }
        } catch (error) {
          console.error("Error updating customer status:", error);
          message.error("Error occurred while updating status.");
        }
      },
      onCancel() {
        console.log("Action cancelled");
      },
    });
  };

  const handleExport = () => {
    const csvData = customers.map((customer) => ({
      ID: customer.id,
      Name: customer.name,
      Email: customer.email,
      CreatedAt: customer.createdAt,
      Status: customer.status ? "Active" : "Locked",
    }));

    const csvHeaders = Object.keys(csvData[0]).join(",") + "\n";
    const csvRows = csvData
      .map((row) => Object.values(row).join(","))
      .join("\n");
    const csvContent = csvHeaders + csvRows;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "customers.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success("Customers exported successfully!");
  };

  const availableCustomers = customers.filter(
    (customer) => customer.status === true
  );
  const unavailableCustomers = customers.filter(
    (customer) => customer.status === false
  );
  const totalCustomers = customers.length;

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: "Avatar",
      dataIndex: "picture",
      key: "picture",
      render: (avatar) => <Avatar src={avatar} icon={<UserOutlined />} />,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      filters: [
        ...new Set(
          customers.map((customer) => ({
            text: customer.name,
            value: customer.name,
          }))
        ),
      ],
      onFilter: (value, record) => record.name.includes(value),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      filters: [
        ...new Set(
          customers.map((customer) => ({
            text: customer.email,
            value: customer.email,
          }))
        ),
      ],
      onFilter: (value, record) => record.email.includes(value),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      sorter: (a, b) => a.balance - b.balance,
      render: (balance) => formatCurrency(balance), // Formats balance as currency
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (value) => formatDate(value),
    },

    {
      title: "Actions",
      key: "actions",
      render: (_, record) =>
        record.status ? (
          <Button
            type="danger"
            onClick={() => toggleStatus(record.id, false)}
            className="bg-red-600 text-white"
          >
            Disable
          </Button>
        ) : null,
    },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date";
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    return date.toLocaleDateString("en-US", options);
  };

  const formatCurrency = (amount) => {
    const validAmount = amount !== undefined ? amount : 0;
    return (
      validAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ"
    );
  };

  const exportToCSV = () => {
    const headers = [
      "Customer ID",
      "Name",
      "Email",
      "Phone Number",
      "Address",
      "Joined Date",
    ];

    const csvRows = [
      headers.join(","), // Add headers as the first row
      ...customers.map(customer => [
        customer.customerId,
        customer.name,
        customer.email,
        customer.phoneNumber,
        customer.address,
        new Date(customer.joinedDate).toLocaleDateString(),
      ].join(","))
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "customers.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Customers</h1>
        <Button type="primary" icon={<ExportOutlined />} onClick={handleExport}>
          Export
        </Button>
      </div>

      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab={`Available (${availableCustomers.length})`} key="1">
          <div className="shadow-lg bg-white rounded-lg overflow-hidden">
            <Spin spinning={loading}>
              <Table
                columns={columns}
                dataSource={availableCustomers.slice(
                  (currentPage - 1) * pageSize,
                  currentPage * pageSize
                )}
                rowKey="id"
                pagination={false}
                className="rounded-lg"
                rowClassName="hover:bg-gray-100"
              />
            </Spin>
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={`Unavailable (${unavailableCustomers.length})`}
          key="2"
        >
          <div className="shadow-lg bg-white rounded-lg overflow-hidden">
            <Spin spinning={loading}>
              <Table
                columns={columns}
                dataSource={unavailableCustomers.slice(
                  (currentPage - 1) * pageSize,
                  currentPage * pageSize
                )}
                rowKey="id"
                pagination={false}
                className="rounded-lg"
                rowClassName="hover:bg-gray-100"
              />
            </Spin>
          </div>
        </Tabs.TabPane>
      </Tabs>

      <div className="flex justify-between mt-4 opacity-50">
        <span>{totalCustomers} customers in total</span>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalCustomers}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};
export default CustomersManager;
