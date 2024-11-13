import React, { useState } from "react";
import { Layout, Menu, Modal } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { Package, List, LogOut, User, Lock } from "lucide-react";
import Password from "antd/es/input/Password";

const { Sider } = Layout;

function SidebarDelivery() {
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutVisible, setLogoutVisible] = useState(false);

  const handleLogout = () => {
    sessionStorage.clear();
    setLogoutVisible(false);
    navigate("/login");
  };

  const menuItems = [
    {
      key: "/shipper/profile",
      icon: <User size={20} />,
      label: "Profile",
    },
    {
      key: "/shipper/delivery-detail",
      icon: <Package size={20} />,
      label: "Delivery Detail",
    },
    {
      key: "/shipper/all-delivery",
      icon: <List size={20} />,
      label: "All Deliveries",
    },
    {
      key: "/shipper/reset-password",
      icon: <Lock size={20} />,
      label: "Reset Password",
    },
    {
      key: "logout",
      icon: <LogOut size={20} />,
      label: "Logout",
      onClick: () => setLogoutVisible(true),
    },
  ];

  return (
    <Sider theme="light" className="min-h-screen shadow-md mr-[50px] ">
      <div className="p-4 text-xl font-bold">Delivery App</div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => {
          if (key !== "logout") navigate(key);
        }}
      />

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
}

export default SidebarDelivery;
