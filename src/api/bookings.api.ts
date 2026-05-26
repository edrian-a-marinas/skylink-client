import axiosClient from "./axiosClient";
import { handleApiError } from "./api.helpers";
import type {
  Booking,
  BookingDetail,
  CancellationRequest,
  RefundDetail,
  RescheduleRequest,
} from "@/types";

/**
 * User/Admin: Create Booking
 * POST /api/v1/bookings
 */
export async function createBooking(
  payload: Partial<Booking>,
): Promise<Booking> {
  try {
    const res = await axiosClient.post("/bookings", payload);
    return res.data as Booking;
  } catch (err) {
    handleApiError(err);
  }
}

/**
 * User: Get own bookings
 * GET /api/v1/bookings
 */
export async function getBookingsForUser(userId?: string): Promise<Booking[]> {
  try {
    const res = await axiosClient.get("/bookings", {
      params: userId ? { userId } : {},
    });
    // Handle PaginatedResponse[BookingListRead]
    const items = Array.isArray(res.data) ? res.data : (res.data?.items || []);
    return items as Booking[];
  } catch (err) {
    handleApiError(err);
  }
}

/**
 * Admin: Get ALL bookings
 * GET /api/v1/bookings/admin/all
 */
export async function getAllBookingsAdmin(): Promise<Booking[]> {
  try {
    const res = await axiosClient.get("/bookings/admin/all");
    // Handle PaginatedResponse[BookingListRead]
    const items = Array.isArray(res.data) ? res.data : (res.data?.items || []);
    return items as Booking[];
  } catch (err) {
    handleApiError(err);
  }
}

/**
 * User/Admin: Get specific booking
 * GET /api/v1/bookings/{booking_id}
 */
export async function getBookingById(id: string): Promise<BookingDetail> {
  try {
    const res = await axiosClient.get(`/bookings/${id}`);
    return res.data as BookingDetail;
  } catch (err) {
    handleApiError(err);
  }
}

/**
 * User/Admin: Cancel Booking
 * DELETE /api/v1/bookings/{booking_id}
 */
export async function cancelBooking(
  id: string,
): Promise<void> {
  try {
    await axiosClient.delete(`/bookings/${id}`);
  } catch (err) {
    handleApiError(err);
  }
}

/**
 * User/Admin: Reschedule Booking
 * PUT /api/v1/bookings/{booking_id}/reschedule
 */
export async function rescheduleBooking(
  id: string,
  payload: RescheduleRequest,
): Promise<Booking> {
  try {
    const res = await axiosClient.put(`/bookings/${id}/reschedule`, payload);
    return res.data as Booking;
  } catch (err) {
    handleApiError(err);
  }
}
