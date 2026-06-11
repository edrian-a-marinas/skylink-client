import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useFlights } from "@/hooks/useFlights";
import { deleteFlight } from "@/api/flights.api";
import AdminLayout from "./_components/AdminLayout";
import DataTable, { type TableColumn } from "@/pages/_shared/components/ui/DataTable";
import StatusBadge from "@/pages/_shared/components/ui/StatusBadge";
import Button from "@/pages/_shared/components/ui/Button";
import Modal from "@/pages/_shared/components/ui/Modal";
import { Search, Plus, Edit2, Trash2, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import type { Flight, PricingSuggestions } from "@/types";
import { getPricingSuggestions } from "@/api/reports.api";
import { cn } from "@/utils/cn";

const AdminFlightsPage = () => {
  const navigate = useNavigate();
  const { data: flights, isLoading, refetch } = useFlights({ pageSize: 100 });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get("sort") ?? "";
  const setSortBy = (val: string) => setSearchParams(val ? { sort: val } : {});
  const isLowSeatsView = searchParams.get("sort") === "seats";
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [flightToDelete, setFlightToDelete] = useState<Flight | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pricingMap, setPricingMap] = useState<Record<string, PricingSuggestions>>({});
  const [pricingLoadingId, setPricingLoadingId] = useState<string | null>(null);
  const [pricingModalFlight, setPricingModalFlight] = useState<Flight | null>(null);

  // Memoized filtering and sorting logic for performance
  const filteredFlights = useMemo(() => {
    const data = flights || [];
    return data.filter((flight) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        flight.flightNumber?.toLowerCase().includes(query) ||
        flight.airline?.toLowerCase().includes(query) ||
        flight.origin?.toLowerCase().includes(query) ||
        flight.destination?.toLowerCase().includes(query);
      
      const matchesStatus = statusFilter === "" || flight.status === statusFilter;
      const matchesLowSeats = !isLowSeatsView || flight.hasLowSeats;
      
      return matchesSearch && matchesStatus && matchesLowSeats;
    }).sort((a, b) => {
      if (sortBy === "departure") {
        return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
      }
      if (sortBy === "price") {
        return (a.price || 0) - (b.price || 0);
      }
      if (sortBy === "seats") {
        return (a.seatsAvailable || 0) - (b.seatsAvailable || 0);
      }
      return 0;
    });
  }, [flights, searchQuery, statusFilter, sortBy]);

  const handleOpenPricing = async (flight: Flight) => {
    setPricingModalFlight(flight);
    if (pricingMap[flight.id]) return;
    setPricingLoadingId(flight.id);
    try {
      const result = await getPricingSuggestions(flight.id);
      setPricingMap((prev) => ({ ...prev, [flight.id]: result }));
    } catch {
      // silent — no suggestions available
    } finally {
      setPricingLoadingId(null);
    }
  };

  const handleOpenDeleteModal = (flight: Flight) => {
    setFlightToDelete(flight);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!flightToDelete) return;
    setIsDeleting(true);
    try {
      await deleteFlight(flightToDelete.id);
      setDeleteModalOpen(false);
      setFlightToDelete(null);
      refetch();
    } catch (err) {
      console.error("Failed to delete flight", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: TableColumn<Flight>[] = useMemo(() => [
    {
      key: "flightNumber",
      header: "FLIGHT NO",
      cell: (row) => <span className="font-bold text-slate-900">{row.flightNumber}</span>,
    },
    {
      key: "airline",
      header: "AIRLINE",
      cell: (row) => <span className="text-slate-700">{row.airline}</span>,
    },
    {
      key: "route",
      header: "ROUTE",
      cell: (row) => (
        <span className="text-[#496B92] font-medium">
          {row.origin} → {row.destination}
        </span>
      ),
    },
    {
      key: "departure",
      header: "DEPARTURE",
      cell: (row) => {
        const date = row.departureTime ? new Date(row.departureTime) : null;
        return (
          <div className="flex flex-col">
            <span className="text-slate-700 font-medium">
              {date ? date.toISOString().split('T')[0] : "—"}
            </span>
            <span className="text-xs text-slate-500">
              {date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"}
            </span>
          </div>
        );
      },
    },
    {
      key: "arrival",
      header: "ARRIVAL",
      cell: (row) => {
        const date = row.arrivalTime ? new Date(row.arrivalTime) : null;
        return (
          <div className="flex flex-col">
            <span className="text-slate-700 font-medium">
              {date ? date.toISOString().split('T')[0] : "—"}
            </span>
            <span className="text-xs text-slate-500">
              {date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"}
            </span>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "STATUS",
      cell: (row) => <StatusBadge label={row.status || "scheduled"} />,
    },
    {
      key: "seats",
      header: "SEATS AVAIL.",
      cell: (row) => (
        <span className={cn(
          "font-medium",
          (row.seatsAvailable ?? 0) < 20 ? "text-rose-600" : "text-slate-700"
        )}>
          {row.seatsAvailable ?? 0} / {row.totalSeats || 180}
        </span>
      ),
    },
    {
      key: "actions",
      header: "ACTIONS",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="relative group/pricing">
            <button
              onClick={() => handleOpenPricing(row)}
              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-100"
            >
              <div className="absolute right-0 top-full mt-2 z-50 hidden group-hover/pricing:flex w-64 rounded-xl bg-slate-900 text-white p-3 shadow-xl pointer-events-none">
                <p className="text-[11px] text-slate-300 leading-relaxed">Suggests whether to raise or lower the ticket price based on how many seats are filled and how close the departure is. A nearly full flight close to departure should cost more.</p>
              </div>
              {pricingLoadingId === row.id ? (
                <span className="animate-spin size-4 border-2 border-emerald-600 border-t-transparent rounded-full block" />
              ) : (
                <span className="text-xs font-bold">₱?</span>
              )}
            </button>
          </div>
          <button
            onClick={() => navigate(ROUTES.ADMIN_EDIT_FLIGHT.replace(":id", row.id))}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100"
            title="Edit Flight"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleOpenDeleteModal(row)}
            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-rose-100"
            title="Delete Flight"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ], [navigate]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Low Seats Banner */}
        {isLowSeatsView && (() => {
          const lowSeatFlights = (flights ?? []).filter((f) => f.hasLowSeats);
          return lowSeatFlights.length > 0 ? (
            <div className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-sm font-bold text-amber-900">
                  {lowSeatFlights.length} flight{lowSeatFlights.length !== 1 ? "s" : ""} nearly full — under 10 seats remaining
                </p>
                <p className="text-xs text-amber-700 mt-0.5 font-medium">
                  These flights are close to selling out. Consider adjusting pricing or opening additional capacity.
                </p>
              </div>
              <button
                onClick={() => setSearchParams({})}
                className="ml-auto text-xs font-bold text-amber-700 hover:underline cursor-pointer shrink-0"
              >
                Clear filter
              </button>
            </div>
          ) : null;
        })()}
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Flights</h2>
            <p className="text-sm font-medium text-slate-500">{filteredFlights.length} flights found</p>
          </div>
          <Link
            to={ROUTES.ADMIN_ADD_FLIGHT}
            className="flex items-center justify-center gap-2 bg-[#496B92] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#3B5470] transition-all shadow-lg shadow-[#496B92]/20"
          >
            <Plus size={20} />
            Add Flight
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by flight no, airline, or route..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-xl bg-slate-50 pl-10 pr-4 text-sm outline-none border border-transparent focus:border-[#496B92]/20 focus:bg-white focus:ring-2 focus:ring-[#496B92]/10 transition-all"
            />
          </div>
          <div className="flex gap-3">
            <select 
              className="h-11 px-4 rounded-xl bg-slate-50 text-sm font-medium border border-transparent focus:border-[#496B92]/20 outline-none min-w-[140px]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="boarding">Boarding</option>
              <option value="on_time">On Time</option>
              <option value="delayed">Delayed</option>
              <option value="cancelled">Cancelled</option>
              <option value="landed">Landed</option>
            </select>
            <select 
              className="h-11 px-4 rounded-xl bg-slate-50 text-sm font-medium border border-transparent focus:border-[#496B92]/20 outline-none min-w-[140px]"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="departure">Departure</option>
              <option value="price">Price</option>
              <option value="seats">Seats</option>
            </select>
            {(() => {
              const lowCount = (flights ?? []).filter((f) => f.hasLowSeats).length;
              return lowCount > 0 ? (
                <button
                  onClick={() => setSearchParams(isLowSeatsView ? {} : { sort: "seats" })}
                  className={cn(
                    "h-11 px-4 rounded-xl text-sm font-bold flex items-center gap-2 border transition-all",
                    isLowSeatsView
                      ? "bg-amber-500 text-white border-amber-500"
                      : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                  )}
                >
                  <AlertTriangle size={14} />
                  Low Seats ({lowCount})
                </button>
              ) : null;
            })()}
          </div>
        </div>

        {/* Flights Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <DataTable
            columns={columns}
            rows={filteredFlights}
            rowKey={(row) => row.id}
            emptyState={
              <div className="py-20 text-center">
                {isLoading ? (
                  <div className="animate-spin size-8 border-4 border-[#496B92] border-t-transparent rounded-full mx-auto" />
                ) : (
                  <p className="text-slate-500 font-medium">No flights found matching your criteria.</p>
                )}
              </div>
            }
          />

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-50 bg-slate-50/30">
            <p className="text-sm font-medium text-slate-500">
              Showing 1-{filteredFlights.length} of {filteredFlights.length}
            </p>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-white transition-colors disabled:opacity-50" disabled>
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center gap-1">
                <button className="size-9 rounded-lg bg-[#496B92] text-white font-bold text-sm">1</button>
              </div>
              <button className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-white transition-colors disabled:opacity-50" disabled>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Suggestions Modal */}
      <Modal
        isOpen={!!pricingModalFlight}
        onClose={() => setPricingModalFlight(null)}
        title="ML Pricing Suggestions"
      >
        {pricingModalFlight && (
          <div className="space-y-4 py-2">
            <p className="text-xs text-slate-500 font-medium">
              {pricingModalFlight.flightNumber} — {pricingModalFlight.origin} → {pricingModalFlight.destination}
            </p>
            {pricingLoadingId === pricingModalFlight.id ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin size-8 border-4 border-[#496B92] border-t-transparent rounded-full" />
              </div>
            ) : pricingMap[pricingModalFlight.id]?.suggestions?.length ? (
              <div className="space-y-3">
                {pricingMap[pricingModalFlight.id].suggestions.map((s) => (
                  <div key={s.seat_class_id} className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-800">{s.seat_class_name}</span>
                      <span className={cn(
                        "text-[10px] font-bold uppercase rounded-full px-2 py-0.5",
                        s.adjustment_pct > 0 ? "bg-emerald-100 text-emerald-700" :
                        s.adjustment_pct < 0 ? "bg-rose-100 text-rose-700" :
                        "bg-slate-100 text-slate-500"
                      )}>
                        {s.adjustment_pct > 0 ? `+${s.adjustment_pct}%` : `${s.adjustment_pct}%`}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>Current: <span className="font-bold text-slate-700">₱{Number(s.current_price).toLocaleString()}</span></span>
                      <span>→</span>
                      <span>Suggested: <span className="font-bold text-[#496B92]">₱{Number(s.suggested_price).toLocaleString()}</span></span>
                    </div>
                    <div className="flex gap-3 text-[11px] text-slate-400">
                      <span>Occupancy: {s.occupancy_rate}%</span>
                      <span>·</span>
                      <span>{s.available_seats}/{s.total_seats} seats</span>
                      <span>·</span>
                      <span>{s.days_until_departure}d to departure</span>
                    </div>
                    <p className="text-[11px] text-slate-500 italic">{s.reason}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-slate-400 py-8">No pricing suggestions available for this flight.</p>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Flight"
      >
        <div className="py-4 space-y-6">
          {flightToDelete && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-900">{flightToDelete.flightNumber} — {flightToDelete.origin} → {flightToDelete.destination}</span>
              </div>
              <span className="text-sm text-slate-500">
                {flightToDelete.departureTime ? new Date(flightToDelete.departureTime).toLocaleString() : "—"}
              </span>
            </div>
          )}

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3 items-start">
            <AlertTriangle className="text-amber-600 shrink-0" size={20} />
            <div>
              <p className="text-sm font-bold text-amber-900">Affected bookings: 12 passengers</p>
              <p className="text-xs text-amber-700 mt-0.5 font-medium">All affected passengers will be notified by email.</p>
            </div>
          </div>

          <p className="text-sm text-slate-600 font-medium text-center">
            Are you sure you want to permanently delete this flight? This action cannot be undone.
          </p>

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              className="flex-1 rounded-xl h-12"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 h-12 rounded-xl"
              onClick={handleDeleteConfirm}
              loading={isDeleting}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default AdminFlightsPage;
