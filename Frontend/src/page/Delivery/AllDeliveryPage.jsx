import React, { useState, useEffect } from "react";
import { Table, Tabs, Pagination, Spin } from "antd";
import { Link } from "react-router-dom";
import Header from "../../component/Header_delivery";
import SidebarDelivery from "../../component/Sidebar_delivery";
import api from "../../config/axios";

const { TabPane } = Tabs;

const DeliveryList = () => {
  const [loading, setLoading] = useState(true);
  const [dataSuccess, setDataSuccess] = useState([]);
  const [dataFailed, setDataFailed] = useState([]);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const email = sessionStorage.getItem("email");
  useEffect(() => {
    const fetchDataSuccess = async () => {
      try {
        const response = await api.get(
          "DeliveryLog/ViewDeliveryLogShipperByEmail",
          {
            params: { email: email },
          }
        );
        const filteredData = response.data.filter(
          (item) => item.status === "Delivery Success"
        );
        setDataSuccess(filteredData);
        setLoading(false);
        console.log(dataSuccess);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchDataSuccess();
  }, [email]);

  useEffect(() => {
    const fetchDataFailed = async () => {
      try {
        const response = await api.get(
          "DeliveryLog/ViewDeliveryLogShipperByEmail",
          {
            params: { email: email },
          }
        );
        const filteredData = response.data.filter(
          (item) => item.status === "Delivery Fail"
        );
        setDataFailed(filteredData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchDataFailed();
  }, [email]);

  useEffect(() => {
    const fetchDataFailed = async () => {
      try {
        const response = await api.get(
          "DeliveryLog/ViewDeliveryLogShipperByEmail",
          {
            params: { email: email },
          }
        );

        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchDataFailed();
  }, [email]);

  const columns = [
    {
      title: "Log ID",
      dataIndex: "logId",
      key: "logId",
    },
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Take Over At",
      dataIndex: "takeOverAt",
      key: "takeOverAt",
    },
    {
      title: "Delivery At",
      dataIndex: "deliveryAt",
      key: "deliveryAt",
    },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalOrders = data.length;

  return (
    <div>
      <Header title="" />

      <div className="flex ">
        <SidebarDelivery />

        <div className="w-full">
          <Tabs
            defaultActiveKey="1"
            className="bg-white p-4 rounded-lg shadow-md"
          >
            <TabPane tab="Delivered Orders" key="1">
              <Spin spinning={loading}>
                <Table
                  columns={columns}
                  dataSource={dataSuccess}
                  pagination={false}
                  className="rounded-lg shadow-2xl"
                />
              </Spin>
            </TabPane>
            <TabPane tab="Failed Orders" key="2">
              <Spin spinning={loading}>
                <Table
                  columns={columns}
                  dataSource={dataFailed}
                  pagination={false}
                  className="rounded-lg shadow-2xl"
                />
              </Spin>
            </TabPane>
          </Tabs>

          <div className="flex justify-between items-center mt-4">
            <span className="text-gray-600">Total Orders: {totalOrders}</span>
            <Pagination
              defaultCurrent={currentPage}
              total={totalOrders}
              pageSize={pageSize}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryList;
