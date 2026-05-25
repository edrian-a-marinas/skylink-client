import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFlight } from "@/api/flights.api";
import { ROUTES } from "@/constants/routes";
import AdminLayout from "./_components/AdminLayout";
import Input from "@/pages/_shared/components/ui/Input";
import Button from "@/pages/_shared/components/ui/Button";
import { ChevronLeft, Save } from "lucide-react";
import { flightSchema, type FlightFormValues } from "@/validation/flight.schemas";
import type { Flight } from "@/types";

const AdminAddFlightPage = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FlightFormValues>({
    resolver: zodResolver(flightSchema),
    defaultValues: {
      status: "scheduled",
      stops: 0,
      seatsAvailable: 150,
      cabinClass: "economy",
    },
  });

  const onSubmit = async (data: FlightFormValues) => {
    setServerError(null);
    try {
      await createFlight(data as Partial<Flight>);
      navigate(ROUTES.ADMIN_FLIGHTS);
    } catch (err: any) {
      setServerError(err.message || "Failed to create flight");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Breadcrumbs & Title */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
            <button onClick={() => navigate(ROUTES.ADMIN_FLIGHTS)} className="hover:text-[#496B92] transition-colors">Flights</button>
            <ChevronLeft size={14} className="rotate-180" />
            <span className="text-[#496B92]">Add Flight</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Add New Flight</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-20">
          {serverError && (
            <div className="p-4 bg-rose-50 text-rose-600 text-sm font-bold rounded-2xl border border-rose-100 flex items-center gap-3">
              <div className="size-2 rounded-full bg-rose-600" />
              {serverError}
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
                className="[&>input]:rounded-xl [&>input]:h-12 opacity-50"
                disabled
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
              Save Flight
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminAddFlightPage;
