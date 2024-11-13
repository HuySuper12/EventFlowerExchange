import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import { Button, Form, Image, Input, Modal, Rate } from "antd";
import Header from "../../../component/header";
import Footer from "../../../component/footer";
import api from "../../../config/axios";
import ProductCard from "../../../component/product-card"; // Import ProductCard
import { toast } from "react-toastify";

const ProductPage = () => {
  const { id } = useParams();
  const [productDetails, setProductDetails] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [activeTab, setActiveTab] = useState("Description");
  const [seller, setSeller] = useState({}); // Updated state for seller
  const [relatedProducts, setRelatedProducts] = useState([]); // State for related products
  const descriptionRef = useRef(null); // Reference for the description section
  const [isFollowed, setIsFollowed] = useState(false);
  const [countFollow, setCountFollow] = useState(0);
  const navigate = useNavigate();
  const userRole = sessionStorage.getItem("role"); // Lấy vai trò người dùng
  const [ordersAndRating, setOrdersAndRating] = useState([]);
  const [rating, setRating] = useState([]);
  const [buyerRating, setBuyerRating] = useState([]);
  const [cartData, setCartData] = useState([]);
  const email = sessionStorage.getItem("email");
  const [user, setUser] = useState(null);
  const [reportVisible, setReportVisible] = useState(false);
  const [reason, setReason] = useState("");

  // Function to fetch product details from API
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);

  const handleGetUser = async () => {
    const email = sessionStorage.getItem("email");
    const EncodeEmail = encodeURIComponent(email);
    if (email) {
      const response = await api.get(
        `Account/GetAccountByEmail/${EncodeEmail}`
      );
      setUser(response.data);
      console.log("buyer:", response.data);
    }
  };

  useEffect(() => {
    handleGetUser();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);

  const fetchProductDetails = async () => {
    try {
      const response = await api.get(`Product/SearchProduct/`, {
        params: {
          id: id,
        },
      });
      setProductDetails(response.data);
      setMainImage(response.data.productImage[0] || "");
      console.log("product", response.data);

      // Fetch seller details using sellerId
      const sellerResponse = await api.get(
        `Account/GetAccountById/${response.data.sellerId}`
      );
      setSeller(sellerResponse.data); // Set seller object
      console.log(sellerResponse.data);

      // Fetch related products based on category
      fetchRelatedProducts(response.data.category);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  // Function to fetch related products based on category
  const fetchRelatedProducts = async (category) => {
    try {
      const response = await api.get("Product/GetProductList/Enable");
      const filteredProducts = response.data.filter(
        (product) => product.category === category
      );
      setRelatedProducts(filteredProducts.slice(0, 4)); // Limit to 4 products
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  // Fetch product details when the component mounts or ID changes
  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const scrollToDescription = () => {
    if (descriptionRef.current) {
      descriptionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Function to handle 'More' button click
  const handleMoreClick = () => {
    setActiveTab("Description"); // Switch to the Description tab
    scrollToDescription(); // Scroll to the description section
  };

  const handleAddToCart = async (event, productId) => {
    const token = sessionStorage.getItem("token");
    const email = sessionStorage.getItem("email");
    if (!token) {
      toast.error("You need to log in to add items to the cart.");
      navigate("/login");
      return;
    }

    console.log("Adding product with ID:", id);

    setCartData((prevCartData) => [
      ...prevCartData,
      { productId }, // Assuming productId is enough to identify the product
    ]);

    try {
      const response = await api.post("Cart/CreateCartItem", {
        productId: id,
        buyerEmail: email,
      });
      if (response.data === true) {
        toast.success(`Added product successfully`);
        console.log(response.data);
        console.log(email);
        console.log(productId);
      } else {
        toast.error("Add product failed");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Add product failed");

      setCartData((prevCartData) =>
        prevCartData.filter((item) => item.productId !== productId)
      );
    }
  };

  useEffect(() => {
    const handleCheckFollow = async () => {
      const email = sessionStorage.getItem("email");
      const response = await api.get(`Follow/CheckFollowByUserEmail`, {
        params: {
          sellerEmail: seller.email,
          followerEmail: email,
        },
      });
      setIsFollowed(response.data);
    };
    handleCheckFollow();
  }, [seller.email]);

  const handleGetCountFollowByUserEmail = async () => {
    try {
      const response = await api.get("Follow/GetCountFollowByUserEmail", {
        params: {
          email: seller.email,
        },
      });
      setCountFollow(response.data);
      console.log("countFollow", response.data);
    } catch (error) {
      console.error("Error fetching follow count:", error);
    }
  };

  // Call handleGetCountFollowByUserEmail in useEffect to ensure it runs on component mount
  useEffect(() => {
    handleGetCountFollowByUserEmail();
  }, [seller.email]);

  const handleFollow = async () => {
    const token = sessionStorage.getItem("token");
    const email = sessionStorage.getItem("email");
    if (!token) {
      toast.error("You need to log in to follow seller.");
      navigate("/login");
      return;
    }

    try {
      const response = await api.post("Follow/CreateFollow", {
        sellerEmail: seller.email,
        followerEmail: email,
      });
      console.log(response.data);
      if (response.data === true) {
        toast.success("Follow seller successfully");
        setIsFollowed(true);
        handleGetCountFollowByUserEmail(); // Refresh follow count
      } else {
        toast.error("Follow seller failed");
      }
    } catch (error) {
      console.error("Error following seller:", error);
      toast.error("Follow seller failed");
    }
  };

  const handleUnFollow = async () => {
    const token = sessionStorage.getItem("token");
    const email = sessionStorage.getItem("email");
    if (!token) {
      toast.error("You need to log in to unfollow seller.");
      navigate("/login");
      return;
    }

    try {
      const response = await api.delete(`Follow/RemoveFollower`, {
        params: {
          sellerEmail: seller.email,
          followerEmail: email,
        },
      });
      console.log(response.data);
      if (response.data === true) {
        toast.success("Unfollow seller successfully");
        setIsFollowed(false);
        handleGetCountFollowByUserEmail(); // Refresh follow count
      } else {
        toast.error("Unfollow seller failed");
      }
    } catch (error) {
      console.error("Error unfollowing seller:", error);
      toast.error("Unfollow seller failed");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    if (amount === 0) {
      return "For Deal";
    }
    const validAmount = amount !== undefined ? amount : 0;
    return (
      validAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ"
    );
  };

  const handleGetOrdersAndRatingBySellerEmail = async () => {
    try {
      const response = await api.get(
        "Product/GetOrdersAndRatingBySellerEmail",
        {
          params: {
            email: seller.email,
          },
        }
      );
      setOrdersAndRating(response.data);
    } catch (error) {
      console.error("Error fetching orders and rating:", error);
    }
  };

  // Call handleGetOrdersAndRatingBySellerEmail in useEffect to ensure it runs on component mount
  useEffect(() => {
    if (seller.email) {
      handleGetOrdersAndRatingBySellerEmail();
    }
  }, [seller.email]);

  const handleViewRatingByProductId = async () => {
    const response = await api.get(`Rating/ViewRatingByProductId`, {
      params: {
        productId: id,
      },
    });
    setRating(response.data);
    console.log("rating:", response.data);
  };

  useEffect(() => {
    handleViewRatingByProductId();
  }, [id]);

  const handleGetAccountRatingById = async () => {
    try {
      const response = await api.get(
        `Account/GetAccountById/${rating.buyerId}`
      );
      setBuyerRating(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching account by ID:", error);
    }
  };

  useEffect(() => {
    if (rating.buyerId) {
      handleGetAccountRatingById();
    }
  }, [rating.buyerId]);

  useEffect(() => {
    const fetchCartData = async () => {
      if (email) {
        try {
          const response = await api.get(`Cart/ViewCartByUserEmail`, {
            params: { email: email },
          });
          setCartData(response.data);
        } catch (error) {
          console.error("Error fetching cart data:", error);
        }
      } else {
        console.error("Email is not set in sessionStorage.");
      }
    };

    fetchCartData();
  }, [email]);

  const handleChatWithSeller = async () => {
    navigate(`/chat/${seller.email}`);
  };

  const handleReport = async () => {
    setReportVisible(true);
  };

  const handleSubmitReport = async () => {
    try {
      const response = await api.post(`Request/CreateRequest`, {
        userId: user.id,
        productId: id,
        reason: reason,
        requestType: "Report",
        status: "Pending",
      });
      console.log(reason);
      console.log(response.data);
      if (response.data === true) {
        toast.success("Request report is sent successfully!");
        setReportVisible(false);
      }
    } catch (error) {
      console.error("Error reporting this product:", error);
      toast.error("Failed to report this product.");
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 mt-10 ml-[120px] mr-[120px] w-[1450px] shadow-md">
        <div className="flex flex-wrap -mx-4">
          {/* Product Image Section */}
          <div className="w-full justify-center md:w-1/2 px-4 mb-8">
            <Image
              width={650}
              height={500}
              src={mainImage}
              alt="Product"
              className="rounded-lg ml-[25px] shadow-md mb-4"
            />
            <div className="flex gap-4 py-4 justify-center overflow-x-auto">
              {productDetails?.productImage?.map((src, index) => (
                <img
                  key={index}
                  width={100}
                  height={100}
                  src={src}
                  alt={`Thumbnail ${index + 1}`}
                  className="rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                  onClick={() => setMainImage(src)}
                />
              ))}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="w-full md:w-1/2 px-4">
            <h2 className="text-3xl font-bold mb-6">
              {productDetails?.productName || "Loading..."}
            </h2>
            <div className="mb-6">
              <span className="text-2xl font-bold mr-2 text-red-500">
                {formatCurrency(productDetails?.price) || "0"}
              </span>
            </div>

            <div className="mb-6">
              <span className="text-2xl font-bold mr-2">
                Freshness Duration:
              </span>
              <span className="text-2xl mr-2 ">
                {productDetails?.freshnessDuration || "0.00"} day
              </span>
            </div>

            <div className="mb-6">
              <span className="text-2xl font-bold mr-2">Category:</span>
              <span className="text-2xl mr-2 ">
                {productDetails?.category || "0.00"}
              </span>
            </div>

            <div className="mb-6">
              <span className="text-2xl font-bold mr-2">Combo Type:</span>
              <span className="text-2xl mr-2 ">
                {productDetails?.comboType || "0.00"}
              </span>
            </div>

            <div className="mb-6">
              <span className="text-2xl font-bold mr-2">Post Date:</span>
              <span className="text-2xl mr-2 ">
                {formatDate(productDetails?.createdAt) || "0"}
              </span>
            </div>

            <div className="mb-6">
              <span className="text-2xl font-bold mr-2">Description:</span>
              <span>
                {productDetails?.description
                  ? productDetails.description
                      .split(" ")
                      .slice(0, 30)
                      .join(" ") + "..."
                  : "No description available"}
              </span>
              <button
                className="text-blue-500 ml-2"
                onClick={scrollToDescription} // Function to scroll to full description
              >
                More
              </button>
            </div>

            {/* Chỉ hiển thị nút "Add to Cart" nếu người dùng không phải là seller */}
            {userRole !== "Seller" &&
              productDetails?.status === "Enable" &&
              !cartData.some(
                (item) => item.productId === productDetails.productId
              ) && (
                <div className="flex items-center gap-4 mb-6">
                  <button
                    className="px-20 py-3 text-black bg-white border border-black rounded-lg hover:bg-orange-300 transition ml-[200px] mt-[20px]"
                    onClick={(event) =>
                      handleAddToCart(event, productDetails.productId)
                    }
                  >
                    Add to Cart
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Seller Profile Section */}
      <div className="container mx-auto px-4 py-4 w-[1480px] mt-10 ml-[105px] mr-[120px]">
        <div className="flex gap-20 items-center p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-4">
            <img
              src={seller.picture}
              alt="Profile"
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h2 className="text-xl font-bold">
                {seller.name || "Loading..."}
              </h2>
              <div className="flex gap-4 mt-4">
                {userRole !== "Seller" && (
                  <button
                    className="px-4 py-2 bg-white text-gray-800 border border-gray-800 font-bold rounded-md hover:bg-blue-200 transition flex items-center gap-2"
                    onClick={handleChatWithSeller}
                  >
                    <img
                      src="https://cdn-icons-png.freepik.com/512/5962/5962463.png"
                      alt="Chat Icon"
                      className="w-5 h-5"
                    />
                    Chat
                  </button>
                )}
                <button
                  className="px-4 py-2 bg-gray-200 text-black font-bold rounded-md hover:bg-orange-300 transition flex items-center gap-2"
                  onClick={() => navigate(`/seller/${seller.id}`)}
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3225/3225196.png"
                    alt="Shop Icon"
                    className="w-5 h-5"
                  />
                  Visit Shop
                </button>
                {/* Chỉ hiển thị nút "Follow" hoặc "Unfollow" nếu người dùng không phải là seller */}
                {userRole !== "Seller" &&
                  (isFollowed ? (
                    <button
                      className="px-4 py-2 bg-gray-200 text-black font-bold rounded-md hover:bg-red-400 transition flex items-center gap-2"
                      onClick={handleUnFollow}
                    >
                      <img
                        src="https://cdn2.iconfinder.com/data/icons/pinpoint-interface/48/unfollow-512.png"
                        alt="Unfollow Icon"
                        className="w-5 h-5"
                      />
                      Unfollow
                    </button>
                  ) : (
                    <button
                      className="px-4 py-2 bg-gray-200 text-black font-bold rounded-md hover:bg-green-400 transition flex items-center gap-2"
                      onClick={handleFollow}
                    >
                      <img
                        src="https://icons.veryicon.com/png/o/miscellaneous/3vjia-icon-line/follow-42.png"
                        alt="Follow Icon"
                        className="w-5 h-5"
                      />
                      Follow
                    </button>
                  ))}
                {userRole !== "Seller" && (
                  <button
                    className="px-4 py-2 bg-gray-200 text-black font-bold rounded-md hover:bg-red-400 transition flex items-center gap-2"
                    onClick={handleReport}
                  >
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/event-flower-exchange.appspot.com/o/png-transparent-error-icon-thumbnail-removebg-preview.png?alt=media&token=0519d1a5-51eb-4243-863d-7fc860a4c522"
                      alt="Report Icon"
                      className="w-5 h-5"
                    />
                    Report
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-4 text-gray-600">
            <div>
              <p>Products</p>
              <p className="font-bold">{ordersAndRating.enableProducts || 0}</p>
            </div>
            <div>
              <p>Joined</p>
              <p className="font-bold">{formatDate(seller.createdAt)}</p>
            </div>
            <div>
              <p>Response Time</p>
              <p className="text-red-500 font-bold">within a few hours</p>
            </div>
            <div>
              <p>Followers</p>
              <p className="font-bold">{countFollow}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Section for Description and Reviews */}
      <div className="mx-20 px-4 py-8 ml-[105px]" ref={descriptionRef}>
        <div className="flex mb-[10px]">
          <b
            className={`border rounded-[30px] px-5 py-3 text-sm cursor-pointer transition duration-300 ${
              activeTab === "Description"
                ? "text-black bg-gray-200 border-black shadow-sm"
                : "text-gray-500 bg-white border-gray-300"
            }`}
            onClick={() => setActiveTab("Description")}
          >
            Description
          </b>
          <p
            className={`border rounded-[30px] px-5 py-3 text-sm cursor-pointer transition duration-300 ml-2 ${
              activeTab === "Reviews"
                ? "text-black bg-gray-200 border-black"
                : "text-gray-500 bg-white border-gray-300"
            }`}
            onClick={() => setActiveTab("Reviews")}
          >
            Reviews
          </p>
        </div>

        <div className="flex flex-col gap-4 border px-6 py-6 text-sm w-[1450px] text-gray-500">
          {activeTab === "Description" ? (
            <p>{productDetails?.description || "No description available"}</p>
          ) : (
            <>
              {/* Review  */}
              <div className="flex items-start gap-4">
                <img
                  src={buyerRating?.picture}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-bold text-gray-800">
                    {buyerRating?.name || "No name available"}
                  </p>

                  <Rate
                    className="mt-2"
                    disabled
                    defaultValue={rating.rating}
                  />

                  <div className="text-sm text-gray-400 mt-2">
                    {rating?.createdAt
                      ? formatDate(rating.createdAt)
                      : "No date available"}
                  </div>

                  <p className="mt-2 text-lg text-gray-950 ">
                    {rating?.comment || "No comment available"}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      <div className="container mx-auto px-4 py-4 w-[1480px] mt-10 ml-[105px] mr-[120px]">
        <h2 className="text-2xl font-bold mb-8 ml-[600px]">Related Products</h2>
        <ProductCard products={relatedProducts} />{" "}
        {/* Pass filtered related products to ProductCard */}
      </div>

      <Footer />

      <Modal
        title="Report Product"
        open={reportVisible}
        onOk={handleSubmitReport}
        onCancel={() => setReportVisible(false)}
        footer={[
          <Button key="back" onClick={() => setReportVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" danger onClick={handleSubmitReport}>
            Report
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Reason for Report This Product" required>
            <Input.TextArea
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a reason for report this product"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ProductPage;
