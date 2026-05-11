import { typography } from "@/constants/theme";
import { FiBookOpen } from "react-icons/fi";
import BookingCard from "./components/BookingCard";

const ManagePage = () => {
  return (
    <section className="flex min-h-[calc(100vh-160px)] items-center justify-center bg-[var(--color-tertiary-10)] px-6 py-12">
      <div className="flex w-full max-w-md flex-col items-center gap-8">

        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <FiBookOpen size={40} strokeWidth={2} className={`shrink-0 text-primary-60`}/>
          <h2 className={`${typography.heading.h2.bold} md:text-heading-2 text-text-static-dark text-center`}>
            Find Your Booking
          </h2>
          <p className={`${typography.paragraph.md.normal} text-text-secondary text-center`}>
            Enter your PNR to retrieve your booking details.
          </p>
        </div>

        {/* Card */}
        <BookingCard />
      </div>
    </section>
  );
};

export default ManagePage;
