import React, { useState } from "react";
import { Layout, Menu, Modal } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  TeamOutlined,
  TransactionOutlined,
  TagOutlined,
  TruckOutlined,
  LogoutOutlined,
  DollarOutlined,
  ExceptionOutlined,
  EditOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const Sidebar = ({ darkMode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "posts", icon: <EditOutlined />, label: "Posts" },
    {
      key: "request-pending",
      icon: <EditOutlined />,
      label: "Request Pending",
    },
    { key: "orders", icon: <ShoppingCartOutlined />, label: "Orders" },
    { key: "customers", icon: <UserOutlined />, label: "Customers" },
    { key: "staffs", icon: <TeamOutlined />, label: "Staffs" },
    { key: "shippers", icon: <TruckOutlined />, label: "Shippers" },
    {
      key: "transactions",
      icon: <TransactionOutlined />,
      label: "Transactions",
    },
    { key: "payments", icon: <DollarOutlined />, label: "Payments" },
    { key: "requests", icon: <ExceptionOutlined />, label: "Request" },
    { key: "vouchers", icon: <TagOutlined />, label: "Vouchers" },
  ];

  const showLogoutConfirm = () => {
    setLogoutVisible(true);
  };

  const handleLogout = () => {
    // Clear session storage
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("email");

    // Navigate to home page
    navigate("/");

    // Close the logout modal
    setLogoutVisible(false);
  };

  return (
    <Sider
      theme={darkMode ? "dark" : "light"}
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      className="min-h-screen flex flex-col justify-between"
    >
      <div>
        <div className="logo p-4 text-center ">
          <Link to="dashboard">
            <img
              src=""
              alt="Logo"
              className={`w-24 ${collapsed ? "hidden" : "block"}`}
            />
          </Link>
        </div>

        <Menu
          theme={darkMode ? "dark" : "light"}
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ marginTop: collapsed ? "20px" : "10px" }}
        >
          {menuItems.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.key}>{item.label}</Link>
            </Menu.Item>
          ))}
          <Menu.Item
            key="/logout"
            icon={<LogoutOutlined />}
            onClick={showLogoutConfirm}
          >
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
