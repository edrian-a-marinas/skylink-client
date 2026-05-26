import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { getUsers, toggleUserStatus, type UserListItem } from "@/api/users.api";
import AdminLayout from "./_components/AdminLayout";
import DataTable, { type TableColumn } from "@/pages/_shared/components/ui/DataTable";
import StatusBadge from "@/pages/_shared/components/ui/StatusBadge";
import { Search, Eye, Ban, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

const AdminUsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user: UserListItem) => {
    try {
      await toggleUserStatus(user.id, !user.is_active);
      fetchUsers();
    } catch (err) {
      console.error("Failed to toggle status", err);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Exclude administrators (role_id: 1) from the management list
      if (user.role_id === 1) return false;

      const full_name = `${user.first_name} ${user.last_name}`.toLowerCase();
      const query = searchQuery.toLowerCase();
      return (
        full_name.includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query)
      );
    });
  }, [users, searchQuery]);

  const columns: TableColumn<UserListItem>[] = [
    {
      key: "id",
      header: "ID",
      cell: (row) => <span className="text-slate-400 font-medium text-xs uppercase">U{row.id.slice(0, 4)}</span>,
    },
    {
      key: "name",
      header: "FULL NAME",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#496B92]/10 text-[#496B92] font-bold text-xs">
            {row.first_name[0]}{row.last_name[0]}
          </div>
          <span className="font-bold text-slate-900">{row.first_name} {row.last_name}</span>
        </div>
      ),
    },
    {
      key: "email",
      header: "EMAIL",
      cell: (row) => <span className="text-slate-600 font-medium">{row.email}</span>,
    },
    {
      key: "registered",
      header: "REGISTERED",
      cell: (row) => <span className="text-slate-500">{new Date(row.created_at).toISOString().split('T')[0]}</span>,
    },
    {
      key: "bookings",
      header: "BOOKINGS",
      cell: (row) => <span className="text-slate-700 font-bold ml-4">{row.bookings_count || 0}</span>,
    },
    {
      key: "status",
      header: "STATUS",
      cell: (row) => (
        <StatusBadge 
          label={row.is_active ? "Active" : "Suspended"} 
          tone={row.is_active ? "success" : "danger"}
        />
      ),
    },
    {
      key: "actions",
      header: "ACTIONS",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(ROUTES.ADMIN_USER_PROFILE.replace(":id", row.id))}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100"
            title="View Detail"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleToggleStatus(row)}
            className={cn(
              "p-2 rounded-lg transition-colors border",
              row.is_active 
                ? "text-rose-600 hover:bg-rose-50 border-rose-100" 
                : "text-emerald-600 hover:bg-emerald-50 border-emerald-100"
            )}
            title={row.is_active ? "Suspend User" : "Activate User"}
          >
            {row.is_active ? <Ban size={16} /> : <CheckCircle size={16} />}
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Users</h2>
          <p className="text-sm font-medium text-slate-500">{filteredUsers.length} users found</p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 w-full rounded-xl bg-white border border-slate-100 pl-10 pr-4 text-sm outline-none focus:border-[#496B92]/20 focus:ring-2 focus:ring-[#496B92]/10 transition-all shadow-sm"
          />
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <DataTable
            columns={columns}
            rows={filteredUsers}
            rowKey={(row) => row.id}
            emptyState={
              <div className="py-20 text-center">
                {isLoading ? (
                  <div className="animate-spin size-8 border-4 border-[#496B92] border-t-transparent rounded-full mx-auto" />
                ) : (
                  <p className="text-slate-500 font-medium">No users found.</p>
                )}
              </div>
            }
          />

          {/* Pagination Placeholder */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-50 bg-slate-50/30">
            <p className="text-sm font-medium text-slate-500">Showing 1-{filteredUsers.length} of {filteredUsers.length}</p>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-white transition-colors" disabled>
                <ChevronLeft size={18} />
              </button>
              <button className="size-9 rounded-lg bg-[#496B92] text-white font-bold text-sm">1</button>
              <button className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-white transition-colors" disabled>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsersPage;
