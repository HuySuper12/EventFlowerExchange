import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../component/header";
import api from "../../../config/axios";
import Footer from "../../../component/footer";
import SlidebarSeller from "../../../component/slidebar-seller";
import { Button, Image, Table, Form, Input, Modal } from "antd";
import { Tab, Tabs } from "../../../component/tab";

const ProductSeller = () => {
  const [products, setProducts] = useState([]);
  const [productsEnable, setProductsEnable] = useState([]);
  const [productsDisable, setProductsDisable] = useState([]);
  const [productsBanned, setProductsBanned] = useState([]);
  const [productsInProgress, setProductsInProgress] = useState([]);
  const [productsRejected, setProductsRejected] = useState([]);
  const [productsExpired, setProductsExpired] = useState([]);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const navigate = useNavigate();

  const email = sessionStorage.getItem("email");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("Product/GetProductList/Deal/Seller", {
          params: { email: email },
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [email]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("Product/GetProductList/Enable/Seller", {
          params: { email: email },
        });
        setProductsEnable(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [email]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get(
          "Product/GetProductList/Disable/Seller",
          {
            params: { email: email },
          }
        );
        setProductsDisable(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [email]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("Product/GetProductList/Banned/Seller", {
          params: { email: email },
        });
        setProductsBanned(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [email]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get(
          "Product/GetProductList/InProgress/Seller",
          {
            params: { email: email },
          }
        );
        setProductsInProgress(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [email]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get(
          "Product/GetProductList/Rejected/Seller",
          {
            params: { email: email },
          }
        );
        setProductsRejected(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [email]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get(
          "Product/GetProductList/Expired/Seller",
          {
            params: { email: email },
          }
        );
        setProductsExpired(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [email]);

  const handleViewDetails = (productId) => {
    const allProducts = [
      ...products,
      ...productsEnable,
      ...productsDisable,
      ...productsBanned,
      ...productsInProgress,
      ...productsRejected,
      ...productsExpired,
    ];

    const product = allProducts.find((p) => p.productId === productId);

    setProductDetails(product);
    setDetailsVisible(true);
  };

  const handleDetailsCancel = () => {
    setDetailsVisible(false);
    setProductDetails(null);
  };

  const handleCreateOrder = (productId) => {
    navigate(`/create-order-id/${productId}`);
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Freshness Duration",
      dataIndex: "freshnessDuration",
      key: "freshnessDuration",
    },
    {
      title: "Combo Type",
      dataIndex: "comboType",
      key: "comboType",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => formatCurrency(price), // Check if price is defined
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Image",
      dataIndex: "productImage",
      key: "productImage",
      render: (images) =>
        images && images.length > 0 ? (
          <Image
            src={images[0]}
            alt="Product"
            style={{ width: 50, height: 50 }}
          />
        ) : (
          <span>No Image</span>
        ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => new Date(createdAt).toLocaleString(),
    },
    {
      title: "Expired At",
      dataIndex: "expireddAt",
      key: "expireddAt",
      render: (expireddAt) => new Date(expireddAt).toLocaleString(),
    },

    {
      title: "Action",
      key: "action",
      render: (record) => {
        console.log("Record:", record);
        return (
          <>
            <Button onClick={() => handleViewDetails(record.productId)}>
              Detail
            </Button>
            {record.price === 0 && (
              <Button
                className="mt-[10px]"
                onClick={() => handleCreateOrder(record.productId)}
              >
                Create order
              </Button>
            )}
          </>
        );
      },
    },
  ];

  const formatCurrency = (amount) => {
    if (amount === 0) {
      return "For Deal";
    }
    const validAmount = amount !== undefined ? amount : 0;
    return (
      validAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ"
    );
  };

  console.log("Products:", products);

  return (
    <div>
      <Header />
      <div className="flex mt-[50px] ml-[30px]">
        <SlidebarSeller />
        <div className="ml-[50px] w-[1100px] shadow-md p-[20px]">
          <p className="text-3xl ml-[500px] mb-[40px]">ALL PRODUCTS</p>

          <Tabs>
            <Tab label="Deal Product">
              <Table dataSource={products} columns={columns} pagination={4} />
            </Tab>

            <Tab label="Enabled Product">
              <Table
                dataSource={productsEnable}
                columns={columns}
                pagination={4}
              />
            </Tab>
            <Tab label="Disabled Product">
              <Table
                dataSource={productsDisable}
                columns={columns}
                pagination={4}
              />
            </Tab>
            <Tab label="Banned Product">
              <Table
                dataSource={productsBanned}
                columns={columns}
                pagination={4}
              />
            </Tab>
            <Tab label="In Progress Product">
              <Table
                dataSource={productsInProgress}
                columns={columns}
                pagination={4}
              />
            </Tab>
            <Tab label="Rejected Product">
              <Table
                dataSource={productsRejected}
                columns={columns}
                pagination={4}
              />
            </Tab>
            <Tab label="Expired Product">
              <Table
                dataSource={productsExpired}
                columns={columns}
                pagination={4}
              />
            </Tab>
          </Tabs>
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
              {productDetails.productImage.map((url, index) => (
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
      <Footer />
    </div>
  );
};

export default ProductSeller;
