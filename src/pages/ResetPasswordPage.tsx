import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROUTES } from "@/constants/routes";
import { resetPassword } from "@/api/auth.api";
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/validation/auth.schemas";
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle2 } from "lucide-react";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Email and Token (OTP) are passed from VerifyOtpPage
  const email = location.state?.email || "";
  const token = location.state?.token || "";

  useEffect(() => {
    if (!email || !token) {
      navigate(ROUTES.FORGOT_PASSWORD);
    }
  }, [email, token, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      token: token, // Set the OTP token automatically
      new_password: "",
      confirmPassword: "",
    }
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setServerError(null);
    try {
      await resetPassword({
        token: data.token,
        new_password: data.new_password,
      });
      setIsSuccess(true);
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 3000);
    } catch (err: unknown) {
      const apiErr = err as { details?: { detail?: unknown }; message?: string };
      const detail = apiErr?.details?.detail;
      setServerError(
        typeof detail === "string" ? detail : (apiErr?.message ?? "Failed to reset password. Please try again."),
      );
    }
  };

  if (isSuccess) {
    return (
      <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden px-4 py-12 md:px-6 bg-[#FDFBF8]">
        <div className="absolute inset-0 z-0 bg-[#5E83AE]">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white/10 blur-[80px]" />
          <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] rounded-full bg-white/10 blur-[60px]" />
        </div>
        <div className="relative z-10 w-full max-w-[500px]">
          <div className="bg-white rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100 p-8 md:p-10 text-center space-y-6">
            <div className="w-20 h-20 bg-success-50/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={40} className="text-success-60" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Password Reset Successful</h2>
            <p className="text-slate-500">
              Your password has been reset successfully. You will be redirected to the login page in a few seconds...
            </p>
            <Link
              to={ROUTES.LOGIN}
              className="block w-full h-14 rounded-2xl bg-primary-60 hover:bg-primary-70 text-white font-bold transition-all flex items-center justify-center"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden px-4 py-12 md:px-6 bg-[#FDFBF8]">
      <div className="absolute inset-0 z-0 bg-[#5E83AE]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white/10 blur-[80px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] rounded-full bg-white/10 blur-[60px]" />
      </div>

      <div className="relative z-10 w-full max-w-[500px]">
        <div className="bg-white rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100 p-8 md:p-10">
          <div className="mb-8">
            <Link
              to={ROUTES.VERIFY_OTP}
              state={{ email }}
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-primary-60 transition-colors mb-6"
            >
              <ArrowLeft size={16} />
              Back to Verification
            </Link>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">New Password</h1>
            <p className="text-slate-500 font-medium">
              Create a strong new password for your account.
            </p>
          </div>

          {serverError && (
            <div className="mb-6 rounded-2xl border border-danger-20 bg-danger-5 px-4 py-3 text-sm text-danger-60 font-medium flex gap-3 items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-danger-60 shrink-0" />
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                New Password
              </label>
              <div
                className={`flex items-center gap-3 rounded-2xl border bg-slate-50 px-4 h-14 transition-all focus-within:bg-white focus-within:ring-4 focus-within:ring-primary-60/5 ${errors.new_password ? "border-danger-40" : "border-slate-200 focus-within:border-primary-60"}`}
              >
                <Lock size={18} className="text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("new_password")}
                  className="w-full bg-transparent text-[15px] outline-none font-medium text-slate-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-300 hover:text-slate-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.new_password && (
                <p className="text-xs text-danger-60 font-bold ml-1">
                  {errors.new_password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                Confirm Password
              </label>
              <div
                className={`flex items-center gap-3 rounded-2xl border bg-slate-50 px-4 h-14 transition-all focus-within:bg-white focus-within:ring-4 focus-within:ring-primary-60/5 ${errors.confirmPassword ? "border-danger-40" : "border-slate-200 focus-within:border-primary-60"}`}
              >
                <Lock size={18} className="text-slate-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className="w-full bg-transparent text-[15px] outline-none font-medium text-slate-700"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-slate-300 hover:text-slate-500"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-danger-60 font-bold ml-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 rounded-2xl bg-primary-60 hover:bg-primary-70 active:scale-[0.98] text-white font-bold shadow-xl shadow-primary-60/20 transition-all disabled:opacity-50 disabled:active:scale-100"
            >
              {isSubmitting ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ResetPasswordPage;
