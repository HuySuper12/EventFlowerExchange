import React, { useEffect, useState } from "react";
import { Layout, Avatar } from "antd";
import api from "../config/axios";

const { Header: AntHeader } = Layout;

const Header = () => {
  const [adminInfo, setAdminInfo] = useState({});

  useEffect(() => {
    const fetchAdminInfo = async () => {
      const email = sessionStorage.getItem("email");
      const encodedEmail = encodeURIComponent(email);
      try {
        const response = await api.get(
          `Account/GetAccountByEmail/${encodedEmail}`
        );
        setAdminInfo(response.data);
      } catch (error) {
        console.error("Error fetching admin profile:", error);
      }
    };

    fetchAdminInfo();
  }, []);

  const formatCurrency = (amount) => {
    const validAmount = amount != null ? amount : 0;
    return (
      validAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ"
    );
  };

  return (
    <AntHeader className="bg-white dark:bg-gray-900 flex items-center justify-between px-6">
      <div className="flex items-center"></div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center cursor-pointer">
          <span className="text-sm font-medium mr-5">
            Balance: {formatCurrency(adminInfo?.balance)}
          </span>
          <Avatar
            src={
              adminInfo?.picture ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
          />
          <span className="ml-2 text-sm font-medium">{adminInfo.name}</span>
        </div>
      </div>
    </AntHeader>
  );
};

export default Header;
