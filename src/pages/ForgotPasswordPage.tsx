import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROUTES } from "@/constants/routes";
import { forgotPassword } from "@/api/auth.api";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/validation/auth.schemas";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setServerError(null);
    try {
      await forgotPassword(data);
      setIsSuccess(true);
      // Redirect to Verify OTP page
      setTimeout(() => {
        navigate(ROUTES.VERIFY_OTP, { state: { email: data.email } });
      }, 2000);
    } catch (err: unknown) {
      const apiErr = err as { details?: { detail?: unknown }; message?: string };
      const detail = apiErr?.details?.detail;
      setServerError(
        typeof detail === "string" ? detail : (apiErr?.message ?? "Failed to send reset email. Please try again."),
      );
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden px-4 py-12 md:px-6 bg-[#FDFBF8]">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 bg-[#5E83AE]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white/10 blur-[80px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] rounded-full bg-white/10 blur-[60px]" />
      </div>

      <div className="relative z-10 w-full max-w-[500px]">
        <div className="bg-white rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100 p-8 md:p-10">
          <div className="mb-8">
            <Link
              to={ROUTES.LOGIN}
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-primary-60 transition-colors mb-6"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Forgot Password?</h1>
            <p className="text-slate-500 font-medium">
              Enter your email address and we'll send you an OTP to reset your password.
            </p>
          </div>

          {serverError && (
            <div className="mb-6 rounded-2xl border border-danger-20 bg-danger-5 px-4 py-3 text-sm text-danger-60 font-medium flex gap-3 items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-danger-60 shrink-0" />
              {serverError}
            </div>
          )}

          {isSuccess ? (
            <div className="space-y-6 text-center py-4">
              <div className="w-20 h-20 bg-success-50/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={40} className="text-success-60" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Check your email</h2>
              <p className="text-slate-500">
                We've sent a 6-digit OTP to your email address. You will be redirected to the verification page...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <div
                  className={`flex items-center gap-3 rounded-2xl border bg-slate-50 px-4 h-14 transition-all focus-within:bg-white focus-within:ring-4 focus-within:ring-primary-60/5 ${errors.email ? "border-danger-40" : "border-slate-200 focus-within:border-primary-60"}`}
                >
                  <Mail size={18} className="text-slate-400" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    {...register("email")}
                    className="w-full bg-transparent text-[15px] outline-none font-medium text-slate-700"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-danger-60 font-bold ml-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 rounded-2xl bg-primary-60 hover:bg-primary-70 active:scale-[0.98] text-white font-bold shadow-xl shadow-primary-60/20 transition-all disabled:opacity-50 disabled:active:scale-100"
              >
                {isSubmitting ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
