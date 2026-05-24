import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/utils/cn";
import { CircleUserRound } from "lucide-react";
import logos1 from "@/assets/logos/Logos-1.png";
import { colors, typography } from "@/constants/theme";

const Navbar = () => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();
  const isAdmin = user?.role_id === 1;

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

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
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
          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <Link
                to={ROUTES.LOGIN}
                className={`${colors.action.ghost} ${typography.label.sm.semiBold} rounded-lg px-4 py-2 hover:bg-primary-10 transition-colors whitespace-nowrap w-78px h-37px`}
              >
                Sign In
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
