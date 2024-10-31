// Transaction.jsx
import React, { useEffect, useState } from "react";
import SidebarCustomer from "../../../component/slidebar-customer";
import Header from "../../../component/header";
import Footer from "../../../component/footer";
import { Table } from "antd";
import api from "../../../config/axios";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const email = sessionStorage.getItem("email");

  const fetchNotifications = async () => {
    if (email) {
      try {
        const encodedEmail = encodeURIComponent(email);
        const response = await api.get(
          `Notification/ViewNotificationByUserEmail/${encodedEmail}`
        );
        setNotifications(response.data.reverse());
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [email]);

  const columns = [
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => {
        return new Date(createdAt).toLocaleString();
      },
    },
  ];
  return (
    <>
      <Header />
      <div className="ml-[230px] mt-[20px] text-[30px]">Your Account</div>

      <div className="flex flex-col md:flex-row h-screen p-6 ml-[200px] mr-[200px]">
        <SidebarCustomer />
        <div className="w-full ml-[30px] bg-white shadow-2xl rounded-xl p-4">
          <div className="mb-6 p-4 border border-gray-300 rounded-lg">
            <h4 className="text-lg font-bold mb-[20px]">Notifications</h4>
            <Table
              dataSource={notifications}
              columns={columns}
              pagination={{ pageSize: 9 }}
            />
            ;
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Notification;
