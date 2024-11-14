import React, { useEffect, useState } from "react";
import Header from "../../../component/header";
import api from "../../../config/axios";
import Footer from "../../../component/footer";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = () => {
  const userEmail = sessionStorage.getItem("email");
  const [cartData, setCartData] = useState([]);
  const [listProduct, setListProduct] = useState(() => {
    const savedList = localStorage.getItem("listProduct");
    return savedList ? JSON.parse(savedList).filter(Boolean) : [];
  });

  const navigate = useNavigate();

  const handleReturnHompage = () => {
    navigate("/");
  };

  const fetchCartData = async () => {
    if (userEmail) {
      try {
        const response = await api.get(`Cart/ViewCartByUserEmail`, {
          params: { email: userEmail },
        });
        setCartData(response.data);
        console.log("cart", response.data);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    } else {
      console.error("Email is not set in sessionStorage.");
    }
  };

  const handleCheckboxChange = (productId) => {
    console.log("Checkbox changed for productId:", productId); // Thêm dòng này
    let updatedList;
    if (listProduct.includes(productId)) {
      updatedList = listProduct.filter((id) => id !== productId);
    } else {
      updatedList = [...listProduct, productId];
    }

    setListProduct(updatedList);
    localStorage.setItem("listProduct", JSON.stringify(updatedList));

    if (updatedList.length === 0) {
      localStorage.removeItem("listProduct");
    }
  };

  const handleRemoveItem = async (productId) => {
    if (userEmail) {
      try {
        const response = await api.delete("Cart/RemoveCartItem", {
          params: {
            email: userEmail,
            productid: productId,
          },
        });
        if (response.data == true) {
          toast.success("Remove product successfully!");
          fetchCartData();
        }
      } catch (error) {
        toast.error("Remove product fail!", error);
      }
    }
  };

  const productList = localStorage.getItem("listProduct");
  const productListArray = productList ? JSON.parse(productList) : [];

  const handleCheckProductHasSameSeller = async () => {
    try {
      const response = await api.post(
        "Order/DivideProductHasSameSeller",
        productListArray
      );
      localStorage.setItem("listProductDevide", JSON.stringify(response.data));
      toast.success("Please enter delivery information to checkout");
      const subtotal = calculateSubtotal();
      localStorage.setItem("subtotal", subtotal);
      navigate("/checkout");
    } catch (error) {
      console.error("Error checking product seller", error);
    }
  };

  const calculateSubtotal = () => {
    return cartData
      .filter((item) => listProduct.includes(item.productId))
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };

  //Tách số
  const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ"; // Định dạng số
  };

  useEffect(() => {
    fetchCartData();
  }, [userEmail]);

  useEffect(() => {
    localStorage.removeItem("listProduct");
    setListProduct([]);
  }, []);

  const fetchSellerId = async (productId) => {
    try {
      const response = await api.get(`Product/SearchProduct`, {
        params: { id: productId },
      });
      return response.data.sellerId;
    } catch (error) {
      console.error("Error fetching sellerId:", error);
      return null;
    }
  };

  const fetchSellerName = async (sellerId) => {
    try {
      const response = await api.get(`Account/GetAccountById/${sellerId}`);
      return response.data.name; // Giả sử API trả về một đối tượng có thuộc tính 'name'
    } catch (error) {
      console.error("Error fetching seller name:", error);
      return "Unknown Seller";
    }
  };

  const groupProductsBySeller = async () => {
    const groupedProducts = {};

    for (const item of cartData) {
      const sellerId = await fetchSellerId(item.productId);
      if (sellerId) {
        const sellerName = await fetchSellerName(sellerId);
        if (!groupedProducts[sellerId]) {
          groupedProducts[sellerId] = { name: sellerName, products: [] };
        }
        groupedProducts[sellerId].products.push(item);
      }
    }

    return groupedProducts;
  };

  const [groupedProducts, setGroupedProducts] = useState({});

  useEffect(() => {
    const organizeCart = async () => {
      const grouped = await groupProductsBySeller();
      setGroupedProducts(grouped);
    };

    organizeCart();
  }, [cartData]);

  const handleSelectAllBySeller = (sellerId, isChecked) => {
    const sellerProducts = groupedProducts[sellerId].products.map(
      (item) => item.productId
    );
    let updatedList;

    if (isChecked) {
      updatedList = [...new Set([...listProduct, ...sellerProducts])];
    } else {
      updatedList = listProduct.filter((id) => !sellerProducts.includes(id));
    }

    setListProduct(updatedList);
    localStorage.setItem("listProduct", JSON.stringify(updatedList));
  };

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
            <ol className="items-center flex w-full max-w-2xl text-center text-sm font-medium text-gray-800 dark:text-gray-400 sm:text-base ml-[100px]">
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
              <li className=" flex items-center text-primary-700 after:mx-6 after:hidden after:border-b after:border-gray-200 dark:text-primary-500 dark:after:border-gray-700 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
                {" "}
                <span className="flex items-center after:mx-2 text-gray-800">
                  <img
                    src="https://thumbs.dreamstime.com/b/check-icon-vector-mark-perfect-black-pictogram-illustration-white-background-148914823.jpg"
                    alt=""
                    className="w-[40px]"
                  />
                  Checkout
                </span>
              </li>
              
            </ol>
          </div>

          <div className="font-sans bg-white max-w-6xl mx-auto p-4">
            <div className="overflow-x-auto">
              <table className="mt-12 w-full border-collapse divide-y">
                <thead className="whitespace-nowrap text-left">
                  <tr>
                    <th className="text-base text-gray-500 font-medium p-2">
                      Select
                    </th>
                    <th className="text-base text-gray-500 font-medium p-2">
                      Product
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
                  {cartData.length > 0 ? (
                    Object.entries(groupedProducts).map(
                      ([sellerId, { name, products }]) => (
                        <>
                          <tr className="" key={sellerId}>
                            <div className="mt-[30px] mb-[10px]">
                              <td
                                colSpan="6"
                                className="text-left font-bold text-gray-800"
                              >
                                <input
                                  type="checkbox"
                                  className="mr-2 w-[30px] h-[20px]"
                                  onChange={(e) =>
                                    handleSelectAllBySeller(
                                      sellerId,
                                      e.target.checked
                                    )
                                  }
                                  checked={products.every((item) =>
                                    listProduct.includes(item.productId)
                                  )}
                                />
                                {name}
                              </td>
                            </div>
                          </tr>

                          {products.map((item, index) => (
                            <tr key={index} className="table-row">
                              <td className="px-2 py-4">
                                <input
                                  type="checkbox"
                                  className="w-5 h-5"
                                  aria-label={`Select ${item.productName}`}
                                  checked={listProduct.includes(item.productId)}
                                  onChange={() =>
                                    handleCheckboxChange(item.productId)
                                  }
                                />
                              </td>
                              <td className="px-2 py-4">
                                <div className="flex items-center gap-4 w-max">
                                  <div className="h-32 shrink-0">
                                    <img
                                      src={item.productImage}
                                      className="w-[200px] h-[120px] object-cover rounded-lg"
                                      alt="Product Image"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-base font-bold text-gray-800">
                                      {item.productName}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-2 py-4">{item.comboType}</td>
                              <td className="px-2 py-4">{item.quantity}</td>
                              <td className="px-2 py-4">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveItem(item.productId)
                                  }
                                  className="bg-transparent border flex justify-center items-center w-11 h-10 rounded-lg"
                                >
                                  <img
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcST1mtZCRWh6vOvjwovfizM2BvKFMTiCDawFw&s"
                                    className="w-[20px]"
                                    alt="Remove Icon"
                                  />
                                </button>
                              </td>
                              <td className="px-2 py-4">
                                <h4 className="text-base font-bold text-gray-800">
                                  {formatCurrency(item.price)}
                                </h4>
                              </td>
                            </tr>
                          ))}
                        </>
                      )
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-8 text-gray-500"
                      >
                        <img
                          src="https://www.skoozo.com/assets/img/empty-cart.png"
                          alt=""
                          className="ml-[300px]"
                        />
                        <button
                          className="bg-blue-500 text-white hover:bg-blue-400 w-[300px] h-[50px] rounded-3xl ml-[20px]"
                          onClick={handleReturnHompage}
                        >
                          Return to homepage
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {cartData.length > 0 && (
              <div className="max-w-xl ml-auto">
                <ul className="text-gray-800 divide-y">
                  <li className="flex flex-wrap gap-3 text-base py-3 font-bold">
                    Subtotal:{" "}
                    <span className="ml-auto">
                      {formatCurrency(calculateSubtotal())}
                    </span>
                  </li>
                </ul>
                <button
                  type="button"
                  className="mt-6 text-base tracking-wide px-5 py-2.5 w-full bg-gray-800 hover:bg-gray-900 text-white rounded-lg"
                  onClick={handleCheckProductHasSameSeller}
                >
                  Make Payment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
