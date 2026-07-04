import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-28 text-center">
      <h1 className="comic-text text-6xl mb-4">404</h1>
      <p className="font-display text-xl mb-3">PAGE NOT FOUND</p>
      <p className="text-black/60 mb-7 text-sm">
        Looks like this drop doesn't exist (yet). Let's get you back on track.
      </p>
      <Link
        to="/"
        className="bg-funky-orange text-white font-bold px-6 py-3 rounded-md inline-block hover:bg-funky-orange-dark transition-colors focus-ring"
      >
        Back to Home
      </Link>
    </div>
  );
}
