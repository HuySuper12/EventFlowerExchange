import Header from "../../../component/header";
import { useNavigate } from "react-router-dom";
import Footer from "../../../component/footer";

const SuccessCheckout = () => {
  const navigate = useNavigate();

  const handleReturn = () => {
    navigate("/");
  };

  return (
    <>
      <Header />
      <img
        src="https://cdn2.iconfinder.com/data/icons/greenline/512/check-512.png"
        className="ml-[800px] mt-[100px] w-[200px]"
      />
      <div className="ml-[750px] mt-[20px] text-[30px]">
        Checkout successfully!
      </div>

      <button
        className="ml-[800px] mt-[40px] mb-[200px] text-[20px] bg-blue-500 text-white px-4 py-2 rounded-md"
        onClick={handleReturn}
      >
        Return to homepage
      </button>
      <Footer />
    </>
  );
};

export default SuccessCheckout;
