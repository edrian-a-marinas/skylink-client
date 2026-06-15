import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Loader2,
  WifiOff,
  Wifi,
} from "lucide-react";
import { registerAdmin, getUsers } from "@/api/users.api";
import AdminLayout from "../_components/AdminLayout";
import { cn } from "@/utils/cn";

// ─── Tab types ───────────────────────────────────────────────────────────────

type SettingsTab = "general" | "regional" | "booking-rules" | "payment" | "email" | "admin-accounts";

// ─── Zod schemas ─────────────────────────────────────────────────────────────

const generalSchema = z.object({
  airlineName: z.string().trim().min(1, "Airline name is required").max(100, "Max 100 characters"),
  contactEmail: z.string().trim().email("Enter a valid email address"),
  contactPhone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s\-().]{7,20}$/, "Enter a valid phone number"),
});

const regionalSchema = z.object({
  currency: z.string().trim().min(1, "Currency is required"),
  timezone: z.string().trim().min(1, "Timezone is required"),
});

const bookingRulesSchema = z.object({
  cancellationWindow: z
    .string()
    .min(1, "Required")
    .transform((v) => Number(v))
    .pipe(
      z.number().int("Must be a whole number").min(0, "Cannot be negative").max(720, "Max 720 hours"),
    ),
  rescheduleWindow: z
    .string()
    .min(1, "Required")
    .transform((v) => Number(v))
    .pipe(
      z.number().int("Must be a whole number").min(0, "Cannot be negative").max(720, "Max 720 hours"),
    ),
});

const paymentSchema = z.object({
  gateway: z.string().trim().min(1, "Payment gateway is required"),
  apiKey: z
    .string()
    .trim()
    .min(10, "API key must be at least 10 characters")
    .max(200, "Max 200 characters"),
});

const emailSchema = z.object({
  senderName: z.string().trim().min(1, "Sender name is required").max(100, "Max 100 characters"),
  replyTo: z.string().trim().email("Enter a valid reply-to email address"),
});

type GeneralValues = z.infer<typeof generalSchema>;
type RegionalValues = z.infer<typeof regionalSchema>;
type PaymentValues = z.infer<typeof paymentSchema>;
type EmailValues = z.infer<typeof emailSchema>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string | undefined }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-red-500">
      <XCircle size={12} />
      {message}
    </p>
  );
}

function inputCls(hasError: boolean) {
  return cn(
    "w-full rounded-xl border bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition-all",
    "placeholder:text-slate-400 focus:ring-2",
    hasError
      ? "border-red-400 focus:border-red-400 focus:ring-red-100"
      : "border-slate-200 focus:border-[#5E83AE] focus:ring-[#5E83AE]/15",
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
      <h2 className="mb-1 text-lg font-bold text-slate-900">{title}</h2>
      <div className="mb-6 h-px bg-slate-100" />
      {children}
    </div>
  );
}

// ─── Success toast ────────────────────────────────────────────────────────────

function SaveToast({ visible }: { visible: boolean }) {
  return (
    <div
      className={cn(
        "fixed bottom-8 right-8 flex items-center gap-3 rounded-2xl bg-white px-5 py-3.5 shadow-[0_8px_32px_-4px_rgba(0,0,0,0.18)] border border-green-100 transition-all duration-300 z-50",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none",
      )}
    >
      <CheckCircle2 size={18} className="text-green-500 shrink-0" />
      <span className="text-sm font-bold text-slate-800">Settings saved successfully.</span>
    </div>
  );
}

// ─── Action Bar (Discard / Save) ──────────────────────────────────────────────

function ActionBar({
  isDirty,
  isSubmitting,
  onDiscard,
}: {
  isDirty: boolean;
  isSubmitting: boolean;
  onDiscard: () => void;
}) {
  return (
    <div className="fixed bottom-6 right-8 z-40 flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      <button
        type="button"
        id="discardSettingsBtn"
        onClick={onDiscard}
        disabled={isSubmitting}
        className="px-4 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors disabled:opacity-50"
      >
        Discard
      </button>
      <button
        type="submit"
        id="saveSettingsBtn"
        disabled={isSubmitting || !isDirty}
        className={cn(
          "rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-all",
          isDirty && !isSubmitting
            ? "bg-[#5E83AE] hover:bg-[#496B92] shadow-md shadow-[#5E83AE]/20"
            : "bg-[#5E83AE]/40 cursor-not-allowed",
        )}
      >
        {isSubmitting && <Loader2 size={15} className="animate-spin inline mr-1.5" />}
        Save Changes
      </button>
    </div>
  );
}

