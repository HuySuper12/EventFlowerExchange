// PrivateRoute.js
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const PrivateRoute = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const handleBeforeUnload = () => {
      sessionStorage.clear(); // Đảm bảo xóa rõ ràng khi đóng trình duyệt
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [navigate]);

  return <Outlet />;
};

export default PrivateRoute;
