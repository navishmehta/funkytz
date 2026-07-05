import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutGrid, Shirt, Tags, Star, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/products', label: 'Products', icon: Shirt },
  { to: '/categories', label: 'Categories', icon: Tags },
  { to: '/reviews', label: 'Reviews', icon: Star },
];

export default function Layout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <>
      <div className="px-6 py-6 border-b border-white/10">
        <p className="text-2xl font-bold text-white tracking-tighter">FUNKYTZ</p>
        <p className="text-white/50 text-xs font-semibold mt-0.5 tracking-widest uppercase">Admin Panel</p>
      </div>
      <nav className="flex-1 px-3 py-5 space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold transition-all ${
                isActive ? 'bg-white/10 text-white font-bold relative after:absolute after:left-0 after:top-2 after:bottom-2 after:w-1 after:bg-funky-orange after:rounded-r-md' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-white/10">
        <div className="px-3 py-2 mb-2">
          <p className="text-white/40 text-[11px] uppercase tracking-wide">Signed in as</p>
          <p className="text-white text-sm font-semibold">{admin?.username}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-semibold text-white/60 hover:bg-white/5 hover:text-white transition-colors"
        >
          <LogOut size={16} /> Log out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-funky-cream flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-funky-black shrink-0 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-funky-black flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-funky-black text-white sticky top-0 z-30 shadow-md">
          <p className="text-lg font-bold tracking-tight">FUNKYTZ ADMIN</p>
          <button onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>
        </header>
        <main className="p-4 sm:p-8 max-w-6xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
