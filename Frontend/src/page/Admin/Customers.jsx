import React, { useState } from 'react';
import { Table, Tag, Avatar, Switch, message, Tabs, Pagination, Button } from 'antd';
import { UserOutlined, ExportOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

const Customers = () => {
  const [customers, setCustomers] = useState([
    {
      id: '1',
      avatar: 'https://media.gq.com.mx/photos/5eb5954e51cd5e1b340e8b67/16:9/w_2560%2Cc_limit/dia-de-goku.png',
      name: 'Toi',
      phone: '123-456-7890',
      createdAt: '2024-03-15',
      status: 'Active',
    },
    {
      id: '2',
      avatar: 'https://media.gq.com.mx/photos/5eb5954e51cd5e1b340e8b67/16:9/w_2560%2Cc_limit/dia-de-goku.png',
      name: 'Alice',
      phone: '987-654-3210',
      createdAt: '2024-03-16',
      status: 'Locked',
    },
    // Add more dummy data as needed for testing
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // Number of items per page

  const availableCustomers = customers.filter(customer => customer.status === 'Active');
  const unavailableCustomers = customers.filter(customer => customer.status === 'Locked');

  const toggleStatus = (id, checked) => {
    setCustomers(customers.map(customer => 
      customer.id === id
        ? { ...customer, status: checked ? 'Active' : 'Locked' }
        : customer
    ));
    message.success(`Customer ${id} has been ${checked ? 'unlocked' : 'locked'}.`);
  };

  const totalCustomers = availableCustomers.length + unavailableCustomers.length;

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar) => <Avatar src={avatar} icon={<UserOutlined />} />,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      filters: [
        ...new Set(customers.map(customer => ({ text: customer.name, value: customer.name }))),
      ],
      onFilter: (value, record) => record.name.includes(value),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      filters: [
        ...new Set(customers.map(customer => ({ text: customer.phone, value: customer.phone }))),
      ],
      onFilter: (value, record) => record.phone.includes(value),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Active' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: 'Active' },
        { text: 'Locked', value: 'Locked' },
      ],
      onFilter: (value, record) => record.status.includes(value),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Switch
          checked={record.status === 'Active'}
          onChange={(checked) => toggleStatus(record.id, checked)}
          checkedChildren="Unlock"
          unCheckedChildren="Lock"
        />
      ),
    },
  ];

  const handleExport = () => {
    const csvData = customers.map(customer => ({
      ID: customer.id,
      Name: customer.name,
      Phone: customer.phone,
      CreatedAt: customer.createdAt,
      Status: customer.status,
    }));

    const csvHeaders = Object.keys(csvData[0]).join(',') + '\n';
    const csvRows = csvData.map(row => Object.values(row).join(',')).join('\n');
    const csvContent = csvHeaders + csvRows;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'customers.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('Customers exported successfully!');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="text-2xl font-bold mb-4">Customers</h1>
          <Button type="primary" icon={<ExportOutlined />} onClick={handleExport}>
            Export
          </Button>
      </div>
      <Tabs defaultActiveKey="1">
        <TabPane tab={`Available (${availableCustomers.length})`} key="1">
          <Table 
            columns={columns}
            dataSource={availableCustomers.slice((currentPage - 1) * pageSize, currentPage * pageSize)} 
            rowKey="id" 
            pagination={false} 
          />
        </TabPane>
        <TabPane tab={`Unavailable (${unavailableCustomers.length})`} key="2">
          <Table 
            columns={columns}
            dataSource={unavailableCustomers.slice((currentPage - 1) * pageSize, currentPage * pageSize)} 
            rowKey="id" 
            pagination={false} 
          />
        </TabPane>
      </Tabs>
      
      <div style={{ marginTop: '16px', marginLeft: '10px', opacity: 0.5, display: 'flex', justifyContent: 'space-between' }}>
        <span>{totalCustomers} customers in total</span>
        <Pagination 
          current={currentPage} 
          pageSize={pageSize} 
          total={totalCustomers} 
          onChange={page => setCurrentPage(page)} 
          showSizeChanger={false} 
        />
      </div>
    </div>
  );
};

export default Customers;
