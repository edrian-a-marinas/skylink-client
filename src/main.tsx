import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.tsx";
import { AuthProvider } from "./store/authStore";
import { BookingFlowProvider } from "./store/bookingFlowStore";
import { PaymentFlowProvider } from "./store/paymentFlowStore";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <AuthProvider>
            <BookingFlowProvider>
              <PaymentFlowProvider>
                <App />
              </PaymentFlowProvider>
            </BookingFlowProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </StrictMode>
);