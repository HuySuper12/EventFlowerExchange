// Transaction.jsx
import React from "react";
import SidebarCustomer from "../../../component/slidebar-customer";
import Header from "../../../component/header";
import Footer from "../../../component/footer";

const ChangePasswordCustomer = () => {
  return (
    <>
      <Header />
      <div className="ml-[230px] mt-[20px] text-[30px]">Your Account</div>

      <div className="flex flex-col md:flex-row h-screen p-6 ml-[200px] mr-[200px]">
        <SidebarCustomer />
        <div className="w-full ml-[30px] bg-white shadow-2xl rounded-xl p-4">
        <div className="mb-6 p-4 border border-gray-300 rounded-lg">
          <h4 className="text-lg font-bold">Change Password</h4>
          <form className="mt-4">
            <div className="mb-4">
              <label className="block text-gray-700">New Password</label>
              <input type="password" className="border rounded-lg w-full p-2" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Confirm Password</label>
              <input type="password" className="border rounded-lg w-full p-2" />
            </div>
            <button className="bg-blue-500 text-white rounded-lg px-4 py-2">
              Change Password
            </button>
          </form>
        </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ChangePasswordCustomer;
