import Header from "../../../component/header";
import { useNavigate } from "react-router-dom";
import Footer from "../../../component/footer";

const FailedTransaction = () => {
  const navigate = useNavigate();

  const handleReturn = () => {
    navigate("/");
  };

  return (
    <>
      <Header />

      <img
        src="https://firebasestorage.googleapis.com/v0/b/event-flower-exchange.appspot.com/o/e2dd070b6354195f096db57025d43d80-transformed.png?alt=media&token=a585acf0-db9b-44d7-b6b0-27b4a7e9ebfc"
        className="ml-[800px] mt-[100px] w-[200px]"
      />
      <div className="ml-[750px] mt-[20px] text-[30px]">
        Failed Transaction!
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

export default FailedTransaction;
