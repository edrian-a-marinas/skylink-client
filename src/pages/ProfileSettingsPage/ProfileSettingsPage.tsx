import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Phone,
  Mail,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// ─── Schemas ─────────────────────────────────────────────────────────────────

const profileSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required"),
  last_name: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Enter a valid email address"),
  phone_number: z.string().trim().optional(),
});

const securitySchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type SecurityFormValues = z.infer<typeof securitySchema>;
type SettingsTab = "profile" | "security";

// ─── Shared field wrapper ─────────────────────────────────────────────────────

const FieldWrapper = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
      {label}
    </label>
    {children}
    {error && <p className="text-xs text-danger-60 font-bold ml-1">{error}</p>}
  </div>
);

const inputRow =
  "flex items-center gap-3 rounded-2xl border bg-slate-50 px-4 h-12 transition-all focus-within:bg-white focus-within:ring-4 focus-within:ring-primary-60/5";
const inputBase =
  "w-full bg-transparent text-[14px] outline-none font-medium text-slate-700";
const borderNormal = "border-slate-200 focus-within:border-primary-60";
const borderError = "border-danger-40";

// ─── Page ─────────────────────────────────────────────────────────────────────

const ProfileSettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  // Profile form
  const [profileSuccess, setProfileSuccess] = useState(false);
  const {
    register: profileReg,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isSavingProfile },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
      email: user?.email ?? "",
      phone_number: user?.phone_number ?? "",
    },
  });

  // Security form
  const [securitySuccess, setSecuritySuccess] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const {
    register: securityReg,
    handleSubmit: handleSecuritySubmit,
    reset: resetSecurity,
    formState: { errors: securityErrors, isSubmitting: isSavingSecurity },
  } = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema),
  });

  // Danger zone
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

  const onProfileSave = async (_data: ProfileFormValues) => {
    // TODO: wire to API
    await new Promise((r) => setTimeout(r, 600));
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const onSecuritySave = async (_data: SecurityFormValues) => {
    // TODO: wire to API
    await new Promise((r) => setTimeout(r, 600));
    setSecuritySuccess(true);
    resetSecurity();
    setTimeout(() => setSecuritySuccess(false), 3000);
  };

  const onDeleteAccount = () => {
    // TODO: wire to API
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="mx-auto max-w-5xl space-y-8">

        {/* Page header */}
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100 text-primary-60">
            <User size={22} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
        </div>

        {/* Unified card */}
        <div className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">
          <div className="flex flex-col lg:flex-row">

            {/* Sidebar */}
            <nav className="flex flex-row lg:flex-col gap-1 p-3 lg:w-52 lg:border-r border-b lg:border-b-0 border-slate-100 shrink-0">
              {(["profile", "security"] as SettingsTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2.5 w-full px-4 py-2.5 rounded-xl text-sm font-bold transition-all text-left capitalize ${
                    activeTab === tab
                      ? "bg-primary-60/10 text-primary-60"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                  }`}
                >
                  {tab === "profile" ? <User size={16} /> : <Lock size={16} />}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>

            {/* Content */}
            <div className="flex-1 p-8">

              {/* ── Profile ── */}
              {activeTab === "profile" && (
                <div>
                  <form onSubmit={handleProfileSubmit(onProfileSave)} noValidate>
                    <h2 className="text-base font-bold text-slate-800 mb-6">Profile Information</h2>

                    {profileSuccess && (
                      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-success-20 bg-success-5 px-4 py-3 text-sm font-medium text-success-60">
                        <CheckCircle2 size={16} className="shrink-0" />
                        Profile updated successfully.
                      </div>
                    )}

                    <div className="space-y-5">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <FieldWrapper label="First Name" error={profileErrors.first_name?.message}>
                          <div className={`${inputRow} ${profileErrors.first_name ? borderError : borderNormal}`}>
                            <User size={16} className="text-slate-400 shrink-0" />
                            <input type="text" placeholder="John" {...profileReg("first_name")} className={inputBase} />
                          </div>
                        </FieldWrapper>

                        <FieldWrapper label="Last Name" error={profileErrors.last_name?.message}>
                          <div className={`${inputRow} ${profileErrors.last_name ? borderError : borderNormal}`}>
                            <User size={16} className="text-slate-400 shrink-0" />
                            <input type="text" placeholder="Doe" {...profileReg("last_name")} className={inputBase} />
                          </div>
                        </FieldWrapper>
                      </div>

                      <FieldWrapper label="Email Address" error={profileErrors.email?.message}>
                        <div className={`${inputRow} ${profileErrors.email ? borderError : borderNormal}`}>
                          <Mail size={16} className="text-slate-400 shrink-0" />
                          <input type="email" placeholder="john@example.com" {...profileReg("email")} className={inputBase} />
                        </div>
                      </FieldWrapper>

                      <FieldWrapper label="Phone Number (Optional)" error={profileErrors.phone_number?.message}>
                        <div className={`${inputRow} ${profileErrors.phone_number ? borderError : borderNormal}`}>
                          <Phone size={16} className="text-slate-400 shrink-0" />
                          <input type="tel" placeholder="+63 900 000 0000" {...profileReg("phone_number")} className={inputBase} />
                        </div>
                      </FieldWrapper>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <button
                        type="submit"
                        disabled={isSavingProfile}
                        className="h-11 px-6 rounded-2xl bg-primary-60 hover:bg-primary-70 active:scale-[0.98] text-white text-sm font-bold shadow-lg shadow-primary-60/20 transition-all disabled:opacity-50"
                      >
                        {isSavingProfile ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>

                  {/* Delete account — inline at bottom of profile */}
                  <div className="mt-10 pt-8 border-t border-slate-100">
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={18} className="text-danger-60 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-700">Delete Account</p>
                        <p className="text-sm text-slate-400 mt-0.5 mb-4">
                          Permanently delete your account and all associated data. This cannot be undone.
                        </p>

                        {!deleteConfirm ? (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirm(true)}
                            className="h-9 px-4 rounded-xl border-2 border-danger-40 text-danger-60 text-sm font-bold hover:bg-danger-60 hover:text-white hover:border-danger-60 transition-all"
                          >
                            Delete My Account
                          </button>
                        ) : (
                          <div className="space-y-3">
                            <p className="text-sm font-bold text-slate-600">
                              Type <span className="text-danger-60 font-mono">DELETE</span> to confirm.
                            </p>
                            <input
                              type="text"
                              value={deleteInput}
                              onChange={(e) => setDeleteInput(e.target.value)}
                              placeholder="DELETE"
                              className="w-full max-w-xs rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-mono text-slate-700 focus:border-danger-40 focus:outline-none focus:ring-2 focus:ring-danger-60/10"
                            />
                            <div className="flex gap-3">
                              <button
                                type="button"
                                onClick={onDeleteAccount}
                                disabled={deleteInput !== "DELETE"}
                                className="h-9 px-4 rounded-xl bg-danger-60 text-white text-sm font-bold transition-all hover:bg-danger-70 disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                Confirm Delete
                              </button>
                              <button
                                type="button"
                                onClick={() => { setDeleteConfirm(false); setDeleteInput(""); }}
                                className="h-9 px-4 rounded-xl border border-slate-200 text-slate-500 text-sm font-bold hover:bg-slate-50 transition-all"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Security ── */}
              {activeTab === "security" && (
                <form onSubmit={handleSecuritySubmit(onSecuritySave)} noValidate>
                  <h2 className="text-base font-bold text-slate-800 mb-6">Change Password</h2>

                  {securitySuccess && (
                    <div className="mb-6 flex items-center gap-3 rounded-2xl border border-success-20 bg-success-5 px-4 py-3 text-sm font-medium text-success-60">
                      <CheckCircle2 size={16} className="shrink-0" />
                      Password updated successfully.
                    </div>
                  )}

                  <div className="space-y-5">
                    <FieldWrapper label="Current Password" error={securityErrors.current_password?.message}>
                      <div className={`${inputRow} ${securityErrors.current_password ? borderError : borderNormal}`}>
                        <Lock size={16} className="text-slate-400 shrink-0" />
                        <input type={showCurrentPw ? "text" : "password"} placeholder="••••••••" {...securityReg("current_password")} className={inputBase} />
                        <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="text-slate-300 hover:text-slate-500 shrink-0">
                          {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </FieldWrapper>

                    <FieldWrapper label="New Password" error={securityErrors.new_password?.message}>
                      <div className={`${inputRow} ${securityErrors.new_password ? borderError : borderNormal}`}>
                        <Lock size={16} className="text-slate-400 shrink-0" />
                        <input type={showNewPw ? "text" : "password"} placeholder="••••••••" {...securityReg("new_password")} className={inputBase} />
                        <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="text-slate-300 hover:text-slate-500 shrink-0">
                          {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </FieldWrapper>

                    <FieldWrapper label="Confirm New Password" error={securityErrors.confirm_password?.message}>
                      <div className={`${inputRow} ${securityErrors.confirm_password ? borderError : borderNormal}`}>
                        <Lock size={16} className="text-slate-400 shrink-0" />
                        <input type={showConfirmPw ? "text" : "password"} placeholder="••••••••" {...securityReg("confirm_password")} className={inputBase} />
                        <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="text-slate-300 hover:text-slate-500 shrink-0">
                          {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </FieldWrapper>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSavingSecurity}
                      className="h-11 px-6 rounded-2xl bg-primary-60 hover:bg-primary-70 active:scale-[0.98] text-white text-sm font-bold shadow-lg shadow-primary-60/20 transition-all disabled:opacity-50"
                    >
                      {isSavingSecurity ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
