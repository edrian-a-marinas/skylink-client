import { useState } from "react";
import { Plane, Search } from "lucide-react";

type TabKey = "pnr" | "flight";

const FlightStatusPage = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("pnr");
  const [query, setQuery] = useState("");

  return (
    <main className="min-h-[calc(100vh-160px)] bg-[#F3F5F7]">
      <section className="bg-gradient-to-b from-[#233449] to-[#3D516B] px-6 py-12 text-center text-white">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
            <Plane size={20} className="text-white" />
          </div>
          <h1 className="text-2xl font-semibold md:text-3xl">Flight Status</h1>
          <p className="text-sm text-white/75 md:text-base">
            Real-time updates for your flight - gate, terminal, delays, and
            more.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20 pt-10">
        <div className="mx-auto w-full max-w-xl">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.15)]">
            <div className="flex rounded-full bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setActiveTab("pnr")}
                className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-colors md:text-sm ${
                  activeTab === "pnr"
                    ? "bg-white text-[#4E6B8D] shadow"
                    : "text-slate-500"
                }`}
              >
                By PNR
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("flight")}
                className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-colors md:text-sm ${
                  activeTab === "flight"
                    ? "bg-white text-[#4E6B8D] shadow"
                    : "text-slate-500"
                }`}
              >
                By Flight No.
              </button>
            </div>

            <div className="mt-5 space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {activeTab === "pnr"
                  ? "PNR / Booking Reference"
                  : "Flight Number"}
              </label>
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={
                  activeTab === "pnr" ? "E.G. SK7831" : "E.G. SK4421"
                }
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-[#4E6B8D] focus:bg-white"
              />
              <p className="text-xs text-slate-400">Try: SK7831 or SK4421</p>
            </div>

            <button
              type="button"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#5D7FA7] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4E6B8D]"
            >
              <Search size={16} />
              Check Status
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default FlightStatusPage;
