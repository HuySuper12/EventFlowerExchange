import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
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
import Page_OTP from "./page/Buyer-Seller/otp";
import TransactionCustomer from "./page/Buyer-Seller/transaction-customer";
import ProfileCustomer from "./page/Buyer-Seller/profile-customer";
import WalletCustomer from "./page/Buyer-Seller/wallet-customer";
import ChangePasswordCustomer from "./page/Buyer-Seller/changpassword-customer";
import ProductCustomer from "./page/Buyer-Seller/product-customer";
import AddProduct from "./page/Buyer-Seller/addprocduct";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputNewPassword from "./page/Buyer-Seller/inputnewpassword";
import ProductSeller from "./page/Buyer-Seller/Product-seller";
const App = () => {
  const router = createBrowserRouter([
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
      element: <Page_OTP />,
    },
    {
      path: "transaction-customer",
      element: <TransactionCustomer />,
    },

    {
      path: "profile-customer",
      element: <ProfileCustomer />,
    },

    {
      path: "wallet-customer",
      element: <WalletCustomer />,
    },
    {
      path: "changpassword-customer",
      element: <ChangePasswordCustomer />,
    },
    {
      path: "product-customer",
      element: <ProductCustomer />,
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
    // {
    //   path: "admin",
    //   element: <PrivateRoute />,
    //   children: [
    //     {
    //       path: "dashboard",
    //       element: <Dashboard />,
    //     },
    //   ],
    // },
  ]);

  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
