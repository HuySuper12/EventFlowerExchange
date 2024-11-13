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

  return (
    <AntHeader className="bg-white dark:bg-gray-900 flex items-center justify-between px-6">
      <div className="flex items-center"></div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center cursor-pointer">
          <Avatar src={adminInfo.picture} />
          <span className="ml-2 text-sm font-medium">{adminInfo.name}</span>
        </div>
      </div>
    </AntHeader>
  );
};

export default Header;
