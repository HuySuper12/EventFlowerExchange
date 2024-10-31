import { useEffect, useState } from "react";
import Header from "../../../component/header";
import ProductCard from "../../../component/product-card";
import "./index.scss";
import api from "../../../config/axios";
import Banner from "../../../component/banner/banner";
import { Link } from "react-router-dom";
import Footer from "../../../component/footer";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect để gọi API khi component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("Product/GetProductList/Latest"); // Đường dẫn API để lấy danh sách sản phẩm
        setProducts(response.data); // Giả sử response trả về danh sách sản phẩm
        setLoading(false);
      } catch (err) {
        setError("Failed to load products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Nếu dữ liệu đang tải hoặc gặp lỗi
  if (loading) {
    return <div>Loading...</div>;
  }



  return (
    <div className="home">
      <Header />
      <Banner />

      <div className="text-center py-8 text-3xl">
        <div className="inline-flex gap-2 items-center mb-3">
          <p className="text-gray-500">NEW</p>
          <span className="text-gray-700 font-medium">ARRIVALS</span>
          <div className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700"></div>
        </div>
      </div>

      {/* Truyền danh sách sản phẩm từ API vào ProductCard */}
      <ProductCard products={products} />

      <Link to={"/product"}>
        <div className="flex justify-center mt-4">
          <button
            className="flex items-center bg-white text-black border border-black px-4 py-2 transition-colors duration-300 hover:bg-blue-500 hover:text-white rounded-[50px]"
            onClick={() => window.scrollTo(0, 0)}
          >
            <img
              src="https://firebasestorage.googleapis.com/v0/b/event-flower-exchange.appspot.com/o/6207.png_860_preview_rev_1.png?alt=media&token=f40c66c1-e8c8-4e7c-81ea-e0994f92601a"
              alt="icon"
              className="h-6 w-6 mr-2 transform rotate-90"
            />
            Show more
          </button>
        </div>
      </Link>

      <Footer />
    </div>
  );
};

export default Home;
