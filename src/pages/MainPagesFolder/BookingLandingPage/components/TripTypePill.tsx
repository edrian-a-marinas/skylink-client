import { colors, typography } from "@/constants/theme";

export type TripType = "one-way" | "round-trip";

interface TripTypePillsProps {
  tripType: TripType;
  setTripType: (type: TripType) => void;
}

const TripTypePills = ({ tripType, setTripType }: TripTypePillsProps) => {
  return (
    <div className="flex gap-2">
      {(["one-way", "round-trip"] as const).map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => setTripType(type)}
          // Note: Assumes `typography` and `colors` are imported at the top of the file
          className={`px-4 py-[6px] rounded-full ${typography.label.sm.semiBold} transition-colors ${
            tripType === type
              ? `${colors.action.primary}`
              : "bg-tertiary-10 text-tertiary-80"
          }`}
        >
          {type === "one-way" ? "One Way" : "Round Trip"}
        </button>
      ))}
    </div>
  );
};

export default TripTypePills;