import { useState, useEffect } from "react";
import { Search, Plane, MapPin, Monitor, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

/* ================= TYPES ================= */

type TabType = "pnr" | "flight";
type FlightStatus = "on-time" | "delayed" | "cancelled";

type FlightResult = {
  status: FlightStatus;
  flightCode: string;
  newArrival?: string;
  departure: {
    code: string;
    city: string;
    scheduled: string;
    actual?: string | null;
  };
  arrival: {
    code: string;
    city: string;
    scheduled: string;
    actual?: string | null;
  };
  gate: string;
  terminal: string;
};

/* ================= MOCK DATA ================= */

// Looked up by PNR / booking reference (e.g. ABC123)
const MOCK_PNR: Record<string, FlightResult> = {
  ABC123: {
    status: "on-time",
    flightCode: "SK 7831",
    departure: { code: "MNL", city: "Manila", scheduled: "06:45", actual: null },
    arrival:   { code: "CEB", city: "Cebu",   scheduled: "08:00", actual: null },
    gate: "Gate 3",
    terminal: "Terminal 1",
  },
  XYZ789: {
    status: "cancelled",
    flightCode: "SK 4421",
    departure: { code: "MNL", city: "Manila", scheduled: "10:00", actual: null },
    arrival:   { code: "DVO", city: "Davao",  scheduled: "11:30", actual: null },
    gate: "Gate 9",
    terminal: "Terminal 2",
  },
  DEF456: {
    status: "delayed",
    flightCode: "PR 101",
    newArrival: "14:50",
    departure: { code: "MNL", city: "Manila",    scheduled: "09:00", actual: "09:30" },
    arrival:   { code: "HKG", city: "Hong Kong", scheduled: "13:30", actual: "14:50" },
    gate: "Gate 12",
    terminal: "Terminal 1",
  },
};

// Looked up by flight number (e.g. PR101)
const MOCK_FLIGHTS: Record<string, FlightResult> = {
  "5J213": {
    status: "on-time",
    flightCode: "5J 213",
    departure: { code: "CEB", city: "Cebu",      scheduled: "15:00", actual: null },
    arrival:   { code: "SIN", city: "Singapore", scheduled: "18:10", actual: null },
    gate: "Gate 7",
    terminal: "Terminal 3",
  },
  SK4500: {
    status: "delayed",
    flightCode: "SK 4500",
    newArrival: "12:25",
    departure: { code: "MNL", city: "Manila",    scheduled: "08:00", actual: "08:25" },
    arrival:   { code: "SIN", city: "Singapore", scheduled: "12:00", actual: "12:25" },
    gate: "Gate 5",
    terminal: "Terminal 2",
  },
  PR101: {
    status: "on-time",
    flightCode: "PR 101",
    departure: { code: "MNL", city: "Manila",    scheduled: "09:00", actual: null },
    arrival:   { code: "HKG", city: "Hong Kong", scheduled: "13:30", actual: null },
    gate: "Gate 12",
    terminal: "Terminal 1",
  },
};

/* ================= CONFIG ================= */

const TAB_CONFIG: Record<TabType, {
  label: string;
  inputLabel: string;
  placeholder: string;
  examples: string[];
}> = {
  pnr: {
    label: "By PNR",
    inputLabel: "PNR / Booking Reference",
    placeholder: "E.G. ABC123",
    examples: ["ABC123", "XYZ789", "DEF456"],
  },
  flight: {
    label: "By Flight No.",
    inputLabel: "Flight Number",
    placeholder: "E.G. PR101",
    examples: ["PR101", "5J213", "SK4500"],
  },
};

/* ================= STATUS CONFIG ================= */

const STATUS_CONFIG: Record<FlightStatus, {
  bg: string;
  border: string;
  text: string;
  icon: React.ReactNode;
  label: string;
}> = {
  "on-time":  { bg: "bg-green-50",  border: "border-green-200",  text: "text-green-700",  icon: <CheckCircle className="w-4 h-4 text-green-600" />,  label: "On Time"   },
  delayed:    { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700", icon: <AlertTriangle className="w-4 h-4 text-yellow-600" />, label: "Delayed"   },
  cancelled:  { bg: "bg-red-50",    border: "border-red-200",    text: "text-red-700",    icon: <XCircle className="w-4 h-4 text-red-600" />,         label: "Cancelled" },
};

/* ================= COMPONENTS ================= */

const Tabs = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}) => (
  <div className="mb-6 flex rounded-xl border border-slate-200 p-1 bg-slate-50">
    {(Object.keys(TAB_CONFIG) as TabType[]).map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all duration-200 ${
          activeTab === tab
            ? "bg-white text-[#1e2d4a] shadow-sm"
            : "text-slate-400 hover:text-slate-600"
        }`}
      >
        {TAB_CONFIG[tab].label}
      </button>
    ))}
  </div>
);

const FlightResultCard = ({
  data,
  onCheckAnother,
}: {
  data: FlightResult;
  onCheckAnother: () => void;
}) => {
  const s = STATUS_CONFIG[data.status];
  const isDelayed   = data.status === "delayed";
  const isCancelled = data.status === "cancelled";

  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
      {/* Status Bar */}
      <div className={`flex items-center justify-between px-4 py-2.5 ${s.bg} border-b ${s.border}`}>
        <div className="flex items-center gap-2">
          {s.icon}
          <span className={`text-xs font-semibold ${s.text}`}>
            {isDelayed
              ? `Delayed — New arrival: ${data.newArrival}`
              : isCancelled
              ? "Cancelled"
              : "On Time"}
          </span>
        </div>
        <span className={`text-xs font-bold tracking-widest ${s.text}`}>
          {data.flightCode}
        </span>
      </div>

      {/* Route */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between">
          {/* Departure */}
          <div>
            <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
              Departure
            </p>
            <h2 className="text-3xl font-bold text-[#1a2a4a] leading-none mt-0.5">
              {data.departure.code}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{data.departure.city}</p>
            <p className="text-sm font-medium text-slate-700 mt-1">
              {data.departure.scheduled}
            </p>
            {data.departure.actual && (
              <p className="text-xs text-red-500 font-medium">
                Actual: {data.departure.actual}
              </p>
            )}
          </div>

          {/* Plane Icon */}
          <div className="flex flex-col items-center gap-1">
            <div className="h-px w-16 bg-slate-200" />
            <Plane size={16} className="text-slate-400" />
            <div className="h-px w-16 bg-slate-200" />
          </div>

          {/* Arrival */}
          <div className="text-right">
            <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
              Arrival
            </p>
            <h2 className="text-3xl font-bold text-[#1a2a4a] leading-none mt-0.5">
              {data.arrival.code}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{data.arrival.city}</p>
            <p className="text-sm font-medium text-slate-700 mt-1">
              {data.arrival.scheduled}
            </p>
            {data.arrival.actual && (
              <p className="text-xs text-red-500 font-medium">
                Actual: {data.arrival.actual}
              </p>
            )}
          </div>
        </div>

        <div className="my-4 border-t border-dashed border-slate-200" />

        {/* Gate / Terminal */}
        <div className="flex justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <MapPin size={12} className="text-slate-400" />
            <span>
              <span className="font-semibold text-slate-700">Gate</span>{" "}
              {data.gate}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Monitor size={12} className="text-slate-400" />
            <span>
              <span className="font-semibold text-slate-700">Terminal</span>{" "}
              {data.terminal}
            </span>
          </div>
        </div>
      </div>

      {/* Check Another Flight */}
      <div className="px-5 pb-4 pt-1">
        <button
          onClick={onCheckAnother}
          className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#5E83AE] hover:text-[#1e2d4a] transition-colors"
        >
          <Search size={12} />
          Check Another Flight →
        </button>
      </div>
    </div>
  );
};

/* ================= MAIN PAGE ================= */

const FlightStatusPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("pnr");
  const [values, setValues]       = useState<Record<TabType, string>>({ pnr: "", flight: "" });
  const [result, setResult]       = useState<FlightResult | null>(null);
  const [error, setError]         = useState<string>("");

  const config = TAB_CONFIG[activeTab];

  // Clear result & error when switching tabs
  useEffect(() => {
    setResult(null);
    setError("");
  }, [activeTab]);

  const handleSubmit = () => {
    const val = values[activeTab].trim().toUpperCase().replace(/\s+/g, "");
    if (!val) {
      setError("Please enter a value.");
      return;
    }

    // Use the correct dataset based on the active tab
    const dataset = activeTab === "pnr" ? MOCK_PNR : MOCK_FLIGHTS;
    const found = dataset[val];

    if (found) {
      setResult(found);
      setError("");
    } else {
      setResult(null);
      setError("No flight found.");
    }
  };

  const handleCheckAnother = () => {
    setResult(null);
    setError("");
    setValues({ pnr: "", flight: "" });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f0f2f5]">
      {/* Hero Header */}
      <div className="flex flex-col items-center gap-2 bg-gradient-to-br from-[#1a2540] via-[#1e2d4a] to-[#384F68] px-6 pb-16 pt-12 text-center">
        <Plane size={28} color="#fff" />
        <h1 className="text-2xl font-bold text-white">Flight Status</h1>
        <p className="text-sm text-slate-300 max-w-xs">
          Real-time updates for your flight — gate, terminal, delays, and more.
        </p>
      </div>

      {/* Card */}
      <div className="flex flex-1 flex-col items-center px-5 py-10">
       <div className="w-full max-w-[440px] md:max-w-[520px] lg:max-w-[600px]">
          <div className="rounded-2xl bg-white p-6 shadow-xl">
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Input */}
            <div className="mb-5">
              <label className="mb-2 block text-xs font-semibold text-slate-600">
                {config.inputLabel}
              </label>
              <input
                type="text"
                placeholder={config.placeholder}
                value={values[activeTab]}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    [activeTab]: e.target.value.toUpperCase(),
                  }))
                }
                onKeyDown={handleKeyDown}
                maxLength={10}
                className="w-full rounded-xl border border-[#d8dfee] px-4 py-3.5 text-sm tracking-widest text-[#1a2a4a] outline-none focus:border-[#1e2d4a] focus:ring-2 focus:ring-[#1e2d4a]/10 transition"
              />
              <p className="mt-2 text-xs text-slate-400">
                Try:{" "}
                {config.examples.map((ex, i) => ( 
                  <span key={ex}>
                    <button
                      onClick={() =>
                        setValues((prev) => ({ ...prev, [activeTab]: ex }))
                      }
                      className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-mono text-slate-600 hover:bg-slate-200 transition"
                    >
                      {ex}
                    </button>
                    {i < config.examples.length - 1 && " or "}
                  </span>
                ))}
              </p>
              {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
            </div>

            <button
              onClick={handleSubmit}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5E83AE] py-3.5 text-sm font-semibold text-white hover:bg-[#1e2d4a] transition-colors"
            >
              <Search size={16} />
              Check Status
            </button>
          </div>

          {result && (
            <FlightResultCard data={result} onCheckAnother={handleCheckAnother} />
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightStatusPage;