import React, { useEffect, useState } from "react";
import { Layout, Avatar, Button } from "antd";
import api from "../config/axios";

const { Header: AntHeader } = Layout;

const Header = () => {
  const [adminInfo, setAdminInfo] = useState({});
  const [isSalaryPaid, setIsSalaryPaid] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const role = sessionStorage.getItem("role");

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

    const checkSalaryStatus = async () => {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1; // Months are 0-indexed
      const currentDate = new Date().getDate();

      try {
        const response = await api.get("VNPAY/CheckSalary", {
          params: { year: currentYear, month: currentMonth },
        });
        setIsSalaryPaid(response.data === true);

        // Enable button on 30th of each month, or 28th/29th of February
        const isFebruary = currentMonth === 2;
        const isLeapYear =
          (currentYear % 4 === 0 && currentYear % 100 !== 0) ||
          currentYear % 400 === 0;
        const isEndOfFebruary =
          isFebruary &&
          (currentDate === 28 || (isLeapYear && currentDate === 29));
        const isEndOfMonth = currentDate === 30;

        setIsButtonEnabled(
          (isEndOfMonth || isEndOfFebruary) && response.data !== "true"
        );
      } catch (error) {
        console.error("Error checking salary status:", error);
      }
    };

    fetchAdminInfo();
    checkSalaryStatus();
  }, []);

  const formatCurrency = (amount) => {
    const validAmount = amount != null ? amount : 0;
    return (
      validAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ"
    );
  };

  const handlePaySalary = async () => {
    try {
      const response = await api.get("VNPAY/PaymentSalaryForStaffAndShipper");
      if (response.data === true) {
        console.log("Payment successful");
        // Thêm logic xử lý sau khi thanh toán thành công nếu cần
      }
    } catch (error) {
      console.error("Error during payment:", error);
    }
  };

  return (
    <AntHeader className="bg-white dark:bg-gray-900 flex items-center justify-between px-6">
      <div className="flex items-center"></div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center cursor-pointer">
          {role === "Manager" && (
            <Button
              type="primary"
              onClick={handlePaySalary}
              disabled={!isButtonEnabled}
              className="mr-5"
            >
              Pay Salary for Staff and Shipper
            </Button>
          )}

          {role === "Manager" && (
            <span className="text-sm font-medium mr-5">
              Balance: {formatCurrency(adminInfo?.balance)}
            </span>
          )}

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
