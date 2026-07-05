import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-funky-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-2xl font-bold tracking-tight text-white tracking-tight">FUNKYTZ</p>
          <p className="text-white/50 text-xs font-semibold mt-1 tracking-widest">ADMIN PANEL</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-black/5 p-6 sm:p-8">
          <h1 className="font-display text-lg mb-6">SIGN IN</h1>

          <label className="block text-xs font-bold mb-1.5 text-black/70">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
            className="w-full border border-black/15 rounded-md px-3 py-2.5 mb-4 text-sm outline-none focus:border-funky-orange"
            placeholder="admin"
          />

          <label className="block text-xs font-bold mb-1.5 text-black/70">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-black/15 rounded-md px-3 py-2.5 mb-5 text-sm outline-none focus:border-funky-orange"
            placeholder="••••••••"
          />

          {error && <p className="text-red-600 text-xs font-semibold mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-funky-orange text-white font-bold py-3 rounded-md hover:bg-funky-orange-dark transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
