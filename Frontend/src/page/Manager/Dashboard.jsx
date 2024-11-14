import React, { useState, useEffect } from "react";
import { Row, Col, Card, List, Avatar, Typography, Table, Button } from "antd";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../../config/axios";
import Papa from "papaparse";

const DashboardManager = () => {
  const [orders, setOrders] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [monthlyCustomersData, setMonthlyCustomersData] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        const response = await api.get("Order/GetMonthlyOrderStatistics");
        setOrdersData(
          response.data.map((item) => ({ name: item.name, orders: item.total }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchRevenueData = async () => {
      try {
        const response = await api.get("Transaction/GetRevenueOrderStatistics");
        setRevenueData(
          response.data.map((item) => ({
            name: item.name,
            revenue: item.total,
          }))
        );
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };

    const fetchMonthlyCustomersData = async () => {
      try {
        const response = await api.get(
          "Account/GetMonthlyRegisterCustomerStatistics"
        );
        setMonthlyCustomersData(
          response.data.map((item) => ({
            name: item.name,
            customers: item.customer,
          }))
        );
      } catch (error) {
        console.error("Error fetching monthly customers data:", error);
      }
    };

    const fetchRecentOrders = async () => {
      try {
        const response = await api.get("Order/ViewAllOrder");
        const recentOrders = response.data
          .reverse()
          .slice(0, 5)
          .map((order) => ({
            key: order.orderId,
            orderId: order.orderId,
            customerName: order.buyerId,
            amount: `${order.totalPrice}`,
            status: order.status,
          }));
        setOrders(recentOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    const fetchRecentProducts = async () => {
      try {
        const response = await api.get("Product/GetProductList/Enable");
        const products = response.data
          .reverse()
          .slice(0, 5)
          .map((product) => ({
            name: product.productName,
            price: product.price,
            sales: product.quantity,
            image: product.productImage[0],
          }));
        setRecentProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchOrdersData();
    fetchRevenueData();
    fetchMonthlyCustomersData();
    fetchRecentOrders();
    fetchRecentProducts();
  }, []);

  const exportToCSV = (data, filename) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      render: (text) => <Typography.Text strong>{text}</Typography.Text>,
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        let colorClass, borderClass;
        if (!text) {
          colorClass = "text-gray-500";
          borderClass = "border-gray-500";
        } else {
          switch (text.toLowerCase()) {
            case "success":
              colorClass = "text-green-500";
              borderClass = "border-green-500";
              break;
            case "fail":
              colorClass = "text-red-500";
              borderClass = "border-red-500";
              break;
            case "delivering":
              colorClass = "text-blue-500";
              borderClass = "border-blue-500";
              break;
            case "take over":
              colorClass = "text-purple-500";
              borderClass = "border-purple-500";
              break;
            default:
              colorClass = "text-black";
              borderClass = "border-black";
          }
        }
        return (
          <div
            className={`border ${borderClass} p-2 rounded-md flex justify-center items-center w-[100px]`}
          >
            <Typography.Text className={colorClass}>
              {text || "Unknown"}
            </Typography.Text>
          </div>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text, record) => (
        <div className="flex items-center justify-between">
          <Typography.Text>{record.amount}</Typography.Text>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      <Row gutter={16}>
        <Col span={8}>
          <Card title="Monthly Revenue">
            <Button
              className="ml-[300px] mb-[20px]"
              onClick={() => exportToCSV(revenueData, "Monthly_Revenue")}
            >
              Export to CSV
            </Button>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Monthly Orders">
            <Button
              className="ml-[300px] mb-[20px]"
              onClick={() => exportToCSV(ordersData, "Monthly_Orders")}
            >
              Export to CSV
            </Button>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ordersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="orders" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="New Monthly Customers">
            <Button
              className="ml-[300px] mb-[20px]"
              onClick={() =>
                exportToCSV(monthlyCustomersData, "Monthly_Customers")
              }
            >
              Export to CSV
            </Button>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyCustomersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="customers" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} className="mt-4">
        <Col span={16}>
          <Card title="Recent Orders">
            <Table
              dataSource={orders}
              columns={columns}
              pagination={false}
              bordered={false}
              showHeader={false}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="h-full" title="Recent Products">
            <List
              itemLayout="horizontal"
              dataSource={recentProducts}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar shape="square" size={80} src={item.image} />
                    }
                    title={item.name}
                    description={`Price: $${item.price} | Sales: ${item.sales}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardManager;
