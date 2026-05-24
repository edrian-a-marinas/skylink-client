type Step = {
  id: string;
  label: string;
};

type StepperProps = {
  steps: Step[];
  activeStepId: string;
};

const Stepper = ({ steps, activeStepId }: StepperProps) => {
  const activeIndex = steps.findIndex((step) => step.id === activeStepId);

  return (
    <ol className="grid gap-3 md:grid-cols-4">
      {steps.map((step, index) => {
        const isComplete = activeIndex > index;
        const isActive = activeIndex === index;

        return (
          <li
            key={step.id}
            className={`rounded-xl border px-4 py-3 text-sm ${
              isActive
                ? "border-sky-300 bg-sky-50 text-sky-800"
                : isComplete
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                  : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide">
              Step {index + 1}
            </p>
            <p className="mt-1 font-medium">{step.label}</p>
          </li>
        );
      })}
    </ol>
  );
};

export default Stepper;
