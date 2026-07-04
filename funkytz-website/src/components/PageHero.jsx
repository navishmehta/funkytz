export default function PageHero({ title, subtitle }) {
  return (
    <div className="bg-funky-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
        <h1 className="comic-text-sm text-3xl sm:text-4xl inline-block bg-funky-orange px-2 rounded-sm">
          {title}
        </h1>
        {subtitle && <p className="text-white/60 mt-3 max-w-xl text-sm sm:text-base">{subtitle}</p>}
      </div>
    </div>
  );
}
