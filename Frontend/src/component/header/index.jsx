import React, { useState, useEffect } from "react";
import "./index.scss";
import { Link, NavLink, useNavigate } from "react-router-dom";
import api from "../../config/axios";
import { authChat } from "../../config/firebasechat";
import { Avatar } from "antd";
import { MessageSquareText } from "lucide-react";

function Header() {
  const [visible, setVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const [accountData, setAccountData] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [systemNotifications, setSystemNotifications] = useState([]);
  const [shopNotifications, setShopNotifications] = useState([]);

  const handleOrder = () => {
    if (role === "Buyer") {
      navigate("/order");
    } else if (role === "Seller") {
      navigate("/order-seller");
    }
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleProduct = () => {
    navigate("/add-product");
  };

  const handleChat = () => {
    navigate("/chat/hello");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("UIDFireBase");
    authChat.signOut();
    setIsLoggedIn(false);
    setRole(null);
    navigate("/");
  };

  const email = sessionStorage.getItem("email");

  const fetchAccountData = async () => {
    if (email) {
      try {
        const encodedEmail = encodeURIComponent(email);
        const response = await api.get(
          `Account/GetAccountByEmail/${encodedEmail}`
        );
        setAccountData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching account data:", error);
      }
    } else {
      console.error("Email is not set in sessionStorage.");
    }
  };

  useEffect(() => {
    fetchAccountData();
  }, [email]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const userRole = sessionStorage.getItem("role");
    if (token) {
      setIsLoggedIn(true);
      setRole(userRole); // Set the role based on sessionStorage
    } else {
      setIsLoggedIn(false);
      setRole(null);
    }
  }, []);

  const fetchCartCount = async () => {
    if (email) {
      try {
        const response = await api.get(`Cart/GetCountCartItemByUserEmail`, {
          params: {
            email: email,
          },
        });
        setCartCount(response.data);
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    }
  };

  const fetchNotifications = async () => {
    if (email) {
      try {
        const encodedEmail = encodeURIComponent(email);
        const response = await api.get(
          `Notification/ViewNotificationByUserEmail`,
          {
            params: {
              email: email,
            },
          }
        );
        setSystemNotifications(response.data.reverse());
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    }
  };

  useEffect(() => {
    fetchAccountData();
    fetchCartCount();
    fetchNotifications();
  }, [email]);

  const fetchShopNotifications = async (email) => {
    try {
      const response = await api.get(
        `Notification/ViewShopNotificationByUserEmail`,
        {
          params: {
            email: email,
          },
        }
      );
      setShopNotifications(response.data.reverse());
      console.log("shop noti", response.data);
    } catch (error) {
      console.error("Error fetching shop notifications:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchShopNotifications(email);
  }, [email]);

  useEffect(() => {
    const loadNotifications = async () => {
      const email = sessionStorage.getItem("email");
      if (email) {
        const systemNotifs = await fetchSystemNotifications(email);
        const shopNotifs = await fetchShopNotifications(email);
        setSystemNotifications(systemNotifs || []);
        setShopNotifications(shopNotifs || []);
      }
    };

    loadNotifications();
  }, []);

  const handleShowMoreNoti = () => {
    navigate("/notification");
  };

  return (
    <div className="header flex items-center justify-between py-5 font-medium relative shadow-md">
      <Link to={"/"}>
        <img
          src="https://i.postimg.cc/sf9KmBz1/logo.png"
          className="w-36"
          alt="Logo"
        />
      </Link>

      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to={"/"} className="flex flex-col items-center gap-1 group">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </NavLink>
        <NavLink
          to={"/product"}
          className="flex flex-col items-center gap-1 group"
        >
          <p>PRODUCTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </NavLink>
        <NavLink
          to={"/contact"}
          className="flex flex-col items-center gap-1 group"
        >
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </NavLink>
        <NavLink
          to={"/about"}
          className="flex flex-col items-center gap-1 group"
        >
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-6 relative">
        {isLoggedIn ? (
          <>
            {/* Notification */}
            <div className="group relative">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/event-flower-exchange.appspot.com/o/noti-transformed.png?alt=media&token=47f07cdb-cb8b-4bba-a556-7151c4531c4a"
                className="w-8 cursor-pointer rounded-full"
                alt="Notification Icon"
              />
              <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
                {(systemNotifications?.length || 0) +
                  (shopNotifications?.length || 0)}
              </p>
              <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
                <div className="flex flex-col gap-2 py-3 px-5 bg-slate-100 text-gray-500 rounded w-[250px]">
                  <div className="text-center font-bold text-lg">
                    Notification system
                  </div>
                  {systemNotifications.slice(0, 3).map((notification) => (
                    <div key={notification.notificationId} className="text-sm">
                      <p>{notification.content}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}

                  {role !== "Seller" && (
                    <>
                      <div className="text-center font-bold text-lg">
                        Notification shop
                      </div>
                      {shopNotifications.slice(0, 3).map((notification) => (
                        <div key={notification.id} className="text-sm">
                          <p>{notification.content}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </>
                  )}

                  <button
                    className="text-blue-500 text-sm cursor-pointer hover:underline text-center"
                    onClick={handleShowMoreNoti}
                  >
                    Show more
                  </button>
                </div>
              </div>
            </div>
            <div className="group relative">
              <Avatar
                src={
                  accountData?.picture ||
                  "https://static.vecteezy.com/system/resources/previews/006/017/592/non_2x/ui-profile-icon-vector.jpg"
                }
                className="w-10 h-10 cursor-pointer rounded-full"
                alt="Profile Icon"
              />
              <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
                <div className="flex flex-col gap-2 py-3 px-5 bg-slate-100 text-gray-500 rounded w-[150px]">
                  <p>Hello {accountData?.name || "Guest"}</p>
                  <p
                    className="cursor-pointer hover:text-black"
                    onClick={handleProfile}
                  >
                    My profile
                  </p>
                  <p
                    className="cursor-pointer hover:text-black"
                    onClick={handleOrder}
                  >
                    Order
                  </p>
                  {role === "Seller" && (
                    <p
                      className="cursor-pointer hover:text-black"
                      onClick={handleProduct}
                    >
                      Product
                    </p>
                  )}
                  <p
                    className="cursor-pointer hover:text-black"
                    onClick={handleLogout}
                  >
                    Logout
                  </p>
                </div>
              </div>
            </div>

            {/* Hiển thị cart khi người dùng đã đăng nhập */}
            {role !== "Seller" && (
              <Link to={"/cart"} className="relative w-5 min-w-7">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/event-flower-exchange.appspot.com/o/images-p9Z7WcJCh-transformed.png?alt=media&token=8e07ccd5-7373-4a39-a7c7-7c8e834cd38c"
                  alt="Cart Icon"
                />
                <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
                  {cartCount}
                </p>
              </Link>
            )}

            <div className="group relative">
              <MessageSquareText
                size={35}
                className="cursor-pointer"
                onClick={handleChat}
              />
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to={"/seller-register"}
              className="text-gray-700 cursor-pointer border-0.5 border-black rounded-md px-5 py-2 transition hover:bg-green-500 hover:text-white"
              style={{ borderRadius: "20px", borderWidth: "2px" }}
            >
              Become a Seller
            </Link>
            <Link
              to={"/login"}
              className="text-gray-700 cursor-pointer border-0.5 border-black rounded-md px-5 py-2 transition hover:bg-blue-500 hover:text-white"
              style={{ borderRadius: "20px", borderWidth: "2px" }}
            >
              Login
            </Link>
          </div>
        )}

        <img
          src="https://www.svgrepo.com/show/509382/menu.svg"
          className="cursor-pointer sm:hidden w-8"
          alt="Menu Icon"
          onClick={() => setVisible(true)}
        />
      </div>

      {/* Slide bar for small screens */}
      <div
        className={`fixed top-0 right-0 bottom-0 overflow-hidden bg-white transition-all duration-500 ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600 h-full">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img
              className="h-4 rotate-90"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6Z9q-sIIPPAjNg5vlVUhfJznWgbWu4Sr34jXn0NQGnJOcfjCkCJTmG_2opr-cgv4YQtk&usqp=CAU"
              alt="Back Icon"
            />
            <p>Back</p>
          </div>
          <NavLink className="py-2 pl-6 border" to={"/"}>
            HOME
          </NavLink>
          <NavLink className="py-2 pl-6 border" to={"/product"}>
            PRODUCT
          </NavLink>
          <NavLink className="py-2 pl-6 border" to={"/contact"}>
            CONTACT
          </NavLink>
          <NavLink className="py-2 pl-6 border" to={"/about"}>
            ABOUT
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Header;
