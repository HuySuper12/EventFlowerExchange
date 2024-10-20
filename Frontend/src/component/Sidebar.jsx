import React, { useState } from 'react';
import { Layout, Menu, Modal } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  TeamOutlined,
  GiftOutlined,
  CarOutlined,
  TransactionOutlined,
  TagOutlined,
  LogoutOutlined,
  EditOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = ({ darkMode }) => {
  const [collapsed, setCollapsed] = useState(false);  
  const [logoutVisible, setLogoutVisible] = useState(false);  
  const location = useLocation();

  const menuItems = [
    { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/posts', icon: <EditOutlined />, label: 'Posts' },
    { key: '/orders', icon: <ShoppingCartOutlined />, label: 'Orders' },
    { key: '/customers', icon: <UserOutlined />, label: 'Customers' },
    { key: '/staffs', icon: <TeamOutlined />, label: 'Staffs' },
    { key: '/couriers', icon: <CarOutlined />, label: 'Couriers' },
    { key: '/transactions', icon: <TransactionOutlined />, label: 'Transactions' },
    { key: '/vouchers', icon: <TagOutlined />, label: 'Vouchers' },
  ];

  const showLogoutConfirm = () => {
    setLogoutVisible(true);
  };

  const handleLogout = () => {
    setLogoutVisible(false);
  };

  return (
    <Sider
      theme={darkMode ? 'dark' : 'light'}
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      className="min-h-screen flex flex-col justify-between"
    >
      <div>
        <div className="logo p-4 text-center ">
          <Link to="/">
            <img
              src=""
              alt="Logo"
              className={`w-24 ${collapsed ? 'hidden' : 'block'}`}
            />
          </Link>
        </div>

        <Menu
          theme={darkMode ? 'dark' : 'light'}
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ marginTop: collapsed ? '20px' : '10px' }} 
        >
          {menuItems.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.key}>{item.label}</Link>
            </Menu.Item>
          ))}
          <Menu.Item key="/logout" icon={<LogoutOutlined />} onClick={showLogoutConfirm}>
            Logout
          </Menu.Item>
        </Menu>
      </div>

      <Modal
        title="Confirm Logout"
        visible={logoutVisible}
        onOk={handleLogout}
        onCancel={() => setLogoutVisible(false)}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to log out?</p>
      </Modal>
    </Sider>
  );
};

export default Sidebar;
