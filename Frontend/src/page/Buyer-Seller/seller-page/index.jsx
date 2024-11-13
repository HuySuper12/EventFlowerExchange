import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import { Image } from "antd";
import Header from "../../../component/header";
import Footer from "../../../component/footer";
import api from "../../../config/axios";
import ProductCard from "../../../component/product-card"; // Import ProductCard
import { toast } from "react-toastify";

const SellerPage = () => {
  const { id } = useParams(); // Get sellerId from URL
  const [seller, setSeller] = useState({});
  const [sellerProducts, setSellerProducts] = useState([]);
  const [sellerSoldProducts, setSellerSoldProducts] = useState([]);
  const [isFollowed, setIsFollowed] = useState(false);
  const [countFollow, setCountFollow] = useState(0);
  const navigate = useNavigate();
  const userRole = sessionStorage.getItem("role");
  const [ordersAndRating, setOrdersAndRating] = useState({});

  useEffect(() => {
    const fetchSellerDetails = async () => {
      try {
        const response = await api.get(`Account/GetAccountById/${id}`);
        setSeller(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching seller details:", error);
      }
    };

    fetchSellerDetails();
  }, [id]);

  useEffect(() => {
    const fetchSellerProduct = async () => {
      try {
        const response = await api.get(`Product/GetProductList/Enable/Seller`, {
          params: { email: seller.email },
        });
        setSellerProducts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching seller details:", error);
      }
    };

    fetchSellerProduct();
  });

  useEffect(() => {
    const fetchSellerSoldProduct = async () => {
      try {
        const response = await api.get(
          `Product/GetProductList/Disable/Seller`,
          { params: { email: seller.email } }
        );
        setSellerSoldProducts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching seller details:", error);
      }
    };

    fetchSellerSoldProduct();
  });

  useEffect(() => {
    const fetchSellerSoldProduct = async () => {
      try {
        const response = await api.get(`Product/GetOrdersAnd`, {
          params: { email: seller.email },
        });
        setSellerSoldProducts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching seller details:", error);
      }
    };

    fetchSellerSoldProduct();
  });

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

  const handleChatWithSeller = () => {
    navigate(`/chat/${seller.email}`);
  };

  const handleReport = () => {
    navigate(`/report/${seller.email}`);
  };

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);

  return (
    <>
      <Header />

      {/* Seller Profile Section */}
      <div className="container mx-auto px-4 py-4 w-[1480px] mt-10 ml-[105px] mr-[120px]">
        <div className="flex gap-20 items-center p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-4">
            <img
              src={seller.picture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
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

      {/* Related Products Section */}
      <div className="container mx-auto px-4 py-4 w-[1480px] mt-10 ml-[105px] mr-[120px]">
        <h2 className="text-2xl font-bold mb-8 ml-[600px]">
          Products of Seller
        </h2>
        <ProductCard products={sellerProducts} />{" "}
        {/* Pass filtered related products to ProductCard */}
      </div>

      <div className="container mx-auto px-4 py-4 w-[1480px] mt-10 ml-[105px] mr-[120px]">
        <h2 className="text-2xl font-bold mb-8 ml-[600px]">
          Products Sold Out of Seller{" "}
        </h2>
        <ProductCard products={sellerSoldProducts} />{" "}
        {/* Pass filtered related products to ProductCard */}
      </div>

      <Footer />
    </>
  );
};

export default SellerPage;
