// Transaction.jsx
import React, { useState } from "react";
import SidebarCustomer from "../../../component/slidebar-customer";
import Header from "../../../component/header";
import Footer from "../../../component/footer";
import { Modal } from "antd";

const WalletCustomer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
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
              Balance: <strong>$100</strong>
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
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
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
