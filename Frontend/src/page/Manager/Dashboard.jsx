import React, { useState } from 'react';
import { Row, Col, Card, List, Avatar, Badge, Typography, Button, Table, Dropdown, Menu } from 'antd';
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
} from 'recharts';
import {
  MoreOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { message } from 'antd';

const Dashboard = () => {
  const [timePeriod, setTimePeriod] = useState('weekly');

  // Weekly data
  const weeklyRevenueData = [
    { name: 'Mon', revenue: 300 },
    { name: 'Tue', revenue: 450 },
    { name: 'Wed', revenue: 400 },
    { name: 'Thu', revenue: 550 },
    { name: 'Fri', revenue: 500 },
    { name: 'Sat', revenue: 600 },
    { name: 'Sun', revenue: 450 },
  ];

  const weeklyOrdersData = [
    { name: 'Mon', orders: 30 },
    { name: 'Tue', orders: 40 },
    { name: 'Wed', orders: 35 },
    { name: 'Thu', orders: 50 },
    { name: 'Fri', orders: 45 },
    { name: 'Sat', orders: 60 },
    { name: 'Sun', orders: 40 },
  ];

  const weeklyCustomersData = [
    { name: 'Mon', customers: 15 },
    { name: 'Tue', customers: 25 },
    { name: 'Wed', customers: 20 },
    { name: 'Thu', customers: 30 },
    { name: 'Fri', customers: 35 },
    { name: 'Sat', customers: 40 },
    { name: 'Sun', customers: 25 },
  ];

  // Monthly data
  const monthlyRevenueData = [
    { name: 'Week 1', revenue: 2000 },
    { name: 'Week 2', revenue: 2500 },
    { name: 'Week 3', revenue: 3000 },
    { name: 'Week 4', revenue: 3500 },
  ];

  const monthlyOrdersData = [
    { name: 'Week 1', orders: 150 },
    { name: 'Week 2', orders: 200 },
    { name: 'Week 3', orders: 250 },
    { name: 'Week 4', orders: 300 },
  ];

  const monthlyCustomersData = [
    { name: 'Week 1', customers: 40 },
    { name: 'Week 2', customers: 60 },
    { name: 'Week 3', customers: 80 },
    { name: 'Week 4', customers: 100 },
  ];

  const trendingProducts = [
    {
      name: 'Red Rose Bouquet',
      price: 120,
      sales: 120,
      image: 'https://tapchivietnamhuongsac.vn/Upload/quoc-hoa-cac-nuoc-tg/mexico_hoathuocduoc.jpg',
    },
    {
      name: 'Sunflower Arrangement',
      price: 95,
      sales: 95,
      image: 'https://ganhhanghoa.vn/wp-content/uploads/2021/11/48-300x300.png',
    },
    {
      name: 'Orchid Plant',
      price: 80,
      sales: 80,
      image: 'https://ganhhanghoa.vn/wp-content/uploads/2021/11/8-300x300.png',
    },
    {
      name: 'Tulip Mix',
      price: 75,
      sales: 75,
      image: 'https://noithatmeta.com/wp-content/uploads/2022/02/Hoa-Anh-Dao.jpg',
    },
  ];

  const [orders, setOrders] = useState([
    { key: 1, orderId: '1001', customerName: 'Alice', productName: 'Red Rose Bouquet', quantity: 2, amount: '$30.59' },
    { key: 2, orderId: '1002', customerName: 'Bob', productName: 'Sunflower Arrangement', quantity: 3, amount: '$25.79' },
    { key: 3, orderId: '1003', customerName: 'Charlie', productName: 'Orchid Plant', quantity: 1, amount: '$40.00' },
  ]);

  const handleTimePeriodChange = (period) => {
    setTimePeriod(period);
  };

  const handleAccept = (orderId) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.orderId !== orderId));
    message.success(`Order ${orderId} accepted!`);
  };

  const handleReject = (orderId) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.orderId !== orderId));
    message.error(`Order ${orderId} rejected!`);
  };

  const revenueData = timePeriod === 'weekly' ? weeklyRevenueData : monthlyRevenueData;
  const ordersData = timePeriod === 'weekly' ? weeklyOrdersData : monthlyOrdersData;
  const customersData = timePeriod === 'weekly' ? weeklyCustomersData : monthlyCustomersData;

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (text) => <Typography.Text strong>{text}</Typography.Text>
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      render: (text, record) => (
        <span>
          {text} <Typography.Text type="secondary"> x{record.quantity}</Typography.Text>
        </span>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text, record) => (
        <div className="flex items-center justify-between">
          <Typography.Text>{record.amount}</Typography.Text>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  key="accept"
                  icon={<CheckCircleOutlined style={{ color: 'green', fontSize: '17px' }} />}
                  style={{ fontSize: '15px' }}
                  onClick={() => handleAccept(record.orderId)}
                >
                  Accept
                </Menu.Item>
                <Menu.Item
                  key="reject"
                  icon={<CloseCircleOutlined style={{ color: 'red', fontSize: '17px' }} />}
                  style={{ fontSize: '15px' }}
                  onClick={() => handleReject(record.orderId)}
                >
                  Reject
                </Menu.Item>
              </Menu>
            }
          >
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      <div className="flex justify-end mb-4">
        <Button.Group>
          <Button
            onClick={() => handleTimePeriodChange('weekly')}
            className={timePeriod === 'weekly' ? 'bg-blue-300 text-white' : ''}
          >
            Weekly
          </Button>
          <Button
            onClick={() => handleTimePeriodChange('monthly')}
            className={timePeriod === 'monthly' ? 'bg-blue-300 text-white' : ''}
          >
            Monthly
          </Button>
        </Button.Group>
      </div>

      <Row gutter={16}>
        <Col span={8}>
          <Card title={timePeriod === 'weekly' ? "Weekly Revenue" : "Monthly Revenue"}>
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
          <Card title={timePeriod === 'weekly' ? "Weekly Orders" : "Monthly Orders"}>
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
          <Card title={timePeriod === 'weekly' ? "New Weekly Customers" : "New Monthly Customers"}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={customersData}>
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
            <Table dataSource={orders} columns={columns} pagination={false} bordered={false} showHeader={false} />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="h-full" title="Trending Products">
            <List
              itemLayout="horizontal"
              dataSource={trendingProducts}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Badge count={index + 1} offset={[-10, 10]}>
                        <Avatar shape="square" size={80} src={item.image} />
                      </Badge>
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

export default Dashboard;
