import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./page/home";
import Login from "./page/login";
import Dashboard from "./page/admin";
import Product from "./page/product";
import PrivateRoute from "./component/private-route";
import ForgotPassword from "./page/forgetPassword"; // Thêm import cho ForgotPassword
import Register from "./page/signup";
import ProductPage from "./page/productpage";
import SellerRegister from "./page/seller-register";
import Cart from "./page/cart-page";
import Checkout from "./page/checkout";

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
      path: "product-page",
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
      path: "admin",
      element: <PrivateRoute />,
      children: [
        {
          path: "dashboard",
          element: <Dashboard />,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
