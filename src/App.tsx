import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import Navbar from "@/pages/_shared/components/layout/Navbar";
import Footer from "@/pages/_shared/components/layout/Footer";
import ProtectedRoute from "@/pages/_shared/components/layout/ProtectedRoute";
import PublicOnlyRoute from "@/pages/_shared/components/layout/PublicOnlyRoute";
import AdminRoute from "@/pages/_shared/components/layout/AdminRoute";
import ScreenPlaceholder from "@/pages/_shared/components/ui/ScreenPlaceholder";
import HomePage from "@/pages/HomePage/HomePage";
import BookingLandingPage from "@/pages/MainPagesFolder/BookingLandingPage/BookingLandingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import SearchResultsPage from "@/pages/BookingResultPagesFolder/SearchResultsPage/SearchResultsPage";
import BookingDetailPage from "@/pages/BookingDetailPage";
import MyBookingsPage from "@/pages/MyBookingsPage";
import PassengerDetailsPage from "@/pages/BookingPagesFolder/PassengerDetailsPage/PassengerDetailsPage";
import SeatSelectionPage from "@/pages/BookingPagesFolder/SeatSelectionPage/SeatSelectionPage";
import BookingSummaryPage from "@/pages/BookingPagesFolder/BookingSummaryPage/BookingSummaryPage";
import PaymentPage from "@/pages/BookingPagesFolder/PaymentPage/PaymentPage";
import PaymentProcessingPage from "@/pages/BookingPagesFolder/PaymentProcessingPage/PaymentProcessingPage";
import BookingConfirmationPage from "@/pages/BookingPagesFolder/BookingConfirmationPage/BookingConfirmationPage";
import ResultsBookingPage from "@/pages/BookingResultPagesFolder/ResultsBookingPage/ResultsBookingPage";
import FlightStatusPage from "@/pages/MainPagesFolder/FlightStatusPage/FlightStatusPage";
import ManageBookingsPage from "@/pages/ManageBookingPagesFolder/ManageBookingsPage/ManageBookingsPage";
import ManageBookingDetailsPage from "@/pages/ManageBookingPagesFolder/ManageBookingDetailsPage/ManageBookingDetailsPage";
import ManageBookingCancelPage from "@/pages/ManageBookingPagesFolder/ManageBookingCancelPage/ManageBookingCancelPage";
import ManageBookingCanceledPage from "@/pages/ManageBookingPagesFolder/ManageBookingCanceledPage/ManageBookingCanceledPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminFlightsPage from "@/pages/admin/AdminFlightsPage";
import AdminAddFlightPage from "@/pages/admin/AdminAddFlightPage";
import AdminEditFlightPage from "@/pages/admin/AdminEditFlightPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminUserDetailPage from "@/pages/admin/AdminUserDetailPage";
import AdminReportsPage from "@/pages/admin/AdminReportsPage";
import AdminPromotionsPage from "@/pages/admin/AdminPromotionsPage";
import ExplorePage from "@/pages/MainPagesFolder/ExplorePage/ExplorePage";
import DestinationPage from "@/pages/ExplorePagesFolder/DestinationPage/DestinationPage";
import PromosPage from "@/pages/ExplorePagesFolder/PromosPage/PromosPage";
import DeaPage from "@/pages/ExplorePagesFolder/DeaPage/DeaPage";
import AdminDestinationsPage from "@/pages/admin/AdminDestinationsPage";

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

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.BOOK} element={<BookingLandingPage />} />
          <Route path={ROUTES.SEARCH_RESULTS} element={<SearchResultsPage />} />
          <Route path={ROUTES.EXPLORE} element={<ExplorePage />} />
          <Route path={ROUTES.FLIGHTS} element={<FlightStatusPage />} />
          <Route
            path={ROUTES.EXPLORE_DESTINATION}
            element={<DestinationPage />}
          />
          <Route path={ROUTES.EXPLORE_PROMOS} element={<PromosPage />} />
          <Route path={ROUTES.EXPLORE_PROMO_DETAIL} element={<DeaPage />} />
          <Route path={ROUTES.FLIGHT_DETAIL} element={<ResultsBookingPage />} />
          <Route
            path={ROUTES.BOOKING_PASSENGER_DETAILS}
            element={<PassengerDetailsPage />}
          />
          <Route
            path={ROUTES.BOOKING_SEAT_SELECTION}
            element={<SeatSelectionPage />}
          />
          <Route
            path={ROUTES.BOOKING_SUMMARY}
            element={<BookingSummaryPage />}
          />
          <Route path={ROUTES.PAYMENT} element={<PaymentPage />} />
          <Route
            path={ROUTES.PAYMENT_OTP}
            element={<PaymentProcessingPage />}
          />
          <Route
            path={ROUTES.BOOKING_CONFIRMATION}
            element={<BookingConfirmationPage />}
          />
          <Route path={ROUTES.PNR_STATUS} element={<FlightStatusPage />} />
          <Route path={ROUTES.MANAGE} element={<ManageBookingsPage />} />
          <Route
            path={ROUTES.MANAGE_BOOKING_DETAIL}
            element={<ManageBookingDetailsPage />}
          />
          <Route
            path={ROUTES.MANAGE_BOOKING_CANCEL}
            element={<ManageBookingCancelPage />}
          />
          <Route
            path={ROUTES.MANAGE_BOOKING_CANCELED}
            element={<ManageBookingCanceledPage />}
          />
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
            <Route path={ROUTES.USER_DASHBOARD} element={<HomePage />} />
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
              path={ROUTES.BOOKING_MEAL_PREFERENCE}
              element={screen(
                "S-20",
                "Meal Preference",
                "user",
                "Meal selection per passenger with standard defaults.",
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
              element={<AdminAddFlightPage />}
            />
            <Route
              path={ROUTES.ADMIN_EDIT_FLIGHT}
              element={<AdminEditFlightPage />}
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
              element={<AdminUserDetailPage />}
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
            <Route path={ROUTES.ADMIN_PROMOTIONS} element={<AdminPromotionsPage />} />
            <Route path={ROUTES.ADMIN_DESTINATIONS} element={<AdminDestinationsPage />} />
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
      {!isAdminRoute && <Footer />}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
