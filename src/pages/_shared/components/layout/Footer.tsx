
import Global from "@/assets/logos/Vector.png";

export default function Footer() {
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
          <div className="flex flex-wrap gap-12">
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-semibold uppercase">Company</h4>
              <a className="text-sm text-[#75808A]">About Us</a>
              <a className="text-sm text-[#75808A]">Careers</a>
              <a className="text-sm text-[#75808A]">Press</a>
              <a className="text-sm text-[#75808A]">Investor Relations</a>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-semibold uppercase">Fly</h4>
              <a className="text-sm text-[#75808A]">Book a Flight</a>
              <a className="text-sm text-[#75808A]">Flight Status</a>
              <a className="text-sm text-[#75808A]">Check-In Online</a>
              <a className="text-sm text-[#75808A]">Baggage Info</a>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-semibold uppercase">Support</h4>
              <a className="text-sm text-[#75808A]">Help Center</a>
              <a className="text-sm text-[#75808A]">Contact Us</a>
              <a className="text-sm text-[#75808A]">Feedback</a>
              <a className="text-sm text-[#75808A]">Accessibility</a>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-semibold uppercase">Legal</h4>
              <a className="text-sm text-[#75808A]">Terms</a>
              <a className="text-sm text-[#75808A]">Privacy</a>
              <a className="text-sm text-[#75808A]">Cookies</a>
              <a className="text-sm text-[#75808A]">Refund Policy</a>
            </div>
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
