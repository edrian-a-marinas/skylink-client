import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import PublicOnlyRoute from "@/components/layout/PublicOnlyRoute";
import AdminRoute from "@/components/layout/AdminRoute";
import ScreenPlaceholder from "@/components/ui/ScreenPlaceholder";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import SearchResultsPage from "@/pages/SearchResultsPage/SearchResultsPage";
import BookingPage from "@/pages/BookingPage";
import BookingDetailPage from "@/pages/BookingDetailPage";
import MyBookingsPage from "@/pages/MyBookingsPage";
import PaymentPage from "@/pages/PaymentPage";
import PNRStatusPage from "@/pages/PNRStatusPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminFlightsPage from "@/pages/admin/AdminFlightsPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminReportsPage from "@/pages/admin/AdminReportsPage";

function screen(
  id: string,
  title: string,
  scope: "public" | "user" | "admin",
  description: string,
) {
  return (
    <ScreenPlaceholder
      id={id}
      title={title}
      scope={scope}
      description={description}
    />
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.SEARCH_RESULTS} element={<SearchResultsPage />} />
          <Route
            path={ROUTES.FLIGHT_DETAIL}
            element={screen(
              "S-03",
              "Flight Detail",
              "public",
              "Flight detail with fare rules, baggage info, and book now action.",
            )}
          />
          <Route path={ROUTES.PNR_STATUS} element={<PNRStatusPage />} />
          <Route
            path={ROUTES.VERIFY_EMAIL_PENDING}
            element={screen(
              "S-09",
              "Verify Email Pending",
              "public",
              "Email verification pending state with resend action.",
            )}
          />
          <Route
            path={ROUTES.AUTH_GATE}
            element={screen(
              "S-10",
              "Login Prompt / Auth Gate",
              "public",
              "Prompt shown when user must authenticate to continue.",
            )}
          />

          {/* Public-only Routes (guest only) */}
          <Route element={<PublicOnlyRoute />}>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route
              path={ROUTES.FORGOT_PASSWORD}
              element={screen(
                "S-06",
                "Forgot Password",
                "public",
                "Password recovery request and resend flow.",
              )}
            />
            <Route
              path={ROUTES.RESET_PASSWORD}
              element={screen(
                "S-07",
                "Reset Password",
                "public",
                "Set new password with strength and confirmation rules.",
              )}
            />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            <Route
              path={ROUTES.ADMIN_LOGIN}
              element={screen(
                "A-01",
                "Admin Login",
                "public",
                "Dedicated admin authentication entry with role verification.",
              )}
            />
          </Route>

          {/* User Routes (Login required) */}
          <Route element={<ProtectedRoute />}>
            <Route
              path={ROUTES.USER_DASHBOARD}
              element={screen(
                "S-11",
                "User Dashboard",
                "user",
                "User home dashboard with personalized booking shortcuts.",
              )}
            />
            <Route path={ROUTES.MY_BOOKINGS} element={<MyBookingsPage />} />
            <Route
              path={ROUTES.BOOKING_DETAIL}
              element={<BookingDetailPage />}
            />
            <Route
              path={ROUTES.BOOKING_CANCEL}
              element={screen(
                "S-14",
                "Cancel Booking Modal",
                "user",
                "Cancellation confirmation with refund preview and policy.",
              )}
            />
            <Route
              path={ROUTES.RESCHEDULE_PICK}
              element={screen(
                "S-15",
                "Reschedule - Pick Date / Flight",
                "user",
                "Select new date and eligible replacement flight.",
              )}
            />
            <Route
              path={ROUTES.RESCHEDULE_SUMMARY}
              element={screen(
                "S-16",
                "Reschedule Summary",
                "user",
                "Compare old vs new itinerary and confirm changes.",
              )}
            />
            <Route
              path={ROUTES.PROFILE_SETTINGS}
              element={screen(
                "S-17",
                "Profile / Settings",
                "user",
                "User profile management and notification preferences.",
              )}
            />
            <Route
              path={ROUTES.BOOKING_PASSENGER_DETAILS}
              element={<BookingPage />}
            />
            <Route
              path={ROUTES.BOOKING_SEAT_SELECTION}
              element={screen(
                "S-19",
                "Seat Selection",
                "user",
                "Seat map selection with fallback for unavailable seats.",
              )}
            />
            <Route
              path={ROUTES.BOOKING_MEAL_PREFERENCE}
              element={screen(
                "S-20",
                "Meal Preference",
                "user",
                "Meal selection per passenger with standard defaults.",
              )}
            />
            <Route
              path={ROUTES.BOOKING_SUMMARY}
              element={screen(
                "S-21",
                "Booking Summary",
                "user",
                "Review itinerary, passenger, and price breakdown before payment.",
              )}
            />
            <Route path={ROUTES.PAYMENT} element={<PaymentPage />} />
            <Route
              path={ROUTES.PAYMENT_OTP}
              element={screen(
                "S-23",
                "3DS / OTP",
                "user",
                "Authentication challenge step for secured payment confirmation.",
              )}
            />
            <Route
              path={ROUTES.BOOKING_CONFIRMATION}
              element={screen(
                "S-24",
                "Booking Confirmation",
                "user",
                "Final confirmation with booking ID, PNR, and e-ticket notice.",
              )}
            />
            <Route
              path={ROUTES.PAYMENT_FAILURE}
              element={screen(
                "S-25",
                "Payment Failure",
                "user",
                "Payment failure recovery with retry and support actions.",
              )}
            />
          </Route>

          {/* Admin Routes (Admin role required) */}
          <Route element={<AdminRoute />}>
            <Route
              path={ROUTES.ADMIN_DASHBOARD}
              element={<AdminDashboardPage />}
            />
            <Route path={ROUTES.ADMIN_FLIGHTS} element={<AdminFlightsPage />} />
            <Route
              path={ROUTES.ADMIN_ADD_FLIGHT}
              element={screen(
                "A-04",
                "Add Flight",
                "admin",
                "Create and publish flight inventory with validation constraints.",
              )}
            />
            <Route
              path={ROUTES.ADMIN_EDIT_FLIGHT}
              element={screen(
                "A-05",
                "Edit Flight",
                "admin",
                "Edit existing flight with affected-booking warning banner.",
              )}
            />
            <Route
              path={ROUTES.ADMIN_DELETE_FLIGHT}
              element={screen(
                "A-06",
                "Delete Flight Modal",
                "admin",
                "Deactivate or delete flight with active-booking impact details.",
              )}
            />
            <Route path={ROUTES.ADMIN_USERS} element={<AdminUsersPage />} />
            <Route
              path={ROUTES.ADMIN_USER_PROFILE}
              element={screen(
                "A-08",
                "Admin User Profile",
                "admin",
                "Detailed user profile, booking history, and status timeline.",
              )}
            />
            <Route
              path={ROUTES.ADMIN_USER_STATUS}
              element={screen(
                "A-09",
                "Suspend / Reactivate Modal",
                "admin",
                "Account status change with required admin reason.",
              )}
            />
            <Route
              path={ROUTES.ADMIN_BOOKINGS}
              element={screen(
                "A-10",
                "Admin Booking List",
                "admin",
                "Booking management table with filters and export actions.",
              )}
            />
            <Route
              path={ROUTES.ADMIN_BOOKING_DETAIL}
              element={screen(
                "A-11",
                "Admin Booking Detail",
                "admin",
                "Booking deep view including payment and passenger timeline.",
              )}
            />
            <Route
              path={ROUTES.ADMIN_BOOKING_CANCEL}
              element={screen(
                "A-12",
                "Admin Cancel Modal",
                "admin",
                "Cancellation workflow with required reason and refund preview.",
              )}
            />
            <Route path={ROUTES.ADMIN_REPORTS} element={<AdminReportsPage />} />
            <Route
              path={ROUTES.ADMIN_REPORT_RESULT}
              element={screen(
                "A-14",
                "Report Result",
                "admin",
                "Generated report output with chart and export summary.",
              )}
            />
          </Route>

          {/* Fallback */}
          <Route
            path={ROUTES.UNAUTHORIZED}
            element={screen(
              "SYS-401",
              "Unauthorized",
              "public",
              "Access denied for the requested area.",
            )}
          />
          <Route
            path="*"
            element={screen(
              "SYS-404",
              "Not Found",
              "public",
              "The requested page does not exist yet or has moved.",
            )}
          />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
