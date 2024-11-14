import React from "react";
import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate(); // Thêm () ở đây
  const handlePolicy = () => {
    navigate("/policy");
  };
  
  return (
    <>
      <div className="border border-gray-300 ml-[300px] mr-[100px] w-[1110px] h-[0.2px] mt-[100px]"></div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-14 my-10 text-sm ml-[300px] mr-[100px]">
        <div>
          <img
            src="https://i.postimg.cc/sf9KmBz1/logo.png"
            alt=""
            className="mb-5 w-32"
          />
          <p className="w-full md:w-[400px] text-gray-600">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the standard dummy text ever since
            the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book.
          </p>
        </div>

        <div className="ml-[100px]">
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li className="cursor-pointer" onClick={handlePolicy}>Privacy policy</li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>0122345678</li>
            <li>contact@forever.com</li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Footer;
