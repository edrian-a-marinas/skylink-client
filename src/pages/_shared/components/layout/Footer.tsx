
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Global from "@/assets/logos/Vector.png";

const footerSections = [
  {
    title: "Company",
    links: ["About Us", "Careers", "Press", "Investor Relations"],
  },
  {
    title: "Fly",
    links: ["Book a Flight", "Flight Status", "Check-In Online", "Baggage Info"],
  },
  {
    title: "Support",
    links: ["Help Center", "Contact Us", "Feedback", "Accessibility"],
  },
  {
    title: "Legal",
    links: ["Terms", "Privacy", "Cookies", "Refund Policy"],
  },
];

export default function Footer() {
  const [clickedOpen, setClickedOpen] = useState<Record<string, boolean>>({});
  const [hovered, setHovered] = useState<string | null>(null);

  const toggle = (title: string) => {
    setClickedOpen((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <footer className="bg-[#171A1C] py-12 text-white">
      <div className="mx-auto max-w-[1131px] px-6">
        {/* TOP FOOTER */}
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          {/* LEFT */}
          <div className="flex max-w-sm flex-col gap-4">
            <div className="flex items-center gap-2">
              <img src={Global} className="h-9 w-auto" />
              <span className="text-2xl font-bold">SkyLink</span>
            </div>

            <p className="text-sm text-[#75808A]">
              Connecting the Philippines and the world. Fly smarter, fly
              SkyLink.
            </p>

            {/* Social icons */}
            <div className="flex gap-3">
              {[
                "/SocialMediaIcons/Icon.png",
                "/SocialMediaIcons/Icon-1.png",
                "/SocialMediaIcons/Icon-2.png",
                "/SocialMediaIcons/Icon-3.png",
              ].map((iconSrc) => (
                <div
                  key={iconSrc}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10"
                >
                  <img src={iconSrc} alt="" className="h-4 w-4" />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT LINKS */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-6 md:grid-cols-4 items-start">
            {footerSections.map(({ title, links }) => {
              const isActive = !!clickedOpen[title] || hovered === title;
              return (
                <div
                  key={title}
                  className="relative w-28 self-start"
                  onMouseEnter={() => setHovered(title)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <button
                    onClick={() => toggle(title)}
                    className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide cursor-pointer select-none hover:text-white/80 transition-colors duration-150"
                  >
                    {title}
                    {isActive ? (
                      <ChevronUp size={13} />
                    ) : (
                      <ChevronDown size={13} />
                    )}
                  </button>

                  {isActive && (
                    <div className="absolute top-full left-0 z-10 pt-3 pb-1 flex flex-col gap-3 bg-[#171A1C]">
                      {links.map((link) => (
                        <a
                          key={link}
                          className="text-sm text-[#75808A] cursor-pointer hover:text-white transition-colors duration-150 whitespace-nowrap"
                        >
                          {link}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-8 h-px w-full bg-white/10" />

        {/* BOTTOM COPYRIGHT */}
        <div className="flex flex-col items-center justify-between gap-3 text-xs text-[#75808A] md:flex-row">
          <span>© 2026 SkyLink Airlines, Inc. All rights reserved.</span>
          <span>Philippines (PHP ₱)</span>
        </div>
      </div>
    </footer>
  );
}