import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.tsx";
import { AuthProvider } from "./store/authStore";
import { BookingFlowProvider } from "./store/bookingFlowStore";
import { PaymentFlowProvider } from "./store/paymentFlowStore";
import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <BookingFlowProvider>
          <PaymentFlowProvider>
            <App />
          </PaymentFlowProvider>
        </BookingFlowProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);