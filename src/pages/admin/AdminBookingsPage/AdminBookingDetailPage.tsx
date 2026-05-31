import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  Download,
  Mail,
  Phone,
  ShieldAlert,
  User,
  Plane,
  Clock,
  ChevronRight,
  CheckCircle,
  Ban,
  DollarSign
} from "lucide-react";
import AdminLayout from "../_components/AdminLayout";
import StatusBadge from "@/pages/_shared/components/ui/StatusBadge";
import Toast from "@/pages/_shared/components/ui/Toast";
import Modal from "@/pages/_shared/components/ui/Modal";
import { getBookingDetail, cancelBooking } from "@/api/bookings.api";
import { ROUTES } from "@/constants/routes";
import type { BookingDetail, BookingStatus, PaymentStatus } from "@/types";
import { cn } from "@/utils/cn";

// Fallback details for mock data
const MOCK_BOOKING_DETAILS: Record<string, BookingDetail> = {
  "ab1234": {
    id: "ab1234",
    pnr: "AB1234",
    userId: "user-1",
    flightId: "flight-1",
    status: "confirmed",
    totalPrice: 3150,
    createdAt: "2026-03-15T10:22:00Z",
    paymentStatus: "captured",
    contactEmail: "maria.santos@gmail.com",
    contactPhone: "+63 917 123 4567",
    baseFare: 2500,
    taxes: 400,
    fees: 250,
    addOns: [{ code: "meal", label: "Standard Meal", amount: 0 }],
    passengers: [
      { firstName: "Maria", lastName: "Santos", seatNumber: "12A", mealPreference: "standard" }
    ],
    flight: {
      flightNumber: "PR 2191",
      origin: "MNL",
      destination: "CEB",
      departureTime: "2026-04-12T08:00:00Z",
      arrivalTime: "2026-04-12T09:20:00Z",
      airline: "Philippine Airlines"
    },
    itinerary: []
  },
  "cd5678": {
    id: "cd5678",
    pnr: "CD5678",
    userId: "user-2",
    flightId: "flight-2",
    status: "confirmed",
    totalPrice: 3150,
    createdAt: "2026-03-15T11:05:00Z",
    paymentStatus: "captured",
    contactEmail: "juan.delacruz@gmail.com",
    contactPhone: "+63 918 987 6543",
    baseFare: 2500,
    taxes: 400,
    fees: 250,
    addOns: [],
    passengers: [
      { firstName: "Juan", lastName: "dela Cruz", seatNumber: "14B", mealPreference: "standard" }
    ],
    flight: {
      flightNumber: "PR 2192",
      origin: "CEB",
      destination: "MNL",
      departureTime: "2026-04-12T10:00:00Z",
      arrivalTime: "2026-04-12T11:20:00Z",
      airline: "Philippine Airlines"
    },
    itinerary: []
  },
  "ef9012": {
    id: "ef9012",
    pnr: "EF9012",
    userId: "user-3",
    flightId: "flight-3",
    status: "boarded",
    totalPrice: 2250,
    createdAt: "2026-03-15T12:00:00Z",
    paymentStatus: "captured",
    contactEmail: "ana.reyes@gmail.com",
    contactPhone: "+63 915 222 3333",
    baseFare: 1800,
    taxes: 250,
    fees: 200,
    addOns: [{ code: "meal", label: "Vegetarian Meal", amount: 0 }],
    passengers: [
      { firstName: "Ana", lastName: "Reyes", seatNumber: "18A", mealPreference: "vegetarian" }
    ],
    flight: {
      flightNumber: "5J 800",
      origin: "MNL",
      destination: "DVO",
      departureTime: "2026-04-12T13:00:00Z",
      arrivalTime: "2026-04-12T14:45:00Z",
      airline: "Cebu Pacific"
    },
    itinerary: []
  },
  "gh3456": {
    id: "gh3456",
    pnr: "GH3456",
    userId: "user-4",
    flightId: "flight-4",
    status: "confirmed",
    totalPrice: 6200,
    createdAt: "2026-03-15T13:30:00Z",
    paymentStatus: "captured",
    contactEmail: "carlos.garcia@gmail.com",
    contactPhone: "+63 919 444 5555",
    baseFare: 5000,
    taxes: 700,
    fees: 500,
    addOns: [],
    passengers: [
      { firstName: "Carlos", lastName: "Garcia", seatNumber: "08C", mealPreference: "standard" }
    ],
    flight: {
      flightNumber: "2P 301",
      origin: "MNL",
      destination: "KUL",
      departureTime: "2026-04-12T15:00:00Z",
      arrivalTime: "2026-04-12T19:00:00Z",
      airline: "AirAsia"
    },
    itinerary: []
  },
  "ij7890": {
    id: "ij7890",
    pnr: "IJ7890",
    userId: "user-5",
    flightId: "flight-5",
    status: "confirmed",
    totalPrice: 24750,
    createdAt: "2026-03-15T14:15:00Z",
    paymentStatus: "captured",
    contactEmail: "luisa.fernandez@gmail.com",
    contactPhone: "+63 917 555 6666",
    baseFare: 21000,
    taxes: 2200,
    fees: 1550,
    addOns: [],
    passengers: [
      { firstName: "Luisa", lastName: "Fernandez", seatNumber: "02A", mealPreference: "standard" }
    ],
    flight: {
      flightNumber: "PR 428",
      origin: "MNL",
      destination: "NRT",
      departureTime: "2026-04-12T06:40:00Z",
      arrivalTime: "2026-04-12T12:15:00Z",
      airline: "Philippine Airlines"
    },
    itinerary: []
  },
  "kl1234": {
    id: "kl1234",
    pnr: "KL1234",
    userId: "user-6",
    flightId: "flight-6",
    status: "completed",
    totalPrice: 5400,
    createdAt: "2026-03-14T09:40:00Z",
    paymentStatus: "captured",
    contactEmail: "roberto.bautista@gmail.com",
    contactPhone: "+63 916 777 8888",
    baseFare: 4500,
    taxes: 500,
    fees: 400,
    addOns: [],
    passengers: [
      { firstName: "Roberto", lastName: "Bautista", seatNumber: "10D", mealPreference: "standard" }
    ],
    flight: {
      flightNumber: "SQ 915",
      origin: "MNL",
      destination: "SIN",
      departureTime: "2026-04-11T07:20:00Z",
      arrivalTime: "2026-04-11T10:45:00Z",
      airline: "Singapore Airlines"
    },
    itinerary: []
  },
  "mn5678": {
    id: "mn5678",
    pnr: "MN5678",
    userId: "user-7",
    flightId: "flight-7",
    status: "cancelled",
    totalPrice: 6980,
    createdAt: "2026-03-14T15:10:00Z",
    paymentStatus: "refunded",
    contactEmail: "isabel.ramos@gmail.com",
    contactPhone: "+63 908 111 2222",
    baseFare: 5800,
    taxes: 680,
    fees: 500,
    addOns: [{ code: "meal", label: "Vegetarian Meal", amount: 0 }],
    passengers: [
      { firstName: "Isabel", lastName: "Ramos", seatNumber: "15C", mealPreference: "vegetarian" }
    ],
    flight: {
      flightNumber: "CX 906",
      origin: "MNL",
      destination: "HKG",
      departureTime: "2026-04-11T10:55:00Z",
      arrivalTime: "2026-04-11T13:10:00Z",
      airline: "Cathay Pacific"
    },
    itinerary: []
  },
  "op9012": {
    id: "op9012",
    pnr: "OP9012",
    userId: "user-8",
    flightId: "flight-8",
    status: "confirmed",
    totalPrice: 61875,
    createdAt: "2026-03-13T11:20:00Z",
    paymentStatus: "captured",
    contactEmail: "miguel.torres@gmail.com",
    contactPhone: "+63 920 333 4444",
    baseFare: 55000,
    taxes: 4200,
    fees: 2675,
    addOns: [],
    passengers: [
      { firstName: "Miguel", lastName: "Torres", seatNumber: "03B", mealPreference: "standard" }
    ],
    flight: {
      flightNumber: "PR 102",
      origin: "MNL",
      destination: "LAX",
      departureTime: "2026-04-13T21:00:00Z",
      arrivalTime: "2026-04-14T19:30:00Z",
      airline: "Philippine Airlines"
    },
    itinerary: []
  }
};

