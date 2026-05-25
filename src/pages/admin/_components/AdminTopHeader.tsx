import { Bell, Menu, Search } from "lucide-react";

type AdminTopHeaderProps = {
  onMenuClick: () => void;
};

const AdminTopHeader = ({ onMenuClick }: AdminTopHeaderProps) => {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex flex-1 items-center gap-4">
        <button
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          onClick={onMenuClick}
        >
          <Menu size={24} />
        </button>

        {/* Search Bar */}
        <div className="relative hidden max-w-md flex-1 md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="h-11 w-full rounded-xl bg-slate-50 pl-10 pr-4 text-sm outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-500/10 border border-transparent focus:border-blue-500/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        {/* Notifications */}
        <button className="relative rounded-full p-2.5 text-slate-500 hover:bg-slate-100 transition-colors">
          <Bell size={22} />
          <span className="absolute right-2 top-2 flex size-2.5 items-center justify-center rounded-full bg-red-500 ring-2 ring-white">
            <span className="sr-only">New notification</span>
          </span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 border-l border-slate-200 pl-5">
          <div className="hidden text-right lg:block">
            <p className="text-sm font-bold text-slate-900 leading-none">Admin User</p>
            <p className="mt-1 text-[11px] text-slate-500 font-medium uppercase tracking-wider">Administrator</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500 text-white font-bold shadow-lg shadow-blue-500/20">
            A
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopHeader;
