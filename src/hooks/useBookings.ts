import { useQuery, useQueryClient } from "@tanstack/react-query";
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

import { useState, useCallback } from 'react';

export const MY_BOOKINGS_QUERY_KEY = "my-bookings";
export const BOOKING_DETAIL_QUERY_KEY = "booking-detail";

export function useMyBookings() {
  const { user } = useAuthStore();
  const { data, isLoading, error, refetch } = useQuery<Booking[]>({
    queryKey: [MY_BOOKINGS_QUERY_KEY, user?.id],
    queryFn: () => getBookingsForUser(user?.id),
    enabled: !!user?.id,
    staleTime: 30 * 1000,
  });

  return {
    data: data ?? null,
    isLoading,
    error: error as APIError | null,
    refetch: async () => {
      const result = await refetch();
      return result.data ?? null;
    },
  };
}

export function useBookingDetail(bookingId?: string) {
  const { data, isLoading, error, refetch } = useQuery<BookingDetail>({
    queryKey: [BOOKING_DETAIL_QUERY_KEY, bookingId],
    queryFn: () => getBookingDetail(bookingId!),
    enabled: !!bookingId,
    staleTime: 60 * 1000,
  });

  return {
    data: data ?? null,
    isLoading,
    error: error as APIError | null,
    refetch: async () => {
      const result = await refetch();
      return result.data ?? null;
    },
  };
}

export function useBookingActions() {
  const queryClient = useQueryClient();
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
        const result = await cancelBooking(bookingId);
        queryClient.invalidateQueries({ queryKey: [MY_BOOKINGS_QUERY_KEY] });
        queryClient.invalidateQueries({ queryKey: [BOOKING_DETAIL_QUERY_KEY, bookingId] });
        return result;
      } catch (err) {
        setError(err as APIError);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [queryClient],
  );

  const reschedule = useCallback(
    async (bookingId: string, payload: RescheduleRequest) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await rescheduleBooking(bookingId, payload);
        queryClient.invalidateQueries({ queryKey: [MY_BOOKINGS_QUERY_KEY] });
        queryClient.invalidateQueries({ queryKey: [BOOKING_DETAIL_QUERY_KEY, bookingId] });
        return result;
      } catch (err) {
        setError(err as APIError);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [queryClient],
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
