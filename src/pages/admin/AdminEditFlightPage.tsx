import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getFlightById, updateFlight } from "@/api/flights.api";
import { ROUTES } from "@/constants/routes";
import AdminLayout from "./_components/AdminLayout";
import Input from "@/pages/_shared/components/ui/Input";
import Button from "@/pages/_shared/components/ui/Button";
import { ChevronLeft, Save } from "lucide-react";
import { flightSchema, type FlightFormValues } from "@/validation/flight.schemas";
import type { Flight } from "@/types";
import { cn } from "@/utils/cn";

const AdminEditFlightPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FlightFormValues>({
    resolver: zodResolver(flightSchema) as any,
  });

  const selectedCabinClass = watch("cabinClass");
  const showBusinessFare = selectedCabinClass === "business" || selectedCabinClass === "first";

  useEffect(() => {
    const fetchFlight = async () => {
      if (!id) return;
      try {
        const flight = await getFlightById(id);
        // Format dates for datetime-local input (YYYY-MM-DDTHH:mm)
        const departureTime = flight.departureTime ? new Date(flight.departureTime).toISOString().slice(0, 16) : "";
        const arrivalTime = flight.arrivalTime ? new Date(flight.arrivalTime).toISOString().slice(0, 16) : "";
        
        reset({
          ...flight,
          departureTime,
          arrivalTime,
        } as any);
      } catch (err) {
        console.error("Failed to fetch flight", err);
        setServerError("Failed to load flight details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlight();
  }, [id, reset]);

  const onSubmit = async (data: FlightFormValues) => {
    if (!id) return;
    setServerError(null);
    try {
      await updateFlight(id, data as Partial<Flight>);
      navigate(ROUTES.ADMIN_FLIGHTS);
    } catch (err: any) {
      // Show detailed error if available from backend (FastAPI style)
      const detail = err.details?.detail;
      const message = Array.isArray(detail) 
        ? detail.map((d: any) => `${d.loc.join('.')}: ${d.msg}`).join(' | ')
        : err.message || "Failed to update flight";
      setServerError(message);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="animate-spin size-10 border-4 border-[#496B92] border-t-transparent rounded-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Breadcrumbs & Title */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
            <button onClick={() => navigate(ROUTES.ADMIN_FLIGHTS)} className="hover:text-[#496B92] transition-colors">Flights</button>
            <ChevronLeft size={14} className="rotate-180" />
            <span className="text-[#496B92]">Edit Flight</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Edit Flight — PR 2191</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-20">
          {serverError && (
            <div className="p-4 bg-rose-50 text-rose-600 text-sm font-bold rounded-2xl border border-rose-100 flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-rose-600" />
                <span>Error from Server:</span>
              </div>
              <p className="ml-5 font-medium opacity-90">{serverError}</p>
            </div>
          )}

          {/* Flight Information Section */}
          <section className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-50 bg-slate-50/30">
              <h3 className="font-bold text-slate-900">Flight Information</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Flight Number *"
                placeholder="e.g. PR 2191"
                error={errors.flightNumber?.message}
                {...register("flightNumber")}
                className="[&>input]:rounded-xl [&>input]:h-12"
              />
              <Input
                label="Airline *"
                placeholder="e.g. Philippine Airlines"
                error={errors.airline?.message}
                {...register("airline")}
                className="[&>input]:rounded-xl [&>input]:h-12"
              />
              <Input
                label="Origin Airport (IATA) *"
                placeholder="e.g. MNL"
                error={errors.origin?.message}
                {...register("origin")}
                className="[&>input]:rounded-xl [&>input]:h-12"
              />
              <Input
                label="Destination Airport (IATA) *"
                placeholder="e.g. CEB"
                error={errors.destination?.message}
                {...register("destination")}
                className="[&>input]:rounded-xl [&>input]:h-12"
              />
              <Input
                label="Departure *"
                type="datetime-local"
                error={errors.departureTime?.message}
                {...register("departureTime")}
                className="[&>input]:rounded-xl [&>input]:h-12"
              />
              <Input
                label="Arrival *"
                type="datetime-local"
                error={errors.arrivalTime?.message}
                {...register("arrivalTime")}
                className="[&>input]:rounded-xl [&>input]:h-12"
              />
              <Input
                label="Flight Image URL"
                placeholder="https://images.unsplash.com/photo-..."
                error={errors.imageUrl?.message}
                {...register("imageUrl")}
                className="[&>input]:rounded-xl [&>input]:h-12 md:col-span-2"
              />
            </div>
          </section>

          {/* Aircraft & Capacity Section */}
          <section className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-50 bg-slate-50/30">
              <h3 className="font-bold text-slate-900">Aircraft & Capacity</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-slate-500 uppercase tracking-widest ml-1">Aircraft Type *</label>
                <select 
                  className="w-full h-12 rounded-xl bg-slate-50 border border-slate-200 px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-[#496B92]/10 focus:border-[#496B92]/20 transition-all"
                  {...register("cabinClass")}
                >
                  <option value="economy">Economy Only</option>
                  <option value="business">Business & Economy</option>
                  <option value="first">First, Business & Economy</option>
                </select>
              </div>
              <Input
                label="Total Seats *"
                type="number"
                placeholder="e.g. 180"
                error={errors.totalSeats?.message}
                {...register("totalSeats")}
                className="[&>input]:rounded-xl [&>input]:h-12"
              />
              <Input
                label="Seats Available *"
                type="number"
                placeholder="e.g. 150"
                error={errors.seatsAvailable?.message}
                {...register("seatsAvailable")}
                className="[&>input]:rounded-xl [&>input]:h-12"
              />
            </div>
          </section>

          {/* Fares & Status Section */}
          <section className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-50 bg-slate-50/30">
              <h3 className="font-bold text-slate-900">Fares & Status</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Economy Fare (₱) *"
                type="number"
                placeholder="₱ 0"
                error={errors.price?.message}
                {...register("price")}
                className="[&>input]:rounded-xl [&>input]:h-12"
              />
              <Input
                label="Business Fare (₱)"
                type="number"
                placeholder="₱ 0"
                className={cn("[&>input]:rounded-xl [&>input]:h-12", !showBusinessFare && "opacity-50")}
                disabled={!showBusinessFare}
              />
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-slate-500 uppercase tracking-widest ml-1">Status *</label>
                <select 
                  className="w-full h-12 rounded-xl bg-slate-50 border border-slate-200 px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-[#496B92]/10 focus:border-[#496B92]/20 transition-all"
                  {...register("status")}
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="boarding">Boarding</option>
                  <option value="on_time">On Time</option>
                  <option value="delayed">Delayed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </section>

          {/* Change Log Section */}
          <section className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden text-left">
            <div className="px-6 py-5 border-b border-slate-50 bg-slate-50/30">
              <h3 className="font-bold text-slate-900">Change Log</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="size-2 rounded-full bg-blue-500 mt-1.5" />
                  <div className="w-px h-full bg-slate-100 min-h-[40px]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Departure time changed from 05:30 to 06:00</p>
                  <p className="text-xs text-slate-400 mt-0.5">Admin User · 2026-04-10 14:32</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="size-2 rounded-full bg-blue-500 mt-1.5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Total seats updated from 160 to 180</p>
                  <p className="text-xs text-slate-400 mt-0.5">Admin User · 2026-04-09 09:15</p>
                </div>
              </div>
            </div>
          </section>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate(ROUTES.ADMIN_FLIGHTS)}
              className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-800 transition-colors"
            >
              <ChevronLeft size={20} />
              Cancel
            </button>
            <Button
              type="submit"
              loading={isSubmitting}
              className="bg-[#496B92] hover:bg-[#3B5470] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-[#496B92]/20 flex items-center gap-2"
            >
              <Save size={20} />
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminEditFlightPage;
