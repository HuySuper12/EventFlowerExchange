import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Steps,
  Modal,
  Upload,
  Input,
  message,
  Form,
  Image,
} from "antd";
import { Clock, Phone, User, Camera, Home } from "lucide-react";
import Header from "../../component/Header_delivery";
import SidebarDelivery from "../../component/Sidebar_delivery";
import api from "../../config/axios";
import uploadFile from "../../utils/upload";
import { PlusOutlined } from "@ant-design/icons";

const { Step } = Steps;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const ProfileShipper = () => {
  const [accountData, setAccountData] = useState(null);
  const email = sessionStorage.getItem("email");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  const fetchAccountData = async () => {
    if (email) {
      try {
        const encodedEmail = encodeURIComponent(email);
        const response = await api.get(
          `Account/GetAccountByEmail/${encodedEmail}`
        );
        setAccountData(response.data);
      } catch (error) {
        console.error("Error fetching account data:", error);
      }
    } else {
      console.error("Email is not set in sessionStorage.");
    }
  };

  useEffect(() => {
    fetchAccountData();
  }, [email]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen && accountData) {
      form.setFieldsValue({
        name: accountData.name,
        email: accountData.email,
        address: accountData.address,
        phone: accountData.phoneNumber,
      });
    }
  };

  const handleUpdate = async (values) => {
    try {
      const response = await api.put("Account/UpdateAccount", {
        email: values.email,
        name: values.name,
        phone: values.phone,
        address: values.address,
      });

      if (response.data === true) {
        message.success("Update successful");
        setIsModalOpen(false);
        await fetchAccountData();
      } else {
        message.error("Update failed.");
      }
    } catch (error) {
      console.error("Error updating account:", error);
      message.error("An error occurred while updating the account.");
    }
  };

  const handleImageUpdate = async () => {
    if (fileList.length > 0) {
      const file = fileList[0];
      const imageUrl = await uploadFile(file.originFileObj);
      const email = sessionStorage.getItem("email");

      try {
        const response = await api.put(`Account/UpdateAccountImage`, null, {
          params: {
            email: email,
            url: imageUrl,
          },
        });

        if (response.data === true) {
          message.success("Image updated successfully");
          setIsImageModalOpen(false);
          setFileList([]);
          await fetchAccountData();
        } else {
          message.error("Image update failed.");
        }
      } catch (error) {
        message.error("An error occurred while updating the image.", error);
      }
    } else {
      message.error("Please upload an image.");
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  return (
    <div>
      <Header title="" />

      <div className="flex">
        <SidebarDelivery />
        
          <div className="flex flex-col md:flex-row w-full h-[750px] ml-[-80px] mt-[-10px] p-6">
            <div className="w-full ml-[30px] bg-white shadow-2xl rounded-xl p-4">
              <h2 className="text-2xl font-bold mb-6">My Profile</h2>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={
                      accountData
                        ? accountData.picture
                        : "https://static.vecteezy.com/system/resources/previews/006/017/592/non_2x/ui-profile-icon-vector.jpg"
                    }
                    alt="Profile"
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className="text-xl font-bold">
                      {accountData ? accountData.name : "Loading..."}
                    </h3>
                    <button
                      className="text-gray-800 border border-black rounded-lg px-3 py-1 hover:bg-gray-200 mt-[10px]"
                      onClick={() => setIsImageModalOpen(true)}
                    >
                      Upload Image
                    </button>
                  </div>
                </div>
                <button
                  className="text-blue-500 border border-blue-500 rounded-lg px-3 py-1 hover:bg-blue-100"
                  onClick={toggleModal}
                >
                  Edit
                </button>
              </div>
              <div className="mb-6 p-4 border border-gray-300 rounded-lg">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-bold">Personal Information</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-gray-500">First Name</p>
                    <p>{accountData ? accountData.name : "Loading..."}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Address</p>
                    <p>{accountData ? accountData.address : "Loading..."}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email address</p>
                    <p>{accountData ? accountData.email : "Loading..."}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p>
                      {accountData ? accountData.phoneNumber : "Loading..."}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">Created At</p>
                    <p>
                      {accountData
                        ? new Date(accountData.createdAt).toLocaleDateString()
                        : "Loading..."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Modal
            title="Update Profile"
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onOk={() => form.submit()}
          >
            <Form form={form} layout="vertical" onFinish={handleUpdate}>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Please enter your email" }]}
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                label="Address"
                name="address"
                rules={[
                  { required: true, message: "Please enter your address" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[
                  { required: true, message: "Please enter your phone number" },
                ]}
              >
                <Input />
              </Form.Item>
            </Form>
          </Modal>

          <Modal
            title="Update Image"
            open={isImageModalOpen}
            onCancel={() => setIsImageModalOpen(false)}
            onOk={handleImageUpdate}
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              beforeUpload={() => false}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
          </Modal>

          {previewImage && (
            <Image
              wrapperStyle={{ display: "none" }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
        
      </div>
    </div>
  );
};

export default ProfileShipper;
