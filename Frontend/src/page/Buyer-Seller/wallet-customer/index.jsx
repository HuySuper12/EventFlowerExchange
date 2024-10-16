// Transaction.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarCustomer from "../../../component/slidebar-customer";
import Header from "../../../component/header";
import Footer from "../../../component/footer";
import { Form, Input, Modal } from "antd";
import { toast } from "react-toastify";
import api from "../../../config/axios";

const WalletCustomer = () => {
  const [accountData, setAccountData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [link, setLink] = useState(
    "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=1000000000&vnp_Command=pay&vnp_CreateDate=20241011074528&vnp_CurrCode=VND&vnp_IpAddr=10.3.80.7&vnp_Locale=vn&vnp_OrderInfo=N%E1%BA%A1p+ti%E1%BB%81n+t%E1%BB%AB%3A+dfasdfadsf&vnp_OrderType=Qu%C3%A0+t%E1%BA%B7ng&vnp_ReturnUrl=https%3A%2F%2Flocalhost%3A7219%2Fapi%2FVNPAY%2Fpayment-callback&vnp_TmnCode=GOSLR1AW&vnp_TxnRef=638642547361681120&vnp_Version=2.1.0&vnp_SecureHash=c65934a4410e692d1c01821de11d77c269860f8024baa5fab39b454bacc8a7b5237a82802c2f6fbccf9117f9660e6a25b4861abe64ce764a0a2d131409729373"
  );
  const navigate = useNavigate();

  const email = sessionStorage.getItem("email");

  useEffect(() => {
    const role = sessionStorage.getItem("role");
    if (role === "Seller") {
      navigate("/");
    } else if (role === "Admin") {
      navigate("/admin");
    } else if (role === "Staff") {
      navigate("/staff");
    } else if (role === "Shipper") {
      navigate("/staff");
    } else if (!role) {
      navigate("/login");
      toast.error("Please login first.");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchAccountData = async () => {
      if (email) {
        try {
          const encodedEmail = encodeURIComponent(email);
          const response = await api.get(
            `Account/GetAccountByEmail/${encodedEmail}`
          );
          setAccountData(response.data);
          console.log(response.data);
        } catch (error) {
          console.error("Error fetching account data:", error);
        }
      } else {
        console.error("Email is not set in sessionStorage.");
      }
    };

    fetchAccountData();
  }, [email]); // Chạy lại khi email thay đổi

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    window.location.href = link;
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Header />
      <div className="ml-[230px] mt-[20px] text-[30px]">Your Account</div>

      <div className="flex flex-col md:flex-row h-screen p-6 ml-[200px] mr-[200px]">
        <SidebarCustomer />
        <div className="w-full ml-[30px] bg-white shadow-2xl rounded-xl p-4">
          <div className="mb-6 p-4 border border-gray-300 rounded-lg w-full">
            <h4 className="text-lg font-bold">Wallet</h4>
            <p>
              Balance:{" "}
              <strong>
                {accountData ? accountData.balance : "Loading..."} VNĐ
              </strong>
            </p>
            <button
              className="border border-gray-300 rounded-full text-lg items-center h-[40px] w-[300px] mt-[30px] ml-[300px] hover:bg-blue-500 hover:text-white"
              onClick={showModal}
            >
              Add to wallet
            </button>
          </div>
        </div>
      </div>

      <Modal
        title="Add Money to Wallet"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form layout="vertical">
          <Form.Item label="Amount" required>
            <div className="flex">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                step={1000}
              />
              <div className="mt-[20px] ml-[10px]">VNĐ</div>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      <Footer />
    </>
  );
};

export default WalletCustomer;

//CALL API
// import React, { useState } from "react";
// import SidebarCustomer from "../../../component/slidebar-customer";
// import Header from "../../../component/header";
// import Footer from "../../../component/footer";
// import { Modal, Form, Input, Button, notification } from "antd";
// import axios from "axios"; // Import Axios

// const WalletCustomer = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [amount, setAmount] = useState("");

//   const showModal = () => {
//     setIsModalOpen(true);
//   };

//   const handleOk = async () => {
//     try {
//       // Gọi API để gửi số tiền
//       const response = await axios.post("YOUR_API_ENDPOINT", { amount });

//       if (response.status === 200) {
//         notification.success({ message: "Transaction successful!" });
//         setAmount(""); // Reset amount after success
//       } else {
//         notification.error({ message: "Transaction failed!" });
//       }
//     } catch (error) {
//       notification.error({ message: "An error occurred!" });
//     } finally {
//       setIsModalOpen(false);
//     }
//   };

//   const handleCancel = () => {
//     setIsModalOpen(false);
//     setAmount(""); // Reset amount on cancel
//   };

//   return (
//     <>
//       <Header />
//       <div className="ml-[230px] mt-[20px] text-[30px]">Your Account</div>

//       <div className="flex flex-col md:flex-row h-screen p-6 ml-[200px] mr-[200px]">
//         <SidebarCustomer />
//         <div className="w-full ml-[30px] bg-white shadow-2xl rounded-xl p-4">
//           <div className="mb-6 p-4 border border-gray-300 rounded-lg w-full">
//             <h4 className="text-lg font-bold">Wallet</h4>
//             <p>
//               Balance: <strong>$100</strong>
//             </p>
//             <button
//               className="border border-gray-300 rounded-full text-lg items-center h-[40px] w-[300px] mt-[30px] ml-[300px] hover:bg-blue-500 hover:text-white"
//               onClick={showModal}
//             >
//               Add to wallet
//             </button>
//           </div>
//         </div>
//       </div>

//       <Modal
//         title="Add Money to Wallet"
//         open={isModalOpen}
//         onOk={handleOk}
//         onCancel={handleCancel}
//       >
//         <Form layout="vertical">
//           <Form.Item label="Amount" required>
//             <Input
//               type="number"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               placeholder="Enter amount"
//             />
//           </Form.Item>
//         </Form>
//       </Modal>

//       <Footer />
//     </>
//   );
// };

// export default WalletCustomer;
