import React, { useState, useEffect } from "react";
import api from "../../../config/axios"; // Import axios
import Header from "../../../component/header";
import Footer from "../../../component/footer";
import { Button, Form, Input, Rate } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function Rating_Page() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("Order/ViewOrderDetail", {
          params: { id: id },
        });

        setProducts(response.data || []); // Set products state
        console.log("API Response:", response.data);
      } catch (error) {
        console.error("Error fetching products", error);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [id]);

  const formatCurrency = (amount) => {
    const validAmount = amount !== undefined ? amount : 0;
    return (
      validAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ"
    );
  };

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("Order/SearchOrderByOrderId", {
          params: { orderId: id },
        });

        setOrder(response.data || []); // Set products state
        console.log("API Response:", response.data);
      } catch (error) {
        console.error("Error fetching products", error);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleSubmit = (values) => {
    const email = sessionStorage.getItem("email");
    const data = {
      orderId: id, // Replace with actual order ID
      buyerEmail: email,
      rating: values.rating,
      comment: values.description,
    };

    api
      .post("Rating/PostRating", data)
      .then((response) => {
        console.log("Response:", response.data);
        if (response.data === true) {
          toast.success("Review and Rating submitted successfully");
          navigate("/order");
        } else {
          toast.error("Review and Rating submission failed");
        }
      })
      .catch((error) => {
        console.error("Error submitting form", error);
      });
  };

  return (
    <>
      <Header />
      <div className="border-t pt-16 ml-[750px] mr-[300px] mb-[30px]">
        <div className="text-2xl">
          <div className="inline-flex items-center gap-2 mb-2 mt-10">
            <p className="prata-regular text-3xl">Review and Rating</p>
          </div>
        </div>
      </div>

      

      <div className="ml-[300px] w-[1100px]">
        <div>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : products.length > 0 ? (
            products.map((product) => (
              <div key={product.productId} className="mb-2">
                <div className="py-4 text-gray-700 border-t border-b">
                  <div className="flex items-start justify-between gap-6 text-sm">
                    <div className="flex items-start gap-6">
                      <img
                        src={product.productImage[0]}
                        alt={product.productName}
                        className="w-16 sm:w-20"
                      />
                      <div className="flex-1">
                        <p className="sm:text-base font-medium">
                          {product.productName}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                          <p className="text-lg">
                            {formatCurrency(product.price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </div>

      <div className="ml-[1200px] mt-[50px] w-[1100px]  text-xl font-medium">
        Total: {formatCurrency(order.totalPrice)}
      </div>

      <Form className="ml-[300px] w-[1100px]" onFinish={handleSubmit}>
        <Form.Item
          label={<span className="text-xl">Rating</span>}
          name="rating"
          initialValue={3}
        >
          <Rate className="text-4xl" allowClear={false} />
        </Form.Item>

        <Form.Item
          label={<span className="text-xl">Description</span>}
          name="description"
          rules={[
            { required: true, message: "Please input your description!" },
          ]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="mt-4 w-[120px] h-[50px] rounded-2xl ml-[500px]"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>

      <Footer />
    </>
  );
}

export default Rating_Page;
