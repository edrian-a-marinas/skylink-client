import axiosClient from "./axiosClient";
import { handleApiError } from "./api.helpers";
import type {
  Booking,
  BookingDetail,
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
export async function getBookingDetail(id: string): Promise<BookingDetail> {
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

/**
 * Admin: Preview Cancellation (Stub if not in OAS)
 */
export async function previewCancellation(id: string): Promise<any> {
  try {
    // If backend doesn't have this, we return a mock or handle it in UI
    const res = await axiosClient.get(`/bookings/${id}/cancel-preview`);
    return res.data;
  } catch (err) {
    // Fallback if endpoint doesn't exist
    return { refund_amount: 0 };
  }
}
