import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.tsx";
import { AuthProvider } from "./store/authStore";
import { BookingFlowProvider } from "./store/bookingFlowStore";
import { PaymentFlowProvider } from "./store/paymentFlowStore";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <BookingFlowProvider>
        <PaymentFlowProvider>
          <App />
        </PaymentFlowProvider>
      </BookingFlowProvider>
    </AuthProvider>
  </StrictMode>,
);
