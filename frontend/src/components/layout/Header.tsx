import React from 'react';
import { Search, Bell, Shield, Terminal } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="h-16 bg-workspace-surface border-b border-workspace-border px-8 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slateText-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search TXID, Wallet, or IP..."
            className="w-96 pl-9 pr-4 py-1.5 bg-workspace-secondary border border-workspace-border rounded text-xs text-slateText-primary placeholder-slateText-muted focus:outline-none font-mono"
            readOnly
          />
        </div>
        <div className="flex items-center space-x-2 px-3 py-1 bg-workspace-secondary border border-workspace-border rounded text-xs font-mono text-slateText-secondary">
          <span className="text-slateText-muted">ACTIVE CASE:</span>
          <span className="text-slateText-primary font-semibold">CHK-2026-041</span>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 text-xs font-mono text-slateText-secondary">
          <Terminal className="w-4 h-4 text-intel-primary" />
          <span>Memgraph: <strong className="text-intel-success">ONLINE</strong></span>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono text-slateText-secondary">
          <Shield className="w-4 h-4 text-intel-primary" />
          <span>Sentinels: <strong className="text-slateText-primary">12/12</strong></span>
        </div>
        <button className="relative p-2 text-slateText-secondary hover:text-slateText-primary transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-intel-critical"></span>
        </button>
      </div>
    </header>
  );
};