// Transaction.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarCustomer from "../../../component/slidebar-customer";
import Header from "../../../component/header";
import Footer from "../../../component/footer";
import { Form, Input, Modal } from "antd";
import { toast } from "react-toastify";
import api from "../../../config/axios";

const WalletSeller = () => {
  const [accountData, setAccountData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState("");

  const navigate = useNavigate();

  const email = sessionStorage.getItem("email");

  useEffect(() => {
    const role = sessionStorage.getItem("role");
    if (role === "Buyer") {
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

  const handleOk = async (values) => {
    setIsModalOpen(false);

    const numericAmount = parseFloat(amount);
    const balance = accountData ? accountData.balance : 0;

    // Check if the amount is greater than the balance
    if (numericAmount > balance) {
      toast.error("The amount entered exceeds your balance.");
      return; // Exit the function if the amount is invalid
    }

    const requestData = {
      userEmail: sessionStorage.getItem("email"),
      amount: amount, // Sử dụng state amount
      requestType: "Withdraw",
    };

    try {
      const response = await api.post(
        "Request/CreateRequest_Withdraw",
        requestData
      );
      console.log(response.data);
      if (response.data == true) {
        toast.success("Request Withdraw successfully.");
      }
    } catch (error) {
      console.error("Error depositing money:", error);
      toast.error("Failed to deposit money.");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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
      <div className="ml-[230px] mt-[20px] text-[30px]">Your Account</div>

      <div className="flex flex-col md:flex-row h-screen p-6 ml-[200px] mr-[200px]">
        <SidebarCustomer />
        <div className="w-full ml-[30px] bg-white shadow-2xl rounded-xl p-4">
          <div className="mb-6 p-4 border border-gray-300 rounded-lg w-full">
            <h4 className="text-lg font-bold">Wallet</h4>
            <p>
              Balance:{" "}
              <strong>
                {accountData && accountData.balance !== null
                  ? formatCurrency(accountData.balance)
                  : "0 VNĐ"}
              </strong>
            </p>
            <button
              className="border border-gray-300 rounded-full text-lg items-center h-[40px] w-[300px] mt-[30px] ml-[300px] hover:bg-blue-500 hover:text-white"
              onClick={showModal}
            >
              Request Withdraw
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

export default WalletSeller;
