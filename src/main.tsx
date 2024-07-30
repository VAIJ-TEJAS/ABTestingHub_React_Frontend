import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ConfigProvider } from "antd";
import { MyContextProvider } from "./context/context.provider.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const clientId = "536694079392-l8fshhc5500re28bk2dk82i9k14h14l6.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ConfigProvider
    theme={{
      token: {
        borderRadius: 3,
        colorPrimary: "#F9A828",
        fontFamily:"sans"
      },
      components: {
        Modal: {
          padding: 0,
          margin: 0
        },
        Input: {
          colorBgContainer: "#D9D9D9"
        },
        InputNumber: {
          colorBgContainer: "#D9D9D9"
        },
        Checkbox: {
          colorPrimary:"#F9A828"
        },
        Segmented:{
          itemSelectedBg: "#F9A828",
          colorText:"#FFFFFF"
        }
      }
    }}
    
  >
    <GoogleOAuthProvider clientId={clientId}>
      <MyContextProvider>
        <ToastContainer />
        <App />
      </MyContextProvider>
    </GoogleOAuthProvider>
  </ConfigProvider>
);