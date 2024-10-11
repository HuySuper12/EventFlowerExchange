// Transaction.jsx
import React from "react";

import SidebarCustomer from "../../../component/slidebar-customer";
import Header from "../../../component/header";
import Footer from "../../../component/footer";

const ProfileCustomer = () => {
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
                <h3 className="text-xl font-bold">Rafiqur Rahman</h3>
              </div>
            </div>
            <button className="text-blue-500 border border-blue-500 rounded-lg px-3 py-1 hover:bg-blue-50">
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
                <p>Rafiqur</p>
              </div>
              <div>
                <p className="text-gray-500">Last Name</p>
                <p>Rahman</p>
              </div>
              <div>
                <p className="text-gray-500">Email address</p>
                <p>rafiqurrahman51@gmail.com</p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p>+09 345 346 46</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500">Address</p>
                <p>Team Manager</p>
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
