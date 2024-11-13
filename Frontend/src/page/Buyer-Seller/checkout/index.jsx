import { Button, Form, Input, Select } from "antd";
import Header from "../../../component/header";
import api from "../../../config/axios";
import { useNavigate } from "react-router-dom";
import Footer from "../../../component/footer";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Checkout = () => {
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [orderResponse, setOrderResponse] = useState(null);
  const [accountData, setAccountData] = useState({});
  const [form] = Form.useForm();

  // Lấy thông tin người dùng từ sessionStorage
  const email = sessionStorage.getItem("email") || "";

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const savedSubtotal = localStorage.getItem("subtotal");
        const response = await api.get("Voucher/GetAllVoucherValid", {
          params: {
            price: savedSubtotal ? parseFloat(savedSubtotal) : 0,
          },
        });
        setVouchers(response.data);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    };

    const fetchAccountData = async () => {
      try {
        const response = await api.get(`Account/GetAccountByEmail/${email}`);
        setAccountData(response.data);
      } catch (error) {
        console.error("Error fetching account data:", error);
      }
    };

    fetchVouchers();
    fetchAccountData();

    const savedSubtotal = localStorage.getItem("subtotal");
    if (savedSubtotal) {
      setSubtotal(parseFloat(savedSubtotal));
    }
  }, [email]);

  const handleCheckOut = async (values) => {
    const value = localStorage.getItem("listProductDevide") || "";
    const formattedValue = value.replace(/"/g, "");

    if (!formattedValue) {
      console.error("Value is empty");
      return;
    }

    const orderData = {
      address: values.address,
      voucherCode: values.voucher || "",
    };

    try {
      const response = await api.post(
        `Order/CheckOutOrder?value=${formattedValue}`,
        orderData
      );
      setOrderResponse(response.data);
    } catch (error) {
      console.error("Error checking out:", error);
    }
  };

  const handleCompleteOrder = async () => {
    if (accountData.balance < orderResponse.subTotal) {
      navigate("/wallet-customer");
      toast.error("Your balance is not enough to checkout!");
      return;
    }

    try {
      const values = form.getFieldsValue();
      const rawValue = localStorage.getItem("listProductDevide") || "";
      const formattedValue = rawValue.replace(/"/g, "");

      console.log("Formatted Value:", formattedValue);

      const orderData = {
        email: email,
        phoneNumber: accountData.phoneNumber,
        address: values.address,
        voucherCode: values.voucher || "",
        product: [],
      };

      console.log("Prepared Order Data:", orderData);

      const response = await api.post(
        `Order/CreateListOrder?value=${formattedValue}`,
        orderData
      );
      console.log("Order Response:", response.data);

      if (response.data === true) {
        navigate("/success-transaction");
        localStorage.clear();
      } else {
        console.error("Order creation failed:", response.data);
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const formatCurrency = (amount) => {
    return amount
      ? amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ"
      : "0 VNĐ";
  };

  const handleVoucherChange = async (value) => {
    try {
      const values = form.getFieldsValue();
      await handleCheckOut({ ...values, voucher: value });
    } catch (error) {
      console.error("Error on voucher change:", error);
    }
  };

  const handleBack = () => {
    navigate("/cart");
    localStorage.clear();
  };

  return (
    <>
      <Header />

      <div className="flex flex-col items-center w-[90%] sm:max-w m-auto mt-14 gap-4 text-gray-800">
        <div className="inline-flex items-center gap-2 mb-2 mt-10">
          <p className="prata-regular text-3xl">Checkout</p>
          <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
        </div>
      </div>

      <section className="bg-white py-8 antialiased md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div className="flex items-center">
            <div className="flex">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3114/3114883.png"
                className="w-[15px] h-[15px] mt-[5px] mr-[10px]"
              />
              <div
                className="mr-[100px] cursor-pointer hover:underline"
                onClick={handleBack}
              >
                Back
              </div>
            </div>

            <ol className="items-center flex w-full max-w-2xl text-center text-sm font-medium text-gray-800 dark:text-gray-400 sm:text-base">
              <li className="after:border-1 flex items-center text-primary-700 after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 dark:text-primary-500 dark:after:border-gray-700 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
                <span className="flex items-center after:mx-2 text-gray-800">
                  <img
                    src="https://png.pngtree.com/png-vector/20190228/ourmid/pngtree-check-mark-icon-design-template-vector-isolated-png-image_711429.jpg"
                    alt="Cart"
                    className="w-[40px]"
                  />
                  Cart
                </span>
              </li>
              <li className=" flex items-center text-primary-700 after:mx-6 after:hidden  after:border-b after:border-gray-200 dark:text-primary-500 dark:after:border-gray-700 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
                <span className="flex items-center after:mx-2 text-gray-800">
                  <img
                    src="https://static.vecteezy.com/system/resources/previews/006/692/205/non_2x/loading-icon-template-black-color-editable-loading-icon-symbol-flat-illustration-for-graphic-and-web-design-free-vector.jpg"
                    alt="Checkout"
                    className="w-[40px]"
                  />
                  Checkout
                </span>
              </li>
            </ol>
          </div>
          <Form
            form={form}
            layout="vertical"
            className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16"
            onFinish={handleCompleteOrder}
          >
            <div className="min-w-0 flex-1 space-y-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Delivery Details
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Form.Item label="Your name" name="name">
                    <Input disabled placeholder={accountData.name} />
                  </Form.Item>

                  <Form.Item
                    label="Your email"
                    name="email"
                    initialValue={email}
                  >
                    <Input disabled placeholder={email} />
                  </Form.Item>
                  <Form.Item
                    label="Address"
                    name="address"
                    rules={[
                      { required: true, message: "Please input your address!" },
                    ]}
                  >
                    <Input
                      placeholder="Address"
                      onChange={async (e) => {
                        try {
                          // Lấy tất cả giá trị hiện tại của form
                          const values = form.getFieldsValue();
                          // Gửi dữ liệu với voucher hiện tại
                          await handleCheckOut({
                            ...values,
                            address: e.target.value,
                            voucher: values.voucher || "", // Lấy giá trị voucher hiện tại
                          });
                        } catch (error) {
                          console.error("Error on address change:", error);
                        }
                      }}
                    />
                  </Form.Item>

                  <Form.Item label="Phone" name="phone">
                    <Input disabled placeholder={accountData.phoneNumber} />
                  </Form.Item>

                  <Form.Item label="Voucher" name="voucher">
                    <Select
                      placeholder="Select a voucher"
                      onChange={handleVoucherChange}
                    >
                      {vouchers.map((voucher) => (
                        <Select.Option key={voucher.code} value={voucher.code}>
                          <div>
                            {voucher.code}
                            <br />
                            {voucher.description}
                            <br />
                            (Expires: {formatDate(voucher.expiryDate)})
                          </div>
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </div>
            </div>

            <div className="mt-6 w-full space-y-6 sm:mt-8 lg:mt-0 lg:max-w-xs xl:max-w-md">
              <div className="flow-root">
                <div className="-my-3 divide-y divide-gray-200">
                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-normal text-gray-500">
                      Subtotal
                    </dt>
                    <dd className="text-base font-medium text-gray-900">
                      {orderResponse
                        ? formatCurrency(orderResponse.subTotal)
                        : formatCurrency(subtotal)}
                    </dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-normal text-gray-500">
                      Shipping
                    </dt>
                    <dd className="text-base font-medium text-green-500">
                      {orderResponse
                        ? formatCurrency(orderResponse.ship)
                        : formatCurrency(0)}
                    </dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-normal text-gray-500">
                      Discount
                    </dt>
                    <dd className="text-base font-medium text-gray-900">
                      {orderResponse
                        ? formatCurrency(orderResponse.discount)
                        : formatCurrency(0)}
                    </dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-normal text-gray-500">
                      Total
                    </dt>
                    <dd className="text-base font-semibold text-gray-900">
                      {orderResponse
                        ? formatCurrency(orderResponse.total)
                        : formatCurrency(subtotal)}
                    </dd>
                  </dl>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  danger
                  onClick={handleBack}
                  className="mt-3 w-[300px] rounded-lg border mr-2"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="mt-3 w-full rounded-lg border border-gray-200 bg-gray-800 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-900 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
                >
                  Proceed to Payment
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Checkout;
