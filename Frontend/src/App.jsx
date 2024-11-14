import React, { useState } from "react";
import { Layout, ConfigProvider, theme } from "antd";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Sidebar from "./component/Sidebar";
import Header from "./component/Header_admin";
import Dashboard from "./page/Admin/Dashboard";
import Posts from "./page/Admin/Posts";
import RequestPending from "./page/Admin/RequestPending";
import Orders from "./page/Admin/Orders";
import Customers from "./page/Admin/Customers";
import Staffs from "./page/Admin/Staffs";
import Shippers from "./page/Admin/Shippers";
import Payments from "./page/Admin/Payments";
import Vouchers from "./page/Admin/Vouchers";
import "./styles/main.scss";

import Home from "././page/Buyer-Seller/home";
import Login from "./page/login";
import Product from "./page/Buyer-Seller/product";
import PrivateRoute from "./component/private-route";
import ForgotPassword from "./page/Buyer-Seller/forgetPassword";
import Register from "./page/signup";
import ProductPage from "./page/Buyer-Seller/productpage";
import SellerRegister from "./page/seller-register";
import Cart from "./page/Buyer-Seller/cart-page";
import Checkout from "./page/Buyer-Seller/checkout";
import Order_Page from "./page/Buyer-Seller/order";
import OTP from "./page/Buyer-Seller/OTP";
import TransactionCustomer from "./page/Buyer-Seller/transaction-customer";
import Profile from "./page/Buyer-Seller/profile";
import WalletCustomer from "./page/Buyer-Seller/wallet-customer";
import ChangePasswordCustomer from "./page/Buyer-Seller/changpassword-customer";
import Notification from "./page/Buyer-Seller/notification";
import AddProduct from "./page/Buyer-Seller/addprocduct";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputNewPassword from "./page/Buyer-Seller/inputnewpassword";
import ProductSeller from "./page/Buyer-Seller/Product-seller";
import SuccessCheckout from "./page/Buyer-Seller/Success/index1";
import SuccessTransaction from "./page/Buyer-Seller/Success";
import FailedTransaction from "./page/Buyer-Seller/Failed";
import FailedCheckout from "./page/Buyer-Seller/Failed/index1";
import "./styles/main.scss";
import WalletSeller from "./page/Buyer-Seller/wallet-seller";
import SellerPage from "./page/Buyer-Seller/seller-page";
import DeliveryDetail from "./page/Delivery/DeliveryDetail";
import DeliveryList from "./page/Delivery/AllDeliveryPage";
import DashboardManager from "./page/Manager/Dashboard";
import PostsManager from "./page/Manager/Posts";
import OrdersManager from "./page/Manager/Orders";
import CustomersManager from "./page/Manager/Customers";
import StaffsManager from "./page/Manager/Staffs";
import TransactionsManager from "./page/Manager/Transactions";
import VouchersManager from "./page/Manager/Vouchers";
import ShippersManager from "./page/Manager/Shippers";
import PaymentsManager from "./page/Manager/Payments";
import RequestsManager from "./page/Manager/Request";
import PostSeller from "./page/Buyer-Seller/post-seller";
import CreateOrderId from "./page/Buyer-Seller/create-order-id";
import CreateOrder from "./page/Buyer-Seller/create-order";
import Order_Seller_Page from "./page/Buyer-Seller/order-seller";
import Rating_Page from "./page/Buyer-Seller/reviewAndRating";
import Chat_Page from "./page/Buyer-Seller/chat";
import TransactionSeller from "./page/Buyer-Seller/transaction-seller";
import RequestPendingManager from "./page/Manager/RequestPending";
import Contact from "./page/Buyer-Seller/contact";
import About from "./page/Buyer-Seller/about";
import CancelOrder_Page from "./page/Buyer-Seller/cancelorder";
import ProfileStaff from "./page/Admin/ProfileStaff";
import ProfileManager from "./page/Manager/ProfileManager";
import Transaction from "./page/Admin/Transaction";
import ProfileShipper from "./page/Delivery/Profile";
import ResetPasswordShipper from "./page/Delivery/ResetPassword";
import Report from "./page/Admin/Report";
import Chat_Hello from "./page/Buyer-Seller/chat-hello";
import ReportManager from "./page/Manager/Report";
import PolicyPage from "./page/Buyer-Seller/policy";
const { Content } = Layout;

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const router = createBrowserRouter([
    // Buyer-Seller Routes
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "product",
      element: <Product />,
    },
    {
      path: "register",
      element: <Register />,
    },
    {
      path: "forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "product-page/:id",
      element: <ProductPage />,
    },
    {
      path: "seller-register",
      element: <SellerRegister />,
    },
    {
      path: "cart",
      element: <Cart />,
    },
    {
      path: "checkout",
      element: <Checkout />,
    },
    {
      path: "order",
      element: <Order_Page />,
    },
    {
      path: "otp",
      element: <OTP />,
    },
    {
      path: "transaction-customer",
      element: <TransactionCustomer />,
    },

    {
      path: "profile",
      element: <Profile />,
    },

    {
      path: "wallet-customer",
      element: <WalletCustomer />,
    },

    {
      path: "wallet-seller",
      element: <WalletSeller />,
    },
    {
      path: "changpassword",
      element: <ChangePasswordCustomer />,
    },
    {
      path: "notification",
      element: <Notification />,
    },

    {
      path: "add-product",
      element: <AddProduct />,
    },
    {
      path: "reset-password",
      element: <InputNewPassword />,
    },
    {
      path: "product-seller",
      element: <ProductSeller />,
    },
    {
      path: "success-checkout",
      element: <SuccessCheckout />,
    },
    {
      path: "success-transaction",
      element: <SuccessTransaction />,
    },
    {
      path: "failed-transaction",
      element: <FailedTransaction />,
    },
    {
      path: "failed-checkout",
      element: <FailedCheckout />,
    },
    {
      path: "seller/:id",
      element: <SellerPage />,
    },
    {
      path: "post-seller",
      element: <PostSeller />,
    },

    {
      path: "product-seller",
      element: <ProductSeller />,
    },
    {
      path: "create-order-id/:id",
      element: <CreateOrderId />,
    },
    {
      path: "create-order",
      element: <CreateOrder />,
    },
    {
      path: "order-seller",
      element: <Order_Seller_Page />,
    },
    {
      path: "rating-page/:id",
      element: <Rating_Page />,
    },
    {
      path: "chat/:emailReceiver",
      element: <Chat_Page />,
    },
    {
      path: "chat",
      element: <Chat_Hello />,
    },
    {
      path: "transaction-seller",
      element: <TransactionSeller />,
    },
    {
      path: "contact",
      element: <Contact />,
    },
    {
      path: "about",
      element: <About />,
    },
    {
      path: "cancelorder/:id",
      element: <CancelOrder_Page />,
    },
    {
      path: "policy",
      element: <PolicyPage />,
    },

    {
      path: "shipper",
      children: [
        {
          path: "delivery-detail",
          element: <DeliveryDetail />,
        },
        {
          path: "all-delivery",
          element: <DeliveryList />,
        },
        {
          path: "profile",
          element: <ProfileShipper />,
        },
        {
          path: "reset-password",
          element: <ResetPasswordShipper />,
        },
      ],
    },

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
            <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
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
        { path: "transactions", element: <Transaction darkMode={darkMode} /> },
        { path: "vouchers", element: <Vouchers darkMode={darkMode} /> },

        {
          path: "request-pending",
          element: <RequestPending darkMode={darkMode} />,
        },
        { path: "shippers", element: <Shippers darkMode={darkMode} /> },
        { path: "payments", element: <Payments darkMode={darkMode} /> },

        { path: "profile", element: <ProfileStaff darkMode={darkMode} /> },
        { path: "report", element: <Report darkMode={darkMode} /> },
      ],
    },

    {
      path: "manager",
      element: (
        <Layout className={`min-h-screen ${darkMode ? "dark" : ""}`}>
          <Sidebar darkMode={darkMode} />
          <Layout
            className={`transition-all duration-300 ${
              darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
            }`}
          >
            <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
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
        {
          path: "dashboard",
          element: <DashboardManager darkMode={darkMode} />,
        },
        { path: "posts", element: <PostsManager darkMode={darkMode} /> },
        { path: "orders", element: <OrdersManager darkMode={darkMode} /> },
        {
          path: "customers",
          element: <CustomersManager darkMode={darkMode} />,
        },
        { path: "staffs", element: <StaffsManager darkMode={darkMode} /> },
        {
          path: "transactions",
          element: <TransactionsManager darkMode={darkMode} />,
        },
        { path: "vouchers", element: <VouchersManager darkMode={darkMode} /> },
        { path: "profile", element: <ProfileManager darkMode={darkMode} /> },
        {
          path: "request-pending",
          element: <RequestPendingManager darkMode={darkMode} />,
        },
        { path: "shippers", element: <ShippersManager darkMode={darkMode} /> },
        { path: "payments", element: <PaymentsManager darkMode={darkMode} /> },
        { path: "requests", element: <RequestsManager darkMode={darkMode} /> },
        { path: "report", element: <ReportManager darkMode={darkMode} /> },
      ],
    },
  ]);

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <ToastContainer />
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
