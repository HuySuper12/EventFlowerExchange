// Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";

const SidebarCustomer = () => {
  return (
    <div className="w-full md:w-1/4 bg-white shadow-2xl rounded-xl p-4">
      <nav className="flex flex-col space-y-4">
        <Link
          to="/profile-customer"
          className="text-gray-700 rounded-3xl border border-transparent hover:border hover:border-blue-500 p-2 transition-transform transform duration-300 ease-in-out flex items-center space-x-2 hover:scale-90"
        >
          <img
            src="https://static.vecteezy.com/system/resources/previews/021/079/672/non_2x/user-account-icon-for-your-design-only-free-png.png"
            alt="Profile Icon"
            className="w-[40px] h-[40px]"
          />
          <span>My Profile</span>
        </Link>
        <Link
          to="/changpassword-customer"
          className="text-gray-700 rounded-3xl border border-transparent hover:border hover:border-blue-500 p-2 transition-transform transform duration-300 ease-in-out flex items-center space-x-2 hover:scale-90"
        >
          <img
            src="https://static.thenounproject.com/png/250130-200.png"
            alt="Change Password Icon"
            className="w-[40px] h-[40px]"
          />
          <span>Change Password</span>
        </Link>
        <Link
          to="/wallet-customer"
          className="text-gray-700 rounded-3xl border border-transparent hover:border hover:border-blue-500 p-2 transition-transform transform duration-300 ease-in-out flex items-center space-x-2 hover:scale-90"
        >
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/002/361/001/small/wallet-icon-free-vector.jpg"
            alt="Wallet Icon"
            className="w-[40px] h-[40px]"
          />
          <span>Wallet</span>
        </Link>
        <Link
          to="/transaction-customer"
          className="text-gray-700 rounded-3xl border border-transparent hover:border hover:border-blue-500 p-2 transition-transform transform duration-300 ease-in-out flex items-center space-x-2 hover:scale-90"
        >
          <img
            src="https://cdn.iconscout.com/icon/premium/png-256-thumb/order-history-2003530-1688309.png?f=webp&w=256"
            alt="Transaction Icon"
            className="w-[40px] h-[40px]"
          />
          <span>Transaction</span>
        </Link>

        <Link
          to="/product-customer"
          className="text-gray-700 rounded-3xl border border-transparent hover:border hover:border-blue-500 p-2 transition-transform transform duration-300 ease-in-out flex items-center space-x-2 hover:scale-90"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/1311/1311095.png"
            alt="Transaction Icon"
            className="w-[40px] h-[40px]"
          />
          <span>Product</span>
        </Link>
      </nav>
    </div>
  );
};

export default SidebarCustomer;
