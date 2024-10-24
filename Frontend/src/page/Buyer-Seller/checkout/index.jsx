import { Button, Form, Input, Select } from "antd";
import Header from "../../../component/header";
import api from "../../../config/axios";
import { useNavigate } from "react-router-dom";
import Footer from "../../../component/footer";
import { useEffect, useState } from "react";

const Checkout = () => {
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [orderResponse, setOrderResponse] = useState(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await api.get("voucher/GetAllVoucher");
        setVouchers(response.data);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    };

    fetchVouchers();

    const savedSubtotal = localStorage.getItem("subtotal");
    if (savedSubtotal) {
      setSubtotal(parseFloat(savedSubtotal));
    }
  }, []);

  const handleCheckOut = async (values) => {
    const orderData = {
      address: values.address,
      voucherCode: values.voucher || "",
      listProduct: JSON.parse(localStorage.getItem("listProduct")) || [],
    };

    try {
      const response = await api.post("order/checkOutOrder", orderData);
      console.log("Order response:", response.data);
      setOrderResponse(response.data);

      const paymentData = {
        name: values.name,
        email: sessionStorage.getItem("email") || "",
        address: values.address,
        phone: values.phone,
        voucher: values.voucher ? values.voucher : "",
      };

      // Save the initial payment data to localStorage
      localStorage.setItem("paymentData", JSON.stringify(paymentData));
    } catch (error) {
      console.error("Error checking out:", error);
    }
  };

  const handleProceedToPayment = () => {
    const savedPaymentData =
      JSON.parse(localStorage.getItem("paymentData")) || {};

    // Update the payment data with subtotal, shipping, discount, and total
    const updatedPaymentData = {
      ...savedPaymentData,
      subtotal: orderResponse ? orderResponse.subTotal : subtotal,
      shipping: orderResponse ? orderResponse.ship : 0,
      discount: orderResponse ? orderResponse.discount : 0,
      total: orderResponse ? orderResponse.total : subtotal,
    };

    // Save the updated payment data to localStorage
    localStorage.setItem("paymentData", JSON.stringify(updatedPaymentData));

    navigate("/order-summary");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
  };

  const email = sessionStorage.getItem("email") || "";

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
          <ol className="items-center flex w-full max-w-2xl text-center text-sm font-medium text-gray-800 dark:text-gray-400 sm:text-base">
            <li className="after:border-1 flex items-center text-primary-700 after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 dark:text-primary-500 dark:after:border-gray-700 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
              <span className="flex items-center after:mx-2 text-gray-800">
                <img
                  src="https://png.pngtree.com/png-vector/20190228/ourmid/pngtree-check-mark-icon-design-template-vector-isolated-png-image_711429.jpg"
                  alt=""
                  className="w-[40px]"
                />
                Cart
              </span>
            </li>
            <li className="after:border-1 flex items-center text-primary-700 after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 dark:text-primary-500 dark:after:border-gray-700 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
              <span className="flex items-center after:mx-2 text-gray-800">
                <img
                  src="https://static.vecteezy.com/system/resources/previews/006/692/205/non_2x/loading-icon-template-black-color-editable-loading-icon-symbol-flat-illustration-for-graphic-and-web-design-free-vector.jpg"
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

          <Form
            layout="vertical"
            className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16"
            onFinish={handleCheckOut}
          >
            <div className="min-w-0 flex-1 space-y-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Delivery Details
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Form.Item
                    label="Your name"
                    name="name"
                    rules={[
                      { required: true, message: "Please input your name!" },
                    ]}
                  >
                    <Input placeholder="Bonnie Green" />
                  </Form.Item>
                  <Form.Item label="Your email" name="email">
                    <Input value={email} disabled placeholder={email} />
                  </Form.Item>
                  <Form.Item
                    label="Address"
                    name="address"
                    rules={[
                      { required: true, message: "Please input your address!" },
                    ]}
                  >
                    <Input placeholder="Address" />
                  </Form.Item>
                  <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[
                      {
                        required: true,
                        message: "Please input your phone number!",
                      },
                    ]}
                  >
                    <Input placeholder="Phone" />
                  </Form.Item>
                  <Form.Item label="Voucher" name="voucher">
                    <Select placeholder="Select a voucher">
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
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-[200px] ml-[300px] bg-gray-800 hover:bg-gray-900 text-white rounded-lg "
                >
                  Verify
                </Button>
              </Form.Item>
            </div>

            <div className="mt-6 w-full space-y-6 sm:mt-8 lg:mt-0 lg:max-w-xs xl:max-w-md">
              <div className="flow-root">
                <div className="-my-3 divide-y divide-gray-200 ">
                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-normal text-gray-500 ">
                      Subtotal
                    </dt>
                    <dd className="text-base font-medium text-gray-900">
                      {orderResponse
                        ? formatCurrency(orderResponse.subTotal)
                        : formatCurrency(subtotal)}
                    </dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-normal text-gray-500 ">
                      Shipping
                    </dt>
                    <dd className="text-base font-medium text-green-500">
                      {orderResponse
                        ? formatCurrency(orderResponse.ship)
                        : formatCurrency(0)}
                    </dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-normal text-gray-500 ">
                      Discount
                    </dt>
                    <dd className="text-base font-medium text-gray-900">
                      {orderResponse
                        ? formatCurrency(orderResponse.discount)
                        : formatCurrency(0)}
                    </dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-normal text-gray-500 ">
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

              <Button
                type="primary"
                onClick={handleProceedToPayment}
                className="mt-3 w-full rounded-lg border border-gray-200 bg-gray-800 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-900 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
              >
                Proceed to Payment
              </Button>
            </div>
          </Form>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Checkout;
