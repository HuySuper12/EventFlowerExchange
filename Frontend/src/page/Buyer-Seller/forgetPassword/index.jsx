import React from "react";
import { Button, Form, Input } from "antd";
import Header from "../../../component/header";
import api from "../../../config/axios";
import { useNavigate } from "react-router-dom";
import Footer from "../../../component/footer";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const handleForgotPassword = async (values) => {
    console.log("Request Payload:", values); // Log the request payload
    const email = values.email;

    // Kiểm tra xem email có hợp lệ không
    if (!email) {
      alert("Email is required.");
      return;
    }

    try {
      // Gọi API với email là query parameter
      const response = await api.post("/Account/SendOTP", null, {
        params: { email: email }, // Sử dụng email từ form
      });

      toast.success("Check your email for password reset instructions.");

      if (response.data === true) {
        localStorage.setItem("email", email);
        navigate("/otp");
      } else {
        console.error(`Error: Status code ${response.status}`);
      }
    } catch (err) {
      console.error("Error response:", err.response); // Log the error response
      alert(err.response?.data?.message || "An error occurred"); // Show a more user-friendly error message
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center w-[90%] sm:max-w m-auto mt-14 gap-4 text-gray-800">
        <div className="inline-flex items-center gap-2 mb-2 mt-10">
          <p className="text-3xl">Forgot Password</p>
          <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
        </div>
      </div>

      <div className="flex flex-col items-center w-[90%] sm:max-w m-auto mt-5 gap-4 text-gray-800">
        <Form
          className="form"
          labelCol={{
            span: 24,
          }}
          onFinish={handleForgotPassword}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter your email!",
              },
            ]}
          >
            <Input
              type="text"
              placeholder="Email"
              className="px-3 py-2 border border-gray-800 w-[500px] text-base"
            />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-center w-full">
              <Button
                className="bg-white text-black border border-gray-800 font-light px-8 py-2 text-lg rounded-[18px] w-[200px] h-[40px]"
                type="primary"
                htmlType="submit"
              >
                Send OTP to your email
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>

      <Footer />
    </>
  );
};

export default ForgotPassword;
