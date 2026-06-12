import axiosClient from "./axiosClient";
import { handleApiError } from "./api.helpers";
import type {
  OTPChallenge,
  Payment,
  PaymentFailure,
  PaymentRequest,
} from "@/types";

export async function initializePayment(
  payload: PaymentRequest,
): Promise<Payment> {
  try {
    const res = await axiosClient.post("/payments/initialize", payload);
    return res.data as Payment;
  } catch (err) {
    handleApiError(err);
  }
}

export async function requestPaymentOtp(
  paymentId: string,
): Promise<OTPChallenge> {
  try {
    const res = await axiosClient.post(`/payments/${paymentId}/otp/request`);
    return res.data as OTPChallenge;
  } catch (err) {
    handleApiError(err);
  }
}

export async function verifyPaymentOtp(
  paymentId: string,
  otpCode: string,
): Promise<Payment> {
  try {
    const res = await axiosClient.post(`/payments/${paymentId}/otp/verify`, {
      otpCode,
    });
    return res.data as Payment;
  } catch (err) {
    handleApiError(err);
  }
}

export async function getPaymentStatus(paymentId: string): Promise<Payment> {
  try {
    const res = await axiosClient.get(`/payments/${paymentId}`);
    return res.data as Payment;
  } catch (err) {
    handleApiError(err);
  }
}

export async function getPaymentFailure(
  paymentId: string,
): Promise<PaymentFailure | null> {
  try {
    const res = await axiosClient.get(`/payments/${paymentId}/failure`);
    return res.data as PaymentFailure | null;
  } catch (err) {
    handleApiError(err);
  }
}

// --- PayMongo Integrations ---

export async function createPaymentIntent(bookingId: string, paymentMethod?: string): Promise<{ client_key: string }> {
  try {
    const url = paymentMethod
      ? `/payments/create-intent?booking_id=${bookingId}&payment_method=${paymentMethod}`
      : `/payments/create-intent?booking_id=${bookingId}`;
    const res = await axiosClient.post(url);
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
}

interface PaymongoMethodPayload {
  type: "card" | "gcash" | "paymaya";
  details?: {
    card_number: string;
    exp_month: number;
    exp_year: number;
    cvc: string;
  };
  billing?: {
    name: string;
    email: string;
    phone?: string;
  };
}

const PAYMONGO_PUBLIC_KEY = import.meta.env.VITE_PAYMONGO_PUBLIC_KEY || "pk_test_uNZ8jMZLRV5B3eLZUeRNG4y6";

export async function createPaymongoPaymentMethod(payload: PaymongoMethodPayload): Promise<any> {
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Basic ${btoa(PAYMONGO_PUBLIC_KEY)}`
    },
    body: JSON.stringify({
      data: {
        attributes: payload
      }
    })
  };

  const res = await fetch('https://api.paymongo.com/v1/payment_methods', options);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.errors?.[0]?.detail || "Failed to create payment method");
  }
  const data = await res.json();
  return data.data;
}

export async function attachPaymongoPaymentIntent(
  intentId: string, 
  paymentMethodId: string, 
  clientKey: string, 
  returnUrl: string
): Promise<any> {
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Basic ${btoa(PAYMONGO_PUBLIC_KEY)}`
    },
    body: JSON.stringify({
      data: {
        attributes: {
          payment_method: paymentMethodId,
          client_key: clientKey,
          return_url: returnUrl
        }
      }
    })
  };

  const res = await fetch(`https://api.paymongo.com/v1/payment_intents/${intentId}/attach`, options);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.errors?.[0]?.detail || "Failed to attach payment method");
  }
  const data = await res.json();
  return data.data;
}
