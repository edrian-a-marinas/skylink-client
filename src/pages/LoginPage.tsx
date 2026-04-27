import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema } from "@/validation/auth.schemas";
import type { LoginFormValues } from "@/validation/auth.schemas";

type AuthTab = "login" | "register";

const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [activeTab, setActiveTab] = useState<AuthTab>("login");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const handleTabChange = (tab: AuthTab) => {
    setActiveTab(tab);
    setServerError(null);
    setSuccessMsg(null);
  };

  const onLoginSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    try {
      await signIn({ email: data.email, password: data.password });
      navigate(ROUTES.HOME);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: unknown } } };
      const detail = axiosErr?.response?.data?.detail;
      if (typeof detail === "string") {
        setServerError(detail);
      } else {
        setServerError("Login failed. Please try again.");
      }
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-160px)] items-center justify-center bg-[var(--sky-muted)] px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-[0_24px_50px_rgba(15,23,42,0.08)]">

        {/* Tabs */}
        <div className="flex items-center text-sm font-semibold text-slate-500">
          <button
            type="button"
            onClick={() => handleTabChange("login")}
            className={`flex-1 border-b-2 px-6 py-4 ${
              activeTab === "login"
                ? "border-[var(--sky-primary)] text-[var(--sky-primary)]"
                : "border-transparent hover:text-slate-700"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("register")}
            className={`flex-1 border-b-2 px-6 py-4 ${
              activeTab === "register"
                ? "border-[var(--sky-primary)] text-[var(--sky-primary)]"
                : "border-transparent hover:text-slate-700"
            }`}
          >
            Register
          </button>
        </div>

        <div className="px-8 pb-8 pt-6">

          {/* Feedback banners */}
          {serverError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {serverError}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {successMsg}
            </div>
          )}

          {/* ── LOGIN ── */}
          {activeTab === "login" ? (
            <form className="space-y-5" onSubmit={handleSubmit(onLoginSubmit)} noValidate>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Email Address
                </label>
                <div className={`mt-2 flex items-center gap-3 rounded-lg border bg-slate-50 px-3 py-2 ${errors.email ? "border-red-400" : "border-slate-200"}`}>
                  <MailIcon />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    autoComplete="email"
                    {...register("email")}
                    className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Password
                </label>
                <div className={`mt-2 flex items-center gap-3 rounded-lg border bg-slate-50 px-3 py-2 ${errors.password ? "border-red-400" : "border-slate-200"}`}>
                  <LockIcon />
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="Your password"
                    autoComplete="current-password"
                    {...register("password")}
                    className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword((p) => !p)}
                    className="text-slate-400 hover:text-slate-600"
                    aria-label={showLoginPassword ? "Hide password" : "Show password"}
                  >
                    <EyeIcon />
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div className="text-right">
                <Link
                  to={ROUTES.FORGOT_PASSWORD}
                  className="text-xs font-semibold text-[var(--sky-primary)] hover:text-[var(--sky-primary-dark)]"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-[var(--sky-primary)] py-3 text-sm font-semibold text-white shadow-sm hover:bg-[var(--sky-primary-dark)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Signing in…" : "Log In"}
              </button>
            </form>

          ) : (
            /* ── REGISTER (UI only — not wired yet) ── */
            <form className="space-y-5">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Full Name
                </label>
                <div className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <UserIcon />
                  <input
                    type="text"
                    placeholder="Juan Dela Cruz"
                    className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Email Address
                </label>
                <div className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <MailIcon />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Phone Number
                </label>
                <div className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <PhoneIcon />
                  <input
                    type="tel"
                    placeholder="+63 9XX XXX XXXX"
                    className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Password
                </label>
                <div className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <LockIcon />
                  <input
                    type={showRegisterPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword((p) => !p)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <EyeIcon />
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-[var(--sky-primary)] py-3 text-sm font-semibold text-white shadow-sm hover:bg-[var(--sky-primary-dark)]"
              >
                Create Account
              </button>
              <p className="text-center text-[11px] text-slate-400">
                By registering, you agree to our Terms & Privacy Policy.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400">
    <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
    <path d="m22 8-10 6L2 8" />
  </svg>
);
const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400">
    <rect x="4" y="10" width="16" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 1 1 8 0v3" />
  </svg>
);
const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400">
    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400">
    <circle cx="12" cy="8" r="3" />
    <path d="M5 20a7 7 0 0 1 14 0" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400">
    <path d="M22 16.5v3a2 2 0 0 1-2.2 2 19 19 0 0 1-8.3-2.9 18.6 18.6 0 0 1-5.7-5.7A19 19 0 0 1 2.5 4.2 2 2 0 0 1 4.5 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.5 9.5a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z" />
  </svg>
);

export default LoginPage;