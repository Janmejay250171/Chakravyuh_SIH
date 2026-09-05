import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Radio,
  Activity,
  RefreshCw,
  ChevronRight,
  Network,
  Users,
  CheckCircle2,
  Eye,
  Server,
  Shield,
  Globe,
  AlertTriangle,
  Clock,
  X,
} from 'lucide-react';

type Sentinel = {
  id: string;
  name: string;
  ip: string;
  latency: number;
  peers: number;
  status: 'ONLINE' | 'DEGRADED';
  location: string;
  region: string;
};

type ActivityLog = {
  id: number;
  time: string;
  title: string;
  description: string;
  status: 'SECURE' | 'MONITORED' | 'HIGH RISK' | 'CASE LINKED';
};

export const P2PSentinelsView: React.FC = () => {
  const initialSentinels: Sentinel[] = [
    {
      id: 'SEN-01',
      name: 'North Gateway',
      ip: '10.144.20.12',
      latency: 11.2,
      peers: 42,
      status: 'ONLINE',
      location: 'Leh Sector',
      region: 'Northern Secure Zone',
    },
    {
      id: 'SEN-02',
      name: 'Western Command',
      ip: '10.201.88.4',
      latency: 14.8,
      peers: 68,
      status: 'ONLINE',
      location: 'Mumbai Hub',
      region: 'Western Secure Zone',
    },
    {
      id: 'SEN-03',
      name: 'Southern Enclave',
      ip: '10.12.4.99',
      latency: 18.1,
      peers: 35,
      status: 'ONLINE',
      location: 'Bangalore',
      region: 'Southern Secure Zone',
    },
    {
      id: 'SEN-04',
      name: 'Eastern Sentinel',
      ip: '10.99.12.40',
      latency: 12.5,
      peers: 51,
      status: 'ONLINE',
      location: 'Kolkata Gateway',
      region: 'Eastern Secure Zone',
    },
  ];

  const [sentinels, setSentinels] =
    useState<Sentinel[]>(initialSentinels);

  const [selectedSentinelId, setSelectedSentinelId] =
    useState('SEN-01');

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const [showActivity, setShowActivity] =
    useState(false);

  const [inspectionLoading, setInspectionLoading] =
    useState(false);

  const [lastUpdated, setLastUpdated] =
    useState('Live monitoring active');

  const activitySectionRef =
    useRef<HTMLDivElement | null>(null);

  const formatTime = () => {
    return new Date().toLocaleTimeString(
      [],
      {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }
    );
  };

  const selectedSentinel = useMemo(() => {
    return (
      sentinels.find(
        (sentinel) =>
          sentinel.id === selectedSentinelId
      ) || sentinels[0]
    );
  }, [sentinels, selectedSentinelId]);

  const totalPeers = useMemo(() => {
    return sentinels.reduce(
      (total, sentinel) =>
        total + sentinel.peers,
      0
    );
  }, [sentinels]);

  const averageLatency = useMemo(() => {
    const total = sentinels.reduce(
      (sum, sentinel) =>
        sum + sentinel.latency,
      0
    );

    return (
      total / sentinels.length
    ).toFixed(1);
  }, [sentinels]);

  const createActivityLogs = (
    sentinel: Sentinel
  ): ActivityLog[] => {
    const txId =
      sentinel.id === 'SEN-01'
        ? 'TX-7A92F'
        : sentinel.id === 'SEN-02'
        ? 'TX-4C81B'
        : sentinel.id === 'SEN-03'
        ? 'TX-9D44E'
        : 'TX-2F17A';

    const currentTime = formatTime();

    return [
      {
        id: 1,
        time: currentTime,
        title: 'P2P Peer Handshake Validated',
        description: `${sentinel.peers} encrypted peer connections authenticated through ${sentinel.id}.`,
        status: 'SECURE',
      },
      {
        id: 2,
        time: currentTime,
        title: 'Transaction Propagation Observed',
        description: `Transaction ${txId} detected across monitored peers connected to ${sentinel.location}.`,
        status: 'MONITORED',
      },
      {
        id: 3,
        time: currentTime,
        title: 'Propagation Pattern Anomaly',
        description: `Propagation velocity exceeded the expected network baseline for this sector.`,
        status: 'HIGH RISK',
      },
      {
        id: 4,
        time: currentTime,
        title: 'Investigation Correlation Matched',
        description: `Network activity linked with investigation CHK-2026-041 for forensic analysis.`,
        status: 'CASE LINKED',
      },
    ];
  };

  const [activityLogs, setActivityLogs] =
    useState<ActivityLog[]>(
      createActivityLogs(initialSentinels[0])
    );

  const refreshTelemetry = () => {
    if (isRefreshing) return;

    setIsRefreshing(true);

    setTimeout(() => {
      setSentinels((previousSentinels) =>
        previousSentinels.map((sentinel) => {
          const latencyChange =
            Math.round(
              (Math.random() * 2 - 1) * 10
            ) / 10;

          const peerChange =
            Math.floor(Math.random() * 7) - 3;

          return {
            ...sentinel,

            latency: Number(
              Math.max(
                5,
                sentinel.latency + latencyChange
              ).toFixed(1)
            ),

            peers: Math.max(
              1,
              sentinel.peers + peerChange
            ),
          };
        })
      );

      const updatedTime = formatTime();

      setLastUpdated(
        `Telemetry updated at ${updatedTime}`
      );

      setIsRefreshing(false);
    }, 700);
  };

  const handleSelectSentinel = (
    sentinel: Sentinel
  ) => {
    setSelectedSentinelId(sentinel.id);

    if (showActivity) {
      setActivityLogs(
        createActivityLogs(sentinel)
      );

      setLastUpdated(
        `Viewing ${sentinel.id} activity at ${formatTime()}`
      );
    }
  };

  const handleInspectActivity = () => {
    if (inspectionLoading) return;

    /*
      If activity is already visible,
      clicking the same button will
      close the inspection panel.
    */

    if (showActivity) {
      setShowActivity(false);

      setLastUpdated(
        `Inspection closed at ${formatTime()}`
      );

      return;
    }

    setInspectionLoading(true);

    setTimeout(() => {
      const latestSentinel =
        sentinels.find(
          (sentinel) =>
            sentinel.id === selectedSentinelId
        ) || sentinels[0];

      setActivityLogs(
        createActivityLogs(latestSentinel)
      );

      setShowActivity(true);

      setLastUpdated(
        `Network inspection started at ${formatTime()}`
      );

      setInspectionLoading(false);
    }, 500);
  };

  const handleDeinspect = () => {
    setShowActivity(false);

    setLastUpdated(
      `Inspection closed at ${formatTime()}`
    );
  };

  useEffect(() => {
    if (
      showActivity &&
      activitySectionRef.current
    ) {
      setTimeout(() => {
        activitySectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
  }, [showActivity]);

  const getStatusStyle = (
    status: ActivityLog['status']
  ) => {
    if (status === 'SECURE') {
      return {
        border: 'border-emerald-200',
        background: 'bg-emerald-50/60',
        badge:
          'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: 'text-emerald-600',
      };
    }

    if (status === 'MONITORED') {
      return {
        border: 'border-amber-200',
        background: 'bg-amber-50/50',
        badge:
          'bg-amber-50 text-amber-800 border-amber-200',
        icon: 'text-amber-700',
      };
    }

    if (status === 'HIGH RISK') {
      return {
        border: 'border-rose-200',
        background: 'bg-rose-50/50',
        badge:
          'bg-rose-50 text-rose-700 border-rose-200',
        icon: 'text-rose-600',
      };
    }

    return {
      border: 'border-blue-200',
      background: 'bg-blue-50/50',
      badge:
        'bg-blue-50 text-blue-700 border-blue-200',
      icon: 'text-blue-600',
    };
  };

  return (
    <div className="max-w-7xl mx-auto space-y-5 text-stone-900">

      {/* HEADER */}

      <div className="bg-white border border-stone-200 rounded-lg px-6 py-5">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          <div>

            <div className="flex items-center gap-2">

              <Radio className="w-5 h-5 text-amber-700" />

              <span className="text-[11px] font-mono uppercase tracking-wide text-amber-800">

                P2P Network Monitoring

              </span>

            </div>

            <h2 className="text-xl font-semibold mt-2">

              Air-Gapped P2P Node Sentinels

            </h2>

            <p className="text-sm text-stone-500 mt-1">

              Gateway listener status and monitored peer activity.

            </p>

          </div>


          <div className="flex items-center gap-3 flex-wrap">

            <button
              type="button"
              onClick={refreshTelemetry}
              disabled={isRefreshing}
              className="flex items-center px-4 py-2.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-60 text-white rounded-md text-xs font-medium transition-colors"
            >

              <RefreshCw
                className={`w-4 h-4 mr-2 ${
                  isRefreshing
                    ? 'animate-spin'
                    : ''
                }`}
              />

              {isRefreshing
                ? 'Refreshing...'
                : 'Refresh Telemetry'}

            </button>


            <div className="border border-emerald-200 bg-emerald-50 px-3 py-2.5 rounded-md text-xs font-mono text-emerald-700">

              <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mr-2" />

              12 / 12 Operational

            </div>

          </div>

        </div>

      </div>


      {/* METRICS */}

      <div className="grid grid-cols-2 lg:grid-cols-4 border border-stone-200 rounded-lg overflow-hidden bg-white">

        <div className="p-5 border-b lg:border-b-0 lg:border-r border-stone-200">

          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wide text-stone-500 font-mono">

            <Server className="w-4 h-4" />

            Active Sentinels

          </div>

          <div className="text-2xl font-semibold font-mono mt-3">

            12

          </div>

          <div className="text-[11px] text-emerald-700 mt-1">

            All sectors reporting

          </div>

        </div>


        <div className="p-5 border-b lg:border-b-0 lg:border-r border-stone-200">

          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wide text-stone-500 font-mono">

            <Users className="w-4 h-4" />

            Connected Peers

          </div>

          <div className="text-2xl font-semibold font-mono mt-3">

            {totalPeers}

          </div>

          <div className="text-[11px] text-stone-500 mt-1">

            Across monitored nodes

          </div>

        </div>


        <div className="p-5 border-b border-stone-200 lg:border-b-0 lg:border-r">

          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wide text-stone-500 font-mono">

            <Activity className="w-4 h-4" />

            Average Latency

          </div>

          <div className="text-2xl font-semibold font-mono mt-3 text-emerald-700">

            {averageLatency}ms

          </div>

          <div className="text-[11px] text-stone-500 mt-1">

            Within threshold

          </div>

        </div>


        <div className="p-5">

          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wide text-stone-500 font-mono">

            <Shield className="w-4 h-4" />

            Enclave Status

          </div>

          <div className="text-xl font-semibold font-mono mt-3 text-emerald-700">

            SECURE

          </div>

          <div className="text-[11px] text-stone-500 mt-1">

            Zero-egress enabled

          </div>

        </div>

      </div>


      {/* MAIN AREA */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* SENTINEL LIST */}

        <div className="xl:col-span-2">

          <div className="bg-white border border-stone-200 rounded-lg">

            <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">

              <div>

                <h3 className="text-sm font-semibold">

                  Sentinel Network

                </h3>

                <p className="text-xs text-stone-500 mt-1">

                  Select a gateway to inspect monitored activity.

                </p>

              </div>

              <Network className="w-5 h-5 text-stone-400" />

            </div>


            <div className="grid grid-cols-1 md:grid-cols-2">

              {sentinels.map((sentinel) => {

                const isSelected =
                  sentinel.id ===
                  selectedSentinelId;

                return (

                  <button
                    key={sentinel.id}
                    type="button"
                    onClick={() =>
                      handleSelectSentinel(sentinel)
                    }
                    className={`text-left p-5 border-b md:nth-last-child(-n+2):border-b-0 border-stone-200 transition-colors ${
                      isSelected
                        ? 'bg-amber-50/60'
                        : 'bg-white hover:bg-stone-50'
                    }`}
                  >

                    <div className="flex items-start justify-between">

                      <div>

                        <div className="flex items-center gap-2">

                          <span className="font-mono text-xs font-bold text-stone-800">

                            {sentinel.id}

                          </span>

                          <span className="text-[10px] px-2 py-0.5 border border-emerald-200 bg-emerald-50 text-emerald-700 rounded-sm font-mono">

                            {sentinel.status}

                          </span>

                        </div>

                        <h4 className="font-medium mt-3">

                          {sentinel.name}

                        </h4>

                        <p className="text-xs text-stone-500 mt-1">

                          {sentinel.location}

                        </p>

                      </div>


                      <ChevronRight
                        className={`w-4 h-4 mt-1 ${
                          isSelected
                            ? 'text-amber-700'
                            : 'text-stone-400'
                        }`}
                      />

                    </div>


                    <div className="grid grid-cols-2 gap-3 mt-5">

                      <div className="border border-stone-200 bg-stone-50 px-3 py-2">

                        <div className="text-[9px] uppercase font-mono text-stone-400">

                          Secure IP

                        </div>

                        <div className="font-mono text-xs mt-1">

                          {sentinel.ip}

                        </div>

                      </div>


                      <div className="border border-stone-200 bg-stone-50 px-3 py-2">

                        <div className="text-[9px] uppercase font-mono text-stone-400">

                          Latency

                        </div>

                        <div className="font-mono text-xs mt-1 text-emerald-700">

                          {sentinel.latency.toFixed(1)}ms

                        </div>

                      </div>

                    </div>


                    <div className="flex justify-between mt-4 text-xs font-mono">

                      <span className="text-stone-500">

                        Peers:
                        {' '}

                        <strong className="text-stone-800">

                          {sentinel.peers}

                        </strong>

                      </span>

                      <span className="text-[10px] text-stone-400">

                        {sentinel.region}

                      </span>

                    </div>

                  </button>

                );
              })}

            </div>

          </div>

        </div>


        {/* INSPECTOR */}

        <div className="bg-white border border-stone-200 rounded-lg">

          <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">

            <div>

              <div className="text-[10px] font-mono uppercase tracking-wide text-stone-400">

                Selected Sentinel

              </div>

              <div className="font-semibold mt-1">

                {selectedSentinel.id}

              </div>

            </div>

            <Network className="w-5 h-5 text-amber-700" />

          </div>


          <div className="p-5 space-y-4">

            <div className="border border-stone-200 bg-stone-50 p-4">

              <div className="flex items-center justify-between">

                <span className="text-[10px] uppercase font-mono text-stone-400">

                  Gateway

                </span>

                <Globe className="w-4 h-4 text-stone-500" />

              </div>

              <div className="font-medium mt-3">

                {selectedSentinel.name}

              </div>

              <div className="text-xs text-stone-500 mt-1">

                {selectedSentinel.location}

              </div>

            </div>


            <div className="grid grid-cols-2 gap-3">

              <div className="border border-stone-200 p-3">

                <div className="text-[9px] uppercase font-mono text-stone-400">

                  Secure IP

                </div>

                <div className="font-mono text-xs mt-2">

                  {selectedSentinel.ip}

                </div>

              </div>


              <div className="border border-stone-200 p-3">

                <div className="text-[9px] uppercase font-mono text-stone-400">

                  Latency

                </div>

                <div className="font-mono text-xs mt-2 text-emerald-700">

                  {selectedSentinel.latency.toFixed(1)}ms

                </div>

              </div>

            </div>


            <div className="border border-stone-200 p-4">

              <div className="flex items-center justify-between">

                <span className="text-[10px] uppercase font-mono text-stone-400">

                  Connected Peer Network

                </span>

                <Users className="w-4 h-4 text-stone-500" />

              </div>

              <div className="text-2xl font-semibold font-mono mt-3">

                {selectedSentinel.peers}

              </div>

              <div className="text-[11px] text-stone-500 mt-1">

                Active encrypted peer connections

              </div>

            </div>


            <div className="border border-emerald-200 bg-emerald-50/40 p-4">

              <div className="flex items-center gap-2 text-xs font-medium text-emerald-800">

                <CheckCircle2 className="w-4 h-4" />

                Zero-Egress Security Active

              </div>

              <p className="text-[11px] text-stone-600 mt-2 leading-relaxed">

                Traffic remains inside the monitored
                environment and outbound communication
                is restricted.

              </p>

            </div>


            {/* INSPECT / DEINSPECT */}

            <button
              type="button"
              onClick={handleInspectActivity}
              disabled={inspectionLoading}
              className={`w-full py-3 text-xs font-semibold rounded-md transition-colors flex items-center justify-center ${
                showActivity
                  ? 'bg-stone-800 hover:bg-stone-900 text-white'
                  : 'bg-amber-700 hover:bg-amber-800 text-white'
              }`}
            >

              {inspectionLoading ? (

                <>

                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />

                  Loading Activity...

                </>

              ) : showActivity ? (

                <>

                  <X className="w-4 h-4 mr-2" />

                  Deinspect Network Activity

                </>

              ) : (

                <>

                  <Eye className="w-4 h-4 mr-2" />

                  Inspect Network Activity

                </>

              )}

            </button>


            <div className="text-center text-[10px] font-mono text-stone-400">

              {lastUpdated}

            </div>

          </div>

        </div>

      </div>


      {/* ACTIVITY PANEL */}

      {showActivity && (

        <div
          ref={activitySectionRef}
          className="bg-white border border-stone-200 rounded-lg"
        >

          <div className="px-6 py-5 border-b border-stone-200">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div>

                <div className="flex items-center gap-2">

                  <Activity className="w-5 h-5 text-amber-700" />

                  <h3 className="text-sm font-semibold">

                    Live Sentinel Activity Stream

                  </h3>

                </div>

                <div className="font-mono text-[11px] text-stone-500 mt-2">

                  {selectedSentinel.id}
                  {' • '}
                  {selectedSentinel.name}
                  {' • '}
                  {selectedSentinel.ip}

                </div>

              </div>


              <div className="flex items-center gap-3">

                <span className="px-3 py-1.5 border border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px] font-mono">

                  ● STREAM ACTIVE

                </span>


                <button
                  type="button"
                  onClick={handleDeinspect}
                  className="px-3 py-1.5 border border-stone-300 hover:bg-stone-100 text-stone-600 text-xs transition-colors flex items-center"
                >

                  <X className="w-4 h-4 mr-1.5" />

                  Deinspect

                </button>

              </div>

            </div>

          </div>


          {/* LOGS */}

          <div className="p-5">

            <div className="space-y-2">

              {activityLogs.map((log) => {

                const styles =
                  getStatusStyle(log.status);

                return (

                  <div
                    key={log.id}
                    className={`border ${styles.border} ${styles.background}`}
                  >

                    <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">

                      <div className="flex items-start">

                        <Clock
                          className={`w-4 h-4 mr-3 mt-0.5 ${styles.icon}`}
                        />

                        <div>

                          <div className="flex flex-wrap items-center gap-3">

                            <span className="text-[10px] font-mono text-stone-400">

                              {log.time}

                            </span>

                            <span className="text-xs font-semibold">

                              {log.title}

                            </span>

                          </div>

                          <p className="text-xs text-stone-600 mt-2">

                            {log.description}

                          </p>

                        </div>

                      </div>


                      <span
                        className={`self-start md:self-center whitespace-nowrap px-2.5 py-1 border text-[10px] font-mono ${styles.badge}`}
                      >

                        {log.status}

                      </span>

                    </div>

                  </div>

                );
              })}

            </div>


            {/* FORENSIC SUMMARY */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">

              <div className="border border-stone-200 p-4">

                <div className="flex items-center gap-2 text-[10px] uppercase font-mono text-stone-500">

                  <Radio className="w-4 h-4" />

                  Propagation Pattern

                </div>

                <div className="font-semibold text-sm mt-3">

                  Multi-Peer Broadcast

                </div>

              </div>


              <div className="border border-rose-200 bg-rose-50/40 p-4">

                <div className="flex items-center gap-2 text-[10px] uppercase font-mono text-rose-600">

                  <AlertTriangle className="w-4 h-4" />

                  Risk Signal

                </div>

                <div className="font-semibold text-sm text-rose-700 mt-3">

                  Anomalous Velocity

                </div>

              </div>


              <div className="border border-amber-200 bg-amber-50/40 p-4">

                <div className="flex items-center gap-2 text-[10px] uppercase font-mono text-amber-700">

                  <Network className="w-4 h-4" />

                  Case Correlation

                </div>

                <div className="font-semibold text-sm text-amber-900 mt-3">

                  CHK-2026-041

                </div>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};