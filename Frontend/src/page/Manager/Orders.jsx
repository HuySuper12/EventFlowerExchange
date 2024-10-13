import React, { useState } from 'react';
import { Table, Tag, Space, Modal, Button, message, Pagination } from 'antd';
import { ExclamationCircleOutlined, ExportOutlined } from '@ant-design/icons';
const { confirm } = Modal;

const Orders = () => {
  const [orders, setOrders] = useState([
    {
      id: '#1001',
      status: 'Pending',
      products: [
        { name: 'Red Rose Bouquet', quantity: 2, price: 50, image: 'https://stc.subi.vn/image/1/210505/bo-hoa-tien-to-2k.jpg' },
        { name: 'Sunflower Arrangement', quantity: 1, price: 100, image: 'https://stc.subi.vn/image/1/230210/1-bo-hoa-tien-to-2k-mix-hoa-hong-sap-thom-2.jpg' }
      ],
      amount: 150,
      customer: 'John Doe',
      createdAt: '2024-03-15 14:30',
      address: '123 Flower St, Bloom City',
      courier: 'Courier A',
    },
    {
      id: '#1002',
      status: 'Ready',
      products: [
        { name: 'Tulip Bouquet', quantity: 3, price: 60, image: '/path/to/image3.jpg' },
      ],
      amount: 180,
      customer: 'Jane Smith',
      createdAt: '2024-03-14 10:00',
      address: '456 Blossom Ave, Garden Town',
      courier: 'Courier B',
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // Number of items per page
  const totalOrders = orders.length;

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      filters: [
        { text: 'Pending', value: 'Pending' },
        { text: 'Ready', value: 'Ready' },
        { text: 'Delivered', value: 'Delivered' },
      ],
      onFilter: (value, record) => record.status.includes(value),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Pending' ? 'gold' : status === 'Ready' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Courier',
      dataIndex: 'courier',
      key: 'courier',
    },
    {
      title: 'Products',
      dataIndex: 'products',
      key: 'products',
      render: (products) => (
        <ul style={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
          {products.map((product, index) => (
            <li key={index} style={{ listStyle: 'none', display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <img 
                src={product.image} 
                alt={product.name} 
                style={{ 
                  width: 50, 
                  height: 50, 
                  borderRadius: '10%', 
                  marginRight: 10 
                }} 
              />
              <span style={{ opacity: 0.7 }}>{product.name} (x{product.quantity})</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'products',
      key: 'quantity',
      render: (products) => (
        products.reduce((acc, product) => acc + product.quantity, 0)
      ),
      sorter: (a, b) => 
        a.products.reduce((acc, product) => acc + product.quantity, 0) - 
        b.products.reduce((acc, product) => acc + product.quantity, 0),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `$${amount.toFixed(2)}`,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => showOrderDetails(record)}>View Details</Button>
          {record.status === 'Pending' && (
            <>
              <Button type="primary" onClick={() => handleStatusChange(record.id, 'Ready')}>Accept</Button>
              <Button danger onClick={() => handleStatusChange(record.id, 'Cancel')}>Reject</Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const showOrderDetails = (order) => {
    const productDetails = order.products.map(product => (
      <div key={product.name} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        <img 
          src={product.image} 
          alt={product.name} 
          style={{ width: 50, borderRadius: '10%', marginRight: 10 }} 
        />
        <span style={{ fontSize: '16px' }}>{product.name} (Qty: {product.quantity}) - Price: ${product.price.toFixed(2)}</span>
      </div>
    ));
  
    Modal.info({
      title: `Order Details - ${order.id}`,
      content: (
        <div style={{ padding: '20px' }}>
          <p style={{ fontSize: '18px', fontWeight: 'bold' }}><strong>Customer:</strong> {order.customer}</p>
          <p style={{ fontSize: '16px' }}><strong>Status:</strong> {order.status}</p>
          <p style={{ fontSize: '16px' }}><strong>Created At:</strong> {order.createdAt}</p>
          <p style={{ fontSize: '16px' }}><strong>Delivery Address:</strong> {order.address}</p>
          <p style={{ fontSize: '16px' }}><strong>Products:</strong></p>
          {productDetails}
          <div style={{ marginTop: '20px', textAlign: 'right', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
            <p style={{ fontSize: '20px', fontWeight: 'bold' }}><strong>Amount:</strong> ${order.amount.toFixed(2)}</p>
          </div>
        </div>
      ),
      onOk() {},
    });
  };

  const handleStatusChange = (orderId, newStatus) => {
    confirm({
      title: `Are you sure you want to ${newStatus === 'Ready' ? 'accept' : 'reject'} this order?`,
      icon: <ExclamationCircleOutlined />,
      content: `This will change the order status to ${newStatus}.`,
      onOk() {
        setOrders(orders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        message.success(`Order ${orderId} has been ${newStatus === 'Ready' ? 'accepted' : 'rejected'}.`);
      },
      onCancel() {},
    });
  };

  const handleExport = () => {
    const csvData = orders.map(order => ({
      OrderID: order.id,
      Status: order.status,
      Customer: order.customer,
      Amount: order.amount.toFixed(2),
      CreatedAt: order.createdAt,
      Address: order.address,
      Products: order.products.map(product => `${product.name} (x${product.quantity})`).join(', '),
    }));

    const csvHeaders = Object.keys(csvData[0]).join(',') + '\n';
    const csvRows = csvData.map(row => Object.values(row).join(',')).join('\n');
    const csvContent = csvHeaders + csvRows;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'orders.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('Orders exported successfully!');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="text-2xl font-bold mb-4">Orders</h1>
        <Button type="primary" icon={<ExportOutlined />} onClick={handleExport}>
          Export
        </Button>
      </div>
      <Table 
        columns={columns} 
        dataSource={orders.slice((currentPage - 1) * pageSize, currentPage * pageSize)} // Apply pagination
        rowKey="id" 
        pagination={false}
      />
      <div style={{ marginTop: '16px', marginLeft: '10px', opacity: 0.5, display: 'flex', justifyContent: 'space-between' }}>
        <span>{totalOrders} orders in total</span>
        <Pagination 
          current={currentPage} 
          pageSize={pageSize} 
          total={totalOrders} 
          onChange={page => setCurrentPage(page)} 
          showSizeChanger={false} 
        />
      </div>
    </div>
  );
};

export default Orders;
