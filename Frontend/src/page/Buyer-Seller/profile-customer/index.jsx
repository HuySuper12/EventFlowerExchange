import React, { useEffect, useState } from "react";
import SidebarCustomer from "../../../component/slidebar-customer";
import Header from "../../../component/header";
import Footer from "../../../component/footer";
import api from "../../../config/axios";

const ProfileCustomer = () => {
  const [accountData, setAccountData] = useState(null);
  const email = sessionStorage.getItem("email");
  console.log("Email:", email);

  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0"); // Lấy ngày và thêm số 0 nếu cần
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Lấy tháng (tháng bắt đầu từ 0)
    const year = date.getFullYear(); // Lấy năm
    return `${day}/${month}/${year}`; // Định dạng ngày/tháng/năm
  };

  useEffect(() => {
    const fetchAccountData = async () => {
      if (email) {
        try {
          const encodedEmail = encodeURIComponent(email);
          const response = await api.get(
            `Account/GetAccountByEmail/${encodedEmail}`
          );
          setAccountData(response.data);
          console.log(response.data);
        } catch (error) {
          console.error("Error fetching account data:", error);
        }
      } else {
        console.error("Email is not set in sessionStorage.");
      }
    };

    fetchAccountData();
  }, [email]); // Chạy lại khi email thay đổi

  return (
    <>
      <Header />
      <div className="ml-[230px] mt-[20px] text-[30px]">Your Account</div>

      <div className="flex flex-col md:flex-row h-screen p-6 ml-[200px] mr-[200px]">
        <SidebarCustomer />

        <div className="w-full ml-[30px] bg-white shadow-2xl rounded-xl p-4">
          <h2 className="text-2xl font-bold mb-6">My Profile</h2>
          {/* Profile Card */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <img
                src="https://bootdey.com/img/Content/avatar/avatar7.png"
                alt="Profile"
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="text-xl font-bold">
                  {accountData ? accountData.name : "Loading..."}
                </h3>
                <button className="text-gray-800 border border-black rounded-lg px-3 py-1 hover:bg-gray-200 mt-[10px]">
                  Upload{" "}
                </button>
              </div>
            </div>
            <button className="text-blue-500 border border-blue-500 rounded-lg px-3 py-1 hover:bg-blue-100">
              Edit
            </button>
          </div>
          <div className="mb-6 p-4 border border-gray-300 rounded-lg">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-bold">Personal Information</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-gray-500">First Name</p>
                <p>{accountData ? accountData.name : "Loading..."}</p>
              </div>
              <div>
                <p className="text-gray-500">Address</p>
                <p>{accountData ? accountData.address : "Loading..."}</p>
              </div>
              <div>
                <p className="text-gray-500">Email address</p>
                <p>{accountData ? accountData.email : "Loading..."}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p>{accountData ? accountData.phoneNumber : "Loading..."}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500">Create at</p>
                <p>
                  {accountData
                    ? getFormattedDate(accountData.createdAt)
                    : "Loading..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProfileCustomer;
