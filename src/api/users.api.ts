import axiosClient from "./axiosClient";
import { handleApiError } from "./api.helpers";
import type { User } from "@/types";

export interface UserDetail extends User {
  total_bookings: number;
}

export interface UserListItem extends User {
  bookings_count: number;
}

/**
 * Admin: Get all users
 * GET /api/v1/users
 */
export async function getUsers(): Promise<UserListItem[]> {
  try {
    const res = await axiosClient.get("/users");
    // Backend returns PaginatedResponse[UserRead]
    const items = Array.isArray(res.data) ? res.data : (res.data?.items || []);
    return items;
  } catch (err) {
    handleApiError(err);
  }
}

/**
 * Admin: Get specific user
 * GET /api/v1/users/{user_id}
 */
export async function getUserById(id: string): Promise<UserDetail> {
  try {
    const res = await axiosClient.get(`/users/${id}`);
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
}

/**
 * Admin: Update User Status (Suspend/Activate)
 * PUT /api/v1/users/{user_id}/status
 * Expects: UserStatusUpdate schema (usually { is_active: boolean })
 */
export async function toggleUserStatus(id: string, active: boolean): Promise<User> {
  try {
    const res = await axiosClient.put(`/users/${id}/status`, { is_active: active });
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
}

/**
 * Admin: Delete User
 * DELETE /api/v1/users/{user_id}
 */
export async function deleteUser(id: string): Promise<void> {
  try {
    await axiosClient.delete(`/users/${id}`);
  } catch (err) {
    handleApiError(err);
  }
}
