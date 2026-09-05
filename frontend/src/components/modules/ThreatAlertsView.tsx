import React, { useMemo, useState } from 'react';
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Eye,
  X,
  AlertTriangle,
  FileSearch,
} from 'lucide-react';

type AlertStatus =
  | 'OPEN'
  | 'INVESTIGATING'
  | 'INVESTIGATION_ACTIVE'
  | 'RESOLVING'
  | 'RESOLVED';

type AlertItem = {
  id: string;
  txId: string;
  severity: 'CRITICAL' | 'HIGH';
  riskScore: number;
  title: string;
  description: string;
  createdAt: string;
  status: AlertStatus;
  caseId?: string;
};

export const ThreatAlertsView: React.FC = () => {
  const initialAlerts: AlertItem[] = [
    {
      id: 'ALT-001',
      txId: 'TX-001',
      severity: 'CRITICAL',
      riskScore: 92,
      title: 'CRITICAL demo risk activity',
      description: 'Seeded demo alert linked to TX-001.',
      createdAt: '04/09/2026, 23:52:26',
      status: 'OPEN',
    },
    {
      id: 'ALT-002',
      txId: 'TX-002',
      severity: 'CRITICAL',
      riskScore: 84,
      title: 'CRITICAL demo risk activity',
      description: 'Seeded demo alert linked to TX-002.',
      createdAt: '04/09/2026, 22:52:26',
      status: 'OPEN',
    },
    {
      id: 'ALT-008',
      txId: 'TX-008',
      severity: 'CRITICAL',
      riskScore: 88,
      title: 'CRITICAL demo risk activity',
      description: 'Seeded demo alert linked to TX-008.',
      createdAt: '04/09/2026, 16:52:26',
      status: 'OPEN',
    },
    {
      id: 'ALT-012',
      txId: 'TX-012',
      severity: 'CRITICAL',
      riskScore: 95,
      title: 'CRITICAL demo risk activity',
      description: 'Seeded demo alert linked to TX-012.',
      createdAt: '04/09/2026, 14:12:08',
      status: 'OPEN',
    },
    {
      id: 'ALT-015',
      txId: 'TX-015',
      severity: 'HIGH',
      riskScore: 78,
      title: 'High-risk propagation pattern',
      description:
        'Abnormal propagation pattern detected in monitored peers.',
      createdAt: '04/09/2026, 12:42:18',
      status: 'OPEN',
    },
    {
      id: 'ALT-018',
      txId: 'TX-018',
      severity: 'HIGH',
      riskScore: 74,
      title: 'High-risk network correlation',
      description:
        'Transaction behaviour matched an active monitoring pattern.',
      createdAt: '04/09/2026, 11:18:45',
      status: 'OPEN',
    },
  ];

  const [alerts, setAlerts] =
    useState<AlertItem[]>(initialAlerts);

  const [filter, setFilter] =
    useState<'ALL' | 'CRITICAL'>('ALL');

  const [searchTerm, setSearchTerm] =
    useState('');

  const [activeAction, setActiveAction] =
    useState<string | null>(null);

  const [selectedAlert, setSelectedAlert] =
    useState<AlertItem | null>(null);

  /*
   * FILTERED ALERTS
   *
   * "Critical Only" intentionally shows only
   * currently active critical threats.
   * Resolved alerts remain visible under "All Alerts".
   */

  const visibleAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesFilter =
        filter === 'ALL'
          ? true
          : alert.severity === 'CRITICAL' &&
            alert.status !== 'RESOLVED';

      const searchValue =
        `${alert.id} ${alert.txId} ${alert.title}`
          .toLowerCase();

      const matchesSearch =
        searchValue.includes(
          searchTerm.toLowerCase()
        );

      return (
        matchesFilter &&
        matchesSearch
      );
    });
  }, [alerts, filter, searchTerm]);

  /*
   * SUMMARY METRICS
   *
   * The static offsets represent alerts already
   * loaded from the backend / historical dataset.
   *
   * Active Critical Threats excludes alerts that
   * have been resolved by the analyst.
   */

  const totalAlerts =
    alerts.length + 9;

  const criticalCount =
    alerts.filter(
      (alert) =>
        alert.severity === 'CRITICAL' &&
        alert.status !== 'RESOLVED'
    ).length + 5;

  const resolvedCount =
    alerts.filter(
      (alert) =>
        alert.status === 'RESOLVED'
    ).length + 6;

  /*
   * STATUS UPDATE HELPER
   */

  const updateAlertStatus = (
    alertId: string,
    status: AlertStatus,
    caseId?: string
  ) => {
    setAlerts((currentAlerts) =>
      currentAlerts.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status,
              caseId:
                caseId ??
                alert.caseId,
            }
          : alert
      )
    );
  };

  /*
   * INVESTIGATION FLOW
   */

  const handleInvestigate = (
    alert: AlertItem
  ) => {
    if (
      activeAction ||
      alert.status === 'INVESTIGATING'
    ) {
      return;
    }

    setActiveAction(alert.id);

    updateAlertStatus(
      alert.id,
      'INVESTIGATING'
    );

    setTimeout(() => {
      const caseId =
        'CHK-2026-041';

      updateAlertStatus(
        alert.id,
        'INVESTIGATION_ACTIVE',
        caseId
      );

      setActiveAction(null);
    }, 1300);
  };

  /*
   * RESOLUTION FLOW
   */

  const handleResolve = (
    alert: AlertItem
  ) => {
    if (
      activeAction ||
      alert.status === 'RESOLVING' ||
      alert.status === 'RESOLVED'
    ) {
      return;
    }

    setActiveAction(alert.id);

    updateAlertStatus(
      alert.id,
      'RESOLVING'
    );

    setTimeout(() => {
      updateAlertStatus(
        alert.id,
        'RESOLVED'
      );

      setActiveAction(null);
    }, 1500);
  };

  /*
   * STATUS DISPLAY CONTENT
   */

  const getStatusContent = (
    alert: AlertItem
  ) => {
    if (
      alert.status === 'INVESTIGATING'
    ) {
      return {
        text:
          'Correlating forensic evidence...',
        className:
          'bg-amber-50 border-amber-200 text-amber-800',
      };
    }

    if (
      alert.status ===
      'INVESTIGATION_ACTIVE'
    ) {
      return {
        text:
          `Investigation active • ${alert.caseId}`,
        className:
          'bg-blue-50 border-blue-200 text-blue-700',
      };
    }

    if (
      alert.status === 'RESOLVING'
    ) {
      return {
        text:
          'Verifying mitigation...',
        className:
          'bg-amber-50 border-amber-200 text-amber-800',
      };
    }

    if (
      alert.status === 'RESOLVED'
    ) {
      return {
        text:
          'Mitigation verified • Alert closed',
        className:
          'bg-emerald-50 border-emerald-200 text-emerald-700',
      };
    }

    return null;
  };

  return (
    <div className="space-y-6 text-stone-900 font-sans max-w-7xl mx-auto antialiased">

      {/* HEADER */}

      <div className="bg-white/90 border border-stone-200/80 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>

          <span className="inline-flex px-3 py-1 bg-amber-50 text-amber-800 border border-amber-300/60 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider">

            Automated Heuristic Triggers & P2P Peer Intercept Streams

          </span>

          <h2 className="text-lg font-bold text-stone-900 mt-3 flex items-center tracking-tight">

            <ShieldAlert className="w-5 h-5 mr-2 text-rose-600" />

            Real-Time Threat Intelligence & Active Intercepts

          </h2>

        </div>


        <div className="flex items-center">

          <span className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-mono font-bold">

            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />

            Live Backend Stream

          </span>

        </div>

      </div>


      {/* SUMMARY CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* TOTAL ALERTS */}

        <div className="bg-white/90 border border-stone-200/80 rounded-2xl p-5 shadow-xs">

          <div className="text-[10px] font-mono uppercase tracking-wider text-stone-500">

            Total Alerts

          </div>

          <div className="flex items-center gap-3 mt-3">

            <span className="text-3xl font-bold font-mono">

              {totalAlerts}

            </span>

            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-mono font-bold">

              Backend Loaded

            </span>

          </div>

        </div>


        {/* ACTIVE CRITICAL THREATS */}

        <div className="bg-white/90 border border-stone-200/80 rounded-2xl p-5 shadow-xs">

          <div className="text-[10px] font-mono uppercase tracking-wider text-stone-500">

            Active Critical Threats

          </div>

          <div className="flex items-center gap-3 mt-3">

            <span className="text-3xl font-bold font-mono text-rose-700">

              {criticalCount}

            </span>

            <span className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-mono font-bold">

              Requires Attention

            </span>

          </div>

        </div>


        {/* RESOLVED ALERTS */}

        <div className="bg-white/90 border border-stone-200/80 rounded-2xl p-5 shadow-xs">

          <div className="text-[10px] font-mono uppercase tracking-wider text-stone-500">

            Resolved / Mitigated

          </div>

          <div className="flex items-center gap-3 mt-3">

            <span className="text-3xl font-bold font-mono text-emerald-700">

              {resolvedCount}

            </span>

            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-mono font-bold">

              Analyst Actions

            </span>

          </div>

        </div>

      </div>


      {/* ALERT PANEL */}

      <div className="bg-white/90 border border-stone-200/80 rounded-2xl p-6 shadow-xs">

        {/* FILTERS */}

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={() =>
                setFilter('ALL')
              }
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                filter === 'ALL'
                  ? 'bg-stone-800 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >

              All Alerts

            </button>


            <button
              type="button"
              onClick={() =>
                setFilter('CRITICAL')
              }
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                filter === 'CRITICAL'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >

              Active Critical

            </button>

          </div>


          {/* SEARCH */}

          <div className="relative w-full lg:w-72">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
              placeholder="Filter threat logs..."
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono outline-none focus:border-amber-500 transition-colors"
            />

          </div>

        </div>


        {/* ALERT LIST */}

        <div className="space-y-3">

          {visibleAlerts.map(
            (alert) => {

              const statusContent =
                getStatusContent(alert);

              const isBusy =
                activeAction === alert.id;

              return (

                <div
                  key={alert.id}
                  className={`border rounded-2xl p-4 transition-all ${
                    alert.status === 'RESOLVED'
                      ? 'bg-emerald-50/30 border-emerald-200'
                      : alert.status === 'INVESTIGATION_ACTIVE'
                      ? 'bg-blue-50/20 border-blue-200'
                      : alert.severity === 'CRITICAL'
                      ? 'bg-white border-stone-200 hover:border-amber-300'
                      : 'bg-white border-stone-200'
                  }`}
                >

                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                    {/* ALERT DETAILS */}

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-2">

                        <span
                          className={`px-2.5 py-1 rounded-md border text-[10px] font-mono font-bold ${
                            alert.severity === 'CRITICAL'
                              ? 'bg-rose-50 border-rose-200 text-rose-700'
                              : 'bg-amber-50 border-amber-200 text-amber-700'
                          }`}
                        >

                          {alert.severity}

                        </span>


                        <span className="text-xs font-mono text-stone-500">

                          Risk Score:{' '}

                          <strong className="text-stone-900">

                            {alert.riskScore}

                          </strong>

                        </span>

                      </div>


                      <div className="mt-3 font-mono text-xs font-bold text-stone-800">

                        {alert.title}{' '}

                        <span className="text-stone-500 font-normal">

                          ({alert.txId})

                        </span>

                      </div>


                      <p className="text-xs text-stone-500 mt-2">

                        {alert.description}

                      </p>


                      <div className="text-[10px] text-stone-400 font-mono mt-2">

                        Alert ID: {alert.id}

                        {' • '}

                        {alert.createdAt}

                      </div>


                      {/* STATUS */}

                      {statusContent && (

                        <div
                          className={`inline-flex items-center gap-2 mt-3 px-3 py-2 rounded-lg border text-[10px] font-mono font-bold ${statusContent.className}`}
                        >

                          {isBusy ? (

                            <Loader2 className="w-3.5 h-3.5 animate-spin" />

                          ) : alert.status === 'RESOLVED' ? (

                            <CheckCircle2 className="w-3.5 h-3.5" />

                          ) : alert.status === 'INVESTIGATION_ACTIVE' ? (

                            <FileSearch className="w-3.5 h-3.5" />

                          ) : (

                            <Search className="w-3.5 h-3.5" />

                          )}

                          {statusContent.text}

                        </div>

                      )}

                    </div>


                    {/* ACTION BUTTONS */}

                    <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 shrink-0">

                      {alert.status === 'OPEN' && (

                        <>

                          <button
                            type="button"
                            onClick={() =>
                              handleInvestigate(alert)
                            }
                            disabled={isBusy}
                            className="px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 disabled:opacity-70 text-white text-xs font-mono font-bold transition-all flex items-center"
                          >

                            <Eye className="w-4 h-4 mr-2" />

                            Investigate

                          </button>


                          <button
                            type="button"
                            onClick={() =>
                              handleResolve(alert)
                            }
                            disabled={isBusy}
                            className="px-4 py-2.5 rounded-xl border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50 disabled:opacity-70 text-stone-700 text-xs font-mono font-bold transition-all"
                          >

                            Resolve

                          </button>

                        </>

                      )}


                      {alert.status === 'INVESTIGATING' && (

                        <button
                          type="button"
                          disabled
                          className="px-4 py-2.5 rounded-xl bg-amber-700 text-white text-xs font-mono font-bold flex items-center opacity-80"
                        >

                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />

                          Investigating...

                        </button>

                      )}


                      {alert.status === 'INVESTIGATION_ACTIVE' && (

                        <>

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedAlert(alert)
                            }
                            className="px-4 py-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-mono font-bold transition-all"
                          >

                            View Case

                          </button>


                          <button
                            type="button"
                            onClick={() =>
                              handleResolve(alert)
                            }
                            disabled={isBusy}
                            className="px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 disabled:opacity-70 text-white text-xs font-mono font-bold transition-all"
                          >

                            Resolve Alert

                          </button>

                        </>

                      )}


                      {alert.status === 'RESOLVING' && (

                        <button
                          type="button"
                          disabled
                          className="px-4 py-2.5 rounded-xl bg-amber-700 text-white text-xs font-mono font-bold flex items-center opacity-80"
                        >

                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />

                          Verifying...

                        </button>

                      )}


                      {alert.status === 'RESOLVED' && (

                        <span className="px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-bold flex items-center">

                          <ShieldCheck className="w-4 h-4 mr-2" />

                          Resolved

                        </span>

                      )}

                    </div>

                  </div>

                </div>

              );
            }
          )}

        </div>


        {/* EMPTY STATE */}

        {visibleAlerts.length === 0 && (

          <div className="py-16 text-center">

            <AlertTriangle className="w-6 h-6 text-stone-300 mx-auto mb-3" />

            <div className="text-sm font-medium text-stone-600">

              No active alerts found

            </div>

            <div className="text-xs text-stone-400 mt-1">

              Try changing the filter or search value.

            </div>

          </div>

        )}

      </div>


      {/* CASE DETAILS MODAL */}

      {selectedAlert && (

        <div className="fixed inset-0 z-50 bg-stone-900/20 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="w-full max-w-lg bg-white rounded-2xl border border-stone-200 shadow-xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between p-5 border-b border-stone-100">

              <div>

                <span className="text-[10px] font-mono uppercase text-stone-400">

                  Investigation Correlation

                </span>

                <h3 className="text-base font-bold text-stone-900 mt-1">

                  {selectedAlert.caseId}

                </h3>

              </div>


              <button
                type="button"
                onClick={() =>
                  setSelectedAlert(null)
                }
                className="p-2 rounded-lg hover:bg-stone-100"
              >

                <X className="w-5 h-5 text-stone-500" />

              </button>

            </div>


            {/* MODAL CONTENT */}

            <div className="p-5 space-y-4">

              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">

                <div className="text-[10px] font-mono uppercase text-stone-400">

                  Linked Alert

                </div>

                <div className="font-bold text-stone-900 mt-2">

                  {selectedAlert.id}

                </div>

              </div>


              <div className="grid grid-cols-2 gap-3">

                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">

                  <div className="text-[10px] font-mono uppercase text-stone-400">

                    Transaction

                  </div>

                  <div className="font-bold text-stone-900 mt-2">

                    {selectedAlert.txId}

                  </div>

                </div>


                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">

                  <div className="text-[10px] font-mono uppercase text-rose-500">

                    Risk Score

                  </div>

                  <div className="font-bold text-rose-700 mt-2">

                    {selectedAlert.riskScore}

                  </div>

                </div>

              </div>


              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">

                <div className="flex items-center gap-2 text-blue-700 font-mono text-xs font-bold">

                  <FileSearch className="w-4 h-4" />

                  Case Correlation Active

                </div>

                <p className="text-xs text-stone-600 mt-2 leading-relaxed">

                  The alert has been linked with the active forensic
                  investigation for correlation and analyst review.

                </p>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};