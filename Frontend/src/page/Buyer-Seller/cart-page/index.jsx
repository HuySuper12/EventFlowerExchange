import { useEffect, useState } from "react";
import Header from "../../../component/header";
import api from "../../../config/axios";
import Footer from "../../../component/footer";

const Cart = () => {
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
    <div>
      <Header />
      <div className="border-t pt-14">
        <div className="text-2xl mb-3">
          <div className="ml-[300px] py-8 text-3xl">
            <div className="inline-flex gap-2 items-center mb-3">
              <p className="text-gray-500">YOUR</p>
              <span className="text-gray-700 font-medium">CART</span>
              <div className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700"></div>
            </div>
          </div>

          <div className="mx-auto max-w-screen-xl px-4 2xl:px-0 ml-[500px]">
            {/* Status */}
            <ol className="items-center flex w-full max-w-2xl text-center text-sm font-medium text-gray-800 dark:text-gray-400 sm:text-base">
              <li className="after:border-1 flex items-center text-primary-700 after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 dark:text-primary-500 dark:after:border-gray-700 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
                <span className="flex items-center after:mx-2 text-gray-800">
                  <img
                    src="https://static.vecteezy.com/system/resources/previews/006/692/205/non_2x/loading-icon-template-black-color-editable-loading-icon-symbol-flat-illustration-for-graphic-and-web-design-free-vector.jpg"
                    alt=""
                    className="w-[40px]"
                  />
                  Cart
                </span>
              </li>
              <li className="after:border-1 flex items-center text-primary-700 after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 dark:text-primary-500 dark:after:border-gray-700 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
                <span className="flex items-center after:mx-2 text-gray-800">
                  <img
                    src="https://thumbs.dreamstime.com/b/check-icon-vector-mark-perfect-black-pictogram-illustration-white-background-148914823.jpg"
                    alt=""
                    className="w-[40px]"
                  />
                  Checkout
                </span>
              </li>
              <li className="flex shrink-0 items-center text-gray-800">
                <img
                  src="https://thumbs.dreamstime.com/b/check-icon-vector-mark-perfect-black-pictogram-illustration-white-background-148914823.jpg"
                  alt=""
                  className="w-[40px]"
                />
                Order summary
              </li>
            </ol>
          </div>

          <div className="font-sans bg-white max-w-6xl mx-auto p-4">
            <div className="overflow-x-auto">
              <table className="mt-12 w-full border-collapse divide-y">
                <thead className="whitespace-nowrap text-left">
                  <tr>
                    <th className="text-base text-gray-500 font-medium p-2">
                      Description
                    </th>
                    <th className="text-base text-gray-500 font-medium p-2">
                      Combo Type
                    </th>
                    <th className="text-base text-gray-500 font-medium p-2">
                      Quantity
                    </th>
                    <th className="text-base text-gray-500 font-medium p-2">
                      Remove
                    </th>
                    <th className="text-base text-gray-500 font-medium p-2">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="whitespace-nowrap divide-y">
                  <tr>
                    <td className="px-2 py-4">
                      <div className="flex items-center gap-4 w-max">
                        <div className="h-32 shrink-0">
                          <img
                            src="https://file.hstatic.net/200000313235/article/14_ecolotus_sen_trong_van_hoa_nguoi_vn_294504ba0d4a44ea96f843b7b67f3041.jpg"
                            className="w-full h-full object-contain rounded-lg"
                          />
                        </div>
                        <div>
                          <p className="text-base font-bold text-gray-800">
                            Product name
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-4">
                      <span className="bg-transparent flex items-center justify-center w-11 h-10 text-base">
                        Theo lô
                      </span>
                    </td>
                    <td className="px-2 py-4">
                      <div className="flex overflow-hidden border w-max rounded-lg">
                        <span className="bg-transparent flex items-center justify-center w-11 h-10 font-semibold text-gray-800 text-base">
                          1
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-4">
                      <button
                        type="button"
                        className="bg-transparent border flex justify-center items-center w-11 h-10 rounded-lg"
                      >
                        <img
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcST1mtZCRWh6vOvjwovfizM2BvKFMTiCDawFw&s"
                          className="w-[20px] justify-center items-center"
                        />
                      </button>
                    </td>
                    <td className="px-2 py-4">
                      <h4 className="text-base font-bold text-gray-800">
                        $18.5
                      </h4>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-2 py-4">
                      <div className="flex items-center gap-4 w-max">
                        <div className="h-32 shrink-0">
                          <img
                            src="https://vcdn1-vnexpress.vnecdn.net/2022/04/06/dok-champa-jpeg-9196-1649239087.jpg?w=460&h=0&q=100&dpr=2&fit=crop&s=_nwx4beoYJQPAytHxJaQfw"
                            className="w-full h-full object-contain rounded-lg"
                          />
                        </div>
                        <div>
                          <p className="text-base font-bold text-gray-800">
                            Product Name
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-4">
                      <span className="bg-transparent flex items-center justify-center w-11 h-10 text-base">
                        Theo sự kiện
                      </span>
                    </td>
                    <td className="px-2 py-4">
                      <div className="overflow-hidden border w-max rounded-lg">
                        <span className="bg-transparent flex items-center justify-center w-11 h-10 font-semibold text-gray-800 text-base">
                          1
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-4">
                      <button
                        type="button"
                        className="bg-transparent border flex justify-center items-center w-11 h-10 rounded-lg"
                      >
                        <img
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcST1mtZCRWh6vOvjwovfizM2BvKFMTiCDawFw&s"
                          className="w-[20px] justify-center items-center"
                        />
                      </button>
                    </td>
                    <td className="px-2 py-4">
                      <h4 className="text-base font-bold text-gray-800">
                        $18.5
                      </h4>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="max-w-xl ml-auto">
              <ul className="text-gray-800 divide-y">
                <li className="flex flex-wrap gap-3 text-base py-3">
                  Subtotal <span className="ml-auto font-bold">$37.00</span>
                </li>
                <li className="flex flex-wrap gap-3 text-base py-3">
                  Shipping <span className="ml-auto font-bold">$4.00</span>
                </li>
                <li className="flex flex-wrap gap-3 text-base py-3">
                  Tax <span className="ml-auto font-bold">$4.00</span>
                </li>
                <li className="flex flex-wrap gap-3 text-base py-3 font-bold">
                  Total <span className="ml-auto">$45.00</span>
                </li>
              </ul>
              <button
                type="button"
                className="mt-6 text-base tracking-wide px-5 py-2.5 w-full bg-gray-800 hover:bg-gray-900 text-white rounded-lg"
              >
                Make Payment
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
