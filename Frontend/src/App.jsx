import React, { useState } from "react";
import { Layout, ConfigProvider, theme } from "antd";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import Sidebar from "./component/Sidebar";
import Header from "./component/Header";
import Dashboard from "./page/Admin/Dashboard";
import Posts from "./page/Admin/Posts";
import Orders from "./page/Admin/Orders";
import Customers from "./page/Admin/Customers";
import Staffs from "./page/Admin/Staffs";
import Couriers from "./page/Admin/Couriers";
import Transactions from "./page/Admin/Transactions";
import Vouchers from "./page/Admin/Vouchers";
import AdminProfileEdit from "./component/AdminProfileEdit";
import "./styles/main.scss";

import Home from "./page/Buyer-Seller/home";
import Login from "./page/login";
import Product from "./page/Buyer-Seller/product";
import ForgotPassword from "./page/Buyer-Seller/forgetPassword";
import Register from "./page/signup";
import ProductPage from "./page/Buyer-Seller/productpage";
import SellerRegister from "./page/seller-register";
import Cart from "./page/Buyer-Seller/cart-page";
import Checkout from "./page/Buyer-Seller/checkout";
import Order_Page from "./page/Buyer-Seller/order";
import TransactionCustomer from "./page/Buyer-Seller/transaction-customer";
import ProfileCustomer from "./page/Buyer-Seller/profile-customer";
import WalletCustomer from "./page/Buyer-Seller/wallet-customer";
import ChangePasswordCustomer from "./page/Buyer-Seller/changpassword-customer";
import ProductCustomer from "./page/Buyer-Seller/product-customer";
import PrivateRoute from "./component/private-route";
import "./styles/main.scss";

const { Content } = Layout;

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleLanguage = () => setLanguage(language === "en" ? "vi" : "en");

  const router = createBrowserRouter([
    // Buyer-Seller Routes
    { path: "/", element: <Home /> },
    { path: "login", element: <Login /> },
    { path: "product", element: <Product /> },
    { path: "register", element: <Register /> },
    { path: "forgot-password", element: <ForgotPassword /> },
    { path: "product-page", element: <ProductPage /> },
    { path: "seller-register", element: <SellerRegister /> },
    { path: "cart", element: <Cart /> },
    { path: "checkout", element: <Checkout /> },
    { path: "order", element: <Order_Page /> },
    { path: "transaction-customer", element: <TransactionCustomer /> },
    { path: "profile-customer", element: <ProfileCustomer /> },
    { path: "wallet-customer", element: <WalletCustomer /> },
    { path: "changpassword-customer", element: <ChangePasswordCustomer /> },
    { path: "product-customer", element: <ProductCustomer /> },

    // Admin Routes wrapped in PrivateRoute
    {
      path: "admin",
      element: (
        <Layout className={`min-h-screen ${darkMode ? "dark" : ""}`}>
          <Sidebar darkMode={darkMode} />
          <Layout
            className={`transition-all duration-300 ${
              darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
            }`}
          >
            <Header
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
              language={language}
              toggleLanguage={toggleLanguage}
            />
            <Content
              className={`p-6 transition-all duration-300 ${
                darkMode ? "bg-gray-900" : "bg-gray-100"
              } min-h-[calc(100vh-64px)]`}
            >
              <PrivateRoute />
            </Content>
          </Layout>
        </Layout>
      ),
      children: [
        { path: "dashboard", element: <Dashboard darkMode={darkMode} /> },
        { path: "posts", element: <Posts darkMode={darkMode} /> },
        { path: "orders", element: <Orders darkMode={darkMode} /> },
        { path: "customers", element: <Customers darkMode={darkMode} /> },
        { path: "staffs", element: <Staffs darkMode={darkMode} /> },
        { path: "couriers", element: <Couriers darkMode={darkMode} /> },
        { path: "transactions", element: <Transactions darkMode={darkMode} /> },
        { path: "vouchers", element: <Vouchers darkMode={darkMode} /> },
        { path: "profile", element: <AdminProfileEdit darkMode={darkMode} /> },
      ],
    },
  ]);

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
