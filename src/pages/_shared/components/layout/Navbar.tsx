import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/useAuthStore";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils/cn";
import {
  LogOut,
  Settings,
  BookOpen,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";
import logos1 from "@/assets/logos/Logos-1.png";
import { colors, typography } from "@/constants/theme";
import { useState, useRef, useEffect } from "react";
import Toast from "@/pages/_shared/components/ui/Toast";

const Navbar = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = user?.role_id === 1;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutToast, setShowLogoutToast] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { label: "Book", path: ROUTES.BOOK },
    { label: "Explore", path: ROUTES.EXPLORE },
    { label: "Flight Status", path: ROUTES.PNR_STATUS },
    { label: "Manage", path: ROUTES.MANAGE },
  ];

  const isActive = (path: string) => {
    if (path === ROUTES.HOME) {
      return location.pathname === ROUTES.HOME;
    }
    return location.pathname.startsWith(path) && path !== "#";
  };

  const handleLogout = () => {
    signOut();
    setIsMenuOpen(false);
    setShowLogoutToast(true);
    setTimeout(() => {
      navigate(ROUTES.HOME);
    }, 1000);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userInitial = user?.first_name?.[0] || user?.email?.[0] || "U";

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <Toast
        message="Logout Successful"
        isOpen={showLogoutToast}
        onClose={() => setShowLogoutToast(false)}
      />
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="flex items-center gap-0">
          <img src={logos1} alt="SkyLink logo" className="size-16" />
          <span
            className="text-[24px] font-normal text-[#496B92] tracking-[0.01em]"
            style={{ fontFamily: "'Russo One', sans-serif" }}
          >
            SkyLink
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={cn(
                "text-[16px] font-medium transition-colors relative pb-1",
                isActive(link.path)
                  ? "text-[#496B92] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-[#496B92]"
                  : "text-slate-500 hover:text-slate-800",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side Actions */}
        <div className="flex items-center gap-6">
          {!isAuthenticated ? (
            <Link
              to={ROUTES.LOGIN}
              className={`${colors.action.ghost} ${typography.label.sm.semiBold} rounded-lg px-6 py-2.5 hover:bg-primary-10 transition-colors whitespace-nowrap border border-slate-100`}
            >
              Sign In
            </Link>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-3 rounded-xl p-1.5 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
              >
                <div className="flex size-9 items-center justify-center rounded-full bg-[#5E83AE] text-white font-bold text-sm shadow-sm">
                  {userInitial.toUpperCase()}
                </div>
                <div className="hidden md:flex items-center gap-1">
                  <span className="text-sm font-bold text-slate-700">
                    {user?.first_name || "Account"}
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-4 text-slate-400 transition-transform",
                      isMenuOpen && "rotate-180",
                    )}
                  />
                </div>
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] py-2 z-50 overflow-hidden transform origin-top-right transition-all animate-in fade-in zoom-in duration-200">
                  <div className="px-4 py-3 border-b border-slate-50 mb-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Signed in as
                    </p>
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {user?.email}
                    </p>
                  </div>

                  {isAdmin && (
                    <Link
                      to={ROUTES.ADMIN_DASHBOARD}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-primary-60 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LayoutDashboard size={18} />
                      Admin Portal
                    </Link>
                  )}

                  <Link
                    to={ROUTES.PROFILE_SETTINGS}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-primary-60 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings size={18} />
                    Account Settings
                  </Link>

                  <Link
                    to={ROUTES.MANAGE}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-primary-60 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <BookOpen size={18} />
                    My Bookings
                  </Link>

                  <div className="h-px bg-slate-50 my-1" />

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut size={18} />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
