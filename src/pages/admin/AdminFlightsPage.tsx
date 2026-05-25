import { useState } from "react";
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
import type { Flight } from "@/types";
import { cn } from "@/utils/cn";

const AdminFlightsPage = () => {
  const navigate = useNavigate();
  const { data: flights, isLoading, refetch } = useFlights();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [flightToDelete, setFlightToDelete] = useState<Flight | null>(null);
  const [isDeleting, setIsRegistering] = useState(false);

  const handleOpenDeleteModal = (flight: Flight) => {
    setFlightToDelete(flight);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!flightToDelete) return;
    setIsRegistering(true);
    try {
      await deleteFlight(flightToDelete.id);
      setDeleteModalOpen(false);
      setFlightToDelete(null);
      refetch();
    } catch (err) {
      console.error("Failed to delete flight", err);
    } finally {
      setIsRegistering(false);
    }
  };

  const columns: TableColumn<Flight>[] = [
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
      cell: (row) => (
        <div className="flex flex-col">
          <span className="text-slate-700 font-medium">{new Date(row.departureTime).toISOString().split('T')[0]}</span>
          <span className="text-xs text-slate-500">{new Date(row.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      ),
    },
    {
      key: "arrival",
      header: "ARRIVAL",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="text-slate-700 font-medium">{new Date(row.arrivalTime).toISOString().split('T')[0]}</span>
          <span className="text-xs text-slate-500">{new Date(row.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      ),
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
          {row.seatsAvailable} / {row.totalSeats || 180}
        </span>
      ),
    },
    {
      key: "actions",
      header: "ACTIONS",
      cell: (row) => (
        <div className="flex items-center gap-2">
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
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Flights</h2>
            <p className="text-sm font-medium text-slate-500">{flights?.length || 0} flights found</p>
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
            <select className="h-11 px-4 rounded-xl bg-slate-50 text-sm font-medium border border-transparent focus:border-[#496B92]/20 outline-none min-w-[140px]">
              <option value="">Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="boarding">Boarding</option>
              <option value="in_air">In Air</option>
              <option value="landed">Landed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select className="h-11 px-4 rounded-xl bg-slate-50 text-sm font-medium border border-transparent focus:border-[#496B92]/20 outline-none min-w-[140px]">
              <option value="">Sort By</option>
              <option value="departure">Departure</option>
              <option value="price">Price</option>
              <option value="seats">Seats</option>
            </select>
          </div>
        </div>

        {/* Flights Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <DataTable
            columns={columns}
            rows={flights || []}
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
            <p className="text-sm font-medium text-slate-500">Showing 1-8 of 10</p>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-white transition-colors disabled:opacity-50">
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center gap-1">
                <button className="size-9 rounded-lg bg-[#496B92] text-white font-bold text-sm">1</button>
                <button className="size-9 rounded-lg text-slate-600 font-bold text-sm hover:bg-white border border-transparent hover:border-slate-200 transition-colors">2</button>
              </div>
              <button className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-white transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

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
              <span className="text-sm text-slate-500">{new Date(flightToDelete.departureTime).toLocaleString()}</span>
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