// ─── General Tab ─────────────────────────────────────────────────────────────

function GeneralTab({ onSave, onDiscard }: { onSave: () => void; onDiscard: () => void }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<GeneralValues>({
    resolver: zodResolver(generalSchema),
    defaultValues: {
      airlineName: "SkyLink Airlines",
      contactEmail: "support@skylink.ph",
      contactPhone: "+63 2 8888 1234",
    },
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoFile = (file: File) => {
    setLogoError(null);
    const allowed = ["image/png", "image/svg+xml"];
    if (!allowed.includes(file.type)) {
      setLogoError("Only PNG or SVG files are allowed.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setLogoError("File must be under 2 MB.");
      return;
    }
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (_data: GeneralValues) => {
    await new Promise((r) => setTimeout(r, 500));
    onSave();
  };

  const handleDiscard = () => {
    reset();
    setLogoFile(null);
    setLogoPreview(null);
    setLogoError(null);
    onDiscard();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <SectionCard title="General Settings">
        <div className="space-y-6">
          {/* Airline Name */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Airline Name
            </label>
            <input
              {...register("airlineName")}
              id="airlineName"
              className={inputCls(!!errors.airlineName)}
              placeholder="SkyLink Airlines"
            />
            <FieldError message={errors.airlineName?.message ?? undefined} />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Logo Upload</label>
            <div
              role="button"
              tabIndex={0}
              className={cn(
                "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-10 cursor-pointer transition-colors",
                isDragging
                  ? "border-[#5E83AE] bg-[#5E83AE]/5"
                  : "border-slate-200 bg-slate-50 hover:border-[#5E83AE] hover:bg-[#5E83AE]/5",
              )}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => { if (e.key === "Enter") fileInputRef.current?.click(); }}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files[0];
                if (file) handleLogoFile(file);
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.svg"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleLogoFile(file);
                }}
              />
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="max-h-20 max-w-xs object-contain"
                />
              ) : (
                <>
                  <p className="text-sm font-semibold text-slate-500">Click to upload or drag &amp; drop</p>
                  <p className="text-xs text-slate-400">PNG, SVG up to 2MB</p>
                </>
              )}
              {logoFile && (
                <p className="mt-2 text-xs text-[#5E83AE] font-semibold">{logoFile.name}</p>
              )}
            </div>
            {logoError && <FieldError message={logoError} />}
          </div>

          {/* Contact Email & Phone */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Contact Email
              </label>
              <input
                {...register("contactEmail")}
                id="contactEmail"
                type="email"
                className={inputCls(!!errors.contactEmail)}
                placeholder="support@skylink.ph"
              />
              <FieldError message={errors.contactEmail?.message ?? undefined} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Contact Phone
              </label>
              <input
                {...register("contactPhone")}
                id="contactPhone"
                type="tel"
                className={inputCls(!!errors.contactPhone)}
                placeholder="+63 2 8888 1234"
              />
              <FieldError message={errors.contactPhone?.message ?? undefined} />
            </div>
          </div>
        </div>
      </SectionCard>

      <ActionBar
        isDirty={isDirty || !!logoFile}
        isSubmitting={isSubmitting}
        onDiscard={handleDiscard}
      />
    </form>
  );
}

// ─── Regional Tab ─────────────────────────────────────────────────────────────

const CURRENCIES = [
  "PHP – Philippine Peso",
  "USD – US Dollar",
  "EUR – Euro",
  "SGD – Singapore Dollar",
  "JPY – Japanese Yen",
  "AUD – Australian Dollar",
];

const TIMEZONES = [
  "Asia/Manila (UTC+8)",
  "UTC",
  "America/New_York (UTC-5)",
  "Europe/London (UTC+0)",
  "Asia/Tokyo (UTC+9)",
  "Australia/Sydney (UTC+10)",
];

function RegionalTab({ onSave, onDiscard }: { onSave: () => void; onDiscard: () => void }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<RegionalValues>({
    resolver: zodResolver(regionalSchema),
    defaultValues: { currency: "", timezone: "" },
  });

  const onSubmit = async (_data: RegionalValues) => {
    await new Promise((r) => setTimeout(r, 500));
    onSave();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <SectionCard title="Regional Settings">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Currency
            </label>
            <select
              {...register("currency")}
              id="currency"
              className={inputCls(!!errors.currency)}
            >
              <option value="">Select currency…</option>
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <FieldError message={errors.currency?.message ?? undefined} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Timezone
            </label>
            <select
              {...register("timezone")}
              id="timezone"
              className={inputCls(!!errors.timezone)}
            >
              <option value="">Select timezone…</option>
              {TIMEZONES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <FieldError message={errors.timezone?.message ?? undefined} />
          </div>
        </div>
      </SectionCard>

      <ActionBar
        isDirty={isDirty}
        isSubmitting={isSubmitting}
        onDiscard={() => { reset(); onDiscard(); }}
      />
    </form>
  );
}

// ─── Booking Rules Tab ────────────────────────────────────────────────────────

function BookingRulesTab({ onSave, onDiscard }: { onSave: () => void; onDiscard: () => void }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<z.input<typeof bookingRulesSchema>, any, z.output<typeof bookingRulesSchema>>({
    resolver: zodResolver(bookingRulesSchema),
    defaultValues: { cancellationWindow: "48", rescheduleWindow: "24" },
  });

  const onSubmit = async (_data: z.output<typeof bookingRulesSchema>) => {
    await new Promise((r) => setTimeout(r, 500));
    onSave();
  };

  // Access errors by string key to bypass strict typing for pipeline schemas
  const cancelErr = (errors as Record<string, { message?: string | undefined }>)["cancellationWindow"]?.message;
  const rescheduleErr = (errors as Record<string, { message?: string | undefined }>)["rescheduleWindow"]?.message;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <SectionCard title="Booking Rules">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Cancellation Window (hours)
            </label>
            <input
              {...register("cancellationWindow")}
              id="cancellationWindow"
              type="number"
              min={0}
              max={720}
              className={inputCls(!!cancelErr)}
              placeholder="48"
            />
            <p className="mt-1.5 text-xs text-slate-400">
              Minimum hours before departure to allow cancellation
            </p>
            <FieldError message={cancelErr} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Reschedule Window (hours)
            </label>
            <input
              {...register("rescheduleWindow")}
              id="rescheduleWindow"
              type="number"
              min={0}
              max={720}
              className={inputCls(!!rescheduleErr)}
              placeholder="24"
            />
            <p className="mt-1.5 text-xs text-slate-400">
              Minimum hours before departure to allow rescheduling
            </p>
            <FieldError message={rescheduleErr} />
          </div>
        </div>
      </SectionCard>

      <ActionBar
        isDirty={isDirty}
        isSubmitting={isSubmitting}
        onDiscard={() => { reset(); onDiscard(); }}
      />
    </form>
  );
}

// ─── Payment Tab ──────────────────────────────────────────────────────────────

type TestStatus = "idle" | "testing" | "success" | "failed";

function PaymentTab({ onSave, onDiscard }: { onSave: () => void; onDiscard: () => void }) {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<PaymentValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { gateway: "", apiKey: "sk_live_xxxxxxxxxxxxxxxxxx" },
  });

  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState<TestStatus>("idle");

  const onSubmit = async (_data: PaymentValues) => {
    await new Promise((r) => setTimeout(r, 500));
    onSave();
  };

  const handleTestConnection = async () => {
    const { apiKey } = getValues();
    if (!apiKey || apiKey.length < 10) {
      setTestStatus("failed");
      setTimeout(() => setTestStatus("idle"), 3000);
      return;
    }
    setTestStatus("testing");
    await new Promise((r) => setTimeout(r, 1800));
    setTestStatus(apiKey.startsWith("sk_") ? "success" : "failed");
    setTimeout(() => setTestStatus("idle"), 3000);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <SectionCard title="Payment Gateway">
        <div className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Payment Gateway
            </label>
            <select
              {...register("gateway")}
              id="paymentGateway"
              className={inputCls(!!errors.gateway)}
            >
              <option value="">Select gateway…</option>
              <option value="stripe">Stripe</option>
              <option value="paypal">PayPal</option>
              <option value="gcash_gateway">GCash Gateway</option>
              <option value="default">Default</option>
            </select>
            <FieldError message={errors.gateway?.message ?? undefined} />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              API Key
            </label>
            <div className="relative">
              <input
                {...register("apiKey")}
                id="apiKey"
                type={showKey ? "text" : "password"}
                className={cn(inputCls(!!errors.apiKey), "pr-11")}
                placeholder="sk_live_xxxxxxxxxxxxxxxxxx"
              />
              <button
                type="button"
                onClick={() => setShowKey((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={showKey ? "Hide API key" : "Show API key"}
              >
                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <FieldError message={errors.apiKey?.message ?? undefined} />
          </div>

          {/* Test Connection Button */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              id="testConnectionBtn"
              onClick={handleTestConnection}
              disabled={testStatus === "testing"}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-bold transition-all",
                testStatus === "success"
                  ? "border-green-300 bg-green-50 text-green-700"
                  : testStatus === "failed"
                    ? "border-red-300 bg-red-50 text-red-600"
                    : "border-slate-200 bg-white text-slate-700 hover:border-[#5E83AE] hover:text-[#5E83AE]",
                "disabled:opacity-60 disabled:cursor-not-allowed",
              )}
            >
              {testStatus === "testing" && <Loader2 size={15} className="animate-spin" />}
              {testStatus === "success" && <Wifi size={15} className="text-green-600" />}
              {testStatus === "failed" && <WifiOff size={15} className="text-red-500" />}
              {testStatus === "idle" && "Test Connection"}
              {testStatus === "testing" && "Testing…"}
              {testStatus === "success" && "Connection successful"}
              {testStatus === "failed" && "Connection failed"}
            </button>
          </div>
        </div>
      </SectionCard>

      <ActionBar
        isDirty={isDirty}
        isSubmitting={isSubmitting}
        onDiscard={() => { reset(); setTestStatus("idle"); onDiscard(); }}
      />
    </form>
  );
}

// ─── Email Tab ────────────────────────────────────────────────────────────────

function EmailTab({ onSave, onDiscard }: { onSave: () => void; onDiscard: () => void }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      senderName: "SkyLink Airlines",
      replyTo: "noreply@skylink.ph",
    },
  });

  const senderName = watch("senderName") || "SkyLink Airlines";

  const onSubmit = async (_data: EmailValues) => {
    await new Promise((r) => setTimeout(r, 500));
    onSave();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <SectionCard title="Email Configuration">
        <div className="space-y-6">
          {/* Sender Name & Reply-To */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Sender Name
              </label>
              <input
                {...register("senderName")}
                id="senderName"
                className={inputCls(!!errors.senderName)}
                placeholder="SkyLink Airlines"
              />
              <FieldError message={errors.senderName?.message ?? undefined} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Reply-To Address
              </label>
              <input
                {...register("replyTo")}
                id="replyTo"
                type="email"
                className={inputCls(!!errors.replyTo)}
                placeholder="noreply@skylink.ph"
              />
              <FieldError message={errors.replyTo?.message ?? undefined} />
            </div>
          </div>

          {/* Template Preview */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Template Preview
            </label>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              {/* Email header */}
              <div className="flex items-center justify-center bg-[#5E83AE] px-6 py-5">
                <span className="text-base font-bold text-white">{senderName}</span>
              </div>
              {/* Email body */}
              <div className="bg-white px-6 py-5">
                <p className="mb-1 text-sm font-semibold text-slate-800">Dear Passenger,</p>
                <p className="text-sm text-slate-500">
                  Your booking has been confirmed. Details are included below…
                </p>
                <button
                  type="button"
                  className="mt-4 rounded-lg bg-[#5E83AE] px-5 py-2 text-sm font-bold text-white hover:bg-[#496B92] transition-colors"
                >
                  View Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      <ActionBar
        isDirty={isDirty}
        isSubmitting={isSubmitting}
        onDiscard={() => { reset(); onDiscard(); }}
      />
    </form>
  );
}

// ─── Sidebar nav item ─────────────────────────────────────────────────────────

function NavItem({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between rounded-xl px-5 py-3.5 text-sm font-semibold transition-colors text-left",
        active
          ? "bg-[#EEF3F8] text-[#5E83AE]"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
      )}
    >
      <span>{label}</span>
      {active ? (
        <ChevronDown size={16} className="text-[#5E83AE]" />
      ) : (
        <ChevronRight size={16} className="text-slate-400" />
      )}
    </button>
  );
}


