import React from "react";
import { Button, Form, Input } from "antd";
import Header from "../../../component/header";
import api from "../../../config/axios";
import { useNavigate } from "react-router-dom";
import Footer from "../../../component/footer";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const handleForgotPassword = async (values) => {
    console.log(values);
    try {
      // Gửi yêu cầu đến server để xử lý quên mật khẩu
      await api.post("forgot-password", values);
      alert("Check your email for password reset instructions.");
      navigate("/login"); // Chuyển hướng về trang đăng nhập
    } catch (err) {
      console.log(err);
      alert(err.response.data);
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
