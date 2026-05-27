import { useCallback, useEffect, useState } from "react";
import {
  cancelBooking,
  createBooking,
  getBookingDetail,
  getBookingsForUser,
  previewCancellation,
  rescheduleBooking,
} from "@/api/bookings.api";
import { useAuthStore } from "@/store/useAuthStore";
import type {
  APIError,
  Booking,
  BookingDetail,
  RescheduleRequest,
} from "@/types";

export function useMyBookings() {
  const { user } = useAuthStore();
  const [data, setData] = useState<Booking[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<APIError | null>(null);

  const fetchMyBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const bookings = await getBookingsForUser(user?.id);
      setData(bookings);
      return bookings;
    } catch (err) {
      setError(err as APIError);
      setData(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    void fetchMyBookings();
  }, [fetchMyBookings]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchMyBookings,
  };
}

export function useBookingDetail(bookingId?: string) {
  const [data, setData] = useState<BookingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<APIError | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!bookingId) {
      setData(null);
      return null;
    }

    setIsLoading(true);
    setError(null);
    try {
      const detail = await getBookingDetail(bookingId);
      setData(detail);
      return detail;
    } catch (err) {
      setError(err as APIError);
      setData(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    void fetchDetail();
  }, [fetchDetail]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchDetail,
  };
}

export function useBookingActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<APIError | null>(null);

  const create = useCallback(async (payload: Partial<Booking>) => {
    setIsLoading(true);
    setError(null);
    try {
      return await createBooking(payload);
    } catch (err) {
      setError(err as APIError);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const previewCancel = useCallback(async (bookingId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      return await previewCancellation(bookingId);
    } catch (err) {
      setError(err as APIError);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancel = useCallback(
    async (bookingId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        return await cancelBooking(bookingId);
      } catch (err) {
        setError(err as APIError);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const reschedule = useCallback(
    async (bookingId: string, payload: RescheduleRequest) => {
      setIsLoading(true);
      setError(null);
      try {
        return await rescheduleBooking(bookingId, payload);
      } catch (err) {
        setError(err as APIError);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    isLoading,
    error,
    create,
    cancel,
    previewCancel,
    reschedule,
  };
}
