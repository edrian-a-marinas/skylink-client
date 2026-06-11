import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  BookingFlowContext,
  INITIAL_BOOKING_FLOW_STATE,
  type BookingFlowContextType,
  type BookingFlowState,
  type BookingPricingSnapshot,
  type BookingFlowStep,
} from "./bookingFlowContext";
import type { MealPreference, Passenger } from "@/types";

const SEAT_HOLD_DEFAULT_MINUTES = 15;

export const BookingFlowProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<BookingFlowState>(
    INITIAL_BOOKING_FLOW_STATE,
  );
  const seatHoldTimerRef = useRef<number | null>(null);

  const clearSeatHoldTimer = () => {
    if (seatHoldTimerRef.current !== null) {
      window.clearTimeout(seatHoldTimerRef.current);
      seatHoldTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (seatHoldTimerRef.current !== null) {
        window.clearTimeout(seatHoldTimerRef.current);
        seatHoldTimerRef.current = null;
      }
    };
  }, []);

  const value = useMemo<BookingFlowContextType>(() => {
    const applySeatHold = (expiresAt: string) => {
      clearSeatHoldTimer();

      const millisecondsUntilExpiry = Math.max(
        new Date(expiresAt).getTime() - Date.now(),
        0,
      );

      seatHoldTimerRef.current = window.setTimeout(() => {
        setState((previous) => ({ ...previous, isSeatHoldExpired: true }));
      }, millisecondsUntilExpiry);
    };

    const setStep = (step: BookingFlowStep) => {
      setState((previous) => ({ ...previous, step }));
    };

    const setPassengers = (passengers: Passenger[]) => {
      setState((previous) => ({ ...previous, passengers }));
    };

    const setSeatSelections = (seats: string[]) => {
      setState((previous) => ({ ...previous, seatSelections: seats }));
    };

    const setMealSelections = (meals: MealPreference[]) => {
      setState((previous) => ({ ...previous, mealSelections: meals }));
    };

    const setPricing = (pricing: BookingPricingSnapshot) => {
      setState((previous) => ({ ...previous, pricing }));
    };

    const startSeatHold = (minutes = SEAT_HOLD_DEFAULT_MINUTES) => {
      const expiresAt = new Date(
        Date.now() + minutes * 60 * 1000,
      ).toISOString();
      applySeatHold(expiresAt);
      setState((previous) => ({
        ...previous,
        seatHoldExpiresAt: expiresAt,
        isSeatHoldExpired: false,
      }));
    };

    const startFlow = (flightId: string) => {
      const expiresAt = new Date(
        Date.now() + SEAT_HOLD_DEFAULT_MINUTES * 60 * 1000,
      ).toISOString();
      applySeatHold(expiresAt);
      setState({
        ...INITIAL_BOOKING_FLOW_STATE,
        selectedFlightId: flightId,
        seatHoldExpiresAt: expiresAt,
      });
    };

    const clearFlow = () => {
      clearSeatHoldTimer();
      setState(INITIAL_BOOKING_FLOW_STATE);
    };

    return {
      state,
      startFlow,
      setStep,
      setPassengers,
      setSeatSelections,
      setMealSelections,
      setPricing,
      startSeatHold,
      clearFlow,
    };
  }, [state]);

  return (
    <BookingFlowContext.Provider value={value}>
      {children}
    </BookingFlowContext.Provider>
  );
};

export default BookingFlowProvider;
