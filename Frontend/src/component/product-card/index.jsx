import React from "react";
import PropTypes from "prop-types";

const colors = [
  "bg-white-900", // Để màu nền là trắng
];

function ProductCard({ products }) {
  // Chia sản phẩm thành các hàng với tối đa 4 sản phẩm mỗi hàng
  const rows = [];
  for (let i = 0; i < products.length; i += 4) {
    rows.push(products.slice(i, i + 4));
  }

  return (
    <div className="p-1">
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex flex-wrap items-center justify-center "
        >
          {row.map((product, index) => (
            <div
              key={product.id}
              className={`flex-shrink-0 m-6 relative overflow-hidden ${
                colors[index % colors.length]
              } rounded-lg max-w-xs shadow-lg group`}
            >
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
                  className="relative w-40"
                  src={product.image}
                  alt={product.name}
                />
              </div>
              <div className="relative text-black px-6 pb-6 mt-6">
                <span className="block opacity-75 -mb-1">{product.type}</span>
                <div className="flex justify-between items-center product-card-title">
                  <span className="block font-semibold text-sm mr-2">
                    {product.name}
                  </span>
                  <span className="block bg-orange-300 text-black rounded-full text-xs font-bold px-3 py-2 leading-none flex items-center">
                    {product.price}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-800">
                  {product.postDate}
                </div>
                <div className="flex justify-center mt-4">
                  <button className="bg-white text-black border border-black px-4 py-2 transition-colors duration-300 hover:bg-orange-400 hover:text-white rounded-[70px] product-card-button">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default ProductCard;
