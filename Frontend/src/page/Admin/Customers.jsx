import React, { useEffect, useState } from "react";
import { Table, Tag, Avatar, Button, message, Tabs, Pagination } from "antd";
import { UserOutlined, ExportOutlined } from "@ant-design/icons";
import api from "../../config/axios";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const toggleStatus = async (id, checked) => {
    try {
      if (!checked) {
        // DELETE request for disabling the account
        const response = await api.delete(`Account/DisableAccount/${id}`);

        if (response.data === true) {
          // Update customer list after disabling
          setCustomers(
            customers.map((customer) =>
              customer.id === id ? { ...customer, status: checked } : customer
            )
          );
          message.success(`Customer ${id} has been locked.`);
        } else {
          message.error("Failed to update status.");
        }
      }
    } catch (error) {
      console.error("Error updating customer status:", error);
      message.error("Error occurred while updating status.");
    }
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
      dataIndex: "avatar",
      key: "avatar",
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
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status ? "green" : "red"}>
          {status ? "ACTIVE" : "LOCKED"}
        </Tag>
      ),
      filters: [
        { text: "Active", value: true },
        { text: "Locked", value: false },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) =>
        record.status ? (
          <Button
            type="danger"
            onClick={() => toggleStatus(record.id, false)}
            style={{ backgroundColor: "red", color: "white" }}
          >
            Disable
          </Button>
        ) : null, // Remove the Enable button from the Unavailable tab
    },
  ];

  const fetchCustomer = async () => {
    const role = "Buyer";

    try {
      const response = await api.get(`Account/ViewAllAccount/${role}`);
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customer data:", error);
      message.error("Failed to fetch customer data");
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 className="text-2xl font-bold mb-4">Customers</h1>
        <Button type="primary" icon={<ExportOutlined />} onClick={handleExport}>
          Export
        </Button>
      </div>

      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab={`Available (${availableCustomers.length})`} key="1">
          <Table
            columns={columns}
            dataSource={availableCustomers.slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize
            )}
            rowKey="id"
            pagination={false}
          />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={`Unavailable (${unavailableCustomers.length})`}
          key="2"
        >
          <Table
            columns={columns}
            dataSource={unavailableCustomers.slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize
            )}
            rowKey="id"
            pagination={false}
          />
        </Tabs.TabPane>
      </Tabs>

      <div
        style={{
          marginTop: "16px",
          marginLeft: "10px",
          opacity: 0.5,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
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

export default Customers;
