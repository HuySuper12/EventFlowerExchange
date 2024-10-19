import React from "react";
import { Button, Form, Input } from "antd";
import Header from "../../component/header";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";
import Footer from "../../component/footer";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    try {
      const response = await api.post("Account/Login", values);
      const token = response.data;

      if (!token) {
        throw new Error("Token không tồn tại trong phản hồi.");
      }

      const tokenParts = token.split(".");
      const encodedPayload = tokenParts[1];
      const decodedPayload = JSON.parse(atob(encodedPayload));

      const {
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": role,
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress":
          email,
      } = decodedPayload;

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("role", role);
      sessionStorage.setItem("email", email);

      if (role === "Buyer") {
        navigate("/");
      } else if (role === "staff") {
        navigate("/admin/dashboard");
      } else if (role === "Seller") {
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      alert(err.response.data);
    }
  };

  // HandleLoginGoogle cho Google Login
  const handleLoginGoogle = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential; // Lấy token từ Google
      const response = await api.post(`Account/LoginByGoogle/${token}`); // Correct template literal syntax

      const appToken = response.data; // Lấy token từ server

      if (!appToken) {
        throw new Error("Token không tồn tại trong phản hồi.");
      }

      const tokenParts = appToken.split(".");
      const encodedPayload = tokenParts[1];
      const decodedPayload = JSON.parse(atob(encodedPayload));

      const {
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": role,
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress":
          email,
      } = decodedPayload;

      sessionStorage.setItem("token", appToken);
      sessionStorage.setItem("role", role);
      sessionStorage.setItem("email", email);

      if (role === "Buyer") {
        navigate("/");
      } else if (role === "staff") {
        navigate("/Admin/Dashboard");
      } else if (role === "Seller") {
        navigate("/");
      }
    } catch (err) {
      console.log("Login Failed", err);
    }
  };
  return (
    <>
      <Header />

      <div className="flex flex-col items-center w-[90%] sm:max-w m-auto mt-14 gap-4 text-gray-800">
        <div className="inline-flex items-center gap-2 mb-2 mt-10">
          <p className="prata-regular text-3xl">Login</p>
          <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
        </div>
      </div>

      <div className="flex flex-col items-center w-[90%] sm:max-w m-auto mt-5 gap-4 text-gray-800">
        <Form
          className="form"
          labelCol={{
            span: 24,
          }}
          onFinish={handleLogin}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập email!",
              },
            ]}
          >
            <Input
              type="text"
              placeholder="Email"
              className="px-3 py-2 border border-gray-800 w-[500px] text-base"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu!",
              },
            ]}
          >
            <Input.Password
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-800 text-base"
            />
          </Form.Item>

          <div className="w-full flex justify-between text-sm mt-[-8px]">
            <a
              href="/forgot-password"
              className="cursor-pointer mb-[8px] text-sm"
            >
              Forgot your password?
            </a>

            <a href="/register" className="cursor-pointer mb-[8px] text-sm ">
              Create account?
            </a>
          </div>

          <Form.Item>
            <div className="flex justify-center w-full">
              <Button
                className="bg-white text-black border border-gray-800 font-light px-8 py-2 text-lg rounded-[18px] w-[100px] h-[40px]"
                type="primary"
                htmlType="submit"
              >
                Login
              </Button>
            </div>
          </Form.Item>
        </Form>

        <div>
          <span>
            <GoogleLogin
              onSuccess={handleLoginGoogle}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </span>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Login;
