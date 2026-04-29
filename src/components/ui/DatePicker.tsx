import { useRef } from "react";
import { CiCalendar } from "react-icons/ci";
import { colors, typography } from "@/constants/theme";

type DatePickerProps = {
  value?: string;
  min?: string;
  max?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
};

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  min,
  max,
  placeholder = "Select date",
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <label
      className={`flex items-center gap-2 ${colors.surface.input} border border-tertiary-30 rounded-[10px] px-4 h-14 cursor-pointer`}
      onClick={() => inputRef.current?.showPicker?.()}
    >
      <CiCalendar size={16} strokeWidth={1} className="shrink-0 text-primary-60" />
      <input
        ref={inputRef}
        type="date"
        value={value}
        min={min}
        max={max}
        placeholder={placeholder}
        onChange={e => onChange?.(e.target.value)}
        className={`bg-transparent flex-1 ${typography.paragraph.md.normal} ${colors.text.primary} outline-none cursor-pointer`}
      />
    </label>
  );
};

export default DatePicker;