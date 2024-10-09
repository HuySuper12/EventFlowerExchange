import { Button, Form, Input } from "antd";
import Header from "../../../component/header";
import api from "../../../config/axios";
import { useNavigate } from "react-router-dom";
import Footer from "../../../component/footer";

const Checkout = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    // Handle form submission, like sending data to the server
    console.log("Form Values: ", values);
    navigate("/payment");
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
          {/* Status */}
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

          {/* Form using Ant Design */}
          <Form
            layout="vertical"
            className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16"
            onFinish={onFinish}
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
                  <Form.Item
                    label="Your email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        type: "email",
                        message: "Please input a valid email!",
                      },
                    ]}
                  >
                    <Input placeholder="name@flowbite.com" />
                  </Form.Item>
                  <Form.Item
                    label="Address"
                    name="address"
                    rules={[
                      { required: true, message: "Please input your address!" },
                    ]}
                  >
                    <Input placeholder="123 Main St" />
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
                    <Input placeholder="(555) 555-5555" />
                  </Form.Item>
                </div>
              </div>
            </div>

            {/* Box checkout */}
            <div className="mt-6 w-full space-y-6 sm:mt-8 lg:mt-0 lg:max-w-xs xl:max-w-md">
              <div className="flow-root">
                <div className="-my-3 divide-y divide-gray-200 ">
                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-normal text-gray-500 ">
                      Subtotal
                    </dt>
                    <dd className="text-base font-medium text-gray-900">
                      $8,094.00
                    </dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-normal text-gray-500 ">
                      Savings
                    </dt>
                    <dd className="text-base font-medium text-green-500">0</dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-normal text-gray-500 ">
                      Store Pickup
                    </dt>
                    <dd className="text-base font-medium text-gray-900">$99</dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-normal text-gray-500 ">
                      Tax
                    </dt>
                    <dd className="text-base font-medium text-gray-900">
                      $199
                    </dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-bold text-gray-900">Total</dt>
                    <dd className="text-base font-bold text-gray-900">
                      $8,392.00
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="space-y-3">
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full bg-gray-800 hover:bg-gray-900 text-white rounded-lg "
                  >
                    Proceed to Payment
                  </Button>
                </Form.Item>
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
