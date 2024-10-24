import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="10495966471-tt5ji4gnh8jn8ultdaedq63aondv13js.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
