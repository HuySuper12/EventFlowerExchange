import { Button, Form, Input } from "antd";
import Header from "../../component/header";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";
import Footer from "../../component/footer";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = async (values) => {
    console.log(values);

    try {
      const response = await api.post("Account/SignUp/Buyer", values);

      console.log("API response:", response.data);

      navigate("/login");
      toast.success("Register was successfully. To continue, please log in");
    } catch (error) {
      console.error("Error creating user:", error.code, error.message);
      const errorMessage =
        error.response?.data || "An error occurred during registration.";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <Header />

      <div className="flex flex-col items-center w-[90%] sm:max-w m-auto mt-14 gap-4 text-gray-800">
        <div className="inline-flex items-center gap-2 mb-2 mt-10">
          <p className="prata-regular text-3xl">Sign up</p>
          <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
        </div>
      </div>

      <div className="flex flex-col items-center w-[90%] sm:max-w m-auto mt-5 gap-4 text-gray-800">
        <Form
          className="form"
          labelCol={{
            span: 24,
          }}
          onFinish={handleRegister}
        >
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên!",
              },
            ]}
          >
            <Input
              type="text"
              placeholder="Name"
              className="px-3 py-2 border border-gray-800 w-[500px] text-base"
            />
          </Form.Item>

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
            name="address"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số địa chỉ!",
              },
            ]}
          >
            <Input
              type="text"
              placeholder="Address"
              className="px-3 py-2 border border-gray-800 w-[500px] text-base"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số điện thoại!",
              },
            ]}
          >
            <Input
              type="text"
              placeholder="Phone"
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

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu xác nhận!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
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

          <div className="w-full flex justify-end text-sm mt-[-8px]">
            <div
              className="cursor-pointer mb-[8px] text-sm "
              onClick={handleLogin}
            >
              I already have a account?
            </div>
          </div>

          <Form.Item>
            <div className="flex justify-center w-full">
              <Button
                className="bg-white text-black border border-gray-800 font-light px-8 py-2 text-lg rounded-[18px] w-[100px] h-[40px]"
                type="primary"
                htmlType="submit"
              >
                Sign up
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>

      <Footer />
    </>
  );
};

export default Register;
