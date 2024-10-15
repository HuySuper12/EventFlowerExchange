import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../component/header";
import Footer from "../../../component/footer";
import { Button, Form, Input } from "antd";
import api from "../../../config/axios";
import { toast } from "react-toastify";

function OTP() {
  const navigate = useNavigate();

  const handleSendOTP = async (values, api) => {
    const email = sessionStorage.getItem("email");

    if (!email || !values.otp) {
      console.error("Email or OTP is not set.");
      return; // Ngừng thực hiện nếu email hoặc OTP không hợp lệ
    }

    try {
      const response = await api.post("Account/VerifyOTP", null, {
        params: {
          otp: values.otp,
          email: email,
        },
      });
      if (response.data == true) {
        navigate("/profile-customer");
      } else {
        toast.error("OTP verification is not match.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error.response.data);
    }
  };

  return (
    <>
      <Header />

      <div className="flex flex-col items-center w-[90%] sm:max-w m-auto mt-14 gap-4 text-gray-800">
        <div className="inline-flex items-center gap-2 mb-2 mt-10">
          <p className="prata-regular text-3xl">Authentication</p>
          <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
        </div>
      </div>

      <div className="flex flex-col items-center w-[90%] sm:max-w m-auto mt-5 gap-4 text-gray-800">
        <Form
          className="form"
          labelCol={{
            span: 24,
          }}
          onFinish={(values) => handleSendOTP(values, api)} // Truyền api vào đây
        >
          <Form.Item
            name="otp"
            rules={[
              {
                required: true,
                message: "Please enter the OTP!",
              },
            ]}
          >
            <Input
              type="text"
              placeholder="OTP"
              className="px-3 py-2 border border-gray-800 w-[500px] text-base"
            />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-center w-full">
              <Button
                className="bg-white text-black border border-gray-800 font-light px-8 py-2 text-lg rounded-[18px] w-[150px] h-[40px]"
                type="primary"
                htmlType="submit"
              >
                Authenticate
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
      <Footer />
    </>
  );
}

export default OTP;
