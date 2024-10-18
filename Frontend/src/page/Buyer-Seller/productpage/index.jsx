import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import { Image } from "antd";
import Header from "../../../component/header";
import Footer from "../../../component/footer";
import api from "../../../config/axios";

const ProductPage = () => {
  const { id } = useParams(); 
  const [productDetails, setProductDetails] = useState(null); // Product details state
  const [mainImage, setMainImage] = useState(""); // Main image state
  const [activeTab, setActiveTab] = useState("Description"); // Tab state

  // Function to fetch product details from API
  const fetchProductDetails = async () => {
    try {
      const response = await api.get(`Product/SearchProduct/${id}`); // Sử dụng ID từ URL
      setProductDetails(response.data); // Update product details
      setMainImage(response.data.productImage[0] || ""); // Set main image
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  // Fetch product details when the component mounts or ID changes
  useEffect(() => {
    fetchProductDetails();
  }, [id]);

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
              src={mainImage} // Display main image from state
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
                  onClick={() => setMainImage(src)} // Change main image on click
                />
              ))}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="w-full md:w-1/2 px-4">
            <h2 className="text-3xl font-bold mb-2">
              {productDetails?.productName || "Loading..."}
            </h2>
            <div className="mb-4">
              <span className="text-2xl font-bold mr-2">
                ${productDetails?.price || "0.00"}
              </span>
              {productDetails?.originalPrice && (
                <span className="text-gray-500 line-through">
                  ${productDetails.originalPrice}
                </span>
              )}
            </div>
            <p className="text-gray-700 mb-6">
              {productDetails?.description || "No description available"}
            </p>
            <div className="flex items-center gap-4 mb-6">
              <button className="px-6 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-500 transition">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Seller Profile Section */}
      <div className="container mx-auto px-4 py-4 w-[1480px] mt-10 ml-[105px] mr-[120px]">
        <div className="flex gap-20 items-center p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-4">
            <img
              src="https://via.placeholder.com/80"
              alt="Profile"
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h2 className="text-xl font-bold">Chiosala12</h2>
              <div className="flex gap-4 mt-4">
                <button className="px-4 py-2 bg-white text-gray-800 border border-gray-800 font-bold rounded-md hover:bg-blue-200 transition flex items-center gap-2">
                  <img
                    src="https://cdn-icons-png.freepik.com/512/5962/5962463.png"
                    alt="Chat Icon"
                    className="w-5 h-5"
                  />
                  Chat Ngay
                </button>
                <button className="px-4 py-2 bg-gray-200 text-black font-bold rounded-md hover:bg-orange-300 transition flex items-center gap-2">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3225/3225196.png"
                    alt="Shop Icon"
                    className="w-5 h-5"
                  />
                  Xem Shop
                </button>
              </div>
            </div>
          </div>
          <div className="flex gap-4 text-gray-600">
            <div>
              <p>Sản Phẩm</p>
              <p className="font-bold">138</p>
            </div>
            <div>
              <p>Tham Gia</p>
              <p className="font-bold">7 tháng trước</p>
            </div>
            <div>
              <p>Thời Gian Phản Hồi</p>
              <p className="text-red-500 font-bold">trong vài giờ</p>
            </div>
            <div>
              <p>Người Theo Dõi</p>
              <p className="font-bold">39,9k</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Section for Description and Reviews */}
      <div className="mx-20 px-4 py-8 ml-[105px]">
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

        {/* Content Display Based on Active Tab */}
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm w-[1450px] text-gray-500">
          {activeTab === "Description" ? (
            <p>{productDetails?.description || "No description available"}</p>
          ) : (
            <>
              <div className="flex items-start gap-4">
                <img
                  src="https://www.w3schools.com/howto/img_avatar.png"
                  alt="Avatar"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-bold text-gray-800">John Doe</p>
                  <div className="flex items-center gap-2 text-yellow-500">
                    <span>⭐⭐⭐⭐⭐</span>
                    <span className="text-sm text-gray-400">2 days ago</span>
                  </div>
                  <p>This product is amazing! I love the quality.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <img
                  src="https://www.w3schools.com/howto/img_avatar2.png"
                  alt="Avatar"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-bold text-gray-800">Jane Doe</p>
                  <div className="flex items-center gap-2 text-yellow-500">
                    <span>⭐⭐⭐⭐</span>
                    <span className="text-sm text-gray-400">1 day ago</span>
                  </div>
                  <p>I found this product very useful.</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductPage;
