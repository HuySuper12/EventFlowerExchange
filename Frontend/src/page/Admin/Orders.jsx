import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Modal, Button, message, Pagination, List, Input } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import api from "../../config/axios"; 

const Orders = () => {
  const [orders, setOrders] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [shippers, setShippers] = useState([]); 
  const [address, setAddress] = useState(''); // State for address input
  const [assignedShippers, setAssignedShippers] = useState([]); // Track assigned shippers
  const pageSize = 12;
  const totalOrders = orders.length;
  
  // Modal state for checking
  const [isCheckModalVisible, setIsCheckModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('Order/ViewAllOrder');
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders: ", error);
        message.error("Failed to load orders.");
      }
    };

    fetchOrders();
  }, []);

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Delivery Address',
      dataIndex: 'deliveredAt',
      key: 'deliveredAt',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => `$${(price / 1000).toFixed(2)}k`, 
      sorter: (a, b) => a.totalPrice - b.totalPrice,
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
        <Tag color={
          status === 'Pending' ? 'gold' 
          : status === 'Take Over' ? 'blue' 
          : status === 'Delivery' ? 'purple' 
          : status === 'Success' ? 'green' 
          : 'red'
        }>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => showOrderDetails(record)}>View Details</Button>
          {record.status === 'Pending' && (
            <Button onClick={() => handleCheck(record)}>Check</Button>
          )}
        </Space>
      ),
    },
  ];

  const showOrderDetails = (order) => {
    Modal.info({
      title: `Order Details - ${order.orderId}`,
      content: (
        <div>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Delivery Address:</strong> {order.deliveredAt}</p>
          <p><strong>Total Price:</strong> ${order.totalPrice}</p>
          <p><strong>Phone Number:</strong> {order.phoneNumber}</p>
          <p><strong>Created At:</strong> {order.createdAt}</p>
        </div>
      ),
      onOk() {},
    });
  };

  const handleCheck = (order) => {
    setSelectedOrder(order); 
    setIsCheckModalVisible(true); 
    setAddress(order.deliveredAt); // Set the address from the order
    fetchShippers(order.deliveredAt); // Fetch shippers based on the address
  };

  const fetchShippers = async (address) => {
    try {
      const response = await api.get(`Account/SearchShipper/${encodeURIComponent(address)}`);
      setShippers(response.data);
    } catch (error) {
      message.error('Failed to fetch shippers for the given address.');
      console.error('API error:', error);
    }
  };

  const handleSelectShipper = async (shipper) => {
    if (!selectedOrder) return;

    const deliveryLog = {
      orderId: selectedOrder.orderId,
      deliveryPersonEmail: shipper.email, 
    };

    try {
      const response = await api.post('DeliveryLog/CreateDeliveryLog', deliveryLog);
      if (response.data === true) {
        message.success(`Delivery log created for order ${selectedOrder.orderId}`);
        setOrders(orders.map(order =>
          order.orderId === selectedOrder.orderId ? { ...order, status: 'Take Over' } : order
        ));
        setAssignedShippers([...assignedShippers, shipper.email]); // Add shipper to assigned list
        setIsCheckModalVisible(false); 
      } else {
        message.error('Failed to create delivery log.');
      }
    } catch (error) {
      message.error('Error creating delivery log.');
      console.error('API error:', error);
    }
  };

  const renderCheckModal = () => {
    if (!selectedOrder) return null;

    return (
      <Modal
        title={`Assign Shipper for Order - ${selectedOrder.orderId}`}
        visible={isCheckModalVisible}
        onCancel={() => setIsCheckModalVisible(false)}
        footer={null}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <p>Select a shipper from the list below:</p>
          <Input 
            placeholder="Enter address to search for shippers"
            value={address}
            onChange={(e) => setAddress(e.target.value)} 
          />
          <List
            dataSource={shippers}
            renderItem={shipper => (
              <List.Item>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <div>
                    <p><strong>{shipper.name}</strong></p>
                    <p>Phone: {shipper.phoneNumber}</p>
                  </div>
                  <Button 
                    type="primary" 
                    onClick={() => handleSelectShipper(shipper)} 
                    disabled={assignedShippers.includes(shipper.email)} // Disable if already assigned
                  >
                    {assignedShippers.includes(shipper.email) ? 'Assigned' : 'Select Shipper'}
                  </Button>
                </div>
              </List.Item>
            )}
          />
        </div>
      </Modal>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="text-3xl font-bold mb-4">Orders</h1>
        <Button type="primary" icon={<ExportOutlined />}>
          Export
        </Button>
      </div>
      <Table 
        columns={columns} 
        dataSource={orders.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        rowKey="orderId" 
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

      {/* Render the check modal */}
      {renderCheckModal()}
    </div>
  );
};

export default Orders; 