// ─── Admin Accounts Tab ───────────────────────────────────────────────────────

const adminAccountSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required").max(100),
  last_name: z.string().trim().min(1, "Last name is required").max(100),
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
  phone_number: z
    .string()
    .trim()
    .regex(/^(\+?63|0)9\d{9}$/, "Enter a valid PH phone number")
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
});

type AdminAccountInput = z.input<typeof adminAccountSchema>;
type AdminAccountValues = z.output<typeof adminAccountSchema>;

type AdminUser = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  created_at: string;
};

function AdminAccountsTab() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminAccountInput, any, AdminAccountValues>({
    resolver: zodResolver(adminAccountSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const { data: admins = [], isLoading: loadingAdmins, refetch: refetchAdmins } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const users = await getUsers();
      return users.filter((u: any) => u.role_id === 1) as AdminUser[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const onSubmit = async (data: AdminAccountValues) => {
    setSubmitStatus("idle");
    try {
      const payload: { first_name: string; last_name: string; email: string; password: string; phone_number?: string } = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
      };
      if (data.phone_number) payload.phone_number = data.phone_number;
      await registerAdmin(payload);
      setSubmitStatus("success");
      setSubmitMessage(`Admin account for ${data.email} created successfully.`);
      reset();
      await refetchAdmins();
    } catch (err: any) {
      setSubmitStatus("error");
      setSubmitMessage(
        err?.response?.data?.detail ?? "Failed to create admin account."
      );
    }
    setTimeout(() => setSubmitStatus("idle"), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Create Form */}
      <SectionCard title="Create Admin Account">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  First Name
                </label>
                <input
                  {...register("first_name")}
                  className={inputCls(!!errors.first_name)}
                  placeholder="Juan"
                />
                <FieldError message={errors.first_name?.message} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Last Name
                </label>
                <input
                  {...register("last_name")}
                  className={inputCls(!!errors.last_name)}
                  placeholder="Dela Cruz"
                />
                <FieldError message={errors.last_name?.message} />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                className={inputCls(!!errors.email)}
                placeholder="admin@skylink.ph"
              />
              <FieldError message={errors.email?.message} />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className={cn(inputCls(!!errors.password), "pr-11")}
                  placeholder="Min. 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <FieldError message={errors.password?.message} />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Phone Number <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <input
                {...register("phone_number")}
                type="tel"
                className={inputCls(!!errors.phone_number)}
                placeholder="09XXXXXXXXX"
              />
              <FieldError message={errors.phone_number?.message} />
            </div>

            {/* Status message */}
            {submitStatus !== "idle" && (
              <div
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold",
                  submitStatus === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-600 border border-red-200",
                )}
              >
                {submitStatus === "success" ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <XCircle size={16} />
                )}
                {submitMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-all",
                isSubmitting
                  ? "bg-[#5E83AE]/40 cursor-not-allowed"
                  : "bg-[#5E83AE] hover:bg-[#496B92] shadow-md shadow-[#5E83AE]/20",
              )}
            >
              {isSubmitting && <Loader2 size={15} className="animate-spin" />}
              {isSubmitting ? "Creating..." : "Create Admin Account"}
            </button>
          </div>
        </form>
      </SectionCard>

      {/* Existing Admins */}
      <SectionCard title="Existing Admins">
        {loadingAdmins ? (
          <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
            <Loader2 size={15} className="animate-spin" />
            Loading...
          </div>
        ) : admins.length === 0 ? (
          <p className="text-sm text-slate-400 font-medium">No admin accounts found.</p>
        ) : (
          <div className="space-y-3">
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {admin.first_name} {admin.last_name}
                  </p>
                  <p className="text-xs text-slate-500">{admin.email}</p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider",
                    admin.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-200 text-slate-500",
                  )}
                >
                  {admin.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS: { id: SettingsTab; label: string }[] = [
  { id: "general", label: "General" },
  { id: "regional", label: "Regional" },
  { id: "booking-rules", label: "Booking Rules" },
  { id: "payment", label: "Payment" },
  { id: "email", label: "Email" },
  { id: "admin-accounts", label: "Admin Accounts" },
];

const AdminSettingsPage = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [showToast, setShowToast] = useState(false);

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleDiscard = () => {
    // each form handles its own reset
  };

  const tabProps = { onSave: handleSave, onDiscard: handleDiscard };

  return (
    <AdminLayout>
      <div className="space-y-6 pb-28">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
          <p className="text-sm font-medium text-slate-500">
            Configure your airline system preferences
          </p>
        </div>

        {/* Body: sidebar + content */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Sidebar nav */}
          <nav
            className="w-full shrink-0 rounded-2xl border border-slate-100 bg-white p-2 shadow-sm lg:w-[220px]"
            aria-label="Settings sections"
          >
            <div className="space-y-1">
              {TABS.map((tab) => (
                <NavItem
                  key={tab.id}
                  label={tab.label}
                  active={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                />
              ))}
            </div>
          </nav>

          {/* Tab content */}
          <div className="min-w-0 flex-1">
            {activeTab === "general" && <GeneralTab {...tabProps} />}
            {activeTab === "regional" && <RegionalTab {...tabProps} />}
            {activeTab === "booking-rules" && <BookingRulesTab {...tabProps} />}
            {activeTab === "payment" && <PaymentTab {...tabProps} />}
            {activeTab === "email" && <EmailTab {...tabProps} />}
            {activeTab === "admin-accounts" && <AdminAccountsTab />}
          </div>
        </div>
      </div>

      <SaveToast visible={showToast} />
    </AdminLayout>
  );
};

export default AdminSettingsPage;
