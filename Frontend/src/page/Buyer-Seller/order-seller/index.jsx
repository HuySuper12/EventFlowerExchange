import React, { useState, useEffect } from "react";
import api from "../../../config/axios"; // Import axios
import Header from "../../../component/header";
import Footer from "../../../component/footer";
import { Button, Modal } from "antd";

function Order_Seller_Page() {
  const [orders, setOrders] = useState([]); // Store user's orders
  const [orderDetails, setOrderDetails] = useState([]); // Store order details
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState("");

  // Fetch all orders
  useEffect(() => {
    const userEmail = sessionStorage.getItem("email");
    console.log("User Email:", userEmail);
    if (!userEmail) {
      console.error("No email found in session storage");
      return;
    }

    api
      .get("Order/ViewOrderBySellerEmail", {
        params: { email: userEmail },
      })
      .then((response) => {
        console.log("API response:", response.data); // Kiểm tra dữ liệu trả về
        if (Array.isArray(response.data)) {
          setOrders(response.data.reverse()); // Sử dụng response.data
        } else {
          setOrders([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching orders", error);
      });
  }, []);

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

  const showOrderDetails = (orderId, status) => {
    setSelectedOrder(groupedOrderDetails[orderId]);
    setStatus(status);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getProgressStepClass = (step) => {
    if (status === "Pending" && step === 1) return "bg-blue-600";
    if (status === "Delivering" && (step === 1 || step === 2))
      return "bg-blue-600";
    if (status === "Success" && step <= 3) return "bg-blue-600";
    return "bg-gray-400";
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formatCurrency = (amount) => {
    const validAmount = amount !== undefined ? amount : 0;
    return (
      validAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ"
    );
  };

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

        {/* Hiển thị sản phẩm theo từng đơn hàng */}
        <div>
          {loading ? (
            <p>Loading...</p>
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.orderId} className="mb-8">
                <h3 className="text-xl font-bold mb-4">
                  Order ID: {order.orderId}
                </h3>
                {groupedOrderDetails[order.orderId]?.map((item, index) => (
                  <div
                    key={index}
                    className={`py-4 text-gray-700 ${
                      index === 0 ? "border-t" : ""
                    } ${
                      index === groupedOrderDetails[order.orderId].length - 1
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
                          <p className="text-sm md:text-base">{order.status}</p>
                        </div>
                      )}

                      {index === 0 && (
                        <Button
                          onClick={() =>
                            showOrderDetails(order.orderId, order.status)
                          }
                        >
                          Track Order
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </div>

      <Modal
        title="Order Details"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>,
        ]}
      >
        {/* Thêm tiến trình giao hàng vào dưới phần chi tiết sản phẩm */}
        <div className="mt-5">
          <ul className="flex items-center justify-between relative">
            {/* Thanh tiến trình */}
            <div
              className={`absolute top-3 left-0 ${
                status === "Success"
                  ? "w-full"
                  : status === "Delivering"
                  ? "w-2/3"
                  : "w-1/3"
              } h-1 bg-blue-600`}
            ></div>

            {/* Các bước tiến trình */}
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
                  <p className="text-lg">{item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <p>
                  Date: <span className="text-gray-500">{item.createdAt}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </Modal>

      <Footer />
    </>
  );
}

export default Order_Seller_Page;
