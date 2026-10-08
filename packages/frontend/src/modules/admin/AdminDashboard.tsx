import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, MapPin, Palette, Activity, ShieldAlert, ArrowLeft } from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalDestinations: number;
  totalThemes: number;
}

export const AdminDashboard: React.FC = () => {
  const { user, token, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    } else if (user && user.role !== 'ADMIN') {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (token && user?.role === 'ADMIN') {
      const fetchStats = async () => {
        try {
          const res = await fetch('/api/admin/stats', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!res.ok) throw new Error('Failed to fetch admin stats');
          const data = await res.json();
          setStats(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchStats();
    }
  }, [user, token]);

  if (authLoading || !user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-white/20">
      
      {/* Background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -right-[10%] w-[70%] h-[70%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div>
            <button 
              onClick={() => navigate('/')}
              className="group flex items-center text-sm font-medium text-white/50 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Diary
            </button>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight flex items-center gap-4">
              Overview <span className="px-3 py-1 text-xs font-semibold uppercase tracking-widest bg-white/10 text-white/90 rounded-full border border-white/10 backdrop-blur-md relative top-1">Admin</span>
            </h1>
            <p className="mt-3 text-lg text-white/50 font-light">Real-time platform statistics and telemetry.</p>
          </div>
          
          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-medium text-white/70">System Online</span>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          </div>
        ) : error ? (
          <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-400">
            <ShieldAlert className="w-6 h-6 shrink-0" />
            <p>{error}</p>
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Stat Card 1 */}
            <div className="group relative p-8 bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden hover:bg-white/[0.04] transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[50px] -mr-16 -mt-16 group-hover:bg-indigo-500/30 transition-colors" />
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-300 mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-5xl font-light tracking-tight mb-2">{stats.totalUsers.toLocaleString()}</h3>
                <p className="text-white/40 font-medium">Total Registered Users</p>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="group relative p-8 bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden hover:bg-white/[0.04] transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[50px] -mr-16 -mt-16 group-hover:bg-blue-500/30 transition-colors" />
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-blue-500/20 text-blue-300 mb-6 group-hover:scale-110 transition-transform duration-500">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-5xl font-light tracking-tight mb-2">{stats.totalDestinations.toLocaleString()}</h3>
                <p className="text-white/40 font-medium">Total Destinations Pinned</p>
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="group relative p-8 bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden hover:bg-white/[0.04] transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-[50px] -mr-16 -mt-16 group-hover:bg-emerald-500/30 transition-colors" />
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300 mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Palette className="w-6 h-6" />
                </div>
                <h3 className="text-5xl font-light tracking-tight mb-2">{stats.totalThemes.toLocaleString()}</h3>
                <p className="text-white/40 font-medium">Themes Available</p>
              </div>
            </div>

            {/* Activity Chart Placeholder */}
            <div className="md:col-span-3 mt-6 p-8 bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden relative group">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-medium mb-1">Platform Activity</h3>
                  <p className="text-sm text-white/40">Engagement and creation metrics</p>
                </div>
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/50">
                  <Activity className="w-5 h-5" />
                </div>
              </div>
              <div className="h-64 w-full border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-white/30 relative overflow-hidden bg-white/[0.01]">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <Activity className="w-8 h-8 mb-3 opacity-50" />
                <p className="text-sm font-medium uppercase tracking-widest">More Analytics Coming Soon</p>
              </div>
            </div>

          </div>
        ) : null}
      </div>
    </div>
  );
};
