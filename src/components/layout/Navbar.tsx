import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/utils/cn";
import { CircleUserRound } from "lucide-react";

const Navbar = () => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();
  const isAdmin = user?.role_id === 1;

  const navLinks = [
    { label: "Search", path: ROUTES.HOME },
    { label: "My Bookings", path: ROUTES.MY_BOOKINGS },
    { label: "Destinations", path: "#" },
    { label: "Manage", path: ROUTES.PNR_STATUS },
    { label: "Offers", path: "#" },
  ];

  const isActive = (path: string) => {
    if (path === ROUTES.HOME) {
      return location.pathname === ROUTES.HOME;
    }
    return location.pathname.startsWith(path) && path !== "#";
  };

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="flex items-center gap-2">
          <span className="text-2xl font-bold text-[#496B92]">SkyLink</span>
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
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side Actions */}
        <div className="flex items-center gap-6">
          <Link to="#" className="text-[16px] font-medium text-slate-700 hover:text-slate-900">
            Support
          </Link>

          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <Link
                to={ROUTES.LOGIN}
                className="flex items-center justify-center"
              >
                <div className="w-10 h-10 rounded-lg bg-[#0D3B3F] flex items-center justify-center text-white overflow-hidden">
                  <CircleUserRound size={24} />
                </div>
              </Link>
            ) : (
              <Link
                to={isAdmin ? ROUTES.ADMIN_DASHBOARD : ROUTES.USER_DASHBOARD}
                className="flex items-center justify-center"
              >
                <div className="w-10 h-10 rounded-lg bg-[#0D3B3F] flex items-center justify-center text-white overflow-hidden">
                  <CircleUserRound size={24} />
                </div>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
