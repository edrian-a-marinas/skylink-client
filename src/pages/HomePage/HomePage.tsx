import HeroImage from "@/assets/BackgroundImages/homepagePlane.png";
import LondonImg from "@/assets/BackgroundImages/london.png";
import ParisImg from "@/assets/BackgroundImages/paris.png";
import TokyoImg from "@/assets/BackgroundImages/tokyo.png";
import SydneyImg from "@/assets/BackgroundImages/sydney.png";
import FlightSearchForm from "@/pages/_shared/components/flights/FlightSearchForm";
import { ArrowRight, ConciergeBell, Plane, Leaf } from "lucide-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <main className="relative min-h-screen bg-[#FDFBF8]">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[650px] w-full flex flex-col justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={HeroImage}
            alt="SkyLink Hero"
            className="h-full w-full object-cover object-[center_45%] scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 w-full">
          <div className="max-w-3xl space-y-4 md:space-y-6">
            <div className="space-y-0">
              <h1 className="text-[42px] md:text-[64px] lg:text-[84px] font-normal tracking-tight text-[#16202C] leading-[1.1]">
                Your Journey,
              </h1>
              <h1 className="text-[42px] md:text-[64px] lg:text-[84px] font-bold italic tracking-tight text-[#496B92] leading-[1.1] mt-[-5px] md:mt-[-10px]">
                Refined.
              </h1>
            </div>

            <p className="text-[15px] md:text-[18px] lg:text-[21px] text-slate-700 max-w-xl leading-[1.6] font-medium opacity-90">
              Experience flight as it was intended. Seamless transitions,
              curated comfort, and the attentive care of the Digital Concierge.
            </p>

            <div className="pt-4 md:pt-8 w-full">
              <FlightSearchForm />
            </div>
          </div>
        </div>
      </section>

      {/* Seasonal Escapes Section */}
      <section className="py-12 md:py-16 bg-[#FDFBF8]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8 md:mb-10">
            <div>
              <h2 className="text-[30px] md:text-[40px] font-bold text-[#16202C] mb-2 tracking-tight">
                Seasonal Escapes
              </h2>
              <p className="text-[14px] md:text-[16px] text-slate-500 font-medium">
                Hand-picked by our SkyLink Concierge.
              </p>
            </div>
            <Link
              to="#"
              className="flex items-center gap-2 text-[#496B92] font-bold text-[14px] md:text-[15px] hover:underline group"
            >
              View all destinations{" "}
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Strict Bento Grid - London is the height anchor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-6xl">
            {/* Left: London - Large Square spanning 2 row heights */}
            <div className="relative rounded-[16px] md:rounded-[24px] overflow-hidden group cursor-pointer aspect-square">
              <img
                src={LondonImg}
                alt="London"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
              <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 text-white">
                <p className="text-[10px] md:text-[12px] font-bold uppercase tracking-widest opacity-80 mb-1">
                  United Kingdom
                </p>
                <h3 className="text-[24px] md:text-[32px] font-bold">London</h3>
              </div>
            </div>

            {/* Right: Nested Grid for perfect alignment */}
            <div className="grid grid-rows-2 gap-4 md:gap-6">
              {/* Paris - Horizontal Rectangle (Top Half) */}
              <div className="relative rounded-[16px] md:rounded-[24px] overflow-hidden group cursor-pointer h-full">
                <img
                  src={ParisImg}
                  alt="Paris"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-white">
                  <p className="text-[10px] md:text-[12px] font-bold uppercase tracking-widest opacity-80 mb-0.5">
                    France
                  </p>
                  <h3 className="text-[20px] md:text-[28px] font-bold">
                    Paris
                  </h3>
                </div>
              </div>

              {/* Bottom Row: Tokyo & Sydney - Two Squares (Bottom Half) */}
              <div className="grid grid-cols-2 gap-4 md:gap-6 h-full">
                <div className="relative rounded-[16px] md:rounded-[24px] overflow-hidden group cursor-pointer aspect-square md:aspect-auto">
                  <img
                    src={TokyoImg}
                    alt="Tokyo"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 md:bottom-5 md:left-5 text-white">
                    <p className="text-[9px] md:text-[11px] font-bold uppercase tracking-widest opacity-80 mb-0.5">
                      Japan
                    </p>
                    <h3 className="text-[18px] md:text-[22px] font-bold">
                      Tokyo
                    </h3>
                  </div>
                </div>
                <div className="relative rounded-[16px] md:rounded-[24px] overflow-hidden group cursor-pointer aspect-square md:aspect-auto">
                  <img
                    src={SydneyImg}
                    alt="Sydney"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 md:bottom-5 md:left-5 text-white">
                    <p className="text-[9px] md:text-[11px] font-bold uppercase tracking-widest opacity-80 mb-0.5">
                      Australia
                    </p>
                    <h3 className="text-[18px] md:text-[22px] font-bold">
                      Sydney
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Information / Features Section */}
      <section className="py-16 md:py-20 bg-[#FDFBF8]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            <div className="space-y-5">
              <div className="w-12 h-12 bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex items-center justify-center text-[#496B92]">
                <ConciergeBell size={22} className="stroke-[1.5px]" />
              </div>
              <div className="space-y-3">
                <h3 className="text-[18px] md:text-[20px] font-bold text-[#16202C]">
                  Personal Concierge
                </h3>
                <p className="text-[15px] text-slate-500 leading-[1.6]">
                  Dedicated assistance from booking to landing, ensuring every
                  detail is handled with precision.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="w-12 h-12 bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex items-center justify-center text-[#496B92]">
                <Plane size={22} className="stroke-[1.5px]" />
              </div>
              <div className="space-y-3">
                <h3 className="text-[18px] md:text-[20px] font-bold text-[#16202C]">
                  Curated Lounges
                </h3>
                <p className="text-[15px] text-slate-500 leading-[1.6]">
                  Access to our private network of airport retreats designed for
                  tranquility and productivity.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="w-12 h-12 bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex items-center justify-center text-[#496B92]">
                <Leaf size={22} className="stroke-[1.5px]" />
              </div>
              <div className="space-y-3">
                <h3 className="text-[18px] md:text-[20px] font-bold text-[#16202C]">
                  Sustainable Flight
                </h3>
                <p className="text-[15px] text-slate-500 leading-[1.6]">
                  We lead with SAF-powered aircraft and a commitment to
                  zero-emission operational targets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal gap before footer */}
      <div className="h-4 md:h-8"></div>
    </main>
  );
};

export default HomePage;
