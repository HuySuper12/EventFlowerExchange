import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../component/header";
import Footer from "../../../component/footer";
import { Button, Form, Input } from "antd";
import api from "../../../config/axios";
import { toast } from "react-toastify";

function InputNewPassword() {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const handleResetPassword = async (values, api) => {
    const email = sessionStorage.getItem("email");
    const emailLocal = localStorage.getItem("email");

    if (token) {
      if (!email || !values.newPassword) {
        console.error("Email or OTP is not set.");
        return;
      }

      try {
        const response = await api.post("Account/ResetPassword", null, {
          params: {
            newPassword: values.newPassword,
            email: email,
          },
        });
        if (response.data == true) {
          navigate("/");
        } else {
          toast.error(response.data);
        }
      } catch (error) {
        console.error("Error Reset Password:", error.response.data);
      }

      //if trường hợp chưa đăng nhập
    } else {
      if (!emailLocal || !values.newPassword) {
        console.error("Email or Password is not set.");
        return;
      }

      try {
        const response = await api.post("Account/ResetPassword", null, {
          params: {
            newPassword: values.newPassword,
            email: emailLocal,
          },
        });
        if (response.data == true) {
          navigate("/login");
          localStorage.removeItem("email");
          toast.success("Please enter login to continue.");
        } else {
          toast.error(response.data);
        }
      } catch (error) {
        console.error("Error Reset Password:", error.response.data);
      }
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
          onFinish={(values) => handleResetPassword(values, api)}
        >
          <Form.Item
            name="newPassword"
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

          <Form.Item
            name="confirmNewPassword"
            dependencies={["newPassword"]}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu xác nhận!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              type="password"
              placeholder="Confirm Password"
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
                Reset Password
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
      <Footer />
    </>
  );
}

export default InputNewPassword;
