import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import Header from "../../../component/header";
import api from "../../../config/axios";
import Footer from "../../../component/footer";
import SlidebarSeller from "../../../component/slidebar-seller";
import { Button, Form, Input, InputNumber } from "antd";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";

const CreateOrderId = () => {
  const [form] = useForm();
  const { id } = useParams();

  const email = sessionStorage.getItem("email");

  const handleSubmit = async (values) => {
    try {
      const response = await api.post("Order/CreateOrderBySeller", {
        sellerEmail: email,
        buyerEmail: values.buyerEmail,
        phoneNumber: values.phoneNumber,
        address: values.address,
        productId: id,
        price: values.price,
      });
      if (response.data == true) {
        toast.success("Order created successfully!");
        console.log(response.data);
      }
    } catch (error) {
      console.error(
        "Error creating order:",
        error.response?.data || error.message
      );
      toast.error("Failed to create order.");
    }
  };

  return (
    <div>
      <Header />
      <div className="flex mt-[50px]">
        <SlidebarSeller />
        <div className="mt-[20px]">
          <div className="text-3xl font-semibold ml-[450px]">CREATE ORDER</div>
          <Form
            className="form mt-[20px] ml-[100px]"
            labelCol={{ span: 24 }}
            form={form}
            onFinish={handleSubmit}
          >
            <Form.Item
              label="Buyer Email"
              name="buyerEmail"
              className="w-[500px]"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập thời hạn của sản phẩm!",
                },
              ]}
            >
              <Input
                type="text"
                placeholder="Buyer Email"
                className="px-3 py-2 border border-gray-800 w-[900px] text-base"
              />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              className="w-[500px]"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số điện thoại người mua!",
                },
              ]}
            >
              <Input
                type="text"
                placeholder="Phone Number"
                className="px-3 py-2 border border-gray-800 w-[900px] h-[50px] text-base"
              />
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[
                { required: true, message: "Vui lòng nhập giá sản phẩm!" },
              ]}
            >
              <InputNumber
                placeholder="Price"
                className="px-3 py-2 border border-gray-800 w-[900px] h-[50px] text-base"
                min={1}
              />
            </Form.Item>

            <Form.Item
              label="Address"
              name="address"
              className="w-[500px]"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <Input
                type="text"
                placeholder="Address"
                className="px-3 py-2 border border-gray-800 w-[900px] h-[50px] text-base"
              />
            </Form.Item>

            <Form.Item>
              <div className="flex justify-center w-full mt-[30px]">
                <Button
                  className="bg-white text-black border border-gray-800 font-light px-8 py-2 text-lg rounded-[18px] w-[150px] h-[40px] ml-[-150px]"
                  type="primary"
                  htmlType="submit"
                >
                  Create Order
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateOrderId;
