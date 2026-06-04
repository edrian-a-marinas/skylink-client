import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, registerSchema } from "@/validation/auth.schemas";
import type {
  LoginFormValues,
  RegisterFormValues,
} from "@/validation/auth.schemas";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  CheckCircle2,
} from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";

type AuthTab = "login" | "register";

interface LoginPageProps {
  defaultTab?: AuthTab;
}

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

const GoogleDivider = () => (
  <div className="relative flex items-center gap-3 my-2">
    <div className="flex-1 h-px bg-slate-200" />
    <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">or</span>
    <div className="flex-1 h-px bg-slate-200" />
  </div>
);

const LoginPage = ({ defaultTab = "login" }: LoginPageProps) => {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState<AuthTab>(defaultTab);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  // Login Form
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoggingIn },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  // Register Form
  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors, isSubmitting: isRegistering },
    reset: resetRegisterForm,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const handleTabChange = (tab: AuthTab) => {
    setActiveTab(tab);
    setServerError(null);
    setSuccessMsg(null);
  };

  const activeTabRef = useRef<AuthTab>(activeTab);
  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  const onLoginSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    try {
      await signIn({ email: data.email, password: data.password });
      navigate(ROUTES.HOME);
    } catch (err: unknown) {
      const apiErr = err as { details?: { detail?: unknown }; message?: string };
      const detail = apiErr?.details?.detail;
      setServerError(
        typeof detail === "string" ? detail : (apiErr?.message ?? "Login failed. Please try again."),
      );
    }
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    setServerError(null);
    try {
      await signUp({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone_number: data.phone_number,
        password: data.password,
      });
      setSuccessMsg(
        "Registration successful! Please check your email to verify your account.",
      );
      setActiveTab("login");
      resetRegisterForm();
    } catch (err: unknown) {
      const apiErr = err as { details?: { detail?: unknown }; message?: string };
      const detail = apiErr?.details?.detail;
      setServerError(
        typeof detail === "string"
          ? detail
          : (apiErr?.message ?? "Registration failed. Please try again."),
      );
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setServerError(null);
      const mode = activeTabRef.current;
      try {
        await signInWithGoogle(tokenResponse.access_token, mode);
        navigate(ROUTES.HOME);
      } catch (err: unknown) {
        const apiErr = err as { details?: { detail?: unknown }; message?: string };
        const detail = apiErr?.details?.detail;
        if (detail === "no_account") {
          handleTabChange("register");
          setSuccessMsg("No account found. Please register first.");
        } else {
          setServerError(
            typeof detail === "string" ? detail : (apiErr?.message ?? "Google sign-in failed. Please try again.")
          );
        }
      }
    },
    onError: () => {
      setServerError("Google sign-in was cancelled or failed.");
    },
  });
  
  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden px-4 py-12 md:px-6 bg-[#FDFBF8]">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 bg-[#5E83AE]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white/10 blur-[80px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] rounded-full bg-white/10 blur-[60px]" />
      </div>
      <div className="relative z-10 w-full max-w-[500px]">
        <div className="bg-white rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100">
          {/* Tab Switcher */}
          <div className="flex border-b border-slate-100 bg-slate-50/50">
            <button
              type="button"
              onClick={() => handleTabChange("login")}
              className={`flex-1 py-6 text-[15px] font-bold transition-all relative ${
                activeTab === "login"
                  ? "text-primary-60 bg-white"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Sign In
              {activeTab === "login" && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary-60" />
              )}
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("register")}
              className={`flex-1 py-6 text-[15px] font-bold transition-all relative ${
                activeTab === "register"
                  ? "text-primary-60 bg-white"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Register
              {activeTab === "register" && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary-60" />
              )}
            </button>
          </div>
          <div className="p-8 md:p-10">
            {/* Feedback banners */}
            {serverError && (
              <div className="mb-6 rounded-2xl border border-danger-20 bg-danger-5 px-4 py-3 text-sm text-danger-60 font-medium flex gap-3 items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-danger-60 shrink-0" />
                {serverError}
              </div>
            )}
            {successMsg && (
              <div className="mb-6 rounded-2xl border border-success-20 bg-success-5 px-4 py-3 text-sm text-success-60 font-medium flex gap-3 items-center">
                <CheckCircle2 size={18} className="shrink-0" />
                {successMsg}
              </div>
            )}
            {activeTab === "login" ? (
              <form
                className="space-y-6"
                onSubmit={handleLoginSubmit(onLoginSubmit)}
                noValidate
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                      Email
                    </label>
                    <div
                      className={`flex items-center gap-3 rounded-2xl border bg-slate-50 px-4 h-14 transition-all focus-within:bg-white focus-within:ring-4 focus-within:ring-primary-60/5 ${loginErrors.email ? "border-danger-40" : "border-slate-200 focus-within:border-primary-60"}`}
                    >
                      <Mail size={18} className="text-slate-400" />
                      <input
                        type="email"
                        placeholder="your@email.com"
                        {...loginRegister("email")}
                        className="w-full bg-transparent text-[15px] outline-none font-medium text-slate-700"
                      />
                    </div>
                    {loginErrors.email && (
                      <p className="text-xs text-danger-60 font-bold ml-1">
                        {loginErrors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                      Password
                    </label>
                    <div
                      className={`flex items-center gap-3 rounded-2xl border bg-slate-50 px-4 h-14 transition-all focus-within:bg-white focus-within:ring-4 focus-within:ring-primary-60/5 ${loginErrors.password ? "border-danger-40" : "border-slate-200 focus-within:border-primary-60"}`}
                    >
                      <Lock size={18} className="text-slate-400" />
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...loginRegister("password")}
                        className="w-full bg-transparent text-[15px] outline-none font-medium text-slate-700"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="text-slate-300 hover:text-slate-500"
                      >
                        {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {loginErrors.password && (
                      <p className="text-xs text-danger-60 font-bold ml-1">
                        {loginErrors.password.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between px-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="w-5 h-5 border-2 border-slate-200 rounded-md transition-all peer-checked:bg-primary-60 peer-checked:border-primary-60 group-hover:border-primary-60/50" />
                      <CheckCircle2
                        size={12}
                        className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                      />
                    </div>
                    <span className="text-[13px] font-bold text-slate-500 group-hover:text-slate-700">
                      Remember me
                    </span>
                  </label>
                  <Link
                    to={ROUTES.FORGOT_PASSWORD}
                    className="text-[13px] font-bold text-primary-60 hover:text-primary-80"
                  >
                    Forgot password?
                  </Link>
                </div>
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full h-14 rounded-2xl bg-primary-60 hover:bg-primary-70 active:scale-[0.98] text-white font-bold shadow-xl shadow-primary-60/20 transition-all disabled:opacity-50 disabled:active:scale-100"
                >
                  {isLoggingIn ? "Signing in..." : "Sign In"}
                </button>
                <GoogleDivider />
                <button
                  type="button"
                  onClick={() => handleGoogleLogin()}
                  className="w-full h-14 rounded-2xl border-2 border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all flex items-center justify-center gap-3 font-bold text-slate-700 text-[15px] shadow-sm"
                >
                  <GoogleIcon />
                  Continue with Google
                </button>
              </form>
            ) : (
              <form
                className="space-y-5"
                onSubmit={handleRegisterSubmit(onRegisterSubmit)}
                noValidate
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                      First Name
                    </label>
                    <div
                      className={`flex items-center gap-3 rounded-xl border bg-slate-50 px-4 h-12 transition-all focus-within:bg-white ${registerErrors.first_name ? "border-danger-40" : "border-slate-200 focus-within:border-primary-60"}`}
                    >
                      <User size={16} className="text-slate-400" />
                      <input
                        type="text"
                        placeholder="John"
                        {...registerRegister("first_name")}
                        className="w-full bg-transparent text-[14px] outline-none font-medium"
                      />
                    </div>
                    {registerErrors.first_name && (
                      <p className="text-[10px] text-danger-60 font-bold">
                        {registerErrors.first_name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                      Last Name
                    </label>
                    <div
                      className={`flex items-center gap-3 rounded-xl border bg-slate-50 px-4 h-12 transition-all focus-within:bg-white ${registerErrors.last_name ? "border-danger-40" : "border-slate-200 focus-within:border-primary-60"}`}
                    >
                      <input
                        type="text"
                        placeholder="Doe"
                        {...registerRegister("last_name")}
                        className="w-full bg-transparent text-[14px] outline-none font-medium ml-2"
                      />
                    </div>
                    {registerErrors.last_name && (
                      <p className="text-[10px] text-danger-60 font-bold">
                        {registerErrors.last_name.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Email Address
                  </label>
                  <div
                    className={`flex items-center gap-3 rounded-xl border bg-slate-50 px-4 h-12 transition-all focus-within:bg-white ${registerErrors.email ? "border-danger-40" : "border-slate-200 focus-within:border-primary-60"}`}
                  >
                    <Mail size={16} className="text-slate-400" />
                    <input
                      type="email"
                      placeholder="john@example.com"
                      {...registerRegister("email")}
                      className="w-full bg-transparent text-[14px] outline-none font-medium"
                    />
                  </div>
                  {registerErrors.email && (
                    <p className="text-[10px] text-danger-60 font-bold">
                      {registerErrors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Phone Number (Optional)
                  </label>
                  <div
                    className={`flex items-center gap-3 rounded-xl border bg-slate-50 px-4 h-12 transition-all focus-within:bg-white ${registerErrors.phone_number ? "border-danger-40" : "border-slate-200 focus-within:border-primary-60"}`}
                  >
                    <Phone size={16} className="text-slate-400" />
                    <input
                      type="tel"
                      placeholder="+1234567890"
                      {...registerRegister("phone_number")}
                      className="w-full bg-transparent text-[14px] outline-none font-medium"
                    />
                  </div>
                  {registerErrors.phone_number && (
                    <p className="text-[10px] text-danger-60 font-bold">
                      {registerErrors.phone_number.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Password
                  </label>
                  <div
                    className={`flex items-center gap-3 rounded-xl border bg-slate-50 px-4 h-12 transition-all focus-within:bg-white ${registerErrors.password ? "border-danger-40" : "border-slate-200 focus-within:border-primary-60"}`}
                  >
                    <Lock size={16} className="text-slate-400" />
                    <input
                      type={showRegisterPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...registerRegister("password")}
                      className="w-full bg-transparent text-[14px] outline-none font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      className="text-slate-300 hover:text-slate-500"
                    >
                      {showRegisterPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {registerErrors.password && (
                    <p className="text-[10px] text-danger-60 font-bold leading-tight">
                      {registerErrors.password.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Confirm Password
                  </label>
                  <div
                    className={`flex items-center gap-3 rounded-xl border bg-slate-50 px-4 h-12 transition-all focus-within:bg-white ${registerErrors.confirmPassword ? "border-danger-40" : "border-slate-200 focus-within:border-primary-60"}`}
                  >
                    <Lock size={16} className="text-slate-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...registerRegister("confirmPassword")}
                      className="w-full bg-transparent text-[14px] outline-none font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-slate-300 hover:text-slate-500"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {registerErrors.confirmPassword && (
                    <p className="text-[10px] text-danger-60 font-bold">
                      {registerErrors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isRegistering}
                  className="w-full h-14 rounded-2xl bg-primary-60 hover:bg-primary-70 active:scale-[0.98] text-white font-bold shadow-xl shadow-primary-60/20 transition-all mt-2 disabled:opacity-50"
                >
                  {isRegistering ? "Creating account..." : "Create Account"}
                </button>
                <GoogleDivider />
                <button
                  type="button"
                  onClick={() => handleGoogleLogin()}
                  className="w-full h-14 rounded-2xl border-2 border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all flex items-center justify-center gap-3 font-bold text-slate-700 text-[15px] shadow-sm"
                >
                  <GoogleIcon />
                  Continue with Google
                </button>
                <p className="text-center text-[12px] text-slate-400 font-medium">
                  By registering, you agree to our{" "}
                  <span className="text-primary-60 hover:underline cursor-pointer">
                    Terms & Privacy Policy
                  </span>
                  .
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;