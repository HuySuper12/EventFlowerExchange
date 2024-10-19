import React, { useState } from "react";
import Header from "../../../component/header";
import ProductCard from "../../../component/product-card";
import Footer from "../../../component/footer";

function Product() {
  const [sortOrder, setSortOrder] = useState(""); // State to store sorting order
  const [visibleCount, setVisibleCount] = useState(12);

  // Sample product data
  const products = [
    {
      id: 1,
      name: "Peace Lily",
      type: "Indoor",
      price: "$36.00",
      postDate: "Posted on: Oct 1, 2024",
      image:
        "https://user-images.githubusercontent.com/2805249/64069899-8bdaa180-cc97-11e9-9b19-1a9e1a254c18.png",
    },
    {
      id: 5,
      name: "Peace Lily",
      type: "Indoor",
      price: "$36.00",
      postDate: "Posted on: Oct 1, 2024",
      image:
        "https://user-images.githubusercontent.com/2805249/64069899-8bdaa180-cc97-11e9-9b19-1a9e1a254c18.png",
    },
    {
      id: 2,
      name: "Monstera",
      type: "Outdoor",
      price: "$45.00",
      postDate: "Posted on: Oct 2, 2024",
      image:
        "https://user-images.githubusercontent.com/2805249/64069899-8bdaa180-cc97-11e9-9b19-1a9e1a254c18.png",
    },
    {
      id: 3,
      name: "Cactus",
      type: "Indoor",
      price: "$20.00",
      postDate: "Posted on: Oct 3, 2024",
      image:
        "https://user-images.githubusercontent.com/2805249/64069899-8bdaa180-cc97-11e9-9b19-1a9e1a254c18.png",
    },
    {
      id: 4,
      name: "Oak Tree",
      type: "Outdoor",
      price: "$68.50",
      postDate: "Posted on: Oct 4, 2024",
      image:
        "https://user-images.githubusercontent.com/2805249/64069899-8bdaa180-cc97-11e9-9b19-1a9e1a254c18.png",
    },
  ];

  // Handle sorting change
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  // Function to sort products based on the selected sortOrder
  const sortProducts = (products) => {
    if (sortOrder === "low-high") {
      return products.sort(
        (a, b) =>
          parseFloat(a.price.substring(1)) - parseFloat(b.price.substring(1))
      );
    } else if (sortOrder === "high-low") {
      return products.sort(
        (a, b) =>
          parseFloat(b.price.substring(1)) - parseFloat(a.price.substring(1))
      );
    }
    return products; // Default to no sorting
  };

  // Get only the visible and sorted products
  const visibleProducts = sortProducts([...products]).slice(0, visibleCount);

  // Function to show more products
  const showMoreProducts = () => {
    setVisibleCount((prevCount) => prevCount + 12);
  };

  return (
    <div>
      <Header />

      {/* Title Section */}
      <div className="flex mt-[80px]">
        <p className="text-3xl ml-[800px] mb-[40px]">ALL PRODUCTS</p>

        <select
          className="border-2 border-gray-300 text-lg ml-[300px] mb-[40px]"
          onChange={handleSortChange}
          value={sortOrder}
        >
          <option value="">Sort by: Relevant</option>
          <option value="low-high">Sort by: Low to High</option>
          <option value="high-low">Sort by: High to Low</option>
        </select>
      </div>

      {/* Search bar UI only (No functionality) */}
      <div className="flex justify-center mb-5 ml-[150px]">
        <input
          type="text"
          placeholder="Search products..."
          className="border border-gray-300 rounded-lg p-2 w-1/3"
        />
        <button className="ml-[10px] px-4 py-2 bg-blue-500 text-white rounded-[20px] hover:bg-blue-600 transition-colors">
          Search
        </button>
      </div>

      {/* Product List */}
      <div className="product-list flex">
        <div>
          <div className="border border-gray-300 ml-[120px] rounded-[10px] w-[200px] h-[150px] mt-[30px]">
            <p className="text-center mb-3 text-xl font-medium mt-[10px]">
              Phân loại sản phẩm
            </p>
            <div className="flex flex-col gap-3 text-base font-light text-gray-700">
              <p className="flex items-center text-lg ml-[20px]">
                <input className="w-4 h-4 mr-2" type="checkbox" />
                Hoa theo lô
              </p>
              <p className="flex items-center text-lg ml-[20px]">
                <input className="w-4 h-4 mr-2" type="checkbox" />
                Hoa theo sự kiện
              </p>
            </div>
          </div>

          <div className="border border-gray-300 ml-[120px] rounded-[10px] w-[200px] h-[190px] mt-[30px]">
            <p className="text-center mb-3 text-xl font-medium mt-[10px]">
              Phân loại hoa
            </p>
            <div className="flex flex-col gap-3 text-base font-light text-gray-700">
              <p className="flex items-center text-lg ml-[20px]">
                <input className="w-4 h-4 mr-2" type="checkbox" />
                Hoa tiệc cưới
              </p>
              <p className="flex items-center text-lg ml-[20px]">
                <input className="w-4 h-4 mr-2" type="checkbox" />
                Hoa sinh nhật
              </p>
              <p className="flex items-center text-lg ml-[20px]">
                <input className="w-4 h-4 mr-2" type="checkbox" />
                Hoa hội nghị
              </p>
            </div>
          </div>
        </div>

        {/* Pass sorted and visible products */}
        <ProductCard products={visibleProducts} />
      </div>

      {/* Show More Button */}
      {visibleCount < products.length && (
        <div className="flex justify-center mt-6">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={showMoreProducts}
          >
            Show More
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Product;

//-------------------------------------------------------------------- Chưa có checkbox----------------------------------------------------------------
// import React, { useState, useEffect } from "react";
// import api from "../../config/axios"; // Import axios để gọi API
// import Header from "../../component/header";
// import ProductCard from "../../component/product-card";

// function Product() {
//   const [sortOrder, setSortOrder] = useState(""); // State to store sorting order
//   const [visibleCount, setVisibleCount] = useState(12);
//   const [searchTerm, setSearchTerm] = useState(""); // State để lưu từ khóa tìm kiếm
//   const [products, setProducts] = useState([]); // State để lưu danh sách sản phẩm từ API

//   // Handle sorting change
//   const handleSortChange = (e) => {
//     setSortOrder(e.target.value);
//   };

//   // Get only the visible products based on the visibleCount
//   const visibleProducts = products.slice(0, visibleCount);

//   // Function to show more products
//   const showMoreProducts = () => {
//     setVisibleCount((prevCount) => prevCount + 12);
//   };

//   // Handle search input change
//   const handleInputChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   // Fetch all products initially when component loads
//   useEffect(() => {
//     const fetchAllProducts = async () => {
//       try {
//         const response = await api.get("YOUR_API_ENDPOINT_FOR_ALL_PRODUCTS"); // Thay thế bằng API lấy tất cả sản phẩm
//         setProducts(response.data);
//       } catch (error) {
//         console.error("Error fetching all products:", error);
//       }
//     };

//     fetchAllProducts();
//   }, []); // Chỉ chạy 1 lần khi component được render

//   // Handle search API call
//   const handleSearch = async () => {
//     try {
//       if (searchTerm.trim() === "") {
//         // Nếu từ khóa rỗng, gọi API lấy tất cả sản phẩm
//         const response = await api.get("YOUR_API_ENDPOINT_FOR_ALL_PRODUCTS"); // Thay thế bằng API lấy tất cả sản phẩm
//         setProducts(response.data);
//       } else {
//         // Gọi API với từ khóa tìm kiếm
//         const response = await api.get(`searchbyname`, { params: { search: searchTerm } });
//         setProducts(response.data);
//       }
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }
//   };

//   return (
//     <div>
//       <Header />

//       {/* Title Section */}
//       <div className="flex mt-[80px]">
//         <p className="text-3xl ml-[800px] mb-[40px]">ALL PRODUCTS</p>

//         <select
//           className="border-2 border-gray-300 text-lg ml-[300px] mb-[40px]"
//           onChange={handleSortChange}
//           value={sortOrder}
//         >
//           <option value="">Sort by: Relevant</option>
//           <option value="low-high">Sort by: Low to High</option>
//           <option value="high-low">Sort by: High to Low</option>
//         </select>
//       </div>

//       {/* Search bar */}
//       <div className="flex justify-center mb-5 ml-[150px]">
//         <input
//           type="text"
//           placeholder="Search products..."
//           className="border border-gray-300 rounded-lg p-2 w-1/3"
//           value={searchTerm} // Liên kết với state searchTerm
//           onChange={handleInputChange} // Cập nhật từ khóa tìm kiếm khi người dùng nhập
//         />
//         <button
//           className="ml-[10px] px-4 py-2 bg-blue-500 text-white rounded-[20px] hover:bg-blue-600 transition-colors"
//           onClick={handleSearch} // Gọi API khi nhấn nút "Search"
//         >
//           Search
//         </button>
//       </div>

//       {/* Product List */}
//       <div className="product-list flex">
//         <div>
//           <div className="border border-gray-300 ml-[120px] rounded-[10px] w-[200px] h-[150px] mt-[30px]">
//             <p className="text-center mb-3 text-xl font-medium mt-[10px]">
//               Phân loại sản phẩm
//             </p>
//             <div className="flex flex-col gap-3 text-base font-light text-gray-700">
//               <p className="flex items-center text-lg ml-[20px]">
//                 <input className="w-4 h-4 mr-2" type="checkbox" />
//                 Hoa theo lô
//               </p>
//               <p className="flex items-center text-lg ml-[20px]">
//                 <input className="w-4 h-4 mr-2" type="checkbox" />
//                 Hoa theo sự kiện
//               </p>
//             </div>
//           </div>

//           <div className="border border-gray-300 ml-[120px] rounded-[10px] w-[200px] h-[190px] mt-[30px]">
//             <p className="text-center mb-3 text-xl font-medium mt-[10px]">
//               Phân loại hoa
//             </p>
//             <div className="flex flex-col gap-3 text-base font-light text-gray-700">
//               <p className="flex items-center text-lg ml-[20px]">
//                 <input className="w-4 h-4 mr-2" type="checkbox" />
//                 Hoa tiệc cưới
//               </p>
//               <p className="flex items-center text-lg ml-[20px]">
//                 <input className="w-4 h-4 mr-2" type="checkbox" />
//                 Hoa sinh nhật
//               </p>
//               <p className="flex items-center text-lg ml-[20px]">
//                 <input className="w-4 h-4 mr-2" type="checkbox" />
//                 Hoa hội nghị
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Pass sorted and visible products */}
//         <ProductCard products={visibleProducts} />
//       </div>

//       {/* Show More Button */}
//       {visibleCount < products.length && (
//         <div className="flex justify-center mt-6">
//           <button
//             className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//             onClick={showMoreProducts}
//           >
//             Show More
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Product;

//----------------------------------------------------------------Đã có checkbox----------------------------------------------------------------

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Header from "../../component/header";
// import ProductCard from "../../component/product-card";

// function Product() {
//   const [sortOrder, setSortOrder] = useState(""); // State để lưu trạng thái sắp xếp
//   const [visibleCount, setVisibleCount] = useState(12); // Số lượng sản phẩm hiển thị
//   const [products, setProducts] = useState([]); // Danh sách sản phẩm hiển thị
//   const [filterWedding, setFilterWedding] = useState(false); // Trạng thái checkbox Hoa tiệc cưới
//   const [filterBirthday, setFilterBirthday] = useState(false); // Trạng thái checkbox Hoa sinh nhật

//   // Handle sorting change
//   const handleSortChange = (e) => {
//     setSortOrder(e.target.value);
//   };

//   // Get only the visible products based on the visibleCount
//   const visibleProducts = products.slice(0, visibleCount);

//   // Function to show more products
//   const showMoreProducts = () => {
//     setVisibleCount((prevCount) => prevCount + 12);
//   };

//   // Fetch all products initially when component loads
//   useEffect(() => {
//     const fetchAllProducts = async () => {
//       try {
//         const response = await axios.get("YOUR_API_ENDPOINT_FOR_ALL_PRODUCTS");
//         setProducts(response.data);
//       } catch (error) {
//         console.error("Error fetching all products:", error);
//       }
//     };

//     fetchAllProducts();
//   }, []); // Chỉ chạy 1 lần khi component được render

//   // Handle filtering for Flower Wedding
//   const handleFlowerWedding = async (checked) => {
//     setFilterWedding(checked);
//   };

//   // Handle filtering for Flower Birthday
//   const handleFlowerBirthday = async (checked) => {
//     setFilterBirthday(checked);
//   };

//   // Fetch products when filters change
//   useEffect(() => {
//     const fetchFilteredProducts = async () => {
//       try {
//         let productsList = [];

//         if (filterWedding && filterBirthday) {
//           // Gọi cả hai API nếu cả hai checkbox đều được tick
//           const [weddingResponse, birthdayResponse] = await Promise.all([
//             axios.get("YOUR_API_ENDPOINT_FOR_WEDDING"),
//             axios.get("YOUR_API_ENDPOINT_FOR_BIRTHDAY"),
//           ]);
//           productsList = [...weddingResponse.data, ...birthdayResponse.data]; // Gộp dữ liệu từ cả hai API
//         } else if (filterWedding) {
//           // Chỉ gọi API cho Hoa tiệc cưới
//           const weddingResponse = await axios.get("YOUR_API_ENDPOINT_FOR_WEDDING");
//           productsList = weddingResponse.data;
//         } else if (filterBirthday) {
//           // Chỉ gọi API cho Hoa sinh nhật
//           const birthdayResponse = await axios.get("YOUR_API_ENDPOINT_FOR_BIRTHDAY");
//           productsList = birthdayResponse.data;
//         } else {
//           // Nếu không có bộ lọc nào được chọn, hiển thị tất cả sản phẩm
//           const response = await axios.get("YOUR_API_ENDPOINT_FOR_ALL_PRODUCTS");
//           productsList = response.data;
//         }

//         setProducts(productsList);
//       } catch (error) {
//         console.error("Error fetching filtered products:", error);
//       }
//     };

//     fetchFilteredProducts();
//   }, [filterWedding, filterBirthday]); // Gọi lại API khi trạng thái checkbox thay đổi

//   return (
//     <div>
//       <Header />

//       {/* Title Section */}
//       <div className="flex mt-[80px]">
//         <p className="text-3xl ml-[800px] mb-[40px]">ALL PRODUCTS</p>

//         <select
//           className="border-2 border-gray-300 text-lg ml-[300px] mb-[40px]"
//           onChange={handleSortChange}
//           value={sortOrder}
//         >
//           <option value="">Sort by: Relevant</option>
//           <option value="low-high">Sort by: Low to High</option>
//           <option value="high-low">Sort by: High to Low</option>
//         </select>
//       </div>

//       {/* Search bar */}
//       <div className="flex justify-center mb-5 ml-[150px]">
//         <input
//           type="text"
//           placeholder="Search products..."
//           className="border border-gray-300 rounded-lg p-2 w-1/3"
//         />
//         <button className="ml-[10px] px-4 py-2 bg-blue-500 text-white rounded-[20px] hover:bg-blue-600 transition-colors">
//           Search
//         </button>
//       </div>

//       {/* Product List */}
//       <div className="product-list flex">
//         <div>
//           <div className="border border-gray-300 ml-[120px] rounded-[10px] w-[200px] h-[150px] mt-[30px]">
//             <p className="text-center mb-3 text-xl font-medium mt-[10px]">
//               Phân loại hoa
//             </p>
//             <div className="flex flex-col gap-3 text-base font-light text-gray-700">
//               <p className="flex items-center text-lg ml-[20px]">
//                 <input
//                   className="w-4 h-4 mr-2"
//                   type="checkbox"
//                   checked={filterWedding}
//                   onChange={(e) => handleFlowerWedding(e.target.checked)}
//                 />
//                 Hoa tiệc cưới
//               </p>
//               <p className="flex items-center text-lg ml-[20px]">
//                 <input
//                   className="w-4 h-4 mr-2"
//                   type="checkbox"
//                   checked={filterBirthday}
//                   onChange={(e) => handleFlowerBirthday(e.target.checked)}
//                 />
//                 Hoa sinh nhật
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Pass sorted and visible products */}
//         <ProductCard products={visibleProducts} />
//       </div>

//       {/* Show More Button */}
//       {visibleCount < products.length && (
//         <div className="flex justify-center mt-6">
//           <button
//             className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//             onClick={showMoreProducts}
//           >
//             Show More
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Product;
