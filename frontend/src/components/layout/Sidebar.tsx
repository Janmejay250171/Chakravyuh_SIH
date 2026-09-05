import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderSearch,
  ShieldAlert,
  Network,
  Cpu,
  History,
  Radio,
  Brain,
  FileSearch,
  MessageSquareCode,
  Settings,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

const navGroups = [
  {
    label: 'OPERATIONS',
    items: [
      {
        name: 'Overview',
        path: '/overview',
        icon: LayoutDashboard,
      },
      {
        name: 'Investigations',
        path: '/investigations',
        icon: FolderSearch,
      },
      {
        name: 'Threat Alerts',
        path: '/alerts',
        icon: ShieldAlert,
      },
    ],
  },

  {
    label: 'INTELLIGENCE ANALYSIS',
    items: [
      {
        name: 'Blockchain Graph',
        path: '/graph',
        icon: Network,
      },
      {
        name: 'Transaction Analysis',
        path: '/transactions',
        icon: Cpu,
      },
      {
        name: 'Timeline Replay',
        path: '/timeline',
        icon: History,
      },
      {
        name: 'P2P Sentinels',
        path: '/sentinels',
        icon: Radio,
      },
      {
        name: 'AI Intelligence',
        path: '/ai-intelligence',
        icon: Brain,
      },
    ],
  },

  {
    label: 'VALIDATION',
    items: [
      {
        name: 'Explainability',
        path: '/explainability',
        icon: FileSearch,
      },
      {
        name: 'Analyst Feedback',
        path: '/feedback',
        icon: MessageSquareCode,
      },
    ],
  },

  {
    label: 'SYSTEM',
    items: [
      {
        name: 'System Settings',
        path: '/settings',
        icon: Settings,
      },
    ],
  },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 min-w-[16rem] h-screen sticky top-0 z-30 flex flex-col bg-workspace-surface border-r border-workspace-border">

      {/* =========================================================
          BRAND / SYSTEM HEADER
      ========================================================= */}

      <div className="border-b border-workspace-border">

        <div className="px-5 pt-5 pb-4">

          <div className="flex items-center gap-3">

            {/* SYSTEM MARK */}

            <div className="relative w-11 h-11 flex-shrink-0 border border-amber-200 bg-gradient-to-br from-amber-50 to-stone-50 flex items-center justify-center shadow-sm">

              <ShieldCheck className="w-5 h-5 text-amber-700" />

              <span className="absolute left-2 right-2 bottom-0 h-[2px] bg-amber-600" />

            </div>


            {/* SYSTEM NAME */}

            <div className="min-w-0">

              <h1 className="text-sm font-bold tracking-[0.14em] text-stone-900 leading-none">

                FORENSIC INTELLIGENCE PLATFORM

              </h1>

              <p className="mt-2 text-[9px] font-mono uppercase tracking-[0.15em] text-stone-400 whitespace-nowrap">
                FORENSIC INTELLIGENCE PLATFORM
                

              </p>

            </div>

          </div>


          {/* CLASSIFICATION STRIP */}

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">

            <div className="flex items-center gap-2">

              <span className="w-1.5 h-1.5 bg-amber-600" />

              <span className="text-[8px] font-mono uppercase tracking-[0.14em] text-stone-400">

                Intelligence Console

              </span>

            </div>


            <span className="text-[8px] font-mono uppercase tracking-[0.12em] text-emerald-700">

              Live

            </span>

          </div>

        </div>

      </div>


      {/* =========================================================
          NAVIGATION
      ========================================================= */}

      <nav className="flex-1 overflow-y-auto px-3 py-4 sidebar-scrollbar">

        <div className="space-y-5">

          {navGroups.map((group) => (

            <div key={group.label}>


              {/* GROUP LABEL */}

              <div className="px-3 mb-2 flex items-center gap-2">

                <span className="text-[8px] font-mono font-semibold uppercase tracking-[0.16em] text-stone-400 whitespace-nowrap">

                  {group.label}

                </span>

                <div className="h-px flex-1 bg-stone-100" />

              </div>


              {/* NAV ITEMS */}

              <div className="space-y-1">

                {group.items.map((item) => {

                  const Icon = item.icon;

                  return (

                    <NavLink
                      key={item.name}
                      to={item.path}
                      className={({ isActive }) =>
                        `
                        group
                        relative
                        flex
                        items-center
                        min-h-[40px]
                        px-3
                        text-xs
                        font-medium
                        transition-all
                        duration-150
                        border
                        ${
                          isActive
                            ? `
                              bg-amber-50/80
                              border-amber-300
                              text-stone-900
                              shadow-[0_1px_2px_rgba(0,0,0,0.04)]
                            `
                            : `
                              border-transparent
                              text-stone-500
                              hover:bg-stone-50
                              hover:border-stone-200
                              hover:text-stone-800
                            `
                        }
                        `
                      }
                    >
                      {({ isActive }) => (

                        <>

                          {/* ACTIVE LEFT INDICATOR */}

                          {isActive && (

                            <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-amber-600" />

                          )}


                          {/* ICON */}

                          <span
                            className={`
                              relative
                              flex
                              items-center
                              justify-center
                              w-7
                              h-7
                              mr-2.5
                              transition-colors
                              ${
                                isActive
                                  ? 'text-amber-700'
                                  : 'text-stone-400 group-hover:text-stone-700'
                              }
                            `}
                          >

                            <Icon className="w-4 h-4" />

                          </span>


                          {/* LABEL */}

                          <span className="flex-1 truncate tracking-[0.01em]">

                            {item.name}

                          </span>


                          {/* ACTIVE STATUS */}

                          {isActive ? (

                            <span className="flex items-center gap-1">

                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />

                            </span>

                          ) : (

                            <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 text-stone-400" />

                          )}

                        </>

                      )}

                    </NavLink>

                  );

                })}

              </div>

            </div>

          ))}

        </div>

      </nav>


      {/* =========================================================
          SECURITY / ENCLAVE STATUS
      ========================================================= */}

      <div className="border-t border-workspace-border bg-stone-50/80">

        {/* SECURITY HEADER */}

        <div className="px-4 py-3 border-b border-stone-200/80">

          <div className="flex items-center justify-between">

            <span className="text-[8px] font-mono uppercase tracking-[0.14em] text-stone-400">

              Enclave Status

            </span>


            <span className="flex items-center gap-1.5 text-[8px] font-mono font-semibold uppercase tracking-[0.08em] text-emerald-700">

              <span className="relative flex w-2 h-2">

                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50 animate-ping" />

                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />

              </span>

              Secure

            </span>

          </div>

        </div>


        {/* SYSTEM TELEMETRY */}

        <div className="px-4 py-3 space-y-2.5">

          <div className="flex items-center justify-between">

            <span className="text-[8px] font-mono uppercase tracking-[0.12em] text-stone-400">

              Mode

            </span>

            <span className="text-[9px] font-mono font-semibold text-stone-700">

              AIR-GAPPED

            </span>

          </div>


          <div className="flex items-center justify-between">

            <span className="text-[8px] font-mono uppercase tracking-[0.12em] text-stone-400">

              Egress

            </span>

            <span className="text-[9px] font-mono font-semibold text-emerald-700">

              BLOCKED

            </span>

          </div>


          <div className="flex items-center justify-between">

            <span className="text-[8px] font-mono uppercase tracking-[0.12em] text-stone-400">

              Node

            </span>

            <span className="text-[9px] font-mono font-semibold text-stone-600">

              NTRO-01

            </span>

          </div>

        </div>


        {/* FOOTER SECURITY LINE */}

        <div className="px-4 py-2.5 border-t border-stone-200/70 flex items-center justify-between">

          <span className="text-[8px] font-mono uppercase tracking-[0.12em] text-stone-400">

            Enclave

          </span>

          <span className="flex items-center gap-1.5 text-[8px] font-mono uppercase text-emerald-700">

            <span className="w-1 h-1 rounded-full bg-emerald-500" />

            Online

          </span>

        </div>

      </div>

    </aside>
  );
};