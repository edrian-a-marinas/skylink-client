import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { verifyOtp, forgotPassword } from "@/api/auth.api";
import { Mail, ArrowLeft, CheckCircle2, RefreshCw } from "lucide-react";

const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const email = location.state?.email || "";

  useEffect(() => {
    if (!email) {
      navigate(ROUTES.FORGOT_PASSWORD);
    }
  }, [email, navigate]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, canResend]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || !email) return;
    setServerError(null);
    setSuccessMsg(null);
    try {
      await forgotPassword({ email });
      setSuccessMsg("A new OTP has been sent to your email.");
      setTimer(60);
      setCanResend(false);
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setServerError(apiErr?.message ?? "Failed to resend OTP.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      setServerError("Please enter all 6 digits.");
      return;
    }

    setServerError(null);
    setIsVerifying(true);
    try {
      await verifyOtp({ email, otp: otpCode });
      // Verification successful, move to reset password page
      // Pass the OTP token so ResetPasswordPage can use it
      navigate(ROUTES.RESET_PASSWORD, { state: { email, token: otpCode } });
    } catch (err: unknown) {
      const apiErr = err as { details?: { detail?: unknown }; message?: string };
      const detail = apiErr?.details?.detail;
      setServerError(
        typeof detail === "string" ? detail : (apiErr?.message ?? "Verification failed. Invalid OTP.")
      );
    } finally {
      setIsVerifying(false);
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
              to={ROUTES.FORGOT_PASSWORD}
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-primary-60 transition-colors mb-6"
            >
              <ArrowLeft size={16} />
              Back
            </Link>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Verify OTP</h1>
            <p className="text-slate-500 font-medium">
              We've sent a 6-digit code to <span className="text-slate-800 font-bold">{email}</span>. Please enter it below.
            </p>
          </div>

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

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-between gap-2">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  ref={(el) => (inputRefs.current[index] = el)}
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-primary-60 focus:bg-white focus:ring-4 focus:ring-primary-60/5 outline-none transition-all"
                />
              ))}
            </div>

            <div className="flex flex-col items-center gap-6">
              <button
                type="submit"
                disabled={isVerifying || otp.join("").length < 6}
                className="w-full h-14 rounded-2xl bg-primary-60 hover:bg-primary-70 active:scale-[0.98] text-white font-bold shadow-xl shadow-primary-60/20 transition-all disabled:opacity-50 disabled:active:scale-100"
              >
                {isVerifying ? "Verifying..." : "Verify Code"}
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend}
                className={`flex items-center gap-2 text-sm font-bold transition-all ${
                  canResend 
                    ? "text-primary-60 hover:text-primary-80" 
                    : "text-slate-300 cursor-not-allowed"
                }`}
              >
                <RefreshCw size={16} className={!canResend ? "" : "animate-spin-hover"} />
                {canResend ? "Resend OTP Code" : `Resend in ${timer}s`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default VerifyOtpPage;
