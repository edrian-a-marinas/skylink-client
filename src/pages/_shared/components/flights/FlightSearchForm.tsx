import { PlaneTakeoff, PlaneLanding, Calendar, Search } from "lucide-react";

const FlightSearchForm = () => {
  return (
    <div className="bg-white rounded-[16px] p-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col md:flex-row items-center gap-0 max-w-6xl mx-auto border border-white/20">
      {/* Departure */}
      <div className="flex-1 w-full flex flex-col px-8 py-4 border-b md:border-b-0 md:border-r border-slate-100">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.05em] mb-2">
          Departure
        </label>
        <div className="flex items-center gap-3">
          <PlaneTakeoff className="text-[#496B92] w-5 h-5" />
          <input
            type="text"
            placeholder="Where from?"
            className="bg-transparent border-none outline-none text-slate-700 font-medium placeholder:text-slate-300 w-full text-[15px]"
          />
        </div>
      </div>

      {/* Arrival */}
      <div className="flex-1 w-full flex flex-col px-8 py-4 border-b md:border-b-0 md:border-r border-slate-100">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.05em] mb-2">
          Arrival
        </label>
        <div className="flex items-center gap-3">
          <PlaneLanding className="text-[#496B92] w-5 h-5" />
          <input
            type="text"
            placeholder="Where to?"
            className="bg-transparent border-none outline-none text-slate-700 font-medium placeholder:text-slate-300 w-full text-[15px]"
          />
        </div>
      </div>

      {/* Dates */}
      <div className="flex-1 w-full flex flex-col px-8 py-4 border-b md:border-b-0 md:border-r border-slate-100">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.05em] mb-2">
          Dates
        </label>
        <div className="flex items-center gap-3">
          <Calendar className="text-[#496B92] w-5 h-5" />
          <input
            type="text"
            placeholder="Select dates"
            className="bg-transparent border-none outline-none text-slate-700 font-medium placeholder:text-slate-300 w-full text-[15px]"
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => (e.target.type = "text")}
          />
        </div>
      </div>

      {/* Search Button */}
      <div className="px-2 py-2 w-full md:w-auto">
        <button className="w-full md:w-auto bg-[#496B92] hover:bg-[#385270] transition-all text-white px-10 py-[18px] rounded-[12px] flex items-center justify-center gap-3 font-bold shadow-md hover:shadow-lg active:scale-[0.98]">
          <Search className="w-5 h-5 stroke-[2.5px]" />
          <span className="text-[15px]">Search Flights</span>
        </button>
      </div>
    </div>
  );
};

export default FlightSearchForm;
