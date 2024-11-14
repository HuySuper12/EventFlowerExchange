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
} from "antd";
import { ExportOutlined } from "@ant-design/icons";
import api from "../../config/axios";

const OrdersManager = () => {
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
  useEffect(() => {
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
            <Button danger onClick={() => showOrderDetails(record)}>
              Reject
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const getProgressStepClass = (step) => {
    if (status === "Pending" && step === 1) return "bg-blue-600";
    if (status === "Delivering" && (step === 1 || step === 2))
      return "bg-blue-600";
    if (status === "Success" && step <= 3) return "bg-blue-600";
    return "bg-gray-400";
  };

  const showOrderDetails = async (order) => {
    try {
      const response = await api.get(
        `Order/ViewOrderDetail?id=${order.orderId}`
      );
      const orderDetails = response.data;

      Modal.info({
        title: "Order Details",
        content: (
          <div className="p-5">
            <div className="mt-5">
              <p className="text-md font-medium">Buyer Name: {order.name}</p>
              <p className="text-md font-medium">
                Phone Number: {order.phoneNumber}
              </p>
              <p className="text-md font-medium">
                Delivered At: {order.deliveredAt}
              </p>
            </div>

            <div className="mt-5">
              <ul className="flex items-center justify-between relative">
                <div
                  className={`absolute top-3 left-0 ${
                    order.status === "Success"
                      ? "w-full"
                      : order.status === "Delivering"
                      ? "w-2/3"
                      : "w-1/3"
                  } h-1 bg-blue-600`}
                ></div>

                <li className="relative w-1/3 flex flex-col items-start text-blue-600">
                  <div
                    className={`flex items-center justify-center w-7 h-7 text-white rounded-full ${getProgressStepClass(
                      1
                    )}`}
                  >
                    1
                  </div>
                  <span className="mt-3 ml-[-5px]">Pending</span>
                </li>

                <li className="relative w-1/3 flex flex-col items-center text-blue-600">
                  <div
                    className={`flex items-center justify-center w-7 h-7 text-white rounded-full ${getProgressStepClass(
                      2
                    )}`}
                  >
                    2
                  </div>
                  <span className="mt-3">Delivering</span>
                </li>

                <li className="relative w-1/3 flex flex-col items-end text-gray-500">
                  <div
                    className={`flex items-center justify-center w-7 h-7 text-white rounded-full ${getProgressStepClass(
                      3
                    )}`}
                  >
                    3
                  </div>
                  <span className="mt-3">Success</span>
                </li>
              </ul>
            </div>

            {orderDetails.map((product, index) => (
              <div
                key={index}
                className="py-4 border-t border-b text-gray-700 mt-6"
              >
                <div className="flex items-start gap-6 text-sm">
                  <img
                    src={product.productImage[0]}
                    alt={product.productName}
                    className="w-16 sm:w-20"
                  />
                  <div>
                    <p className="sm:text-base font-medium">
                      {product.productName}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                      <p className="text-lg">{formatCurrency(product.price)}</p>
                    </div>
                    <p>
                      Date:{" "}
                      <span className="text-gray-500">
                        {formatDate(product.createdAt)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <p className="text-lg ml-[20px] mt-[10px] mb-[30px] font-bold">
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

  const exportToCSV = () => {
    const headers = [
      "Order ID",
      "Delivery Address",
      "Phone Number",
      "Total Price",
      "Created At",
      "Status",
    ];

    const csvRows = [
      headers.join(","), // Add headers as the first row
      ...filteredOrders.map(order => [
        order.orderId,
        order.deliveredAt,
        order.phoneNumber,
        order.totalPrice,
        formatDate(order.createdAt),
        order.status,
      ].join(","))
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "orders.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <Button
            icon={<ExportOutlined />}
            onClick={exportToCSV}
          >
            Export CSV
          </Button>
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

export default OrdersManager;
