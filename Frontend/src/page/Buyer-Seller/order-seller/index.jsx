import React, { useState, useEffect } from "react";
import api from "../../../config/axios"; // Import axios
import Header from "../../../component/header";
import Footer from "../../../component/footer";
import { Button, Modal } from "antd";
import { Tabs, Tab } from "../../../component/tab";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Order_Seller_Page() {
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [orders2, setOrders2] = useState([]);
  const [orderDetails2, setOrderDetails2] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [selectedOrderDetails, setSelectedOrderDetails] = useState({});
  const [accountBuyer, setAccountBuyer] = useState({});
  const [orderTime, setOrderTime] = useState([]);
  const navigate = useNavigate();
  const [isRated, setIsRated] = useState(false); // New state to track rating status

  useEffect(() => {
    const role = sessionStorage.getItem("role");
    if (role === "Buyer") {
      navigate("/");
    } else if (role === "Admin") {
      navigate("/admin");
    } else if (role === "Staff") {
      navigate("/staff");
    } else if (role === "Shipper") {
      navigate("/delivery-detail");
    } else if (!role) {
      navigate("/login");
      toast.error("Please login first.");
    }
  }, [navigate]);

  // Fetch all orders
  useEffect(() => {
    const userEmail = sessionStorage.getItem("email");
    console.log("User Email:", userEmail);
    if (!userEmail) {
      console.error("No email found in session storage");
      return;
    }

    (async () => {
      try {
        const response = await api.get("Order/ViewOrderBySellerEmail", {
          params: { email: userEmail },
        });
        console.log("API response:", response.data); // Kiểm tra dữ liệu trả về
        if (Array.isArray(response.data)) {
          const filteredOrders = response.data.filter(
            (order) => order.status !== null
          );
          setOrders(filteredOrders.reverse()); // Sử dụng response.data
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders", error);
      }
    })();
  }, []);

  useEffect(() => {
    const fetchOrdersByStatus = async () => {
      const userEmail = sessionStorage.getItem("email");
      console.log("User Email:", userEmail);
      if (!userEmail) {
        console.error("No email found in session storage");
        return;
      }

      try {
        const response = await api.get("Order/ViewOrderByStatusAndBuyerEmail", {
          params: { email: userEmail, status: "null" },
        });
        console.log("API response:", response.data);
        if (Array.isArray(response.data)) {
          setOrders2(response.data.reverse());
        } else {
          setOrders2([]);
        }
      } catch (error) {
        console.error("Error fetching orders", error);
      }
    };

    fetchOrdersByStatus();
  }, []);

  useEffect(() => {
    const fetchAccountBuyer = async () => {
      const userEmail = sessionStorage.getItem("email");
      const encodedEmail = encodeURIComponent(userEmail);

      console.log("User Email:", userEmail);
      if (!userEmail) {
        console.error("No email found in session storage");
        return;
      }

      try {
        const response = await api.get(
          `Account/GetAccountByEmail/${encodedEmail}`
        );
        console.log("API response:", response.data);
        setAccountBuyer(response.data);
      } catch (error) {
        console.error("Error fetching account", error);
      }
    };

    fetchAccountBuyer();
  }, []);

  // Fetch order details for each order
  useEffect(() => {
    const fetchOrderDetails2 = async () => {
      setLoading(true);
      try {
        const details = await Promise.all(
          orders2.map((order) =>
            api
              .get("Order/ViewOrderDetail", {
                params: { id: order.orderId },
              })
              .then((response) => {
                return response.data.map((product) => ({
                  ...product,
                  orderId: order.orderId,
                }));
              })
          )
        );
        const allProducts = details.flat();
        setOrderDetails2(allProducts);
      } catch (error) {
        console.error("Error fetching order details", error);
      } finally {
        setLoading(false);
      }
    };

    if (orders2.length > 0) {
      fetchOrderDetails2();
    }
  }, [orders2]);

  // Fetch order details for each order
  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const details = await Promise.all(
          orders.map((order) =>
            api
              .get("Order/ViewOrderDetail", {
                params: { id: order.orderId },
              })
              .then((response) => {
                // Thêm orderId vào từng sản phẩm
                return response.data.map((product) => ({
                  ...product,
                  orderId: order.orderId,
                }));
              })
          )
        );
        const allProducts = details.flat();
        setOrderDetails(allProducts);
      } catch (error) {
        console.error("Error fetching order details", error);
      } finally {
        setLoading(false);
      }
    };

    if (orders.length > 0) {
      fetchOrderDetails();
    }
  }, [orders]);

  console.log(orders);

  // Group products by orderId
  const groupedOrderDetails = orderDetails.reduce((acc, item) => {
    if (!acc[item.orderId]) {
      acc[item.orderId] = [];
    }
    acc[item.orderId].push(item);
    return acc;
  }, {});

  const groupedOrderDetails2 = orderDetails2.reduce((acc, item) => {
    if (!acc[item.orderId]) {
      acc[item.orderId] = [];
    }
    acc[item.orderId].push(item);
    return acc;
  }, {});

  const showOrderDetails = async (orderId, status) => {
    const order = orders.find((o) => o.orderId === orderId);
    const name = await fetchAccountByOrderId(orderId);
    console.log("Order found:", order); // Debugging line
    setSelectedOrder(groupedOrderDetails[orderId]);
    setSelectedOrderDetails({
      deliveredAt: order.deliveredAt,
      totalPrice: order.totalPrice,
      phoneNumber: order.phoneNumber,
      orderId: order.orderId, // Ensure orderId is included
      name, // Add userName to the details
      createdAt: order.createdAt, // Ensure createdAt is included
      issueReport: order.issueReport, // Ensure issueReport is included
    });
    setStatus(status);

    // Fetch and set order time
    try {
      const response = await api.get("DeliveryLog/ViewDeliveryTime", {
        params: { id: orderId },
      });
      setOrderTime(response.data);
    } catch (error) {
      console.error("Error fetching order time", error);
    }

    setIsModalOpen(true);
  };

  const showOrderDetails2 = (orderId, status) => {
    const order = orders2.find((o) => o.orderId === orderId);
    setSelectedOrder(groupedOrderDetails2[orderId]);
    setSelectedOrderDetails({
      deliveredAt: order.deliveredAt,
      totalPrice: order.totalPrice,
      phoneNumber: order.phoneNumber,
    });
    setStatus(status);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getProgressStepClass = (step) => {
    if (status === "Check Out" && step === 1) return "bg-blue-600";
    if (status === "Pending" && step === 1) return "bg-blue-600";
    if (status === "Take over" && (step === 2 || step === 1))
      return "bg-blue-600";

    if (status === "Delivering" && (step === 1 || step === 2 || step === 3))
      return "bg-blue-600";
    if (status === "Success" && step <= 4) return "bg-blue-600";
    if (status === "Fail" && step <= 4)
      return step === 4 ? "bg-red-600" : "bg-blue-600";
    return "bg-gray-400";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "";
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

  const handleAccept = async (orderId) => {
    const order = orders2.find((o) => o.orderId === orderId);

    if (accountBuyer.balance < order.totalPrice) {
      navigate("/wallet-customer");
      toast.error("Your balance is not enough");
      return;
    }

    try {
      const response = await api.put(
        "Order/UpdateOrderStatusCreatedBySeller",
        null,
        {
          params: {
            orderId: orderId,
            status: "Accepted",
          },
        }
      );
      if (response.data === true) {
        toast.success("Accept order successfully");
        window.location.reload();
      } else {
        toast.error("Accept order failed");
      }
    } catch (error) {
      console.error("Error updating order status", error);
      toast.error("Error updating order status");
    }
  };

  const handleReject = async (orderId) => {
    const order = orders2.find((o) => o.orderId === orderId);

    const response = await api.put(
      "Order/UpdateOrderStatusCreatedBySeller",
      null,
      {
        params: {
          orderId: orderId,
          status: "Rejected",
        },
      }
    );
    if (response.data === true) {
      toast.success("Reject order successfully");
      window.location.reload();
    } else {
      toast.error("Reject order failed");
    }
  };

  const handleCancelOrder = async (orderId) => {
    navigate(`/cancelorder/${orderId}`);
  };

  const fetchAccountByOrderId = async (orderId) => {
    try {
      const response = await api.get("Account/ViewAccountBuyerByOrderId", {
        params: { orderId },
      });
      console.log("API response:", response.data.name); // Kiểm tra dữ liệu trả về
      return response.data.name; // Lấy thuộc tính name
    } catch (error) {
      console.error("Error fetching account by orderId", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchOrderTime = async () => {
      setLoading(true);
      try {
        const response = await api.get("DeliveryLog/ViewDeliveryTime", {
          params: {
            id: orders.orderId,
          },
        });
        setOrderTime(response.data);
      } catch (error) {
        console.error("Error fetching order details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderTime();
  }, [orders]);

  const handleCheckRatingOrderByUserEmail = async () => {
    const email = sessionStorage.getItem("email");
    try {
      const response = await api.get("Rating/CheckRatingOrderByUserEmail", {
        params: {
          buyerEmail: email,
          orderId: selectedOrderDetails.orderId,
        },
      });
      console.log("API response:", response.data);
      setIsRated(response.data); // Update state based on API response
    } catch (error) {
      console.error("Error fetching rating", error);
    }
  };

  // Call this function when the modal is opened
  useEffect(() => {
    if (isModalOpen) {
      handleCheckRatingOrderByUserEmail();
    }
  }, [isModalOpen, selectedOrderDetails.orderId]);

  return (
    <>
      <Header />

      <div className="border-t pt-16 ml-[300px] mr-[300px]">
        <div className="text-2xl">
          <div className="inline-flex items-center gap-2 mb-2 mt-10">
            <p className="prata-regular text-3xl">My Orders</p>
            <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
          </div>
        </div>
      </div>

      <div className="ml-[300px] w-[1100px]">
        <Tabs>
          <Tab label="Your Orders Requested">
            <div className="py-4">
              {/* Display products for each order */}
              <div>
                {loading ? (
                  <p>Loading...</p>
                ) : orders2.length > 0 ? (
                  orders2.map((order2) => (
                    <div key={order2.orderId} className="mb-8">
                      <h3 className="text-xl font-bold mb-4">
                        Order ID: {order2.orderId}
                      </h3>
                      {groupedOrderDetails2[order2.orderId]?.map(
                        (item, index) => (
                          <div
                            key={index}
                            className={`py-4 text-gray-700 ${
                              index === 0 ? "border-t" : ""
                            } ${
                              index ===
                              groupedOrderDetails2[order2.orderId].length - 1
                                ? "border-b"
                                : ""
                            }`}
                          >
                            {/* Product details */}
                            <div className="flex items-start justify-between gap-6 text-sm">
                              <div className="flex items-start gap-6">
                                <img
                                  src={item.productImage[0]}
                                  alt={item.productName}
                                  className="w-16 sm:w-20"
                                />
                                <div className="flex-1">
                                  <p className="sm:text-base font-medium">
                                    {item.productName}
                                  </p>
                                  <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                                    <p className="text-lg">
                                      {formatCurrency(item.price)}
                                    </p>
                                    <p>Quantity: {item.quantity}</p>
                                  </div>
                                  <p>
                                    Date:{" "}
                                    <span className="text-gray-500">
                                      {formatDate(item.createdAt)}
                                    </span>
                                  </p>
                                </div>
                              </div>

                              {index === 0 && (
                                <div className="flex items-center gap-2">
                                  <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                                  <p className="text-sm md:text-base">
                                    {order2.status || "Pending"}
                                  </p>
                                </div>
                              )}

                              {index === 0 && (
                                <div className="flex items-center gap-2">
                                  <Button
                                    onClick={() =>
                                      showOrderDetails2(
                                        order2.orderId,
                                        order2.status
                                      )
                                    }
                                  >
                                    CheckOrder
                                  </Button>
                                  <Button
                                    onClick={() => handleAccept(order2.orderId)}
                                  >
                                    Accept
                                  </Button>
                                  <Button
                                    onClick={() => handleReject(order2.orderId)}
                                  >
                                    Reject
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ))
                ) : (
                  <p>No products found.</p>
                )}
              </div>
            </div>
          </Tab>

          <Tab label="On Pending">
            <div className="py-4 ">
              {/* Hiển thị sản phẩm theo từng đơn hàng */}
              <div>
                {loading ? (
                  <p>Loading...</p>
                ) : orders.length > 0 ? (
                  orders
                    .filter((order) => order.status === "Pending") // Filter orders by status
                    .map((order) => (
                      <div key={order.orderId} className="mb-8">
                        <h3 className="text-xl font-bold mb-4">
                          Order ID: {order.orderId}
                        </h3>
                        {groupedOrderDetails[order.orderId]?.map(
                          (item, index) => (
                            <div
                              key={index}
                              className={`py-4 text-gray-700 ${
                                index === 0 ? "border-t" : ""
                              } ${
                                index ===
                                groupedOrderDetails[order.orderId].length - 1
                                  ? "border-b"
                                  : ""
                              }`}
                            >
                              {/* Product details */}
                              <div className="flex items-start justify-between gap-6 text-sm">
                                <Link to={`/product-page/${item.productId}`}>
                                  <div className="flex items-start gap-6">
                                    <img
                                      src={item.productImage[0]}
                                      alt={item.productName}
                                      className="w-16 sm:w-20"
                                    />
                                    <div className="flex-1">
                                      <p className="sm:text-base font-medium">
                                        {item.productName}
                                      </p>
                                      <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                                        <p className="text-lg">
                                          {formatCurrency(item.price)}
                                        </p>
                                      </div>
                                      <p>
                                        Date:{" "}
                                        <span className="text-gray-500">
                                          {formatDate(item.createdAt)}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </Link>

                                {index === 0 && (
                                  <div className="flex items-center gap-2">
                                    <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                                    <p className="text-sm md:text-base">
                                      {order.status}
                                    </p>
                                  </div>
                                )}

                                {index === 0 && (
                                  <Button
                                    onClick={() =>
                                      showOrderDetails(
                                        order.orderId,
                                        order.status
                                      )
                                    }
                                  >
                                    Track Order
                                  </Button>
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ))
                ) : (
                  <p>No products found.</p>
                )}
              </div>
            </div>
          </Tab>

          <Tab label="Take Over">
            <div className="py-4 ">
              {/* Hiển thị sản phẩm theo từng đơn hàng */}
              <div>
                {loading ? (
                  <p>Loading...</p>
                ) : orders.length > 0 ? (
                  orders
                    .filter((order) => order.status === "Take over") // Filter orders by status
                    .map((order) => (
                      <div key={order.orderId} className="mb-8">
                        <h3 className="text-xl font-bold mb-4">
                          Order ID: {order.orderId}
                        </h3>
                        {groupedOrderDetails[order.orderId]?.map(
                          (item, index) => (
                            <div
                              key={index}
                              className={`py-4 text-gray-700 ${
                                index === 0 ? "border-t" : ""
                              } ${
                                index ===
                                groupedOrderDetails[order.orderId].length - 1
                                  ? "border-b"
                                  : ""
                              }`}
                            >
                              {/* Product details */}
                              <div className="flex items-start justify-between gap-6 text-sm">
                                <Link to={`/product-page/${item.productId}`}>
                                  <div className="flex items-start gap-6">
                                    <img
                                      src={item.productImage[0]}
                                      alt={item.productName}
                                      className="w-16 sm:w-20"
                                    />
                                    <div className="flex-1">
                                      <p className="sm:text-base font-medium">
                                        {item.productName}
                                      </p>
                                      <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                                        <p className="text-lg">
                                          {formatCurrency(item.price)}
                                        </p>
                                      </div>
                                      <p>
                                        Date:{" "}
                                        <span className="text-gray-500">
                                          {formatDate(item.createdAt)}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </Link>

                                {index === 0 && (
                                  <div className="flex items-center gap-2">
                                    <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                                    <p className="text-sm md:text-base">
                                      {order.status}
                                    </p>
                                  </div>
                                )}

                                {index === 0 && (
                                  <Button
                                    onClick={() =>
                                      showOrderDetails(
                                        order.orderId,
                                        order.status
                                      )
                                    }
                                  >
                                    Track Order
                                  </Button>
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ))
                ) : (
                  <p>No products found.</p>
                )}
              </div>
            </div>
          </Tab>

          <Tab label="Delivering">
            <div className="py-4 ">
              {/* Hiển thị sản phẩm theo từng đơn hàng */}
              <div>
                {loading ? (
                  <p>Loading...</p>
                ) : orders.length > 0 ? (
                  orders
                    .filter((order) => order.status === "Delivering") // Filter orders by status
                    .map((order) => (
                      <div key={order.orderId} className="mb-8">
                        <h3 className="text-xl font-bold mb-4">
                          Order ID: {order.orderId}
                        </h3>
                        {groupedOrderDetails[order.orderId]?.map(
                          (item, index) => (
                            <div
                              key={index}
                              className={`py-4 text-gray-700 ${
                                index === 0 ? "border-t" : ""
                              } ${
                                index ===
                                groupedOrderDetails[order.orderId].length - 1
                                  ? "border-b"
                                  : ""
                              }`}
                            >
                              {/* Product details */}
                              <div className="flex items-start justify-between gap-6 text-sm">
                                <Link to={`/product-page/${item.productId}`}>
                                  <div className="flex items-start gap-6">
                                    <img
                                      src={item.productImage[0]}
                                      alt={item.productName}
                                      className="w-16 sm:w-20"
                                    />
                                    <div className="flex-1">
                                      <p className="sm:text-base font-medium">
                                        {item.productName}
                                      </p>
                                      <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                                        <p className="text-lg">
                                          {formatCurrency(item.price)}
                                        </p>
                                      </div>
                                      <p>
                                        Date:{" "}
                                        <span className="text-gray-500">
                                          {formatDate(item.createdAt)}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </Link>

                                {index === 0 && (
                                  <div className="flex items-center gap-2">
                                    <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                                    <p className="text-sm md:text-base">
                                      {order.status}
                                    </p>
                                  </div>
                                )}

                                {index === 0 && (
                                  <Button
                                    onClick={() =>
                                      showOrderDetails(
                                        order.orderId,
                                        order.status
                                      )
                                    }
                                  >
                                    Track Order
                                  </Button>
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ))
                ) : (
                  <p>No products found.</p>
                )}
              </div>
            </div>
          </Tab>

          <Tab label="Success">
            <div className="py-4 ">
              {/* Hiển thị sản phẩm theo từng đơn hàng */}
              <div>
                {loading ? (
                  <p>Loading...</p>
                ) : orders.length > 0 ? (
                  orders
                    .filter((order) => order.status === "Success") // Filter orders by status
                    .map((order) => (
                      <div key={order.orderId} className="mb-8">
                        <h3 className="text-xl font-bold mb-4">
                          Order ID: {order.orderId}
                        </h3>
                        {groupedOrderDetails[order.orderId]?.map(
                          (item, index) => (
                            <div
                              key={index}
                              className={`py-4 text-gray-700 ${
                                index === 0 ? "border-t" : ""
                              } ${
                                index ===
                                groupedOrderDetails[order.orderId].length - 1
                                  ? "border-b"
                                  : ""
                              }`}
                            >
                              {/* Product details */}
                              <div className="flex items-start justify-between gap-6 text-sm">
                                <Link to={`/product-page/${item.productId}`}>
                                  <div className="flex items-start gap-6">
                                    <img
                                      src={item.productImage[0]}
                                      alt={item.productName}
                                      className="w-16 sm:w-20"
                                    />
                                    <div className="flex-1">
                                      <p className="sm:text-base font-medium">
                                        {item.productName}
                                      </p>
                                      <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                                        <p className="text-lg">
                                          {formatCurrency(item.price)}
                                        </p>
                                      </div>
                                      <p>
                                        Date:{" "}
                                        <span className="text-gray-500">
                                          {formatDate(item.createdAt)}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </Link>

                                {index === 0 && (
                                  <div className="flex items-center gap-2">
                                    <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                                    <p className="text-sm md:text-base">
                                      {order.status}
                                    </p>
                                  </div>
                                )}

                                {index === 0 && (
                                  <Button
                                    onClick={() =>
                                      showOrderDetails(
                                        order.orderId,
                                        order.status
                                      )
                                    }
                                  >
                                    Track Order
                                  </Button>
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ))
                ) : (
                  <p>No products found.</p>
                )}
              </div>
            </div>
          </Tab>

          <Tab label="Fail">
            <div className="py-4 ">
              {/* Hiển thị sản phẩm theo từng đơn hàng */}
              <div>
                {loading ? (
                  <p>Loading...</p>
                ) : orders.length > 0 ? (
                  orders
                    .filter((order) => order.status === "Canceled") // Filter orders by status
                    .map((order) => (
                      <div key={order.orderId} className="mb-8">
                        <h3 className="text-xl font-bold mb-4">
                          Order ID: {order.orderId}
                        </h3>
                        {groupedOrderDetails[order.orderId]?.map(
                          (item, index) => (
                            <div
                              key={index}
                              className={`py-4 text-gray-700 ${
                                index === 0 ? "border-t" : ""
                              } ${
                                index ===
                                groupedOrderDetails[order.orderId].length - 1
                                  ? "border-b"
                                  : ""
                              }`}
                            >
                              {/* Product details */}
                              <div className="flex items-start justify-between gap-6 text-sm">
                                <Link to={`/product-page/${item.productId}`}>
                                  <div className="flex items-start gap-6">
                                    <img
                                      src={item.productImage[0]}
                                      alt={item.productName}
                                      className="w-16 sm:w-20"
                                    />
                                    <div className="flex-1">
                                      <p className="sm:text-base font-medium">
                                        {item.productName}
                                      </p>
                                      <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                                        <p className="text-lg">
                                          {formatCurrency(item.price)}
                                        </p>
                                      </div>
                                      <p>
                                        Date:{" "}
                                        <span className="text-gray-500">
                                          {formatDate(item.createdAt)}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </Link>

                                {index === 0 && (
                                  <div className="flex items-center gap-2">
                                    <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                                    <p className="text-sm md:text-base">
                                      {order.status}
                                    </p>
                                  </div>
                                )}

                                {index === 0 && (
                                  <Button
                                    onClick={() =>
                                      showOrderDetails(
                                        order.orderId,
                                        order.status
                                      )
                                    }
                                  >
                                    Track Order
                                  </Button>
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ))
                ) : (
                  <p>No products found.</p>
                )}
              </div>
            </div>
          </Tab>

          <Tab label="Cancel">
            <div className="py-4 ">
              {/* Hiển thị sản phẩm theo từng đơn hàng */}
              <div>
                {loading ? (
                  <p>Loading...</p>
                ) : orders.length > 0 ? (
                  orders
                    .filter((order) => order.status === "Canceled") // Filter orders by status
                    .map((order) => (
                      <div key={order.orderId} className="mb-8">
                        <h3 className="text-xl font-bold mb-4">
                          Order ID: {order.orderId}
                        </h3>
                        {groupedOrderDetails[order.orderId]?.map(
                          (item, index) => (
                            <div
                              key={index}
                              className={`py-4 text-gray-700 ${
                                index === 0 ? "border-t" : ""
                              } ${
                                index ===
                                groupedOrderDetails[order.orderId].length - 1
                                  ? "border-b"
                                  : ""
                              }`}
                            >
                              {/* Product details */}
                              <div className="flex items-start justify-between gap-6 text-sm">
                                <Link to={`/product-page/${item.productId}`}>
                                  <div className="flex items-start gap-6">
                                    <img
                                      src={item.productImage[0]}
                                      alt={item.productName}
                                      className="w-16 sm:w-20"
                                    />
                                    <div className="flex-1">
                                      <p className="sm:text-base font-medium">
                                        {item.productName}
                                      </p>
                                      <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                                        <p className="text-lg">
                                          {formatCurrency(item.price)}
                                        </p>
                                      </div>
                                      <p>
                                        Date:{" "}
                                        <span className="text-gray-500">
                                          {formatDate(item.createdAt)}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </Link>

                                {index === 0 && (
                                  <div className="flex items-center gap-2">
                                    <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                                    <p className="text-sm md:text-base">
                                      {order.status}
                                    </p>
                                  </div>
                                )}

                                {index === 0 && (
                                  <Button
                                    onClick={() =>
                                      showOrderDetails(
                                        order.orderId,
                                        order.status
                                      )
                                    }
                                  >
                                    Track Order
                                  </Button>
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ))
                ) : (
                  <p>No products found.</p>
                )}
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>

      <Modal
        title="Order Details"
        open={isModalOpen}
        onCancel={handleCancel}
        className="w-[1000px]"
        footer={[
          status === "Pending" && (
            <Button
              key="cancel"
              onClick={() => {
                handleCancelOrder(selectedOrderDetails.orderId);
                console.log("orderid", selectedOrderDetails.orderId);
              }}
            >
              Cancel Order
            </Button>
          ),
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>,
        ]}
      >
        {/* Display additional order details */}
        <div className="mt-5">
          <p className="text-lg font-bold text-center">Delivery Information</p>
          <p className="text-md font-medium">
            Buyer Name: {selectedOrderDetails.name}
          </p>
          <p className="text-md font-medium">
            Phone Number: {selectedOrderDetails.phoneNumber}
          </p>
          <p className="text-md font-medium">
            Delivered At: {selectedOrderDetails.deliveredAt}
          </p>
          <p className="text-md font-medium">
            Reason: {selectedOrderDetails.issueReport}
          </p>
        </div>

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
                {selectedOrderDetails?.createdAt ? (
                  <span>{formatDate(selectedOrderDetails.createdAt)}</span>
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
        {selectedOrder.map((item, index) => (
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
                <p className="sm:text-base font-medium">{item.productName}</p>
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
          Total Price: {formatCurrency(selectedOrderDetails.totalPrice)}
        </p>
      </Modal>

      <Footer />
    </>
  );
}

export default Order_Seller_Page;
