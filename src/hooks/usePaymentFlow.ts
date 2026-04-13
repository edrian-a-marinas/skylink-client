import { useCallback, useState } from "react";
import {
  getPaymentFailure,
  getPaymentStatus,
  initializePayment,
  requestPaymentOtp,
  verifyPaymentOtp,
} from "@/api/payments.api";
import type {
  APIError,
  OTPChallenge,
  Payment,
  PaymentFailure,
  PaymentRequest,
} from "@/types";

type PaymentFlowAction =
  | "idle"
  | "initialize"
  | "request_otp"
  | "verify_otp"
  | "status"
  | "failure";

export function usePaymentFlow() {
  const [payment, setPayment] = useState<Payment | null>(null);
  const [otpChallenge, setOtpChallenge] = useState<OTPChallenge | null>(null);
  const [failure, setFailure] = useState<PaymentFailure | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<APIError | null>(null);
  const [lastAction, setLastAction] = useState<PaymentFlowAction>("idle");

  const initialize = useCallback(async (payload: PaymentRequest) => {
    setIsLoading(true);
    setError(null);
    setLastAction("initialize");

    try {
      const nextPayment = await initializePayment(payload);
      setPayment(nextPayment);
      setFailure(null);
      return nextPayment;
    } catch (err) {
      setError(err as APIError);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const requestOtp = useCallback(async (paymentId: string) => {
    setIsLoading(true);
    setError(null);
    setLastAction("request_otp");

    try {
      const challenge = await requestPaymentOtp(paymentId);
      setOtpChallenge(challenge);
      return challenge;
    } catch (err) {
      setError(err as APIError);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyOtp = useCallback(async (paymentId: string, otpCode: string) => {
    setIsLoading(true);
    setError(null);
    setLastAction("verify_otp");

    try {
      const nextPayment = await verifyPaymentOtp(paymentId, otpCode);
      setPayment(nextPayment);
      return nextPayment;
    } catch (err) {
      setError(err as APIError);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchStatus = useCallback(async (paymentId: string) => {
    setIsLoading(true);
    setError(null);
    setLastAction("status");

    try {
      const nextPayment = await getPaymentStatus(paymentId);
      setPayment(nextPayment);
      return nextPayment;
    } catch (err) {
      setError(err as APIError);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchFailure = useCallback(async (paymentId: string) => {
    setIsLoading(true);
    setError(null);
    setLastAction("failure");

    try {
      const failureReason = await getPaymentFailure(paymentId);
      setFailure(failureReason);
      return failureReason;
    } catch (err) {
      setError(err as APIError);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    payment,
    otpChallenge,
    failure,
    isLoading,
    error,
    lastAction,
    initialize,
    requestOtp,
    verifyOtp,
    fetchStatus,
    fetchFailure,
  };
}

export default usePaymentFlow;
