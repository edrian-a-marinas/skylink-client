type ErrorStateProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
};

const ErrorState = ({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorStateProps) => {
  return (
    <section className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-800">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-2 text-sm">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-md border border-rose-300 bg-white px-3 py-1.5 text-sm font-medium text-rose-700 hover:bg-rose-100"
        >
          Retry
        </button>
      ) : null}
    </section>
  );
};

export default ErrorState;
