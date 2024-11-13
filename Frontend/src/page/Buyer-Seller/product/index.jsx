import React, { useState, useEffect } from "react";
import api from "../../../config/axios"; // Import axios để gọi API
import Header from "../../../component/header";
import ProductCard from "../../../component/product-card";
import Footer from "../../../component/footer";

function Product() {
  const [sortOrder, setSortOrder] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filters, setFilters] = useState({
    batch: false,
    event: false,
    wedding: false,
    birthday: false,
    conference: false,
  });

  // Handle sorting change
  const handleSortChange = (e) => {
    const selectedSortOrder = e.target.value;
    setSortOrder(selectedSortOrder);

    if (selectedSortOrder === "relevant") {
      setProducts(allProducts);
    } else {
      let sortedProducts = [...products]; // Sao chép danh sách sản phẩm hiện tại

      if (selectedSortOrder === "low-high") {
        sortedProducts.sort((a, b) => a.price - b.price); // Sắp xếp tăng dần theo giá
      } else if (selectedSortOrder === "high-low") {
        sortedProducts.sort((a, b) => b.price - a.price); // Sắp xếp giảm dần theo giá
      }

      setProducts(sortedProducts); // Cập nhật danh sách sản phẩm đã sắp xếp
    }
  };

  // Handle input change (chỉ lưu từ khóa)
  const handleSearchInputChange = (e) => {
    setSearchKeyword(e.target.value);
    setVisibleCount(12);
  };

  // Handle search click
  const handleSearchClick = () => {
    filterProducts(); // Filter products when the search is clicked
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }));
  };

  // Function to filter products based on selected filters
  const filterProducts = () => {
    if (!allProducts || allProducts.length === 0) {
      console.warn("No products available to filter.");
      return;
    }

    const filteredProducts = allProducts.filter((product) => {
      const matchesSearch = product.productName
        .toLowerCase()
        .includes(searchKeyword.toLowerCase());

      const matchesComboType =
        (filters.batch && product.comboType.toLowerCase() === "batch") ||
        (filters.event && product.comboType.toLowerCase() === "event") ||
        (filters.wedding && product.category.toLowerCase() === "wedding") ||
        (filters.birthday && product.category.toLowerCase() === "birthday") ||
        (filters.conference &&
          product.category.toLowerCase() === "conference") ||
        (!filters.batch &&
          !filters.event &&
          !filters.wedding &&
          !filters.birthday &&
          !filters.conference);

      console.log(
        `Product: ${product.productName}, Matches Search: ${matchesSearch}, Matches ComboType: ${matchesComboType}`
      );

      return matchesSearch && matchesComboType;
    });

    console.log("Filtered Products:", filteredProducts);

    if (filteredProducts.length === 0) {
      console.warn("No products match the current filters.");
    }

    setProducts(filteredProducts);
    setVisibleCount(12);
  };

  // Get only the visible products based on the visibleCount
  const visibleProducts = products.slice(0, visibleCount);

  // Function to show more products
  const showMoreProducts = () => {
    setVisibleCount((prevCount) => prevCount + 12);
  };

  // Fetch all products initially when component loads
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await api.get("Product/GetProductList/Enable");
        setProducts(response.data);
        setAllProducts(response.data); // Lưu danh sách sản phẩm gốc
        console.log("All Products fetched:", response.data); // Kiểm tra dữ liệu
      } catch (error) {
        console.error("Error fetching all products:", error);
      }
    };

    fetchAllProducts();
  }, []);

  // Reapply filters whenever filters change
  useEffect(() => {
    filterProducts(); // Cập nhật danh sách sản phẩm khi filters thay đổi
  }, [filters]);

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
          <option value="relevant">Sort by: Relevant</option>
          <option value="low-high">Sort by: Low to High</option>
          <option value="high-low">Sort by: High to Low</option>
        </select>
      </div>

      {/* Search bar */}
      <div className="flex justify-center mb-5 ml-[150px]">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm"
          value={searchKeyword}
          onChange={handleSearchInputChange}
          className="border border-gray-300 rounded-lg p-2 w-1/3"
        />
        <button
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          onClick={handleSearchClick}
        >
          Search
        </button>
      </div>

      {/* Product List */}
      <div className="product-list flex">
        <div>
          <div className="border border-gray-300 ml-[120px] rounded-[10px] w-[200px] h-[150px] mt-[30px]">
            <p className="text-center mb-3 text-xl font-medium mt-[10px]">
              Categories
            </p>
            <div className="flex flex-col gap-3 text-base font-light text-gray-700">
              <p className="flex items-center text-lg ml-[20px]">
                <input
                  className="w-4 h-4 mr-2"
                  type="checkbox"
                  name="batch"
                  checked={filters.batch}
                  onChange={handleFilterChange}
                />
                Batch
              </p>
              <p className="flex items-center text-lg ml-[20px]">
                <input
                  className="w-4 h-4 mr-2"
                  type="checkbox"
                  name="event"
                  checked={filters.event}
                  onChange={handleFilterChange}
                />
                Event
              </p>
            </div>
          </div>

          <div className="border border-gray-300 ml-[120px] rounded-[10px] w-[200px] h-[190px] mt-[30px]">
            <p className="text-center mb-3 text-xl font-medium mt-[10px]">
              Flower Type
            </p>
            <div className="flex flex-col gap-3 text-base font-light text-gray-700">
              <p className="flex items-center text-lg ml-[20px]">
                <input
                  className="w-4 h-4 mr-2"
                  type="checkbox"
                  name="wedding"
                  checked={filters.wedding}
                  onChange={handleFilterChange}
                />
                Wedding
              </p>
              <p className="flex items-center text-lg ml-[20px]">
                <input
                  className="w-4 h-4 mr-2"
                  type="checkbox"
                  name="birthday"
                  checked={filters.birthday}
                  onChange={handleFilterChange}
                />
                Birthday
              </p>
              <p className="flex items-center text-lg ml-[20px]">
                <input
                  className="w-4 h-4 mr-2"
                  type="checkbox"
                  name="conference"
                  checked={filters.conference}
                  onChange={handleFilterChange}
                />
                Conference
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
            className="flex items-center bg-white text-black border border-black px-4 py-2 transition-colors duration-300 hover:bg-blue-500 hover:text-white rounded-[50px] "
            onClick={showMoreProducts}
          >
            <img
              src="https://firebasestorage.googleapis.com/v0/b/event-flower-exchange.appspot.com/o/6207.png_860_preview_rev_1.png?alt=media&token=f40c66c1-e8c8-4e7c-81ea-e0994f92601a"
              alt="icon"
              className="h-6 w-6 mr-2 transform rotate-90"
            />
            Show more
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Product;
