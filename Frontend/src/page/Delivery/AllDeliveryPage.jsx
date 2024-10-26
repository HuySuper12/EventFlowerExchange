import React, { useState, useEffect } from "react";
import { Table, Tabs, Pagination, Spin } from "antd";
import { Link } from "react-router-dom";
import Header from "../../component/Header_delivery";
import SidebarDelivery from "../../component/Sidebar_delivery";

const { TabPane } = Tabs;

const DeliveryList = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setTimeout(() => {
      setData([
        {
          key: "122324",
          order: "#122324",
          phone: "123-456-7890",
          address: "123 Main St, City, Country",
          products: ["https://example.com/product1.jpg"],
          amount: "$2.00",
          customer: "Joan Koch",
          status: "Delivered",
        },
        {
          key: "122325",
          order: "#122325",
          phone: "987-654-3210",
          address: "456 Elm St, City, Country",
          products: ["https://example.com/product2.jpg"],
          amount: "$5.00",
          customer: "John Doe",
          status: "Failed",
        },
        {
          key: "122326",
          order: "#122326",
          phone: "456-789-0123",
          address: "789 Oak St, City, Country",
          products: ["https://example.com/product3.jpg"],
          amount: "$10.00",
          customer: "Alice Smith",
          status: "Delivered",
        },
        {
          key: "122327",
          order: "#122327",
          phone: "321-654-9870",
          address: "101 Pine St, City, Country",
          products: ["https://example.com/product4.jpg"],
          amount: "$15.00",
          customer: "Bob Johnson",
          status: "Failed",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const columns = [
    {
      title: "Order",
      dataIndex: "order",
      key: "order",
      render: (text, record) => <Link to={`/order/${record.key}`}>{text}</Link>,
      sorter: (a, b) => a.order.localeCompare(b.order),
    },
    {
      title: "Products",
      dataIndex: "products",
      key: "products",
      render: (products) => (
        <div className="flex space-x-2">
          {products.map((product, index) => (
            <img
              key={index}
              src={product}
              alt="Product"
              className="w-8 h-8 object-cover rounded-md"
            />
          ))}
        </div>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) =>
        parseFloat(a.amount.substring(1)) - parseFloat(b.amount.substring(1)),
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filteredData = (status) =>
    data.filter((order) => order.status === status);

  const totalOrders = data.length;
  const paginatedData = (status) =>
    filteredData(status).slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );

  return (
    <div >
      <Header title="" />

      <div className="flex ">
        <SidebarDelivery />

        <div className="w-full">
          <Tabs
            defaultActiveKey="1"
            className="bg-white p-4 rounded-lg shadow-md"
          >
            <TabPane tab="Delivered Orders" key="1">
              <Spin spinning={loading}>
                <Table
                  columns={columns}
                  dataSource={paginatedData("Delivered")}
                  pagination={false}
                  className="rounded-lg shadow-2xl"
                />
              </Spin>
            </TabPane>
            <TabPane tab="Failed Orders" key="2">
              <Spin spinning={loading}>
                <Table
                  columns={columns}
                  dataSource={paginatedData("Failed")}
                  pagination={false}
                  className="rounded-lg shadow-2xl"
                />
              </Spin>
            </TabPane>
          </Tabs>

          <div className="flex justify-between items-center mt-4">
            <span className="text-gray-600">Total Orders: {totalOrders}</span>
            <Pagination
              defaultCurrent={currentPage}
              total={totalOrders}
              pageSize={pageSize}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryList;
