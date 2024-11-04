import { Button, Form, Input, Select } from "antd";
import Header from "../../../component/header";
import api from "../../../config/axios";
import { useNavigate } from "react-router-dom";
import Footer from "../../../component/footer";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý gửi thông tin
    console.log({ name, email, phone, message });
    // Reset form
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
  };

  return (
    <>
      <Header />
      <div className="container mx-auto p-6 ml-[280px] w-[1200px]">
        <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
        <p className="mb-4">
          Welcome to the Contact Us page of [Store Name]! We are always here to
          listen and assist you. If you have any questions about our products,
          orders, or need further support, feel free to reach out to us through
          any of the following methods:
        </p>

        <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
        <p>Address: 123 Flower Street, District 1, Ho Chi Minh City</p>
        <p>Phone: (08) 1234 5678</p>
        <p>Email: contact@storename.com</p>
        <p>Follow us on social media:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>
            <a href="#" className="text-blue-500">
              Facebook
            </a>
          </li>
          <li>
            <a href="#" className="text-blue-500">
              Instagram
            </a>
          </li>
          <li>
            <a href="#" className="text-blue-500">
              Twitter
            </a>
          </li>
        </ul>

        <h2 className="text-xl font-semibold mb-2">Send a Message</h2>
        <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded">
          <div className="mb-4">
            <label className="block mb-1" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1" htmlFor="phone">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              rows="4"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Send
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
