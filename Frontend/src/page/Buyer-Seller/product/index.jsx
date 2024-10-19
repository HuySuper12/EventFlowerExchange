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
    workshop: false,
  });

  // Handle sorting change
  const handleSortChange = (e) => {
    const selectedSortOrder = e.target.value;
    setSortOrder(selectedSortOrder);

    if (selectedSortOrder === "relevant") {
      // Reset to original products
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
    const filteredProducts = allProducts.filter((product) => {
      const matchesSearch = product.productName
        .toLowerCase()
        .includes(searchKeyword.toLowerCase());

      // Kiểm tra từng bộ lọc
      const matchesComboType =
        (filters.batch ? product.comboType === "batch" : true) &&
        (filters.event ? product.comboType === "event" : true) &&
        (filters.wedding ? product.category === "wedding" : true) &&
        (filters.birthday ? product.category === "birthday" : true) &&
        (filters.workshop ? product.category === "workshop" : true);

      return matchesSearch && matchesComboType;
    });

    setProducts(filteredProducts); // Cập nhật danh sách sản phẩm
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
              Phân loại sản phẩm
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
                Hoa theo lô
              </p>
              <p className="flex items-center text-lg ml-[20px]">
                <input
                  className="w-4 h-4 mr-2"
                  type="checkbox"
                  name="event"
                  checked={filters.event}
                  onChange={handleFilterChange}
                />
                Hoa sự kiện
              </p>
            </div>
          </div>

          <div className="border border-gray-300 ml-[120px] rounded-[10px] w-[200px] h-[190px] mt-[30px]">
            <p className="text-center mb-3 text-xl font-medium mt-[10px]">
              Phân loại hoa
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
                Hoa tiệc cưới
              </p>
              <p className="flex items-center text-lg ml-[20px]">
                <input
                  className="w-4 h-4 mr-2"
                  type="checkbox"
                  name="birthday"
                  checked={filters.birthday}
                  onChange={handleFilterChange}
                />
                Hoa sinh nhật
              </p>
              <p className="flex items-center text-lg ml-[20px]">
                <input
                  className="w-4 h-4 mr-2"
                  type="checkbox"
                  name="workshop"
                  checked={filters.workshop}
                  onChange={handleFilterChange}
                />
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
