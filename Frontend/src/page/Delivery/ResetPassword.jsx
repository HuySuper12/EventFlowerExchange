import React from "react";
import { Input, Form, Button } from "antd";
import Header from "../../component/Header_delivery";
import SidebarDelivery from "../../component/Sidebar_delivery";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPasswordShipper = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const handleResetPassword = async (values, api) => {
    const email = sessionStorage.getItem("email");
    console.log(email);

    try {
      const response = await api.post("Account/ResetPassword", null, {
        params: {
          newPassword: values.newPassword,
          email: email,
        },
      });
      if (response.data === "true") {
        toast.success("Password changed successfully");
      } else {
        toast.error("Failed to change password");
      }
    } catch (error) {
      console.error("Error Reset Password:", error.response.data);
      toast.error("An error occurred while resetting password");
    }
  };
  return (
    <div>
      <Header title="" />

      <div className="flex">
        <SidebarDelivery />

        <div className="w-full">
          <div className="flex flex-col items-center w-[90%] sm:max-w m-auto mt-[150px] gap-4 text-gray-800">
            <div className="inline-flex items-center gap-2 mb-2 mt-10">
              <p className="prata-regular text-3xl">Change Password</p>
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
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordShipper;
