import { Button, Form, Input } from "antd";
import Header from "../../component/header";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    console.log(values);

    try {
      // gửi request đến server
      const response = await api.post("login", values);
      const { token } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/");
    } catch (err) {
      console.log(err);
      alert(err.response.data);
    }
  };

  return (
    <>
      <Header />

      <div className="flex flex-col items-center w-[90%] sm:max-w m-auto mt-14 gap-4 text-gray-800">
        <div className="inline-flex items-center gap-2 mb-2 mt-10">
          <p className="prata-regular text-3xl">Login</p>
          <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
        </div>
      </div>

      <div className="flex flex-col items-center w-[90%] sm:max-w m-auto mt-5 gap-4 text-gray-800">
        <Form
          className="form"
          labelCol={{
            span: 24,
          }}
          onFinish={handleLogin}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập email!",
              },
            ]}
          >
            <Input
              type="text"
              placeholder="Email"
              className="px-3 py-2 border border-gray-800 w-[500px] text-base"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu!",
              },
            ]}
          >
            <Input
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-800 text-base"
            />
          </Form.Item>

          <div className="w-full flex justify-between text-sm mt-[-8px]">
            <a
              href="/forgot-password"
              className="cursor-pointer mb-[8px] text-sm"
            >
              Forgot your password?
            </a>

            <a href="/register" className="cursor-pointer mb-[8px] text-sm ">
              Create account?
            </a>
          </div>

          <Form.Item>
            <div className="flex justify-center w-full">
              <Button
                className="bg-white text-black border border-gray-800 font-light px-8 py-2 text-lg rounded-[18px] w-[100px] h-[40px]"
                type="primary"
                htmlType="submit"
              >
                Login
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default Login;

// import { Button, Form, Input } from "antd";
// import "./index.scss";
// import Header from "../../component/header";
// import api from "../../config/axios";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const navigate = useNavigate();

//   // vùng của javascript
//   const handleLogin = async (values) => {
//     console.log(values);

//     try {
//       // gửi request đến server
//       const response = await api.post("login", values);
//       const { token } = response.data;
//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(response.data));
//       navigate("/");
//     } catch (err) {
//       console.log(err);
//       alert(err.response.data);
//     }
//   };

//   return (
//     <>
//       <Header />
//       <div className="login">
//         <div className="login__image">
//           <img
//             src="https://img.freepik.com/free-photo/colorful-fish-swimming-underwater_23-2150777184.jpg"
//             alt=""
//           />
//         </div>
//         <div className="login__form">
//           <div className="form-wrapper">
// <Form
//   className="form"
//   labelCol={{
//     span: 24,
//   }}
//   onFinish={handleLogin} // event => chạy khi mà form đc submit thành công
// >
//   <Form.Item
//     label="Phone"
//     name="phone"
//     rules={[
//       {
//         required: true,
//         message: "Vui lòng nhập số điẹn thoại!",
//       },
//     ]}
//   >
//     <Input type="text" placeholder="Username" />
//   </Form.Item>
//   <Form.Item
//     label="Password"
//     name="password"
//     rules={[
//       {
//         required: true,
//         message: "Vui lòng nhập mật khẩu!",
//       },
//     ]}
//   >
//     <Input type="password" placeholder="Password" />
//   </Form.Item>
//   <Form.Item>
//     <Button type="primary" htmlType="submit">
//       Login
//     </Button>
//   </Form.Item>
// </Form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Login;
