const announcements = [
  'Free Shipping on Orders Above ₹1999',
  'Order Instantly on WhatsApp & Pay via UPI',
  'New Drops Every Friday — Stay Funky',
];

export default function TopBar() {
  const content = (
    <>
      <span className="whitespace-nowrap">{announcements[0]}</span>
      <span className="whitespace-nowrap">{announcements[1]}</span>
      <span className="whitespace-nowrap">{announcements[2]}</span>
    </>
  );

  return (
    <>
      <style>{`
        @keyframes custom-marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-custom-marquee {
          animation: custom-marquee 25s linear infinite;
        }
      `}</style>
      <div className="bg-funky-black text-white text-[11px] sm:text-xs">
        <div className="h-9 overflow-hidden flex items-center">
          <div className="flex w-max animate-custom-marquee hover:[animation-play-state:paused] cursor-default">
            {/* First Half */}
            <div className="flex shrink-0 gap-40 sm:gap-64 pr-40 sm:pr-64 items-center">
              {content}
              {content}
              {content}
            </div>
            {/* Second Half (duplicate for seamless loop) */}
            <div className="flex shrink-0 gap-40 sm:gap-64 pr-40 sm:pr-64 items-center" aria-hidden="true">
              {content}
              {content}
              {content}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
