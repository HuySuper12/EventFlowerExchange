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
} from "antd";
import { Clock, Phone, User, Camera, Home } from "lucide-react";
import Header from "../../component/Header_delivery";
import SidebarDelivery from "../../component/Sidebar_delivery";
import api from "../../config/axios";
import uploadFile from "../../utils/upload";
import { toast } from "react-toastify";

const { Step } = Steps;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const DeliveryDetail = () => {
  const [reason, setReason] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [deliveryLog, setDeliveryLog] = useState(null);
  const email = sessionStorage.getItem("email");
  const [accountData, setAccountData] = useState(null);
  const [productData, setProductData] = useState([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isFailedModalOpen, setIsFailedModalOpen] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [deliveryTime, setDeliveryTime] = useState(null);
  const [buyerAccount, setBuyerAccount] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [deliveryStatus, setDeliveryStatus] = useState(null);
  const [sellerDetail, setSellerDetail] = useState(null);
  const [isCancelOrderModalOpen, setIsCancelOrderModalOpen] = useState(false);
  const fetchDeliveryLog = async () => {
    try {
      const response = await api.get(
        `DeliveryLog/ViewDeliveryLogDeliveringByShipperEmail`,
        {
          params: { email: email },
        }
      );
      setDeliveryLog(response.data);
      updateStep(response.data.status);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching delivery log:", error);
    }
  };

  const fetchAccountData = async () => {
    try {
      const response = await api.get(`Account/GetAccountByEmail/${email}`);
      setAccountData(response.data);
    } catch (error) {
      console.error("Error fetching account data:", error);
    }
  };

  const fetchOrderDetails = async () => {
    if (!deliveryLog?.orderId) return;
    try {
      const response = await api.get(`Order/ViewOrderDetail`, {
        params: { id: deliveryLog.orderId },
      });
      setProductData(response.data);
      console.log("Product Data:", response.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  useEffect(() => {
    fetchDeliveryLog();
  }, [email]);

  useEffect(() => {
    fetchAccountData();
  }, [email]);

  useEffect(() => {
    fetchOrderDetails();
  }, [deliveryLog?.orderId]);

  const updateStep = (status) => {
    switch (status) {
      case null:
        setCurrentStep(1);
        break;
      case "Delivering":
        setCurrentStep(2);
        break;
      case "Success":
        setCurrentStep(3);
        break;
      case "Fail":
        setCurrentStep(3);
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
        fetchDeliveryLog();
        fetchAccountData();
        fetchOrderDetails();
        setDeliveryStatus("success");
        setTimeout(() => {
          window.location.reload();
        }, 10000);
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

      console.log(response.data);

      if (response.data == true) {
        message.success("Order marked as failed!");
        setIsFailedModalOpen(false);
        console.log(response.data);
        fetchDeliveryLog();
        fetchAccountData();
        fetchOrderDetails();
        setDeliveryStatus("fail");
        setTimeout(() => {
          window.location.reload();
        }, 10000);
      }
    } catch (error) {
      console.error("Error updating delivery log:", error);
      message.error("Failed to update delivery status.");
    }
  };

  //Handle cancel order
  const handleCancelOrder = async () => {
    const role = sessionStorage.getItem("role");
    try {
      const response = await api.put(`Order/CancelOrderByBuyer`, null, {
        params: {
          orderId: deliveryLog?.orderId,
          reason: reason,
          role: role,
        },
      });
      console.log(response.data);
      if (response.data === true) {
        message.success("Order canceled successfully!");
        setIsCancelOrderModalOpen(false);
      }
    } catch (error) {
      console.error("Error canceling order:", error);
      message.error("Failed to cancel order.");
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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date";
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    return date.toLocaleDateString("en-US", options);
  };

  const formatCurrency = (amount) => {
    const validAmount = amount !== undefined ? amount : 0;
    return (
      validAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ"
    );
  };

  const fetchDeliveryTime = async () => {
    try {
      const response = await api.get(`DeliveryLog/ViewDeliveryTime`, {
        params: { id: deliveryLog?.orderId },
      });
      console.log("delivery time:", response.data);
      setDeliveryTime(response.data);

      // Handle the response data as needed
    } catch (error) {
      console.error("Error fetching delivery time:", error);
    }
  };

  useEffect(() => {
    const fetchBuyerAccountByOrderId = async () => {
      try {
        const response = await api.get(`Account/ViewAccountBuyerByOrderId`, {
          params: { orderId: deliveryLog.orderId },
        });
        setBuyerAccount(response.data);
        console.log("Buyer Account:", response.data);
      } catch (error) {
        console.error("Error fetching buyer account:", error);
      }
    };

    fetchBuyerAccountByOrderId(deliveryLog?.orderId);
  }, [deliveryLog?.orderId]);

  useEffect(() => {
    const fetchBuyerOrderByOrderId = async () => {
      try {
        const response = await api.get(`Order/SearchOrderByOrderId`, {
          params: { orderId: deliveryLog?.orderId },
        });
        setOrderDetails(response.data);
        console.log("Order Details:", response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchBuyerOrderByOrderId(deliveryLog?.orderId); // Gọi API khi component được mount
  }, [deliveryLog?.orderId]);

  useEffect(() => {
    fetchDeliveryTime();
  }, [deliveryLog?.orderId]);

  const viewSellerDetail = async () => {
    if (!productData || productData.length === 0) return; // Check if productData is available
    const sellerId = productData[0]?.sellerId; // Access the first product's sellerId
    console.log("Seller ID:", sellerId);
    try {
      const response = await api.get(`Account/GetAccountById/${sellerId}`);
      setSellerDetail(response.data);
      console.log("Seller Detail:", response.data);
    } catch (error) {
      console.error("Error fetching seller details:", error);
    }
  };

  useEffect(() => {
    if (productData.length > 0) {
      viewSellerDetail();
    }
  }, [productData]);

  console.log("Delivery Log:", deliveryLog);
  console.log("Delivery Time:", deliveryTime);
  console.log("Current Step:", currentStep);
  console.log("Delivery Status:", deliveryStatus);

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
              <div className="mt-4 text-lg font-semibold">
                {" "}
                Total: {formatCurrency(orderDetails?.totalPrice)}
              </div>
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
                    title="Pending"
                    description={formatDate(deliveryLog?.createdAt)}
                    status={deliveryStatus ? "finish" : "process"}
                    icon={
                      <div
                        style={{
                          backgroundColor:
                            deliveryStatus === "success" ||
                            deliveryLog?.status === null ||
                            deliveryLog?.status === "Delivering"
                              ? "#52c41a"
                              : "#d9d9d9",
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
                    title="Take Order"
                    description={
                      deliveryTime?.deliveringTime
                        ? formatDate(deliveryTime.deliveringTime)
                        : ""
                    }
                    status={deliveryStatus ? "finish" : "wait"}
                    icon={
                      <div
                        style={{
                          backgroundColor:
                            deliveryStatus === "success" ||
                            deliveryLog?.status === "Delivering"
                              ? "#52c41a"
                              : "#d9d9d9",
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
                    title={deliveryStatus === "fail" ? "Fail" : "Delivered"}
                    description={deliveryTime?.successOrFailTime}
                    status="finish"
                    icon={
                      <div
                        style={{
                          backgroundColor:
                            deliveryStatus === "success"
                              ? "#52c41a"
                              : deliveryStatus === "fail"
                              ? "#f5222d"
                              : "#d9d9d9",
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

                  <div className="text-lg font-semibold justify-center ml-[220px]">
                    {" "}
                    Information of Seller
                  </div>
                  <div className="flex items-center">
                    <Phone className="mr-2" style={{ color: "#52c41a" }} />
                    <span>Phone: {sellerDetail?.phoneNumber}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="mr-2" style={{ color: "#f5222d" }} />
                    <span>Customer: {sellerDetail?.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Home className="mr-2" style={{ color: "#722ed1" }} />
                    <span>Take Order at: {sellerDetail?.address}</span>
                  </div>

                  <div className="text-lg font-semibold justify-center ml-[200px]">
                    {" "}
                    Information of Customer
                  </div>
                  <div className="flex items-center">
                    <Phone className="mr-2" style={{ color: "#52c41a" }} />
                    <span>Phone: {orderDetails?.phoneNumber}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="mr-2" style={{ color: "#f5222d" }} />
                    <span>Customer: {buyerAccount?.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Home className="mr-2" style={{ color: "#722ed1" }} />
                    <span>Delivery at: {orderDetails?.deliveredAt}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2" style={{ color: "#722ed1" }} />
                    <span>
                      Created At: {formatDate(deliveryLog?.createdAt)}
                    </span>
                  </div>
                </Space>

                {/* Buttons based on deliveryLog.status */}
                <div className="mt-6 flex justify-between">
                  {deliveryLog?.status === null && (
                    <Space>
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
                      <Button
                        type="default"
                        className="mr-2"
                        size="large"
                        onClick={() => setIsCancelOrderModalOpen(true)}
                        danger
                      >
                        Cancel Order
                      </Button>
                    </Space>
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

          {/* Modal for cancel order */}
          <Modal
            title="Cancel Order"
            open={isCancelOrderModalOpen}
            onOk={handleCancelOrder}
            onCancel={() => setIsCancelOrderModalOpen(false)}
            okText="Confirm"
            cancelText="Cancel"
          >
            <Form layout="vertical">
              <Form.Item label="Reason for Failure" required>
                <Input.TextArea
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please provide a reason for cancel"
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
