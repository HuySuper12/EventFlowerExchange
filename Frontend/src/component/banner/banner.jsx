import React from "react";
import { Link } from "react-router-dom";

function Banner() {
  return (
    <div className="banner flex flex-col sm:flex-row border border-gray-400">
      {/* Banner left side */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
        <div className="text-[#414141]">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p className="font-medium text-sm md:text-base">OUR BEST SELLER</p>
          </div>

          <h1 className="text-3xl sm:py-3 lg:text-5xl leading-relaxed">
            New Arrivals
          </h1>

          <div className="flex items-center gap-2">
            <Link to={"/product"}>
              <p className="font-semibold text-sm md:text-base px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 hover:border-gray-400 transition-colors">
                SHOP NOW
              </p>
            </Link>
            <p className="w-8 md:w-11 h-[1px] bg-[#414141]"></p>
          </div>
        </div>
      </div>

      {/* Banner right side */}
      <img
        src="https://vinasave.com/vnt_upload/UploadFile/thanh-ly-cua-hang-hoa-tuoi-2.jpg"
        className="w-full sm:w-1/2"
      />
    </div>
  );
}

export default Banner;
