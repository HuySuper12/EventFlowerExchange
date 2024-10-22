import React from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import api from "../../config/axios";
import { toast } from "react-toastify";

const colors = ["bg-white-900"];

function ProductCard({ products }) {
  const navigate = useNavigate();

  const rows = [];
  for (let i = 0; i < products.length; i += 4) {
    rows.push(products.slice(i, i + 4));
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const email = sessionStorage.getItem("email");
  const role = sessionStorage.getItem("role");

  const handleAddToCart = async (event, productId) => {
    event.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("You need to log in to add items to the cart.");
      navigate("/login");
      return;
    }

    console.log("Adding product with ID:", productId);
    try {
      const response = await api.post("Cart/CreateCartItem", {
        productId,
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
    }
  };

  const formatCurrency = (amount) => {
    const validAmount = amount !== undefined ? amount : 0;
    return (
      validAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ"
    );
  };

  return (
    <div className="p-1">
      {rows.map((row, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="flex flex-wrap items-center justify-center "
        >
          {row.map((product, index) => (
            <div
              key={product.productId}
              className={`flex-shrink-0 m-6 relative overflow-hidden ${
                colors[index % colors.length]
              } rounded-lg max-w-xs shadow-lg group`}
              style={{ width: "250px", height: "400px" }}
            >
              <Link to={`/product-page/${product.productId}`}>
                <div className="relative pt-10 px-10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <div
                    className="block absolute w-48 h-48 bottom-0 left-0 -mb-24 ml-3"
                    style={{
                      background: "radial-gradient(black, transparent 60%)",
                      transform: "rotate3d(0, 0, 1, 20deg) scale3d(1, 0.6, 1)",
                      opacity: 0.2,
                    }}
                  ></div>
                  <img
                    className="relative w-full h-32 object-cover rounded-md"
                    src={
                      product.productImage && product.productImage.length > 0
                        ? product.productImage[0]
                        : "default-image-url.jpg"
                    }
                    alt={product.productName}
                  />
                </div>
              </Link>
              <div className="relative text-black px-6 pb-6 mt-6">
                <span className="block opacity-75 -mb-1">
                  {product.category}
                </span>
                <div className="flex justify-between items-center product-card-title">
                  <span className="block font-semibold text-sm mr-2">
                    {product.productName}
                  </span>
                  <span className="block bg-orange-300 text-black rounded-full text-xs font-bold px-3 py-2 leading-none flex items-center">
                    {product.price} VNĐ
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-800">
                  {formatDate(product.createdAt)}
                </div>
                <div className="flex justify-center mt-4">
                  {role !== "Seller" && (
                    <button
                      className="bg-white text-black border border-black px-4 py-2 transition-colors duration-300 hover:bg-orange-400 hover:text-white rounded-[70px] product-card-button"
                      onClick={(event) =>
                        handleAddToCart(event, product.productId)
                      }
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

ProductCard.propTypes = {
  products: PropTypes.array.isRequired,
};

export default ProductCard;
