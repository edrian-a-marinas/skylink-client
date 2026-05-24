type ScreenPlaceholderProps = {
  id: string;
  title: string;
  description?: string;
  scope?: "public" | "user" | "admin";
};

const SCOPE_STYLES: Record<
  NonNullable<ScreenPlaceholderProps["scope"]>,
  string
> = {
  public: "border-sky-200 bg-sky-50 text-sky-700",
  user: "border-emerald-200 bg-emerald-50 text-emerald-700",
  admin: "border-amber-200 bg-amber-50 text-amber-700",
};

const ScreenPlaceholder = ({
  id,
  title,
  description,
  scope = "public",
}: ScreenPlaceholderProps) => {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <div
        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${SCOPE_STYLES[scope]}`}
      >
        {scope} screen
      </div>

      <h1 className="mt-4 text-3xl font-bold text-slate-900">{title}</h1>
      <p className="mt-2 text-sm font-medium text-slate-500">{id}</p>
      <p className="mt-4 max-w-2xl text-slate-600">
        {description ??
          "Screen shell is ready for final UI handoff. Business logic and routing are being implemented first."}
      </p>
    </section>
  );
};

export default ScreenPlaceholder;
