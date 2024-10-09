import { useEffect, useState } from "react";
import Header from "../../../component/header";
import ProductCard from "../../../component/product-card";
import "./index.scss";
import api from "../../../config/axios";
import Banner from "../../../component/banner/banner";
import { Link } from "react-router-dom";
import Footer from "../../../component/footer";

const Home = () => {
  const products = [
    {
      id: 1,
      name: "Peace Lily hoa tiệc cưới tiệc hahah",
      type: "Indoor",
      price: "$36.00",
      postDate: "Posted on: Oct 1, 2024", // Thêm post date
      image:
        "https://user-images.githubusercontent.com/2805249/64069899-8bdaa180-cc97-11e9-9b19-1a9e1a254c18.png",
    },
    {
      id: 2,
      name: "Monstera",
      type: "Outdoor",
      price: "$45.00",
      postDate: "Posted on: Oct 2, 2024", // Thêm post date
      image:
        "https://user-images.githubusercontent.com/2805249/64069998-305de300-cc9a-11e9-8ae7-5a0fe00299f2.png",
    },
    {
      id: 3,
      name: "Oak Tree",
      type: "Outdoor",
      price: "$68.50",
      postDate: "Posted on: Oct 2, 2024", // Thêm post date
      image:
        "https://user-images.githubusercontent.com/2805249/64069899-8bdaa180-cc97-11e9-9b19-1a9e1a254c18.png",
    },
    {
      id: 4,
      name: "Pothos",
      type: "Indoor",
      price: "$30.00",
      postDate: "Posted on: Oct 2, 2024", // Thêm post date
      image:
        "https://user-images.githubusercontent.com/2805249/64069899-8bdaa180-cc97-11e9-9b19-1a9e1a254c18.png",
    },
    {
      id: 5,
      name: "Snake Plant",
      type: "Indoor",
      price: "$25.00",
      postDate: "Posted on: Oct 2, 2024", // Thêm post date
      image: "https://hoayeuthuong.com/hinh-hoa-tuoi/hoa-cuc/10704_tinh.jpg",
    },
  ];

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

      <ProductCard products={products} />

      <div className="flex justify-center mt-4">
        <Link to={"/product"}>
          <button className="flex items-center bg-white text-black border border-black px-4 py-2 transition-colors duration-300 hover:bg-blue-500 hover:text-white rounded-[50px] ">
            <img
              src="https://img.lovepik.com/element/40144/6207.png_860.png"
              alt="icon"
              className="h-6 w-6 mr-2 transform rotate-90" // Adjust margin and rotation
            />
            Show more
          </button>
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default Home;

// import { useEffect, useState } from "react";
// import Header from "../../component/header";
// import ProductCard from "../../component/product-card";
// import "./index.scss";
// import api from "../../config/axios"; // Đã cấu hình Axios
// import Banner from "../../component/banner/banner";

// const Home = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true); // Để hiển thị trạng thái loading
//   const [error, setError] = useState(null); // Xử lý lỗi

//   // useEffect để gọi API khi component mount
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await api.get("/products"); // Đường dẫn API để lấy danh sách sản phẩm
//         setProducts(response.data); // Giả sử response trả về danh sách sản phẩm
//         setLoading(false);
//       } catch (err) {
//         setError("Failed to load products");
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   // Nếu dữ liệu đang tải hoặc gặp lỗi
//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div className="home">
//       <Header />
//       <Banner />

//       <div className="text-center py-8 text-3xl">
//         <div className="inline-flex gap-2 items-center mb-3">
//           <p className="text-gray-500">NEW</p>
//           <span className="text-gray-700 font-medium">ARRIVALS</span>
//           <div className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700"></div>
//         </div>
//       </div>

//       {/* Truyền danh sách sản phẩm từ API vào ProductCard */}
//       <ProductCard products={products} />

//       <div className="flex justify-center mt-4">
//         <button className="flex items-center bg-white text-black border border-black px-4 py-2 transition-colors duration-300 hover:bg-blue-500 hover:text-white rounded-[50px] ">
//           <img
//             src="https://img.lovepik.com/element/40144/6207.png_860.png"
//             alt="icon"
//             className="h-6 w-6 mr-2 transform rotate-90" // Adjust margin and rotation
//           />
//           Show more
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Home;
