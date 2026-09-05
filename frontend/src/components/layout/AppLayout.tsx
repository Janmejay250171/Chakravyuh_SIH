import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderSearch, ShieldAlert, Share2, Database, Clock, Radio, Cpu, Eye, Terminal, Settings, Search, Shield } from 'lucide-react';
import logoImage from '../../assets/logo.png';

export const AppLayout: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const navItems = [
    { path: '/overview', label: 'Overview', icon: LayoutDashboard },
    { path: '/investigations', label: 'Investigations', icon: FolderSearch },
    { path: '/alerts', label: 'Threat Alerts', icon: ShieldAlert },
    { path: '/graph', label: 'Blockchain Graph', icon: Share2 },
    { path: '/transactions', label: 'Transaction Analysis', icon: Database },
    { path: '/timeline', label: 'Timeline Replay', icon: Clock },
    { path: '/sentinels', label: 'P2P Sentinels', icon: Radio },
    { path: '/ai-intelligence', label: 'AI Intelligence', icon: Cpu },
    { path: '/explainability', label: 'Explainability', icon: Eye },
    { path: '/feedback', label: 'Analyst Feedback', icon: Terminal },
    { path: '/settings', label: 'System Settings', icon: Settings },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate('/transactions');
  };

  return (
    <div className="flex h-screen bg-stone-100 text-stone-900 font-sans antialiased overflow-hidden selection:bg-amber-200 selection:text-stone-900">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-stone-200/80 flex flex-col z-20 shadow-xs">
        <div className="p-6 border-b border-stone-200/80 flex flex-col items-center justify-center bg-stone-50/50 text-center">
          <img src={logoImage} alt="Chakravyuh Logo" className="w-32 h-32 object-contain rounded-2xl shadow-sm mb-2" />
          <span className="text-xs font-bold text-stone-900 tracking-tight font-sans">FORENSIC INTELLIGENCE PLATFORM</span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3.5 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
                    isActive 
                      ? 'bg-amber-50 border border-amber-300/80 text-amber-900 shadow-2xs font-bold' 
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-amber-700' : 'text-stone-400'}`} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-stone-200 bg-stone-50/80 text-[10px] font-mono text-stone-500 flex items-center justify-between">
          <span className="flex items-center"><Shield className="w-3 h-3 mr-1 text-stone-400"/> ENCLAVE: SECURE</span>
          <span className="text-emerald-700 font-bold flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1"></span>ONLINE</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gradient-to-br from-stone-50 via-amber-50/20 to-stone-100">
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-stone-200/80 flex items-center justify-between px-6 z-10 shadow-2xs">
          <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2 flex-1 max-w-xl relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search TXID, Wallet, or IP (Press Enter)..." 
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2 text-xs text-stone-900 placeholder-stone-400 font-mono focus:outline-none focus:border-amber-600 focus:bg-white shadow-2xs transition-all"
            />
          </form>
          <div className="flex items-center space-x-4 font-mono text-xs">
            <span className="px-3.5 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-700 shadow-2xs">
              ACTIVE CASE: <strong className="text-amber-800">CHK-2026-041</strong>
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};