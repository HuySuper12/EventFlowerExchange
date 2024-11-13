import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Space,
  Modal,
  Button,
  message,
  Pagination,
  List,
  Input,
  Image,
} from "antd";
import { ExportOutlined } from "@ant-design/icons";
import api from "../../config/axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [shippers, setShippers] = useState([]);
  const [address, setAddress] = useState(""); // State for address input
  const [assignedShippers, setAssignedShippers] = useState([]); // Track assigned shippers

  const pageSize = 8;

  // Modal state for checking
  const [isCheckModalVisible, setIsCheckModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  // Fetch data from API

  const fetchOrders = async () => {
    try {
      const response = await api.get("Order/ViewAllOrder");
      setOrders(response.data);
      setFilteredOrders(response.data);
      // Set assigned shippers based on orders
      const assigned = response.data
        .filter((order) => order.status === "Take Over")
        .map((order) => order.deliveryPersonEmail); // Assuming deliveryPersonEmail is the identifier
      setAssignedShippers(assigned);
      console.log(response.data.reverse());
    } catch (error) {
      console.error("Error fetching orders: ", error);
      message.error("Failed to load orders.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleFilter = (status) => {
    const updatedStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];

    setSelectedStatuses(updatedStatuses);

    if (updatedStatuses.length === 0) {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter((order) => updatedStatuses.includes(order.status))
      );
    }
  };

  const getButtonClasses = (status) => {
    const baseClasses = "px-4 py-2 border rounded";
    const isSelected = selectedStatuses.includes(status);

    switch (status) {
      case "Pending":
        return `${baseClasses} ${
          isSelected
            ? "border-yellow-400 text-yellow-400 hover:border-yellow-500 hover:text-yellow-500"
            : "border-gray-300 text-gray-700"
        }`;
      case "Success":
        return `${baseClasses} ${
          isSelected
            ? "border-green-400 text-green-400 hover:border-green-500 hover:text-green-500"
            : "border-gray-300 text-gray-700"
        }`;
      case "Take Over":
        return `${baseClasses} ${
          isSelected
            ? "border-blue-400 text-blue-400 hover:border-blue-500 hover:text-blue-500"
            : "border-gray-300 text-gray-700"
        }`;
      case "Delivering":
        return `${baseClasses} ${
          isSelected
            ? "border-purple-400 text-purple-400 hover:border-purple-500 hover:text-purple-500"
            : "border-gray-300 text-gray-700"
        }`;
      default:
        return baseClasses;
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Delivery Address",
      dataIndex: "deliveredAt",
      key: "deliveredAt",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => formatCurrency(price),
      sorter: (a, b) => a.totalPrice - b.totalPrice,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (value) => formatDate(value),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "Pending"
              ? "gold"
              : status === "Success"
              ? "green"
              : status === "Delivering"
              ? "purple"
              : status === "Take over"
              ? "blue"
              : "red"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => showOrderDetails(record)}>View Details</Button>
          {record.status === "Pending" && (
            <Button onClick={() => handleCheck(record)}>Check</Button>
          )}
          {record.status === "Pending" && (
            <Button danger onClick={() => SendNotifyNoShipper(record)}>
              Notify No Shipper
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const showOrderDetails = async (order) => {
    const getProgressStepClass = (step) => {
      if (order.status === "Check Out" && step === 1) return "bg-blue-600";
      if (order.status === "Pending" && step === 1) return "bg-blue-600";
      if (order.status === "Take over" && (step === 2 || step === 1))
        return "bg-blue-600";

      if (
        order.status === "Delivering" &&
        (step === 1 || step === 2 || step === 3)
      )
        return "bg-blue-600";
      if (order.status === "Success" && step <= 4) return "bg-blue-600";
      if (order.status === "Fail" && step <= 4)
        return step === 4 ? "bg-red-600" : "bg-blue-600";
      return "bg-gray-400";
    };

    try {
      const response = await api.get(`Order/ViewOrderDetail`, {
        params: {
          id: order.orderId,
        },
      });
      const orderDetails = response.data;

      const seller = await api.get(
        `Account/GetAccountById/${orderDetails[0].sellerId}`
      );
      console.log(seller.data);

      const buyer = await api.get(`Account/ViewAccountBuyerByOrderId`, {
        params: {
          orderId: order.orderId,
        },
      });

      const deliveryTimeResponse = await api.get(
        `DeliveryLog/ViewDeliveryTime`,
        {
          params: {
            id: order.orderId,
          },
        }
      );
      const orderTime = deliveryTimeResponse.data;

      Modal.info({
        title: "Order Details",
        width: "500px",
        content: (
          <div className="p-2">
            <div className="mt-5">
              <p className="text-lg font-bold text-center">Buyer Information</p>
              <p className="text-md font-medium">
                Buyer Name: {buyer.data.name}
              </p>
              <p className="text-md font-medium">
                Phone Number Buyer: {order.phoneNumber}
              </p>
              <p className="text-md font-medium">
                Delivered At: {order.deliveredAt}
              </p>


              <p className="text-lg font-bold text-center">
                Seller Information
              </p>
              <p className="text-md font-medium">
                Seller Name: {seller.data.name}
              </p>
              <p className="text-md font-medium">
                Phone Number Seller: {seller.data.phoneNumber}
              </p>
              <p className="text-md font-medium">
                Take Order At: {seller.data.address}
              </p>
            </div>

            <p className="text-md font-medium">Reason: {order.issueReport}</p>

            {/* Thêm tiến trình giao hàng vào dưới phần chi tiết sản phẩm */}
            <div className="mt-5">
              <ul className="flex items-center justify-between relative">
                {/* Thanh tiến trình */}
                <div
                  className={`absolute top-3 left-0 ${
                    status === "Success" || status === "Fail"
                      ? "w-full"
                      : status === "Delivering"
                      ? "w-3/4"
                      : status === "Pending"
                      ? "w-1/4"
                      : status === "Take over"
                      ? "w-2/4"
                      : "w-1/4"
                  } h-1 bg-blue-600`}
                ></div>

                {/* Các bước tiến trình */}
                <li className="relative w-1/4 flex flex-col items-start text-blue-600">
                  <div
                    className={`flex items-center justify-center w-7 h-7 text-white rounded-full ${getProgressStepClass(
                      1
                    )}`}
                  >
                    1
                  </div>
                  <span className="mt-3 ml-[-10px]">Check Out</span>
                  <p className="text-gray-500 ml-[-15px]">
                    {order?.createdAt ? (
                      <span>{formatDate(order.createdAt)}</span>
                    ) : (
                      <>
                        <span>On</span> <br />
                        <span>Time</span>
                      </>
                    )}
                  </p>
                </li>

                <li className="relative w-1/4 flex flex-col items-center text-blue-600">
                  <div
                    className={`flex items-center justify-center w-7 h-7 text-white rounded-full ml-[-30px] ${getProgressStepClass(
                      2
                    )}`}
                  >
                    2
                  </div>
                  <span className="mt-3 ml-[-30px]">Pending</span>
                  <p className="text-gray-500 ml-[5px]">
                    {orderTime.takeOverTime ? (
                      <span>{formatDate(orderTime.takeOverTime)}</span>
                    ) : (
                      <>
                        <span className="ml-[-30px]">On Time</span> <br />
                        <span className="ml-[-1050px]">.</span>
                      </>
                    )}
                  </p>
                </li>

                <li className="relative w-1/4 flex flex-col items-center text-blue-600">
                  <div
                    className={`flex items-center justify-center w-7 h-7 text-white rounded-full ${getProgressStepClass(
                      3
                    )}`}
                  >
                    3
                  </div>
                  <span className="mt-3">Delivering</span>
                  <p className="text-gray-500 ml-[20px]">
                    {orderTime.deliveringTime ? (
                      <span>{formatDate(orderTime.deliveringTime)}</span>
                    ) : (
                      <>
                        <span className="ml-[-20px]">On Time</span> <br />
                        <span className="ml-[-1050px]">.</span>
                      </>
                    )}
                  </p>
                </li>

                <li className="relative w-1/4 flex flex-col items-end text-blue-600">
                  <div
                    className={`flex items-center justify-center w-7 h-7 text-white rounded-full ${getProgressStepClass(
                      4
                    )}`}
                  >
                    4
                  </div>
                  <span className="mt-3">
                    {status === "Fail" ? "Fail" : "Success"}
                  </span>
                  <p className="text-gray-500 ml-[50px]">
                    {orderTime.successOrFailTime ? (
                      <span>{formatDate(orderTime.successOrFailTime)}</span>
                    ) : (
                      <>
                        <span className="ml-[-50px]">On Time</span> <br />
                        <span className="ml-[-1050px]">.</span>
                      </>
                    )}
                  </p>
                </li>
              </ul>
            </div>

            {/* Danh sách sản phẩm trong đơn hàng */}
            {orderDetails.map((item, index) => (
              <div
                key={index}
                className="py-4 border-t border-b text-gray-700 mt-6"
              >
                <div className="flex items-start gap-6 text-sm">
                  <img
                    src={item.productImage[0]}
                    alt={item.productName}
                    className="w-16 sm:w-20"
                  />
                  <div>
                    <p className="sm:text-base font-medium">
                      {item.productName}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                      <p className="text-lg">{formatCurrency(item.price)}</p>
                    </div>
                    <p>
                      Date:{" "}
                      <span className="text-gray-500">
                        {formatDate(item.createdAt)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <p className="text-lg ml-[220px] mt-[10px] mb-[30px] font-bold">
              Total Price: {formatCurrency(order.totalPrice)}
            </p>
          </div>
        ),
        onOk() {},
      });
    } catch (error) {
      message.error("Failed to load order details.");
      console.error("API error:", error);
    }
  };

  const handleCheck = (order) => {
    setSelectedOrder(order);
    setIsCheckModalVisible(true);
    setAddress(order.deliveredAt);
    fetchShippers(order.deliveredAt);
  };

  const fetchShippers = async (address) => {
    try {
      const response = await api.get(
        `Account/SearchShipper/${encodeURIComponent(address)}`
      );
      // Filter out shippers that are already assigned
      console.log(address);
      const availableShippers = response.data.filter(
        (shipper) => !assignedShippers.includes(shipper.email)
      );
      setShippers(availableShippers);
    } catch (error) {
      message.error("Failed to fetch shippers for the given address.");
      console.error("API error:", error);
    }
  };

  const handleSelectShipper = async (shipper) => {
    if (!selectedOrder) return;

    const deliveryLog = {
      orderId: selectedOrder.orderId,
      deliveryPersonEmail: shipper.email,
    };

    try {
      const response = await api.post(
        "DeliveryLog/CreateDeliveryLog",
        deliveryLog
      );
      if (response.data === true) {
        message.success(
          `Delivery log created for order ${selectedOrder.orderId}`
        );
        setOrders(
          orders.map((order) =>
            order.orderId === selectedOrder.orderId
              ? { ...order, status: "Take Over" }
              : order
          )
        );
        setAssignedShippers([...assignedShippers, shipper.email]);
        setIsCheckModalVisible(false);
        fetchOrders();
      } else {
        message.error("Failed to create delivery log.");
      }
    } catch (error) {
      message.error("Error creating delivery log.");
      console.error("API error:", error);
    }
  };

  const renderCheckModal = () => {
    if (!selectedOrder) return null;

    return (
      <Modal
        title={`Assign Shipper for Order - ${selectedOrder.orderId}`}
        visible={isCheckModalVisible}
        onCancel={() => setIsCheckModalVisible(false)}
        footer={null}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p>Select a shipper from the list below:</p>
          <Input
            placeholder="Enter address to search for shippers"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <List
            dataSource={shippers}
            renderItem={(shipper) => (
              <List.Item>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <div>
                    <p>
                      <strong>{shipper.name}</strong>
                    </p>
                    <p>Phone: {shipper.phoneNumber}</p>
                  </div>
                  <Button
                    type="primary"
                    onClick={() => handleSelectShipper(shipper)}
                    disabled={assignedShippers.includes(shipper.email)}
                  >
                    {assignedShippers.includes(shipper.email)
                      ? "Assigned"
                      : "Select Shipper"}
                  </Button>
                </div>
              </List.Item>
            )}
          />
        </div>
      </Modal>
    );
  };

  const SendNotifyNoShipper = async (order) => {
    try {
      // Lấy thông tin người dùng bằng orderId
      const userResponse = await api.get(`Account/ViewAccountBuyerByOrderId`, {
        params: {
          orderId: order.orderId,
        },
      });
      const userEmail = userResponse.data.email; // Giả sử email được trả về trong userResponse

      const notification = {
        userEmail: userEmail,
        content: `No shipper available for order ${order.orderId}. Please take action.`,
      };

      const response = await api.post(
        "Notification/CreateNotification",
        notification
      );
      if (response.data == true) {
        message.success(`Notification sent for order ${order.orderId}`);
      } else {
        message.error("Failed to send notification.");
      }
    } catch (error) {
      message.error("Error sending notification.");
      console.error("API error:", error);
    }
  };

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
    const validAmount = amount != null ? amount : 0;
    return (
      validAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ"
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Orders</h1>
        <div className="space-x-2">
          {["Pending", "Success", "Take Over", "Delivering"].map((status) => (
            <button
              key={status}
              onClick={() => handleFilter(status)}
              className={getButtonClasses(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={filteredOrders.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )}
        rowKey="orderId"
        pagination={false}
      />
      <div className="flex justify-between mt-4">
        <span>{filteredOrders.length} orders in total</span>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredOrders.length}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
      </div>

      {/* Render the check modal */}
      {renderCheckModal()}
    </div>
  );
};

export default Orders;