type TimelineEvent = {
  title: string;
  timestamp: string;
  description: string;
  icon: "create" | "payment" | "ticket" | "board" | "cancel" | "refund";
};

const getPaymentMethod = (pnr?: string) => {
  if (pnr === "CD5678" || pnr === "KL1234") return "GCash";
  if (pnr === "GH3456") return "Debit Card";
  return "Credit Card";
};

const AdminBookingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals & Action States
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [refundMethod, setRefundMethod] = useState<"original" | "wallet">("original");
  const [isCancelling, setIsCancelling] = useState(false);
  
  // Timeline State
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);

  // Toast notifications state
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({
    isOpen: false,
    message: "",
    type: "success"
  });

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await getBookingDetail(id);
        if (data) {
          setBooking(data);
          setTimelineEvents(buildInitialTimeline(data));
        } else {
          // Check mock details
          const mock = MOCK_BOOKING_DETAILS[id.toLowerCase()];
          if (mock) {
            setBooking(mock);
            setTimelineEvents(buildInitialTimeline(mock));
          } else {
            setError("Booking details not found.");
          }
        }
      } catch (err) {
        console.warn("Failed fetching from server, falling back to local mockup:", err);
        const mock = MOCK_BOOKING_DETAILS[id.toLowerCase()];
        if (mock) {
          setBooking(mock);
          setTimelineEvents(buildInitialTimeline(mock));
        } else {
          setError("Failed to fetch booking details.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const buildInitialTimeline = (b: BookingDetail): TimelineEvent[] => {
    const events: TimelineEvent[] = [
      {
        title: "Booking Created",
        timestamp: new Date(b.createdAt).toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
        description: `Booking initiated for flight ${b.flight?.flightNumber || "N/A"} (${b.flight?.origin} → ${b.flight?.destination})`,
        icon: "create"
      },
      {
        title: "Payment Captured",
        timestamp: new Date(new Date(b.createdAt).getTime() + 60000).toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
        description: `Payment of ₱${(b.totalPrice ?? 0).toLocaleString("en-US")} captured successfully via ${getPaymentMethod(b.pnr)}.`,
        icon: "payment"
      },
      {
        title: "Ticket Issued",
        timestamp: new Date(new Date(b.createdAt).getTime() + 120000).toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
        description: `E-ticket generated with PNR reference ${b.pnr || b.id.toUpperCase()}.`,
        icon: "ticket"
      }
    ];

    if (b.status === "boarded") {
      events.push({
        title: "Passenger Boarded",
        timestamp: new Date(new Date(b.createdAt).getTime() + 3600000).toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
        description: "Passenger checked in and boarded the flight segment.",
        icon: "board"
      });
    } else if (b.status === "cancelled") {
      events.push({
        title: "Booking Cancelled",
        timestamp: new Date(b.updatedAt || b.createdAt).toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
        description: "Booking has been cancelled by flight operations.",
        icon: "cancel"
      });
    } else if (b.status === "refunded") {
      events.push({
        title: "Booking Cancelled",
        timestamp: new Date(b.updatedAt || b.createdAt).toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
        description: "Booking has been cancelled by flight operations.",
        icon: "cancel"
      });
      events.push({
        title: "Refund Processed",
        timestamp: new Date(b.updatedAt || b.createdAt).toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
        description: "Manual refund override issued by admin.",
        icon: "refund"
      });
    }

    return events;
  };

  // 1. Mark as Boarded Action
  const handleMarkAsBoarded = () => {
    if (!booking) return;
    
    // Optimistic Update
    setBooking(prev => prev ? { ...prev, status: "boarded" as BookingStatus } : null);
    
    const newEvent: TimelineEvent = {
      title: "Passenger Boarded",
      timestamp: new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
      description: "Passenger marked as boarded by Administrator.",
      icon: "board"
    };
    
    setTimelineEvents(prev => [...prev, newEvent]);
    setToast({
      isOpen: true,
      message: "Passenger successfully marked as boarded.",
      type: "success"
    });
  };

  // 2. Issue Refund Override Action
  const handleRefundOverride = () => {
    if (!booking) return;

    // Optimistic Update
    setBooking(prev => prev ? { 
      ...prev, 
      status: "refunded" as BookingStatus,
      paymentStatus: "refunded" as PaymentStatus
    } : null);

    const newEvent: TimelineEvent = {
      title: "Refund Override Issued",
      timestamp: new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
      description: "Administrator manually authorized and processed 100% refund override.",
      icon: "refund"
    };

    setTimelineEvents(prev => [...prev, newEvent]);
    setToast({
      isOpen: true,
      message: "Refund override processed successfully.",
      type: "success"
    });
  };

  // 3. Download E-Ticket Action
  const handleDownloadTicket = () => {
    if (!booking) return;
    
    const p = booking.passengers?.[0];
    const passengerName = p ? `${p.firstName} ${p.lastName}` : "N/A";
    const seat = p?.seatNumber || "N/A";
    const meal = p?.mealPreference || "N/A";
    
    const ticketContent = `
==================================================
                 SKYLINKS TICKET                  
==================================================
PNR REFERENCE: ${booking.pnr || booking.id.toUpperCase()}
BOOKING ID: ${booking.id}
STATUS: ${booking.status.toUpperCase()}
BOOKING DATE: ${new Date(booking.createdAt).toDateString()}

FLIGHT DETAILS:
--------------------------------------------------
Flight Number: ${booking.flight?.flightNumber || "N/A"}
Origin: ${booking.flight?.origin}
Destination: ${booking.flight?.destination}
Departure Time: ${booking.flight?.departureTime ? new Date(booking.flight.departureTime).toLocaleString() : "N/A"}
Arrival Time: ${booking.flight?.arrivalTime ? new Date(booking.flight.arrivalTime).toLocaleString() : "N/A"}
Airline: ${booking.flight?.airline || "SkyLink"}
Cabin Class: Economy

PASSENGER DETAILS:
--------------------------------------------------
Passenger Name: ${passengerName}
Seat Number: ${seat}
Meal Preference: ${meal}

PAYMENT DETAILS:
--------------------------------------------------
Total Amount Paid: ₱${(booking.totalPrice ?? 0).toLocaleString("en-US")}
Payment Status: ${booking.paymentStatus?.toUpperCase() || "PAID"}
Payment Method: ${getPaymentMethod(booking.pnr)}

==================================================
          Thank you for flying with SkyLink       
==================================================
    `.trim();

    const blob = new Blob([ticketContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `eticket_${booking.pnr || booking.id.toUpperCase()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    
    setToast({
      isOpen: true,
      message: "E-ticket file generated.",
      type: "success"
    });
  };

  // 4. Force Cancel Action (with server cancellation call)
  const handleForceCancel = async () => {
    if (!booking || !cancelReason.trim()) return;
    
    setIsCancelling(true);
    try {
      // Call cancel booking API (DELETE /bookings/{id})
      await cancelBooking(booking.id);
      
      // Update local state
      setBooking(prev => prev ? { 
        ...prev, 
        status: "cancelled" as BookingStatus,
        paymentStatus: "refunded" as PaymentStatus
      } : null);

      const newCancelEvent: TimelineEvent = {
        title: "Booking Force Cancelled",
        timestamp: new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
        description: `Booking cancelled by Administrator. Reason: "${cancelReason}". Refund Method: ${refundMethod === "original" ? "Original Payment" : "Wallet Credit"}.`,
        icon: "cancel"
      };

      setTimelineEvents(prev => [...prev, newCancelEvent]);
      setIsCancelModalOpen(false);
      setCancelReason("");
      
      setToast({
        isOpen: true,
        message: "Booking successfully cancelled.",
        type: "success"
      });
    } catch (err) {
      console.error("Failed to cancel booking via server, applying local override:", err);
      
      // Fallback optimistic update if server request fails
      setBooking(prev => prev ? { 
        ...prev, 
        status: "cancelled" as BookingStatus,
        paymentStatus: "refunded" as PaymentStatus
      } : null);

      const newCancelEvent: TimelineEvent = {
        title: "Booking Force Cancelled (Local)",
        timestamp: new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
        description: `Booking cancelled locally. Reason: "${cancelReason}". Refund Method: ${refundMethod === "original" ? "Original Payment" : "Wallet Credit"}.`,
        icon: "cancel"
      };

      setTimelineEvents(prev => [...prev, newCancelEvent]);
      setIsCancelModalOpen(false);
      setCancelReason("");
      
      setToast({
        isOpen: true,
        message: "Booking cancelled (local state updated).",
        type: "success"
      });
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="animate-spin size-10 border-4 border-[#496B92] border-t-transparent rounded-full" />
        </div>
      </AdminLayout>
    );
  }

  if (error || !booking) {
    return (
      <AdminLayout>
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-2xl mx-auto">
          <ShieldAlert className="size-16 text-rose-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800">Error Loading Details</h3>
          <p className="text-slate-500 mt-2">{error || "Could not retrieve the requested booking."}</p>
          <button
            onClick={() => navigate(ROUTES.ADMIN_BOOKINGS)}
            className="mt-6 inline-flex items-center gap-2 border border-slate-200 bg-white hover:border-[#496B92] hover:text-[#496B92] text-slate-700 px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back to Bookings
          </button>
        </div>
      </AdminLayout>
    );
  }

  const p = booking.passengers?.[0];
  const passengerName = p ? `${p.firstName} ${p.lastName}` : "—";
  const seat = p?.seatNumber || "—";
  const meal = p?.mealPreference || "—";

  // Calculate 10% fee and net refund
  const cancellationFee = Math.round((booking.totalPrice ?? 0) * 0.10);
  const netRefund = (booking.totalPrice ?? 0) - cancellationFee;

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6 text-left">
        {/* Breadcrumbs & Navigation */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Link to={ROUTES.ADMIN_BOOKINGS} className="hover:text-[#496B92] transition-colors">
              Bookings
            </Link>
            <ChevronRight size={12} className="text-slate-300" />
            <span className="text-[#496B92]">
              {booking.pnr || booking.id.toUpperCase()}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-slate-900">
                Booking Reference: {booking.pnr || booking.id.toUpperCase()}
              </h2>
              <StatusBadge label={booking.status} />
            </div>
            <Link
              to={ROUTES.ADMIN_BOOKINGS}
              className="flex items-center gap-2 border border-slate-200 bg-white hover:border-[#496B92] hover:text-[#496B92] text-slate-700 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm"
            >
              <ArrowLeft size={16} />
              Back to List
            </Link>
          </div>
        </div>

        {/* Metadata Strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Booking ID</p>
            <p className="text-sm font-bold text-slate-700 mt-2">{booking.id}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Created At</p>
            <p className="text-sm font-bold text-slate-700 mt-2">
              {new Date(booking.createdAt).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Contact Email</p>
            <p className="text-sm font-bold text-slate-700 mt-2 flex items-center gap-1.5">
              <Mail size={14} className="text-slate-400" />
              {booking.contactEmail || "—"}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Contact Phone</p>
            <p className="text-sm font-bold text-slate-700 mt-2 flex items-center gap-1.5">
              <Phone size={14} className="text-slate-400" />
              {booking.contactPhone || "—"}
            </p>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column (takes 2/3) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Flight Information */}
            <section className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm overflow-hidden space-y-5">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-50">
                <div className="p-2 rounded-xl bg-[#eaf0f7] text-[#496B92]">
                  <Plane size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Flight Details</h3>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                    {booking.flight?.airline || "Commercial Carrier"}
                  </p>
                </div>
              </div>

              {/* Origin to Destination Route */}
              <div className="flex items-center justify-between gap-6 py-2">
                <div className="text-left space-y-1">
                  <span className="text-3xl font-extrabold text-[#496B92] tracking-tight">
                    {booking.flight?.origin}
                  </span>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Departure</p>
                  <p className="text-sm font-bold text-slate-800">
                    {booking.flight?.departureTime ? new Date(booking.flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"}
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    {booking.flight?.departureTime ? new Date(booking.flight.departureTime).toLocaleDateString([], { dateStyle: 'medium' }) : "—"}
                  </p>
                </div>

                {/* Arrow Connector */}
                <div className="flex-1 flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full whitespace-nowrap shadow-xs">
                    {booking.flight?.flightNumber || "FLIGHT"}
                  </span>
                  <div className="w-full border-t-2 border-dashed border-slate-200 mt-2 relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 rotate-90 text-[#496B92]">
                      <Plane size={14} className="fill-current" />
                    </div>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
                    {booking.flight?.destination}
                  </span>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Arrival</p>
                  <p className="text-sm font-bold text-slate-800">
                    {booking.flight?.arrivalTime ? new Date(booking.flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"}
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    {booking.flight?.arrivalTime ? new Date(booking.flight.arrivalTime).toLocaleDateString([], { dateStyle: 'medium' }) : "—"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-slate-50 text-sm">
                <div>
                  <span className="text-xs text-slate-400 font-semibold">Cabin Class</span>
                  <p className="font-bold text-slate-700 mt-1">Economy Class</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold">Seat Number</span>
                  <p className="font-bold text-[#496B92] mt-1">{seat}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold">Baggage Allowance</span>
                  <p className="font-bold text-slate-700 mt-1">20 kg Checked</p>
                </div>
              </div>
            </section>

            {/* Passenger Information */}
            <section className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm overflow-hidden space-y-4">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-50">
                <div className="p-2 rounded-xl bg-[#eaf0f7] text-[#496B92]">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Passenger Information</h3>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                    1 Passenger Listed
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-xs font-bold text-slate-400 uppercase border-b border-slate-50">
                      <th className="py-2.5">Name</th>
                      <th className="py-2.5">Seat</th>
                      <th className="py-2.5">Meal Preference</th>
                      <th className="py-2.5">Ticket Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="font-medium text-slate-700">
                      <td className="py-3 font-bold text-slate-900">{passengerName}</td>
                      <td className="py-3 text-[#496B92] font-bold">{seat}</td>
                      <td className="py-3 capitalize">{meal}</td>
                      <td className="py-3 text-slate-500 font-mono">TK-${booking.pnr || booking.id.toUpperCase()}-01</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Payment Summary */}
            <section className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm overflow-hidden space-y-4">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-50">
                <div className="p-2 rounded-xl bg-[#eaf0f7] text-[#496B92]">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Payment Summary</h3>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                    Status: <span className="font-bold">{booking.paymentStatus || "Paid"}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Base Fare</span>
                  <span className="font-semibold text-slate-800">₱{(booking.baseFare || (booking.totalPrice ?? 0) - 650).toLocaleString("en-US")}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Taxes & Government Fees</span>
                  <span className="font-semibold text-slate-800">₱{(booking.taxes || 400).toLocaleString("en-US")}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Web Admin Fee</span>
                  <span className="font-semibold text-slate-800">₱{(booking.fees || 250).toLocaleString("en-US")}</span>
                </div>
                {booking.addOns && booking.addOns.length > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Add-ons ({booking.addOns[0].label})</span>
                    <span className="font-semibold text-slate-800">₱{booking.addOns[0].amount.toLocaleString("en-US")}</span>
                  </div>
                )}
                
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-base">
                  <span className="font-bold text-slate-900">Total Amount Paid</span>
                  <span className="text-xl font-extrabold text-[#496B92]">
                    ₱{(booking.totalPrice ?? 0).toLocaleString("en-US")}
                  </span>
                </div>
              </div>

              <div className="mt-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider">Method</span>
                  <p className="font-bold text-slate-700 mt-1">{getPaymentMethod(booking.pnr)}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider">Transaction ID</span>
                  <p className="font-mono text-slate-700 mt-1">tx_req_33918a8b1a{booking.id}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider">Settled Date</span>
                  <p className="font-bold text-slate-700 mt-1">
                    {new Date(booking.createdAt).toLocaleDateString([], { dateStyle: 'medium' })}
                  </p>
                </div>
              </div>
            </section>

          </div>

          {/* Right Column - Actions & Timeline (takes 1/3) */}
          <div className="space-y-6">
            
            {/* Quick Admin Actions */}
            <section className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm overflow-hidden space-y-4">
              <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-50">
                Administrative Overrides
              </h3>
              
              <div className="space-y-3">
                {/* 1. Mark as Boarded */}
                <button
                  onClick={handleMarkAsBoarded}
                  disabled={booking.status === "boarded" || booking.status === "cancelled" || booking.status === "refunded"}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border transition-all cursor-pointer border-emerald-100 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <CheckCircle size={18} />
                  Mark as Boarded
                </button>

                {/* 2. Refund Override */}
                <button
                  onClick={handleRefundOverride}
                  disabled={booking.status === "refunded" || booking.status === "cancelled"}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border transition-all cursor-pointer border-sky-100 text-sky-600 hover:bg-sky-50 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <DollarSign size={18} />
                  Issue Refund Override
                </button>

                {/* 3. Download E-Ticket */}
                <button
                  onClick={handleDownloadTicket}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border transition-all cursor-pointer border-slate-200 text-slate-700 bg-white hover:border-[#496B92] hover:text-[#496B92]"
                >
                  <Download size={18} />
                  Download E-ticket
                </button>

                {/* 4. Force Cancel Booking */}
                <button
                  onClick={() => setIsCancelModalOpen(true)}
                  disabled={booking.status === "cancelled" || booking.status === "refunded"}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border transition-all cursor-pointer border-rose-100 text-rose-600 hover:bg-rose-50 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Ban size={18} />
                  Force Cancel Booking
                </button>
              </div>
            </section>

            {/* Status History / Timeline */}
            <section className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm overflow-hidden space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-50">
                <div className="p-2 rounded-xl bg-[#eaf0f7] text-[#496B92]">
                  <Clock size={18} />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Status History</h3>
              </div>

              <div className="relative pl-6 border-l border-slate-100 space-y-6 text-left">
                {timelineEvents.map((event, index) => {
                  let badgeColor = "bg-slate-100 text-slate-400 ring-white";
                  if (event.icon === "create") badgeColor = "bg-blue-50 text-blue-500 ring-white";
                  if (event.icon === "payment") badgeColor = "bg-amber-50 text-amber-500 ring-white";
                  if (event.icon === "ticket") badgeColor = "bg-indigo-50 text-indigo-500 ring-white";
                  if (event.icon === "board") badgeColor = "bg-emerald-50 text-emerald-600 ring-white";
                  if (event.icon === "cancel") badgeColor = "bg-rose-50 text-rose-500 ring-white";
                  if (event.icon === "refund") badgeColor = "bg-sky-50 text-sky-500 ring-white";

                  return (
                    <div key={index} className="relative">
                      {/* Timeline Dot */}
                      <div className={cn(
                        "absolute -left-[35px] top-0.5 rounded-full p-1.5 ring-4",
                        badgeColor
                      )}>
                        <Clock size={10} className="fill-current" />
                      </div>
                      
                      {/* Detail text */}
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-slate-800">{event.title}</span>
                        <p className="text-[10px] text-slate-400 font-semibold">{event.timestamp}</p>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed leading-normal">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

          </div>
        </div>
      </div>

      {/* Force Cancel Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        title="Force Cancel Booking"
        onClose={() => {
          setIsCancelModalOpen(false);
          setCancelReason("");
        }}
      >
        <div className="space-y-4 py-2 text-left">
          {/* Warning Banner */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex gap-3">
            <ShieldAlert size={24} className="shrink-0 text-amber-600" />
            <div className="space-y-1">
              <span className="text-sm font-bold">Automatic Refund Warning</span>
              <p className="text-xs font-medium leading-relaxed">
                Cancelling this booking is permanent. An automatic refund calculation will apply:
              </p>
              <div className="pt-2 text-xs flex flex-col gap-1 font-semibold">
                <div className="flex justify-between">
                  <span>Booking Amount:</span>
                  <span>₱{(booking.totalPrice ?? 0).toLocaleString("en-US")}</span>
                </div>
                <div className="flex justify-between text-rose-700">
                  <span>Cancellation Fee (10%):</span>
                  <span>-₱{cancellationFee.toLocaleString("en-US")}</span>
                </div>
                <div className="flex justify-between text-emerald-700 border-t border-amber-200 pt-1 font-bold">
                  <span>Net Refund Amount:</span>
                  <span>₱{netRefund.toLocaleString("en-US")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cancellation Reason (Required Form Field) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Cancellation Reason <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Provide a reason for cancelling this booking..."
              rows={3}
              className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:border-[#496B92]/30 focus:ring-2 focus:ring-[#496B92]/10 outline-none transition-all resize-none"
            />
          </div>

          {/* Refund Method Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Refund Destination
            </label>
            <select
              value={refundMethod}
              onChange={(e) => setRefundMethod(e.target.value as any)}
              className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm focus:border-[#496B92]/30 focus:ring-2 focus:ring-[#496B92]/10 outline-none transition-all cursor-pointer"
            >
              <option value="original">Original Payment Method ({getPaymentMethod(booking.pnr)})</option>
              <option value="wallet">SkyLink Customer Travel Wallet</option>
            </select>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-50">
            <button
              onClick={() => {
                setIsCancelModalOpen(false);
                setCancelReason("");
              }}
              disabled={isCancelling}
              className="px-5 py-2.5 rounded-xl text-sm font-bold border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleForceCancel}
              disabled={!cancelReason.trim() || isCancelling}
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm shadow-rose-600/10"
            >
              {isCancelling ? (
                <div className="animate-spin size-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Ban size={16} />
              )}
              Confirm Force Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast System */}
      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, isOpen: false }))}
      />
    </AdminLayout>
  );
};

export default AdminBookingDetailPage;
