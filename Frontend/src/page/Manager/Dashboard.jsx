import React, { useState } from 'react';
import { Row, Col, Card, List, Avatar, Badge, Typography, Button } from 'antd';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [timePeriod, setTimePeriod] = useState('weekly'); // State to manage the selected time period

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
    { name: 'Red Rose Bouquet', price: 120, sales: 120, image: 'https://tapchivietnamhuongsac.vn/Upload/quoc-hoa-cac-nuoc-tg/mexico_hoathuocduoc.jpg' },
    { name: 'Sunflower Arrangement', price: 95, sales: 95, image: 'https://ganhhanghoa.vn/wp-content/uploads/2021/11/48-300x300.png' },
    { name: 'Orchid Plant', price: 80, sales: 80, image: 'https://ganhhanghoa.vn/wp-content/uploads/2021/11/8-300x300.png' },
    { name: 'Tulip Mix', price: 75, sales: 75, image: 'https://noithatmeta.com/wp-content/uploads/2022/02/Hoa-Anh-Dao.jpg' },
  ];

  const handleTimePeriodChange = (period) => {
    setTimePeriod(period);
  };

  // Choose the correct data set based on the selected time period
  const revenueData = timePeriod === 'weekly' ? weeklyRevenueData : monthlyRevenueData;
  const ordersData = timePeriod === 'weekly' ? weeklyOrdersData : monthlyOrdersData;
  const customersData = timePeriod === 'weekly' ? weeklyCustomersData : monthlyCustomersData;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="flex justify-end mb-4">
        <Button.Group>
          <Button onClick={() => handleTimePeriodChange('weekly')} className={timePeriod === 'weekly' ? 'bg-blue-500 text-white' : ''}>
            Weekly
          </Button>
          <Button onClick={() => handleTimePeriodChange('monthly')} className={timePeriod === 'monthly' ? 'bg-blue-500 text-white' : ''}>
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

      <Card className="mt-4">
        <h2 className="text-xl font-semibold mb-4">Trending Products</h2>
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
                title={<Typography.Text strong>{item.name}</Typography.Text>}
                description={<Typography.Text>${item.price} - {item.sales} sales</Typography.Text>}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
