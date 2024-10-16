import React from "react";
import SidebarCustomer from "../../../component/slidebar-customer";
import Header from "../../../component/header";
import Footer from "../../../component/footer";
import api from "../../../config/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ChangePasswordCustomer = () => {
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    try {
      const email = sessionStorage.getItem("email");
      if (email) {
        const response = await api.post("Account/SendOTP", null, {
          params: { email: email },
        });

        //null để cho axios biết là không lấy dữ liệu trong body

        if (response.data === true) {
          navigate("/otp");
          toast.success("Please enter OTP to continue.");
        } else {
          console.error(`Error: Status code ${response.status}`);
        }
      } else {
        console.error("No email found in sessionStorage");
      }
    } catch (error) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error:", error.message);
      }
    }
  };

  return (
    <>
      <Header />
      <div className="ml-[230px] mt-[20px] text-[30px]">Your Account</div>

      <div className="flex flex-col md:flex-row h-screen p-6 ml-[200px] mr-[200px]">
        <SidebarCustomer />
        <div className="w-full ml-[30px] bg-white shadow-2xl rounded-xl p-4">
          <div className="mb-6 p-4 border border-gray-300 rounded-lg">
            <h4 className="text-lg font-bold">Change Password</h4>
            <button
              className="bg-blue-500 text-white rounded-lg px-4 py-2 mt-[20px] ml-[350px]"
              onClick={handleResetPassword}
            >
              Reset Password
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ChangePasswordCustomer;
