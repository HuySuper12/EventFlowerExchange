import React from "react";
import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { Package, List, LogOut } from "lucide-react";

const { Sider } = Layout;

function SidebarDelivery() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    sessionStorage.clear();
  };

  const menuItems = [
    {
      key: "/delivery-detail",
      icon: <Package size={20} />,
      label: "Delivery Detail",
    },
    {
      key: "/all-delivery",
      icon: <List size={20} />,
      label: "All Deliveries",
    },
    {
      key: "/login",
      icon: <LogOut size={20} />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <Sider theme="light" className="min-h-screen shadow-md mr-[50px] ">
      <div className="p-4 text-xl font-bold">Delivery App</div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  );
}

export default SidebarDelivery;
