import React, { useEffect, useState } from "react";
import SidebarCustomer from "../../../component/slidebar-customer";
import Header from "../../../component/header";
import Footer from "../../../component/footer";
import { Table } from "antd";
import { Tab, Tabs } from "../../../component/tab";
import api from "../../../config/axios"; // Assuming you have axios instance setup here

const TransactionCustomer = () => {
  const [transactions, setTransactions] = useState([]);
  const [VNPAY, setVNPAY] = useState([]);
  const email = sessionStorage.getItem("email"); // Get email from sessionStorage

  useEffect(() => {
    // Function to fetch data
    const fetchTransactions = async () => {
      try {
        // Call API with email as parameter
        const response = await api.get(
          "Transaction/ViewAllTransactionByEmail",
          {
            params: { email: email }, // Corrected the params syntax
          }
        );
        console.log(response);
        setTransactions(response.data.reverse()); // Set the response data to transactions state
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      }
    };

    // Invoke the function to fetch transactions
    fetchTransactions();
  }, [email]); // Dependency array to re-run effect when email changes

  useEffect(() => {
    // Function to fetch data
    const fetchVNPAY = async () => {
      try {
        // Call API with email as parameter
        const response = await api.get("VNPAY/GetPaymentListBy", {
          params: { email: email, type: 1 }, // Corrected the params syntax
        });
        console.log(response);
        setVNPAY(response.data.reverse()); // Set the response data to transactions state
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      }
    };

    // Invoke the function to fetch transactions
    fetchVNPAY();
  }, [email]); // Dependency array to re-run effect when email changes

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    const validAmount = amount !== undefined ? amount : 0;
    return (
      validAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ"
    );
  };

  const columns1 = [
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
    },
    {
      title: "Transaction Code",
      dataIndex: "transactionCode",
      key: "transactionCode",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => formatCurrency(amount),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (status ? "Success" : "Failed"),
    },
    {
      title: "Transaction Content",
      dataIndex: "transactionContent",
      key: "transactionContent",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => formatDate(createdAt),
    },
  ];

  const columns2 = [
    {
      title: "Payment ID",
      dataIndex: "paymentId",
      key: "paymentId",
    },
    {
      title: "Payment Code",
      dataIndex: "paymentCode",
      key: "paymentCode",
    },
    {
      title: "Content",
      dataIndex: "paymentContent",
      key: "paymentContent",
    },
    {
      title: "Payment Type",
      dataIndex: "paymentType",
      key: "paymentType",
      render: (value) => (value === 1 ? "Deposit" : value.toString()),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => formatCurrency(amount),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => formatDate(createdAt),
    },
  ];

  return (
    <>
      <Header />
      <div className="ml-[230px] mt-[20px] text-[30px]">Your Account</div>

      <div className="flex flex-col md:flex-row h-screen p-6 ml-[200px] mr-[200px]">
        <SidebarCustomer />
        <div className="w-full ml-[30px] bg-white shadow-2xl rounded-xl p-4">
          <div className="mb-6 p-4 border border-gray-300 rounded-lg w-full">
            <h4 className="text-lg font-bold mb-[20px]">Transaction History</h4>
            <Tabs>
              <Tab label="Transaction Order">
                <div className="py-4">
                  <h2 className="text-lg font-medium mb-2">
                    Transaction Order
                  </h2>
                  <Table
                    dataSource={transactions}
                    columns={columns1}
                    pagination={{ pageSize: 4 }}
                  />
                  ;
                </div>
              </Tab>
              <Tab label="Transaction Deposit">
                <div className="py-4">
                  <h2 className="text-lg font-medium mb-2">
                    Transaction Deposit
                  </h2>
                  <Table
                    dataSource={VNPAY}
                    columns={columns2}
                    pagination={{ pageSize: 4 }}
                  />
                  ;
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default TransactionCustomer;
