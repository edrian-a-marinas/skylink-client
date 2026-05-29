import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils/cn";
import {
  LayoutDashboard,
  Plane,
  Users,
  BookOpen,
  BarChart3,
  ScrollText,
  Settings,
  LogOut,
  X,
  Tag,
} from "lucide-react";
import logos1 from "@/assets/logos/Logos-1.png";
import { useState } from "react";
import Toast from "@/pages/_shared/components/ui/Toast";
import { MapPin } from "lucide-react";


type AdminSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [showLogoutToast, setShowLogoutToast] = useState(false);

  const handleLogout = () => {
    signOut();
    setShowLogoutToast(true);
    setTimeout(() => {
      navigate(ROUTES.HOME);
    }, 1500);
  };

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: ROUTES.ADMIN_DASHBOARD },
    { label: "Flights", icon: Plane, path: ROUTES.ADMIN_FLIGHTS },
    { label: "Destinations", icon: MapPin, path: ROUTES.ADMIN_DESTINATIONS },
    { label: "Promotions", icon: Tag, path: ROUTES.ADMIN_PROMOTIONS },
    { label: "Users", icon: Users, path: ROUTES.ADMIN_USERS },
    { label: "Bookings", icon: BookOpen, path: ROUTES.ADMIN_BOOKINGS },
    {
      label: "Reports",
      icon: BarChart3,
      path: ROUTES.ADMIN_REPORTS,
      subItems: [
        { label: "Activity Log", icon: ScrollText, path: "/admin/activity-log" },
      ],
    },
    { label: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <Toast 
        message="Logout Successful" 
        isOpen={showLogoutToast} 
        onClose={() => setShowLogoutToast(false)} 
      />
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[260px] bg-[#3B5470] text-slate-100 transition-transform duration-300 transform lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-6 lg:py-8">
            <Link to={ROUTES.ADMIN_DASHBOARD} className="flex items-center gap-3">
              <img src={logos1} alt="SkyLink" className="size-10 brightness-0 invert" />
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white">SkyLink</h1>
                <p className="text-[10px] uppercase tracking-widest text-slate-300 font-bold opacity-70">Admin Portal</p>
              </div>
            </Link>
            <button className="lg:hidden" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3">
            {menuItems.map((item) => (
              <div key={item.label}>
                <Link
                  to={item.path}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    isActive(item.path)
                      ? "bg-[#496B92] text-white"
                      : "text-slate-300 hover:bg-[#496B92]/50 hover:text-white",
                  )}
                >
                  <item.icon size={20} className={cn(isActive(item.path) ? "text-white" : "text-slate-400 group-hover:text-white")} />
                  {item.label}
                </Link>
                {item.subItems && (
                  <div className="mt-1 ml-6 space-y-1">
                    {item.subItems.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.path}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-4 py-2 text-[13px] font-medium transition-colors",
                          isActive(sub.path)
                            ? "text-white"
                            : "text-slate-400 hover:text-white",
                        )}
                      >
                        <sub.icon size={16} />
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Bottom section */}
          <div className="border-t border-[#496B92] p-4">
            <div className="flex items-center gap-3 rounded-xl bg-[#496B92]/30 p-3 mb-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500 text-white font-bold">A</div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white">Admin User</p>
                <p className="truncate text-xs text-slate-400">My Profile</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-colors"
            >
              <LogOut size={20} />
              Log Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
