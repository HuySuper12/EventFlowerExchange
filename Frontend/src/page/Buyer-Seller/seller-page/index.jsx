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
        const response = await api.get(`Product/GetProductList/Enable/Seller`, {params: {email: seller.email}});
        setSellerProducts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching seller details:", error);
      }
    };

    fetchSellerProduct();
  },);

  useEffect(() => {
    const fetchSellerSoldProduct = async () => {
      try {
        const response = await api.get(`Product/GetProductList/Disable/Seller`, {params: {email: seller.email}});
        setSellerSoldProducts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching seller details:", error);
      }
    };

    fetchSellerSoldProduct();
  },);




  return (
    <>
      <Header />

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
                <button className="px-4 py-2 bg-white text-gray-800 border border-gray-800 font-bold rounded-md hover:bg-blue-200 transition flex items-center gap-2">
                  <img
                    src="https://cdn-icons-png.freepik.com/512/5962/5962463.png"
                    alt="Chat Icon"
                    className="w-5 h-5"
                  />
                  Chat
                </button>
                
                <button className="px-4 py-2 bg-gray-200 text-black font-bold rounded-md hover:bg-green-400 transition flex items-center gap-2">
                  <img
                    src="https://icons.veryicon.com/png/o/miscellaneous/3vjia-icon-line/follow-42.png"
                    alt="Shop Icon"
                    className="w-5 h-5"
                  />
                  Follow
                </button>
                <button className="px-4 py-2 bg-gray-200 text-black font-bold rounded-md hover:bg-red-400 transition flex items-center gap-2">
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/event-flower-exchange.appspot.com/o/png-transparent-error-icon-thumbnail-removebg-preview.png?alt=media&token=0519d1a5-51eb-4243-863d-7fc860a4c522"
                    alt="Shop Icon"
                    className="w-5 h-5"
                  />
                  Report
                </button>
              </div>
            </div>
          </div>
          <div className="flex gap-4 text-gray-600">
            <div>
              <p>Products</p>
              <p className="font-bold">138</p>
            </div>
            <div>
              <p>Joined</p>
              <p className="font-bold">7 months ago</p>
            </div>
            <div>
              <p>Response Time</p>
              <p className="text-red-500 font-bold">within a few hours</p>
            </div>
            <div>
              <p>Followers</p>
              <p className="font-bold">39.9k</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="container mx-auto px-4 py-4 w-[1480px] mt-10 ml-[105px] mr-[120px]">
        <h2 className="text-2xl font-bold mb-8 ml-[600px]">Products of Seller</h2>
        <ProductCard products={sellerProducts} />{" "}
        {/* Pass filtered related products to ProductCard */}
      </div>

      <div className="container mx-auto px-4 py-4 w-[1480px] mt-10 ml-[105px] mr-[120px]">
        <h2 className="text-2xl font-bold mb-8 ml-[600px]">Products Sold Out of Seller </h2>
        <ProductCard products={sellerSoldProducts} />{" "}
        {/* Pass filtered related products to ProductCard */}
      </div>

      <Footer />
    </>
  );
};

export default SellerPage;
