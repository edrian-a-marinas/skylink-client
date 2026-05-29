import { useEffect, useMemo, useState } from "react";
import AdminLayout from "./_components/AdminLayout";
import DataTable, { type TableColumn } from "@/pages/_shared/components/ui/DataTable";
import Button from "@/pages/_shared/components/ui/Button";
import Modal from "@/pages/_shared/components/ui/Modal";
import {
  Search, Plus, Edit2, Trash2, MapPin, Plane, Tag,
} from "lucide-react";
import {
  getAirports, createAirport, updateAirport, deleteAirport,
  getAircraft, createAircraft, updateAircraft, deleteAircraft,
  getSeatClasses, createSeatClass, updateSeatClass, deleteSeatClass,
} from "@/api/destinations.api";
import type {
  Airport, Aircraft, SeatClass,
} from "@/types/destinations.types";

type Tab = "airports" | "aircraft" | "seat-classes";

const AdminDestinationsPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("airports");
  const [searchQuery, setSearchQuery] = useState("");

  // Data
  const [airports, setAirports] = useState<Airport[]>([]);
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [seatClasses, setSeatClasses] = useState<SeatClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Airport | Aircraft | SeatClass | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [form, setForm] = useState<Record<string, string | number>>({});

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [a, ac, sc] = await Promise.all([getAirports(), getAircraft(), getSeatClasses()]);
      setAirports(a);
      setAircraft(ac);
      setSeatClasses(sc);
    } catch (err) {
      console.error("Failed to fetch destinations data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const openAdd = () => { setForm({}); setAddModalOpen(true); };
  const openEdit = (item: Airport | Aircraft | SeatClass) => { setSelectedItem(item); setForm({ ...item }); setEditModalOpen(true); };
  const openDelete = (item: Airport | Aircraft | SeatClass) => { setSelectedItem(item); setDeleteModalOpen(true); };

  const handleAdd = async () => {
    setIsSubmitting(true);
    try {
      if (activeTab === "airports") await createAirport(form as any);
      if (activeTab === "aircraft") await createAircraft({ ...form, total_seats: Number(form.total_seats) } as any);
      if (activeTab === "seat-classes") await createSeatClass(form as any);
      setAddModalOpen(false);
      fetchAll();
    } catch (err) { console.error(err); }
    finally { setIsSubmitting(false); }
  };

  const handleEdit = async () => {
    if (!selectedItem) return;
    setIsSubmitting(true);
    try {
      if (activeTab === "airports") await updateAirport(selectedItem.id, form as any);
      if (activeTab === "aircraft") await updateAircraft(selectedItem.id, { ...form, total_seats: Number(form.total_seats) } as any);
      if (activeTab === "seat-classes") await updateSeatClass(selectedItem.id, form as any);
      setEditModalOpen(false);
      fetchAll();
    } catch (err) { console.error(err); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    setIsSubmitting(true);
    try {
      if (activeTab === "airports") await deleteAirport(selectedItem.id);
      if (activeTab === "aircraft") await deleteAircraft(selectedItem.id);
      if (activeTab === "seat-classes") await deleteSeatClass(selectedItem.id);
      setDeleteModalOpen(false);
      fetchAll();
    } catch (err) { console.error(err); }
    finally { setIsSubmitting(false); }
  };

  const field = (key: string, label: string, type = "text") => (
    <div className="space-y-1.5">
      <label className="text-[13px] font-bold text-slate-500 uppercase tracking-widest ml-1">{label}</label>
      <input
        type={type}
        value={form[key] ?? ""}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        className="w-full h-12 rounded-xl bg-slate-50 border border-slate-200 px-4 text-sm outline-none focus:ring-2 focus:ring-[#496B92]/10 focus:border-[#496B92]/20 transition-all"
      />
    </div>
  );

  const airportColumns: TableColumn<Airport>[] = [
    { key: "iata_code", header: "IATA", cell: (r) => <span className="font-bold text-[#496B92]">{r.iata_code}</span> },
    { key: "name", header: "AIRPORT NAME", cell: (r) => <span className="font-medium text-slate-900">{r.name}</span> },
    { key: "city", header: "CITY", cell: (r) => <span className="text-slate-600">{r.city}</span> },
    { key: "country", header: "COUNTRY", cell: (r) => <span className="text-slate-600">{r.country}</span> },
    { key: "timezone", header: "TIMEZONE", cell: (r) => <span className="text-slate-500 text-xs">{r.timezone}</span> },
    {
      key: "actions", header: "ACTIONS", cell: (r) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(r)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-100 transition-colors"><Edit2 size={15} /></button>
          <button onClick={() => openDelete(r)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-100 transition-colors"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ];

  const aircraftColumns: TableColumn<Aircraft>[] = [
    { key: "registration", header: "REG. NO.", cell: (r) => <span className="font-bold text-[#496B92]">{r.registration}</span> },
    { key: "model", header: "MODEL", cell: (r) => <span className="font-medium text-slate-900">{r.model}</span> },
    { key: "total_seats", header: "TOTAL SEATS", cell: (r) => <span className="text-slate-600">{r.total_seats}</span> },
    {
      key: "actions", header: "ACTIONS", cell: (r) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(r)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-100 transition-colors"><Edit2 size={15} /></button>
          <button onClick={() => openDelete(r)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-100 transition-colors"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ];

  const seatClassColumns: TableColumn<SeatClass>[] = [
    { key: "id", header: "ID", cell: (r) => <span className="text-slate-400 text-xs">#{r.id}</span> },
    { key: "name", header: "CLASS NAME", cell: (r) => <span className="font-bold text-slate-900">{r.name}</span> },
    {
      key: "actions", header: "ACTIONS", cell: (r) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(r)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-100 transition-colors"><Edit2 size={15} /></button>
          <button onClick={() => openDelete(r)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-100 transition-colors"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ];

  const filteredAirports = useMemo(() =>
    airports.filter((a) =>
      a.iata_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.city.toLowerCase().includes(searchQuery.toLowerCase())
    ), [airports, searchQuery]);

  const filteredAircraft = useMemo(() =>
    aircraft.filter((a) =>
      a.registration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.model.toLowerCase().includes(searchQuery.toLowerCase())
    ), [aircraft, searchQuery]);

  const filteredSeatClasses = useMemo(() =>
    seatClasses.filter((s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    ), [seatClasses, searchQuery]);

  const tabLabel = activeTab === "airports" ? "Airport" : activeTab === "aircraft" ? "Aircraft" : "Seat Class";

  const addFormFields = () => {
    if (activeTab === "airports") return (
      <div className="space-y-4">
        {field("iata_code", "IATA Code *")}
        {field("name", "Airport Name *")}
        <div className="grid grid-cols-2 gap-4">
          {field("city", "City *")}
          {field("country", "Country *")}
        </div>
        {field("timezone", "Timezone *")}
      </div>
    );
    if (activeTab === "aircraft") return (
      <div className="space-y-4">
        {field("registration", "Registration No. *")}
        {field("model", "Model *")}
        {field("total_seats", "Total Seats *", "number")}
      </div>
    );
    return (
      <div className="space-y-4">
        {field("name", "Class Name *")}
      </div>
    );
  };

  const editFormFields = () => {
    if (activeTab === "airports") return (
      <div className="space-y-4">
        {field("name", "Airport Name")}
        <div className="grid grid-cols-2 gap-4">
          {field("city", "City")}
          {field("country", "Country")}
        </div>
        {field("timezone", "Timezone")}
      </div>
    );
    if (activeTab === "aircraft") return (
      <div className="space-y-4">
        {field("registration", "Registration No.")}
        {field("model", "Model")}
        {field("total_seats", "Total Seats", "number")}
      </div>
    );
    return (
      <div className="space-y-4">
        {field("name", "Class Name")}
      </div>
    );
  };

  const tabs: { key: Tab; label: string; icon: typeof MapPin }[] = [
    { key: "airports", label: "Airports", icon: MapPin },
    { key: "aircraft", label: "Aircraft", icon: Plane },
    { key: "seat-classes", label: "Seat Classes", icon: Tag },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Destinations & Fleet</h2>
            <p className="text-sm font-medium text-slate-500">Manage airports, aircraft, and seat classes</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center justify-center gap-2 bg-[#496B92] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#3B5470] transition-all shadow-lg shadow-[#496B92]/20"
          >
            <Plus size={20} />
            Add {tabLabel}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white rounded-xl border border-slate-100 shadow-sm w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSearchQuery(""); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab.key
                  ? "bg-[#496B92] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder={`Search ${tabLabel.toLowerCase()}s...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-xl bg-slate-50 pl-10 pr-4 text-sm outline-none border border-transparent focus:border-[#496B92]/20 focus:bg-white focus:ring-2 focus:ring-[#496B92]/10 transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {activeTab === "airports" && (
            <DataTable
              columns={airportColumns}
              rows={filteredAirports}
              rowKey={(r) => String(r.id)}
              emptyState={
                <div className="py-20 text-center">
                  {isLoading
                    ? <div className="animate-spin size-8 border-4 border-[#496B92] border-t-transparent rounded-full mx-auto" />
                    : <p className="text-slate-500 font-medium">No airports found.</p>}
                </div>
              }
            />
          )}
          {activeTab === "aircraft" && (
            <DataTable
              columns={aircraftColumns}
              rows={filteredAircraft}
              rowKey={(r) => String(r.id)}
              emptyState={
                <div className="py-20 text-center">
                  {isLoading
                    ? <div className="animate-spin size-8 border-4 border-[#496B92] border-t-transparent rounded-full mx-auto" />
                    : <p className="text-slate-500 font-medium">No aircraft found.</p>}
                </div>
              }
            />
          )}
          {activeTab === "seat-classes" && (
            <DataTable
              columns={seatClassColumns}
              rows={filteredSeatClasses}
              rowKey={(r) => String(r.id)}
              emptyState={
                <div className="py-20 text-center">
                  {isLoading
                    ? <div className="animate-spin size-8 border-4 border-[#496B92] border-t-transparent rounded-full mx-auto" />
                    : <p className="text-slate-500 font-medium">No seat classes found.</p>}
                </div>
              }
            />
          )}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-50 bg-slate-50/30">
            <p className="text-sm font-medium text-slate-500">
              {activeTab === "airports" && `${filteredAirports.length} airports`}
              {activeTab === "aircraft" && `${filteredAircraft.length} aircraft`}
              {activeTab === "seat-classes" && `${filteredSeatClasses.length} seat classes`}
            </p>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title={`Add ${tabLabel}`}>
        <div className="py-4 space-y-4">
          {addFormFields()}
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1 rounded-xl h-12" onClick={() => setAddModalOpen(false)} type="button">
              Cancel
            </Button>
            <Button
              className="flex-1 bg-[#496B92] hover:bg-[#3B5470] text-white h-12 rounded-xl font-bold"
              onClick={handleAdd}
              loading={isSubmitting}
            >
              Add {tabLabel}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title={`Edit ${tabLabel}`}>
        <div className="py-4 space-y-4">
          {editFormFields()}
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1 rounded-xl h-12" onClick={() => setEditModalOpen(false)} type="button">
              Cancel
            </Button>
            <Button
              className="flex-1 bg-[#496B92] hover:bg-[#3B5470] text-white h-12 rounded-xl font-bold"
              onClick={handleEdit}
              loading={isSubmitting}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title={`Delete ${tabLabel}`}>
        <div className="py-4 space-y-6">
          <p className="text-sm text-slate-600 font-medium text-center">
            Are you sure you want to delete this {tabLabel.toLowerCase()}? This cannot be undone.
          </p>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1 rounded-xl h-12" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="flex-1 bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 h-12 rounded-xl"
              onClick={handleDelete}
              loading={isSubmitting}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default AdminDestinationsPage;