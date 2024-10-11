import React, { useState } from "react";
import Header from "../../../component/header";
import Footer from "../../../component/footer";
import { Button, Modal } from "antd";

function Order_Page() {
  const [open, setOpen] = useState(false); // Removed type annotation
  const [loading, setLoading] = useState(true); // Removed type annotation
  const [status, setStatus] = useState("giao hàng thành công");

  const showLoading = () => {
    setOpen(true);
    setLoading(true);

    // Simple loading mock. You should add cleanup logic in real world.
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const getProgressStepClass = (step) => {
    if (status === "đang chuẩn bị hàng" && step === 1) return "bg-blue-600";
    if (status === "đang giao hàng" && (step === 1 || step === 2))
      return "bg-blue-600";
    if (status === "giao hàng thành công" && step <= 3) return "bg-blue-600";
    return "bg-gray-400";
  };

  return (
    <>
      <Header />

      <div className="border-t pt-16 ml-[300px] mr-[300px]">
        <div className="text-2xl">
          <div className="inline-flex items-center gap-2 mb-2 mt-10">
            <p className="prata-regular text-3xl">My Order</p>
            <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
          </div>
        </div>

        <div>
          <div className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-6 text-sm">
              <img
                src="https://greengarden.vn/wp-content/uploads/2023/12/hoa-hong2.jpg"
                alt="Product"
                className="w-16 sm:w-20"
              />
              <div>
                <p className="sm:text-base font-medium">Product Name</p>
                <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                  <p className="text-lg">Price</p>
                  <p>Quantity: 1</p>
                  <p>comboType</p>
                </div>
                <p>
                  Date: <span className="text-gray-500">9/10/2024</span>
                </p>
              </div>
            </div>

            <div className="md:w-1/2 flex justify-between">
              <div className="flex items-center gap-2">
                <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                <p className="text-sm md:text-base">Ready to ship</p>
              </div>

              <button
                className="border px-4 py-2 text-sm font-medium rounded-sm"
                onClick={showLoading}
              >
                Track order
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title={<p>Loading Modal</p>}
        footer={
          <Button type="primary" onClick={showLoading}>
            Reload
          </Button>
        }
        loading={loading}
        open={open}
        onCancel={() => setOpen(false)}
      >
        <p className="text-lg font-medium text-center">Detail Order</p>
        <div className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 mb-2">
                Order ID{" "}
                <span className="font-bold text-black">1222528743</span>
              </p>
              <p className="text-gray-500 mb-0">
                Order On <span className="font-bold text-black">9/10/2024</span>
              </p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <ul className="relative flex justify-between mx-0 mt-0 mb-5 px-0 pt-0 pb-4">
            <div className="absolute top-3 left-0 w-full h-1 bg-gray-300"></div>

            <div
              className={`absolute top-3 left-0 ${
                status === "giao hàng thành công"
                  ? "w-full"
                  : status === "đang giao hàng"
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
              <span className="mt-3 ml-[-5px]">Đang chuẩn bị</span>
            </li>

            <li className="relative w-1/3 flex flex-col items-center text-blue-600">
              <div
                className={`flex items-center justify-center w-7 h-7 text-white rounded-full ${getProgressStepClass(
                  2
                )}`}
              >
                2
              </div>
              <span className="mt-3">Đang được giao</span>
            </li>

            <li className="relative w-1/3 flex flex-col items-end text-gray-500">
              <div
                className={`flex items-center justify-center w-7 h-7 text-white rounded-full ${getProgressStepClass(
                  3
                )}`}
              >
                3
              </div>
              <span className="mt-3">Đã hoàn thành</span>
            </li>
          </ul>
        </div>
        <div className="flex mb-4 pb-2">
          <div className="flex-grow">
            <h5 className="font-bold">Flower</h5>
            <p className="text-gray-500">Quantity: 1</p>
            <h4 className="mb-3">
              Price: <span className="text-sm text-gray-500"> 299.000 </span>
            </h4>
          </div>
          <div>
            <img
              className="self-center"
              src="https://123flower.vn/data/item/1708845322/thumb-b0532_600x600.jpg"
              width="250"
            />
          </div>
        </div>
      </Modal>

      <Footer />
    </>
  );
}
export default Order_Page;

//Call API
// export default Order_Page;

// import React, { useState, useEffect } from "react";
// import axios from "axios"; // Import axios
// import Header from "../../component/header";
// import Footer from "../../component/footer";
// import { Modal, Button } from "antd";

// function Order_Page() {
//   const [orders, setOrders] = useState([]); // To store user's orders
//   const [selectedOrder, setSelectedOrder] = useState(null); // To store selected order details
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [loading, setLoading] = useState(false); // To track loading state

//   // Fetch orders on component mount
//   useEffect(() => {
//     const userEmail = "user@example.com"; // Replace with the actual user's email
//     axios
//       .get(`/api/getOrdersByEmail?email=${userEmail}`) // Update with your actual API endpoint
//       .then((response) => {
//         setOrders(response.data.orders); // Assuming the orders come in response.data.orders
//       })
//       .catch((error) => {
//         console.error("Error fetching orders", error);
//       });
//   }, []);

//   // Function to fetch order details by ID and open the modal
//   const showOrderDetails = (orderId) => {
//     setLoading(true); // Set loading to true
//     axios
//       .get(`/api/getOrderDetails?id=${orderId}`) // Replace with the correct API endpoint
//       .then((response) => {
//         setSelectedOrder(response.data); // Store order details in state
//         setIsModalOpen(true);
//       })
//       .catch((error) => {
//         console.error("Error fetching order details", error);
//       })
//       .finally(() => {
//         setLoading(false); // Set loading to false after the API call completes
//       });
//   };

//   const handleOk = () => {
//     setIsModalOpen(false);
//     setSelectedOrder(null); // Reset selected order when closing the modal
//   };

//   const handleCancel = () => {
//     setIsModalOpen(false);
//     setSelectedOrder(null); // Reset selected order when cancelling the modal
//   };

//   // Function to determine step status based on order status
//   const getProgressStepClass = (step) => {
//     if (selectedOrder?.status === "đang chuẩn bị hàng" && step === 1) return "bg-blue-600";
//     if (selectedOrder?.status === "đang giao hàng" && (step === 1 || step === 2))
//       return "bg-blue-600";
//     if (selectedOrder?.status === "giao hàng thành công" && step <= 3) return "bg-blue-600";
//     return "bg-gray-400";
//   };

//   return (
//     <>
//       <Header />

//       <div className="border-t pt-16 ml-[300px] mr-[300px]">
//         <div className="text-2xl">
//           <div className="inline-flex items-center gap-2 mb-2 mt-10">
//             <p className="prata-regular text-3xl">My Orders</p>
//             <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
//           </div>
//         </div>

//         {/* List all orders */}
//         <div>
//           {orders.map((order) => (
//             <div key={order.id} className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//               <div className="flex items-start gap-6 text-sm">
//                 <img
//                   src={order.productImage} // Assuming order object has productImage
//                   alt={order.productName}
//                   className="w-16 sm:w-20"
//                 />
//                 <div>
//                   <p className="sm:text-base font-medium">{order.productName}</p>
//                   <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
//                     <p className="text-lg">{order.price}</p>
//                     <p>Quantity: {order.quantity}</p>
//                   </div>
//                   <p>Date: <span className="text-gray-500">{order.date}</span></p>
//                 </div>
//               </div>

//               <div className="md:w-1/2 flex justify-between">
//                 <button
//                   className="border px-4 py-2 text-sm font-medium rounded-sm"
//                   onClick={() => showOrderDetails(order.id)} // Pass order ID to fetch details
//                 >
//                   Track order
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Modal to show order details */}
//       <Modal
//         title={<p>Loading Order Details</p>}
//         open={isModalOpen}
//         onCancel={handleCancel}
//         footer={[
//           <Button key="back" onClick={handleCancel}>
//             Close
//           </Button>
//         ]}
//         closable={!loading} // Prevent closing the modal while loading
//         confirmLoading={loading} // Show loading state on modal button
//       >
//         {loading ? (
//           <p className="text-center">Loading...</p>
//         ) : (
//           selectedOrder && (
//             <div className="p-4">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <p className="text-gray-500 mb-2">
//                     Order ID <span className="font-bold text-black">{selectedOrder.id}</span>
//                   </p>
//                   <p className="text-gray-500 mb-0">
//                     Order On <span className="font-bold text-black">{selectedOrder.date}</span>
//                   </p>
//                 </div>
//               </div>

//               <div className="p-4">
//                 {/* Status Progress Bar */}
//                 <ul className="relative flex justify-between mx-0 mt-0 mb-5 px-0 pt-0 pb-4">
//                   <div className="absolute top-3 left-0 w-full h-1 bg-gray-300"></div>

//                   {/* Progress line based on order status */}
//                   <div
//                     className={`absolute top-3 left-0 ${
//                       selectedOrder.status === "giao hàng thành công"
//                         ? "w-full"
//                         : selectedOrder.status === "đang giao hàng"
//                         ? "w-2/3"
//                         : "w-1/3"
//                     } h-1 bg-blue-600`}
//                   ></div>

//                   <li className="relative w-1/3 flex flex-col items-start text-blue-600">
//                     <div className={`flex items-center justify-center w-7 h-7 text-white rounded-full ${getProgressStepClass(1)}`}>
//                       1
//                     </div>
//                     <span className="mt-3 ml-[-5px]">Đang chuẩn bị</span>
//                   </li>

//                   <li className="relative w-1/3 flex flex-col items-center text-blue-600">
//                     <div className={`flex items-center justify-center w-7 h-7 text-white rounded-full ${getProgressStepClass(2)}`}>
//                       2
//                     </div>
//                     <span className="mt-3">Đang được giao</span>
//                   </li>

//                   <li className="relative w-1/3 flex flex-col items-end text-gray-500">
//                     <div className={`flex items-center justify-center w-7 h-7 text-white rounded-full ${getProgressStepClass(3)}`}>
//                       3
//                     </div>
//                     <span className="mt-3">Đã hoàn thành</span>
//                   </li>
//                 </ul>
//               </div>

//               <div className="flex mb-4 pb-2">
//                 <div className="flex-grow">
//                   <h5 className="font-bold">{selectedOrder.productName}</h5>
//                   <p className="text-gray-500">Quantity: {selectedOrder.quantity}</p>
//                   <h4 className="mb-3">
//                     Price: <span className="text-sm text-gray-500">{selectedOrder.price}</span>
//                   </h4>
//                 </div>
//                 <div>
//                   <img className="self-center" src={selectedOrder.productImage} width="250" alt={selectedOrder.productName} />
//                 </div>
//               </div>
//             </div>
//           )
//         )}
//       </Modal>

//       <Footer />
//     </>
//   );
// }

// export default Order_Page;
