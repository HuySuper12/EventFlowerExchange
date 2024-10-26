import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
} from "antd";
import { Clock, Phone, User, Camera, Home } from "lucide-react";
import Header from "../../component/Header_delivery";
import SidebarDelivery from "../../component/Sidebar_delivery";
import api from "../../config/axios";
import uploadFile from "../../utils/upload";

const { Step } = Steps;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const DeliveryDetail = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCancel, setIsCancel] = useState(false);
  const [reason, setReason] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [deliveryLog, setDeliveryLog] = useState(null);
  const email = sessionStorage.getItem("email");
  const [accountData, setAccountData] = useState(null);
  const { orderId } = useParams();
  const [productData, setProductData] = useState([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isFailedModalOpen, setIsFailedModalOpen] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    const fetchDeliveryLog = async () => {
      try {
        const response = await api.get(
          `DeliveryLog/ViewDeliveryLogShipperByEmail`,
          {
            params: { email: email },
          }
        );
        setDeliveryLog(response.data[0]);
        updateStep(response.data[0].status);
      } catch (error) {
        console.error("Error fetching delivery log:", error);
      }
    };

    fetchDeliveryLog();
  }, [email]);

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const response = await api.get(`Account/GetAccountByEmail/${email}`);
        setAccountData(response.data);
      } catch (error) {
        console.error("Error fetching account data:", error);
      }
    };

    fetchAccountData();
  }, [email]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!deliveryLog?.orderId) return;
      try {
        const response = await api.get(`Order/ViewOrderDetail`, {
          params: { id: deliveryLog.orderId },
        });
        setProductData(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [deliveryLog?.orderId]);

  const updateStep = (status) => {
    switch (status) {
      case null:
        setCurrentStep(0);
        break;
      case "Delivering":
        setCurrentStep(1);
        break;
      case "Success":
        setCurrentStep(2);
        break;
      case "Fail":
        setCurrentStep(2);
        break;
      default:
        setCurrentStep(0);
    }
  };

  const handleUpdateDelivering = async () => {
    try {
      const response = await api.put(
        `DeliveryLog/UpdateDeliveryLogDeliveringStatus`,
        null,
        {
          params: {
            orderId: deliveryLog?.orderId,
          },
        }
      );
      if (response.data === true) {
        message.success("Update status to Delivering successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating delivery log:", error);
      message.error("Failed to update delivery status.");
    }
  };
  // Update success status
  const handleUpdateSuccess = async () => {
    if (fileList.length === 0) {
      message.error("Please upload a photo.");
      return;
    }

    const file = fileList[0];
    const imageUrl = await uploadFile(file.originFileObj);

    console.log("Image URL:", imageUrl); // Check if image is uploaded correctly

    try {
      const response = await api.put(
        `DeliveryLog/UpdateDeliveryLogSuccessStatus`,
        null,
        {
          params: {
            orderId: deliveryLog?.orderId,
            url: imageUrl,
          },
        }
      );

      if (response.data === true) {
        message.success("Delivery confirmed!");
        setIsSuccessModalOpen(false);
      } else {
        console.log("Response error:", response); // Check if API response is correct
      }
    } catch (error) {
      console.error("Error updating delivery log:", error);
      message.error("Failed to update delivery status.");
    }
  };

  // Update fail status
  const handleUpdateFail = async () => {
    if (fileList.length === 0) {
      message.error("Please upload a photo.");
      return;
    }

    if (!reason) {
      message.error("Please provide a reason for failure.");
      return;
    }

    try {
      const file = fileList[0].originFileObj;
      const downloadURL = await uploadFile(file);

      const response = await api.put(
        `DeliveryLog/UpdateDeliveryLogFailStatus`,
        null,
        {
          params: {
            orderId: deliveryLog?.orderId,
            url: downloadURL,
            reason: reason,
          },
        }
      );

      if (response.data === true) {
        message.success("Order marked as failed!");
        setIsFailedModalOpen(false);
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error updating delivery log:", error);
      message.error("Failed to update delivery status.");
    }
  };

  const handleFileChange = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const productColumns = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (text, record) => (
        <Space>
          <img
            src={record.productImage[0]}
            alt={text}
            className="w-8 h-8 object-cover rounded-md"
          />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
  ];

  const uploadButton = (
    <div>
      <Camera />
      <div>Upload</div>
    </div>
  );

  return (
    <div>
      <Header title="" />

      <div className="flex">
        <SidebarDelivery />
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Order #{deliveryLog?.orderId}
          </h2>
          <div className="flex gap-4">
            <div className="flex-1">
              <Table
                className="shadow-2xl"
                columns={productColumns}
                dataSource={productData}
                pagination={false}
              />
            </div>

            <div className="flex-1 w-[1000px]">
              <Card
                bordered={false}
                style={{
                  boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
                  borderRadius: "8px",
                }}
              >
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{
                    borderBottom: "1px solid #e8e8e8",
                    paddingBottom: "8px",
                  }}
                >
                  Delivery Details
                </h3>

                <Steps
                  current={currentStep}
                  className="flex justify-between mb-4"
                  style={{
                    borderBottom: "1px solid #e8e8e8",
                    paddingBottom: "8px",
                  }}
                >
                  <Step
                    title="Take Order"
                    description="Time"
                    status={currentStep > 0 ? "finish" : "process"}
                    icon={
                      <div
                        style={{
                          backgroundColor:
                            currentStep > 0 ? "#52c41a" : "#d9d9d9", // Màu xanh khi hoàn thành, xám khi chưa
                          borderRadius: "50%",
                          width: "32px",
                          height: "32px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "14px",
                        }}
                      >
                        1
                      </div>
                    }
                  />
                  <Step
                    title="On the way"
                    description="Time"
                    status={
                      currentStep > 1
                        ? "finish"
                        : currentStep === 1
                        ? "process"
                        : "wait"
                    }
                    icon={
                      <div
                        style={{
                          backgroundColor:
                            currentStep > 1 ? "#52c41a" : "#d9d9d9", // Màu xanh khi hoàn thành, xám khi chưa
                          borderRadius: "50%",
                          width: "32px",
                          height: "32px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "14px",
                        }}
                      >
                        2
                      </div>
                    }
                  />
                  <Step
                    title={
                      deliveryLog?.status === "Delivery Fail"
                        ? "Delivery Fail"
                        : "Delivered"
                    }
                    description="Time"
                    status={
                      currentStep > 2
                        ? "finish"
                        : currentStep === 2
                        ? "process"
                        : "wait"
                    }
                    icon={
                      <div
                        style={{
                          backgroundColor:
                            currentStep > 2 ? "#52c41a" : "#d9d9d9", // Màu xanh khi hoàn thành, xám khi chưa
                          borderRadius: "50%",
                          width: "32px",
                          height: "32px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "14px",
                        }}
                      >
                        3
                      </div>
                    }
                  />
                </Steps>

                <Space direction="vertical" size="large" className="w-full">
                  <div className="flex items-center">
                    <User className="mr-2" style={{ color: "#13c2c2" }} />
                    <span>Courier: {accountData?.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="mr-2" style={{ color: "#52c41a" }} />
                    <span>Phone: {}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="mr-2" style={{ color: "#f5222d" }} />
                    <span>Customer: {}</span>
                  </div>
                  <div className="flex items-center">
                    <Home className="mr-2" style={{ color: "#722ed1" }} />
                    <span>Delivery at: {deliveryLog?.createdAt}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2" style={{ color: "#722ed1" }} />
                    <span>Created At: {deliveryLog?.createdAt}</span>
                  </div>
                </Space>

                {/* Buttons based on deliveryLog.status */}
                <div className="mt-6 flex justify-between">
                  {deliveryLog?.status === null && (
                    <Button
                      type="default"
                      className="mr-2"
                      size="large"
                      onClick={handleUpdateDelivering}
                      style={{
                        backgroundColor: "white",
                        borderColor: "#1890ff",
                        color: "#1890ff",
                      }}
                    >
                      Update Status to Delivering
                    </Button>
                  )}

                  {deliveryLog?.status === "Delivering" && (
                    <Space>
                      <Button
                        type="default"
                        size="large"
                        onClick={() => setIsSuccessModalOpen(true)}
                        style={{
                          backgroundColor: "white",
                          borderColor: "#52c41a",
                          color: "#52c41a",
                        }}
                      >
                        Update Status to Success
                      </Button>
                      <Button
                        type="default"
                        size="large"
                        onClick={() => setIsFailedModalOpen(true)}
                        style={{
                          backgroundColor: "white",
                          borderColor: "#f5222d",
                          color: "#f5222d",
                        }}
                      >
                        Update Status to Fail
                      </Button>
                    </Space>
                  )}
                </div>
              </Card>
            </div>
          </div>

          {/* Modal for Confirm Success */}
          <Modal
            title="Confirm Success"
            open={isSuccessModalOpen}
            onOk={handleUpdateSuccess}
            onCancel={() => setIsSuccessModalOpen(false)}
            okText="Confirm"
            cancelText="Cancel"
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleFileChange}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
          </Modal>

          {/* Modal for Confirm Fail */}
          <Modal
            title="Confirm Fail"
            open={isFailedModalOpen}
            onOk={handleUpdateFail}
            onCancel={() => setIsFailedModalOpen(false)}
            okText="Confirm"
            cancelText="Cancel"
          >
            <Form layout="vertical">
              <Form.Item label="Upload Proof">
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleFileChange}
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
              </Form.Item>
              <Form.Item label="Reason for Failure" required>
                <Input.TextArea
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please provide a reason for failure"
                />
              </Form.Item>
            </Form>
          </Modal>

          <Modal
            open={previewOpen}
            title="Preview"
            footer={null}
            onCancel={() => setPreviewOpen(false)}
          >
            <img alt="example" style={{ width: "100%" }} src={previewImage} />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetail;
