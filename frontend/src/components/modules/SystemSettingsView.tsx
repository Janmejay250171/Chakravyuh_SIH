import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Lock,
  Database,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Server,
  Clock,
} from 'lucide-react';

type IsolationLevel =
  | 'RESTRICTED / NTRO-SECURE'
  | 'CLASSIFIED'
  | 'TOP SECRET';

export const SystemSettingsView: React.FC = () => {
  const [firewallActive, setFirewallActive] = useState(true);

  const [isolationLevel, setIsolationLevel] =
    useState<IsolationLevel>('RESTRICTED / NTRO-SECURE');

  const [isSyncing, setIsSyncing] = useState(false);

  const [syncStep, setSyncStep] =
    useState('');

  const [lastSync, setLastSync] =
    useState('System synchronization pending');

  const [syncStatus, setSyncStatus] =
    useState<'idle' | 'success'>('idle');

  const [showIsolationOptions, setShowIsolationOptions] =
    useState(false);

  const formatTime = () => {
    return new Date().toLocaleString([], {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleSync = () => {
    if (isSyncing) return;

    setIsSyncing(true);
    setSyncStatus('idle');

    setSyncStep(
      'Validating encrypted database channel...'
    );

    setTimeout(() => {
      setSyncStep(
        'Checking zero-egress firewall policy...'
      );
    }, 700);

    setTimeout(() => {
      setSyncStep(
        'Synchronising intelligence records...'
      );
    }, 1400);

    setTimeout(() => {
      setSyncStep(
        'Verifying secure database integrity...'
      );
    }, 2100);

    setTimeout(() => {
      setLastSync(formatTime());
      setSyncStep('');
      setIsSyncing(false);
      setSyncStatus('success');
    }, 2900);
  };

  const handleFirewallToggle = () => {
    if (firewallActive) {
      const confirmed = window.confirm(
        'Disabling the Zero-Egress Firewall may expose the enclave to external network communication. Continue?'
      );

      if (!confirmed) return;
    }

    setFirewallActive((previous) => !previous);
  };

  const selectIsolationLevel = (
    level: IsolationLevel
  ) => {
    setIsolationLevel(level);
    setShowIsolationOptions(false);
  };

  return (
    <div className="space-y-6 text-stone-900 font-sans max-w-7xl mx-auto antialiased">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white/90 backdrop-blur-md border border-stone-200/80 p-6 rounded-2xl shadow-xs gap-4">

        <div>

          <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-300/60 rounded-xl text-xs font-mono font-bold uppercase tracking-wider">

            Zero-Egress Firewall Rule Enforcement and Secure Memgraph Database Synchronization

          </span>

          <h2 className="text-lg font-bold text-stone-900 mt-3 flex items-center tracking-tight">

            <Settings className="w-5 h-5 mr-2 text-amber-700" />

            Air-Gapped Enclave System Settings

          </h2>

          <p className="text-sm text-stone-500 mt-2">

            Manage enclave security controls, database protection and
            classified intelligence isolation policies.

          </p>

        </div>


        <div
          className={`px-3.5 py-1.5 border rounded-xl text-xs font-mono font-bold ${
            firewallActive
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}
        >

          <span
            className={`inline-block w-2 h-2 rounded-full mr-2 ${
              firewallActive
                ? 'bg-emerald-500'
                : 'bg-rose-500'
            }`}
          />

          {firewallActive
            ? 'ENCLAVE SECURED'
            : 'SECURITY WARNING'}

        </div>

      </div>


      {/* SECURITY CONTROLS */}

      <div className="bg-white/90 backdrop-blur-md border border-stone-200/80 rounded-2xl shadow-xs overflow-visible">

        <div className="px-6 py-5 border-b border-stone-200">

          <div className="flex items-center gap-2">

            <Shield className="w-5 h-5 text-amber-700" />

            <div>

              <h3 className="font-bold text-sm">

                Security Controls

              </h3>

              <p className="text-xs text-stone-500 mt-1">

                Core protection mechanisms for the air-gapped intelligence environment.

              </p>

            </div>

          </div>

        </div>


        {/* FIREWALL */}

        <div className="px-6 py-5 border-b border-stone-100">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div>

              <div className="font-mono text-sm font-bold text-stone-800">

                Zero-Egress Firewall Enforcement

              </div>

              <div className="text-xs text-stone-500 mt-2">

                Prevents unauthorized outbound network communication
                from the secure enclave.

              </div>

            </div>


            <div className="flex items-center gap-4">

              <span
                className={`px-3 py-1 rounded-xl border text-xs font-mono font-bold ${
                  firewallActive
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >

                {firewallActive
                  ? 'ACTIVE'
                  : 'DISABLED'}

              </span>


              <button
                type="button"
                onClick={handleFirewallToggle}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  firewallActive
                    ? 'bg-emerald-600'
                    : 'bg-stone-300'
                }`}
                aria-label="Toggle Zero-Egress Firewall"
              >

                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${
                    firewallActive
                      ? 'left-7'
                      : 'left-1'
                  }`}
                />

              </button>

            </div>

          </div>


          {!firewallActive && (

            <div className="mt-4 flex items-start gap-3 border border-rose-200 bg-rose-50 px-4 py-3">

              <AlertTriangle className="w-5 h-5 text-rose-600 mt-0.5" />

              <div>

                <div className="text-sm font-semibold text-rose-800">

                  Zero-Egress Protection Disabled

                </div>

                <p className="text-xs text-rose-700 mt-1">

                  The enclave is operating with reduced outbound network protection.

                </p>

              </div>

            </div>

          )}

        </div>


        {/* ENCRYPTION */}

        <div className="px-6 py-5 border-b border-stone-100">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div className="flex items-start gap-3">

              <Lock className="w-5 h-5 text-amber-700 mt-0.5" />

              <div>

                <div className="font-mono text-sm font-bold text-stone-800">

                  Memgraph In-Memory Encryption

                </div>

                <div className="text-xs text-stone-500 mt-2">

                  Intelligence graph data remains encrypted while processed
                  within the secure memory environment.

                </div>

              </div>

            </div>


            <div className="text-right">

              <div className="font-mono font-bold text-sm text-emerald-700">

                AES-256

              </div>

              <div className="text-[10px] font-mono uppercase text-stone-400 mt-1">

                Encryption Enabled

              </div>

            </div>

          </div>

        </div>


        {/* DATA ISOLATION */}

        <div className="px-6 py-5 relative">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div>

              <div className="font-mono text-sm font-bold text-stone-800">

                Classified Data Isolation Level

              </div>

              <div className="text-xs text-stone-500 mt-2">

                Controls the operational security boundary applied to
                classified investigation intelligence.

              </div>

            </div>


            <div className="relative">

              <button
                type="button"
                onClick={() =>
                  setShowIsolationOptions(
                    !showIsolationOptions
                  )
                }
                className="min-w-[240px] flex items-center justify-between gap-4 border border-stone-300 bg-white px-4 py-2.5 text-xs font-mono font-bold hover:border-amber-400 transition-colors"
              >

                <span
                  className={
                    isolationLevel === 'TOP SECRET'
                      ? 'text-rose-700'
                      : isolationLevel === 'CLASSIFIED'
                      ? 'text-amber-700'
                      : 'text-stone-700'
                  }
                >

                  {isolationLevel}

                </span>

                <ChevronDown className="w-4 h-4 text-stone-400" />

              </button>


              {showIsolationOptions && (

                <div className="absolute right-0 mt-2 w-full min-w-[240px] bg-white border border-stone-200 shadow-lg z-20">

                  {(
                    [
                      'RESTRICTED / NTRO-SECURE',
                      'CLASSIFIED',
                      'TOP SECRET',
                    ] as IsolationLevel[]
                  ).map((level) => (

                    <button
                      key={level}
                      type="button"
                      onClick={() =>
                        selectIsolationLevel(level)
                      }
                      className={`w-full text-left px-4 py-3 text-xs font-mono border-b last:border-b-0 border-stone-100 hover:bg-stone-50 ${
                        isolationLevel === level
                          ? 'bg-amber-50 text-amber-800 font-bold'
                          : 'text-stone-700'
                      }`}
                    >

                      {level}

                    </button>

                  ))}

                </div>

              )}

            </div>

          </div>

        </div>

      </div>


      {/* DATABASE SYNCHRONIZATION */}

      <div className="bg-white/90 backdrop-blur-md border border-stone-200/80 rounded-2xl shadow-xs overflow-hidden">

        <div className="px-6 py-5 border-b border-stone-200">

          <div className="flex items-center gap-2">

            <Database className="w-5 h-5 text-amber-700" />

            <div>

              <h3 className="font-bold text-sm">

                Secure Database Synchronization

              </h3>

              <p className="text-xs text-stone-500 mt-1">

                Synchronise authorised intelligence records with the
                encrypted Memgraph environment.

              </p>

            </div>

          </div>

        </div>


        <div className="p-6">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* DATABASE STATUS */}

            <div className="border border-stone-200 p-5">

              <div className="flex items-center gap-2">

                <Server className="w-4 h-4 text-emerald-700" />

                <span className="text-[10px] font-mono uppercase text-stone-400">

                  Database Status

                </span>

              </div>

              <div className="font-mono font-bold text-sm text-emerald-700 mt-4">

                CONNECTED

              </div>

              <p className="text-xs text-stone-500 mt-2">

                Secure Memgraph instance available.

              </p>

            </div>


            {/* LAST SYNC */}

            <div className="border border-stone-200 p-5">

              <div className="flex items-center gap-2">

                <Clock className="w-4 h-4 text-amber-700" />

                <span className="text-[10px] font-mono uppercase text-stone-400">

                  Last Synchronization

                </span>

              </div>

              <div className="font-mono font-bold text-sm text-stone-800 mt-4">

                {lastSync}

              </div>

              <p className="text-xs text-stone-500 mt-2">

                Latest authorised intelligence update.

              </p>

            </div>


            {/* CHANNEL STATUS */}

            <div className="border border-stone-200 p-5">

              <div className="flex items-center gap-2">

                <Lock className="w-4 h-4 text-amber-700" />

                <span className="text-[10px] font-mono uppercase text-stone-400">

                  Sync Channel

                </span>

              </div>

              <div className="font-mono font-bold text-sm text-emerald-700 mt-4">

                ENCRYPTED

              </div>

              <p className="text-xs text-stone-500 mt-2">

                AES-256 protected intelligence channel.

              </p>

            </div>

          </div>


          {/* SYNC PROCESS */}

          {isSyncing && (

            <div className="mt-6 border border-amber-200 bg-amber-50 px-5 py-4">

              <div className="flex items-center gap-3">

                <RefreshCw className="w-5 h-5 text-amber-700 animate-spin" />

                <div>

                  <div className="text-sm font-semibold text-amber-900">

                    Secure Synchronization In Progress

                  </div>

                  <div className="text-xs text-amber-800 mt-1">

                    {syncStep}

                  </div>

                </div>

              </div>

            </div>

          )}


          {/* SUCCESS */}

          {syncStatus === 'success' && !isSyncing && (

            <div className="mt-6 border border-emerald-200 bg-emerald-50 px-5 py-4">

              <div className="flex items-start gap-3">

                <CheckCircle2 className="w-5 h-5 text-emerald-700 mt-0.5" />

                <div>

                  <div className="text-sm font-semibold text-emerald-800">

                    Secure Database Synchronization Completed

                  </div>

                  <p className="text-xs text-emerald-700 mt-1">

                    Intelligence records were verified and synchronised
                    successfully within the encrypted enclave environment.

                  </p>

                </div>

              </div>

            </div>

          )}


          {/* ACTION */}

          <div className="mt-6 pt-5 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div className="text-xs text-stone-500">

              Synchronization is validated against the active enclave
              security policy before database records are updated.

            </div>


            <button
              type="button"
              onClick={handleSync}
              disabled={isSyncing}
              className={`px-5 py-2.5 text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                isSyncing
                  ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                  : 'bg-amber-700 hover:bg-amber-800 text-white'
              }`}
            >

              <RefreshCw
                className={`w-4 h-4 ${
                  isSyncing
                    ? 'animate-spin'
                    : ''
                }`}
              />

              {isSyncing
                ? 'Synchronizing...'
                : 'Synchronize Now'}

            </button>

          </div>

        </div>

      </div>


      {/* SYSTEM AUDIT */}

      <div className="bg-white/90 backdrop-blur-md border border-stone-200/80 rounded-2xl shadow-xs">

        <div className="px-6 py-5 border-b border-stone-200">

          <div className="flex items-center gap-2">

            <Shield className="w-5 h-5 text-amber-700" />

            <h3 className="font-bold text-sm">

              System Audit

            </h3>

          </div>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-stone-200">

          <div className="p-6">

            <div className="text-[10px] font-mono uppercase text-stone-400">

              Security Audit Status

            </div>

            <div className="flex items-center gap-2 mt-3 text-emerald-700">

              <CheckCircle2 className="w-4 h-4" />

              <span className="font-bold text-sm">

                VERIFIED

              </span>

            </div>

          </div>


          <div className="p-6">

            <div className="text-[10px] font-mono uppercase text-stone-400">

              Active Security Policy

            </div>

            <div className="font-mono font-bold text-sm mt-3">

              ZERO-EGRESS ENCLAVE

            </div>

          </div>


          <div className="p-6">

            <div className="text-[10px] font-mono uppercase text-stone-400">

              Data Classification

            </div>

            <div className="font-mono font-bold text-sm mt-3">

              {isolationLevel}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};