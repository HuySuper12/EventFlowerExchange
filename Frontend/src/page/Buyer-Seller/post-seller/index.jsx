import React, { useEffect, useState } from "react";
import SidebarCustomer from "../../../component/slidebar-customer";
import Header from "../../../component/header";
import Footer from "../../../component/footer";
import {
  Table,
  Pagination,
  Modal,
  Button,
  Input,
  Form,
  Image,
  Tag,
} from "antd";
import api from "../../../config/axios";
import SlidebarSeller from "../../../component/slidebar-seller";

const PostSeller = () => {
  const [combinedData, setCombinedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const requestsPerPage = 8;
  const email = sessionStorage.getItem("email");
  const [rejectedReasonVisible, setRejectedReasonVisible] = useState(null);

  const fetchRequestsAndProducts = async () => {
    if (email) {
      try {
        const requestResponse = await api.get(`Request/GetRequestListBy`, {
          params: {
            email: email,
            type: "Post",
          },
        });

        console.log("Requests response:", requestResponse.data);

        if (requestResponse.data && Array.isArray(requestResponse.data)) {
          const dataWithProducts = await Promise.all(
            requestResponse.data.map(async (request) => {
              const product = await fetchProduct(request.productId);
              return { ...request, product };
            })
          );

          console.log("Combined data with products:", dataWithProducts);
          setCombinedData(
            dataWithProducts.reverse().filter((item) => item.product !== null)
          );
        } else {
          console.error(
            "Unexpected data format or no data:",
            requestResponse.data
          );
          setCombinedData([]);
        }
      } catch (error) {
        console.error("Error fetching requests and products:", error);
        setCombinedData([]);
      }
    }
  };

  const fetchProduct = async (id) => {
    try {
      const response = await api.get(`Product/SearchProduct`, {
        params: {
          id: id,
        },
      });
      console.log("Product response for ID", id, ":", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchRequestsAndProducts();
  }, []);

  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentData = combinedData.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewDetails = (productId) => {
    const product = combinedData.find(
      (item) => item.product.productId === productId
    );
    setProductDetails(product.product);
    setDetailsVisible(true);
  };

  const handleDetailsCancel = () => {
    setDetailsVisible(false);
    setProductDetails(null);
  };

  const handleViewRejectedReason = (productId) => {
    const product = combinedData.find(
      (item) => item.product && item.product.productId === productId
    );
    if (product) {
      setProductDetails(product);
      setRejectedReasonVisible(true);
    } else {
      console.error("Product not found for ID:", productId);
    }
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: ["product", "productName"],
      key: "productName",
    },
    {
      title: "Combo Type",
      dataIndex: ["product", "comboType"],
      key: "comboType",
    },
    {
      title: "Created At",
      dataIndex: ["product", "createdAt"],
      key: "createdAt",
      render: (createdAt) => new Date(createdAt).toLocaleString(),
    },
    {
      title: "Expired At",
      dataIndex: ["product", "expireddAt"],
      key: "expireddAt",
      render: (expireddAt) => new Date(expireddAt).toLocaleString(),
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
              : status === "Accepted"
              ? "green"
              : "red"
          }
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <>
          <Button onClick={() => handleViewDetails(record.product.productId)}>
            Detail
          </Button>
          {record.status === "Rejected" && (
            <Button
              className="ml-[10px]"
              onClick={() => handleViewRejectedReason(record.product.productId)}
            >
              View Reason
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <>
      <Header />

      <div className="flex mt-[50px]">
        <SlidebarSeller />
        <div className="w-full ml-[30px] bg-white shadow-2xl rounded-xl p-4">
          <div className="mb-6 p-4 border border-gray-300 rounded-lg">
            <h4 className="text-lg font-bold mb-[20px]">Products</h4>
            <Table
              dataSource={currentData}
              columns={columns}
              pagination={false}
              rowKey="requestId"
            />
            <Pagination
              current={currentPage}
              pageSize={requestsPerPage}
              total={combinedData.length}
              onChange={handlePageChange}
              className="mt-4"
            />
          </div>
        </div>
      </div>

      <Modal
        title="Product Details"
        visible={detailsVisible}
        onCancel={handleDetailsCancel}
        footer={null}
        width={800}
      >
        {productDetails ? (
          <Form layout="vertical">
            <Form.Item label={<strong>Product Name</strong>}>
              <Input
                value={productDetails.productName}
                disabled
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                }}
              />
            </Form.Item>
            <Form.Item label={<strong>Price</strong>}>
              <Input
                value={productDetails.price}
                disabled
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                }}
              />
            </Form.Item>
            <Form.Item label={<strong>Description</strong>}>
              <Input.TextArea
                value={productDetails.description}
                disabled
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                }}
              />
            </Form.Item>
            <Form.Item label={<strong>Category</strong>}>
              <Input
                value={productDetails.category}
                disabled
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                }}
              />
            </Form.Item>
            <Form.Item label={<strong>Status</strong>}>
              <Input
                value={productDetails.status}
                disabled
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                }}
              />
            </Form.Item>
            <Form.Item label={<strong>Quantity</strong>}>
              <Input
                value={productDetails.quantity}
                disabled
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                }}
              />
            </Form.Item>
            <Form.Item label={<strong>Freshness Duration</strong>}>
              <Input
                value={`${productDetails.freshnessDuration} days`}
                disabled
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                }}
              />
            </Form.Item>
            <Form.Item label={<strong>Combo Type</strong>}>
              <Input
                value={productDetails.comboType}
                disabled
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                }}
              />
            </Form.Item>
            <Form.Item label={<strong>Created At</strong>}>
              <Input
                value={new Date(productDetails.createdAt).toLocaleString()}
                disabled
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                }}
              />
            </Form.Item>
            <Form.Item label={<strong>Expires At</strong>}>
              <Input
                value={new Date(productDetails.expireddAt).toLocaleString()}
                disabled
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                }}
              />
            </Form.Item>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {(productDetails?.productImage || []).map((url, index) => (
                <Image
                  key={index}
                  src={url}
                  alt="Product"
                  style={{
                    width: 150,
                    height: 150,
                    margin: 5,
                    objectFit: "cover",
                  }}
                />
              ))}
            </div>
          </Form>
        ) : (
          <p>No details available</p>
        )}
      </Modal>

      <Modal
        title="Rejected Reason"
        visible={rejectedReasonVisible}
        onCancel={() => setRejectedReasonVisible(false)}
        footer={null}
        width={800}
      >
        <Form layout="vertical">
          <Form.Item label={<strong>Reason</strong>}>
            <Input.TextArea
              value={
                productDetails
                  ? productDetails.reason || "No reason provided"
                  : "No reason provided"
              }
              disabled
              style={{
                backgroundColor: "#fff",
                color: "#000",
              }}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Footer />
    </>
  );
};

export default PostSeller;
