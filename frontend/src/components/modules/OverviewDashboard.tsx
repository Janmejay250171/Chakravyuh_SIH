import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Bitcoin,
  Boxes,
  CheckCircle2,
  Clock3,
  Database,
  Eye,
  Globe2,
  Network,
  Radar,
  RefreshCw,
  Search,
  ShieldAlert,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";

type RiskLevel = "CRITICAL" | "HIGH" | "MEDIUM";

type Transaction = {
  txid: string;
  sourceIp: string;
  cluster: string;
  amount: string;
  geo: string;
  risk: number;
  level: RiskLevel;
};

const transactions: Transaction[] = [
  {
    txid: "a001f3e9demo",
    sourceIp: "10.20.2.21",
    cluster: "P2P-2",
    amount: "1.980 BTC",
    geo: "SG · AS45102",
    risk: 92,
    level: "CRITICAL",
  },
  {
    txid: "a008f3d0demo",
    sourceIp: "10.20.4.28",
    cluster: "P2P-1",
    amount: "7.090 BTC",
    geo: "DE · AS3320",
    risk: 88,
    level: "CRITICAL",
  },
  {
    txid: "a002f3eademo",
    sourceIp: "10.20.3.22",
    cluster: "P2P-3",
    amount: "2.710 BTC",
    geo: "RU · AS48852",
    risk: 84,
    level: "CRITICAL",
  },
  {
    txid: "a003f3ebdemo",
    sourceIp: "10.20.4.23",
    cluster: "P2P-4",
    amount: "3.440 BTC",
    geo: "DE · AS3320",
    risk: 73,
    level: "HIGH",
  },
  {
    txid: "a004f3ecdemo",
    sourceIp: "10.20.5.24",
    cluster: "P2P-5",
    amount: "4.170 BTC",
    geo: "US · AS7922",
    risk: 67,
    level: "HIGH",
  },
];

const activityFeed = [
  {
    title: "High-risk wallet cluster detected",
    detail: "Cluster P2P-2 linked across 4 transaction hops",
    time: "2 min ago",
    type: "danger",
  },
  {
    title: "Mixer decoupling completed",
    detail: "Whirlpool pattern resolved with 91.4% confidence",
    time: "8 min ago",
    type: "warning",
  },
  {
    title: "Graph intelligence updated",
    detail: "1,284 new wallet relationships indexed",
    time: "14 min ago",
    type: "success",
  },
  {
    title: "Sentinel node synchronized",
    detail: "Node P2P-07 transmitted latest packet batch",
    time: "21 min ago",
    type: "info",
  },
];

function RiskBadge({ level, risk }: { level: RiskLevel; risk: number }) {
  const styles = {
    CRITICAL:
      "border-red-200 bg-red-50 text-red-700 shadow-[0_0_12px_rgba(239,68,68,0.08)]",
    HIGH: "border-orange-200 bg-orange-50 text-orange-700",
    MEDIUM: "border-amber-200 bg-amber-50 text-amber-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-bold tracking-wide ${styles[level]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          level === "CRITICAL"
            ? "bg-red-500 animate-pulse"
            : level === "HIGH"
            ? "bg-orange-500"
            : "bg-amber-500"
        }`}
      />
      {level} · {risk}
    </span>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent,
  trend,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  accent: "orange" | "red" | "emerald" | "blue";
  trend?: string;
}) {
  const colors = {
    orange: {
      icon: "bg-orange-50 text-orange-600 border-orange-100",
      line: "bg-orange-500",
    },
    red: {
      icon: "bg-red-50 text-red-600 border-red-100",
      line: "bg-red-500",
    },
    emerald: {
      icon: "bg-emerald-50 text-emerald-600 border-emerald-100",
      line: "bg-emerald-500",
    },
    blue: {
      icon: "bg-blue-50 text-blue-600 border-blue-100",
      line: "bg-blue-500",
    },
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div
        className={`absolute left-0 top-0 h-full w-1 ${colors[accent].line}`}
      />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">
            {title}
          </p>

          <div className="mt-3 flex items-end gap-3">
            <h3 className="text-3xl font-bold tracking-tight text-stone-900">
              {value}
            </h3>

            {trend && (
              <span className="mb-1 flex items-center gap-1 text-xs font-medium text-emerald-600">
                <TrendingUp className="h-3 w-3" />
                {trend}
              </span>
            )}
          </div>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl border ${colors[accent].icon}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-5 border-t border-stone-100 pt-3">
        <p className="text-xs text-stone-500">{subtitle}</p>
      </div>
    </div>
  );
}

export const OverviewDashboard: React.FC = () => {
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [time, setTime] = useState(new Date());
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const filteredTransactions = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return transactions;

    return transactions.filter(
      (tx) =>
        tx.txid.toLowerCase().includes(query) ||
        tx.sourceIp.toLowerCase().includes(query) ||
        tx.cluster.toLowerCase().includes(query)
    );
  }, [search]);

  const handleRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 900);
  };

  return (
    <div className="min-h-full bg-[#f7f7f5]">
      {/* Main Content */}
      <div className="mx-auto max-w-[1600px] px-5 py-6 lg:px-8">

        {/* TOP COMMAND BAR */}
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 text-white shadow-lg">
                <Radar className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-tight text-stone-900">
                  Command Overview
                </h1>

                <p className="text-xs text-stone-500">
                  Real-time blockchain intelligence and threat monitoring
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* LIVE STATUS */}
            <div className="hidden items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 shadow-sm md:flex">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                  System Status
                </p>
                <p className="text-xs font-semibold text-emerald-600">
                  All Systems Operational
                </p>
              </div>
            </div>

            {/* CLOCK */}
            <div className="hidden rounded-xl border border-stone-200 bg-white px-4 py-2.5 shadow-sm sm:block">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                UTC Time
              </p>
              <p className="font-mono text-xs font-semibold text-stone-700">
                {time.toUTCString().slice(17, 25)}
              </p>
            </div>

            {/* REFRESH */}
            <button
              onClick={handleRefresh}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-600 shadow-sm transition hover:bg-stone-50 hover:text-stone-900"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* INTELLIGENCE STATUS */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-mono text-sm font-bold tracking-wide text-stone-800">
                    CHAKRAVYUH INTELLIGENCE CORE
                  </h2>

                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    LIVE
                  </span>
                </div>

                <p className="mt-1 text-sm text-stone-500">
                  Blockchain intelligence engine synchronized with active
                  investigation dataset.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 text-xs">
              <div className="rounded-lg bg-stone-50 px-3 py-2 text-stone-500">
                <span className="font-semibold text-stone-800">24</span>{" "}
                Sentinel Nodes
              </div>

              <div className="rounded-lg bg-stone-50 px-3 py-2 text-stone-500">
                <span className="font-semibold text-stone-800">38 ms</span>{" "}
                Graph Query
              </div>

              <div className="rounded-lg bg-stone-50 px-3 py-2 text-stone-500">
                <span className="font-semibold text-stone-800">94.6%</span>{" "}
                AI Confidence
              </div>
            </div>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Monitored Records"
            value="30"
            subtitle="30 datasets currently indexed"
            icon={Database}
            accent="orange"
            trend="+12%"
          />

          <StatCard
            title="Critical Risk Sinks"
            value="8"
            subtitle="12 active threat alerts"
            icon={ShieldAlert}
            accent="red"
            trend="+3"
          />

          <StatCard
            title="Active Cases"
            value="5"
            subtitle="3 investigations updated today"
            icon={Eye}
            accent="emerald"
          />

          <StatCard
            title="Tracked Volume"
            value="376.95"
            subtitle="BTC flowing through monitored clusters"
            icon={Bitcoin}
            accent="blue"
            trend="+8.4%"
          />
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_0.8fr]">

          {/* LEFT */}
          <div className="space-y-6">

            {/* HIGH RISK TABLE */}
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
              <div className="flex flex-col gap-4 border-b border-stone-100 p-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-red-500" />

                    <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-stone-800">
                      Recent High-Risk Activity
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-stone-400">
                    Live transaction intelligence requiring investigator
                    attention
                  </p>
                </div>

                {/* SEARCH */}
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search TXID, IP, cluster..."
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 pl-9 pr-3 text-xs outline-none transition focus:border-orange-400 focus:bg-white"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px]">
                  <thead>
                    <tr className="border-b border-stone-100 bg-stone-50/70">
                      <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        Transaction ID
                      </th>

                      <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        Source IP
                      </th>

                      <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        Cluster
                      </th>

                      <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        Amount
                      </th>

                      <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        Geo ASN
                      </th>

                      <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        Risk
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredTransactions.map((tx) => (
                      <tr
                        key={tx.txid}
                        onClick={() => setSelectedTx(tx)}
                        className="cursor-pointer border-b border-stone-100 transition hover:bg-orange-50/40"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <Wallet className="h-3.5 w-3.5 text-orange-500" />

                            <span className="font-mono text-xs font-semibold text-orange-700">
                              {tx.txid}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4 font-mono text-xs text-stone-600">
                          {tx.sourceIp}
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-md bg-stone-100 px-2 py-1 font-mono text-[10px] font-semibold text-stone-600">
                            {tx.cluster}
                          </span>
                        </td>

                        <td className="px-5 py-4 font-mono text-xs font-semibold text-stone-800">
                          {tx.amount}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-stone-500">
                            <Globe2 className="h-3.5 w-3.5" />
                            {tx.geo}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <RiskBadge level={tx.level} risk={tx.risk} />
                        </td>
                      </tr>
                    ))}

                    {filteredTransactions.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-12 text-center text-sm text-stone-400"
                        >
                          No matching transaction found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between border-t border-stone-100 px-5 py-4">
                <p className="text-xs text-stone-400">
                  Showing {filteredTransactions.length} high-risk records
                </p>

                <button className="flex items-center gap-1 text-xs font-semibold text-orange-700 transition hover:text-orange-900">
                  View all alerts
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* NETWORK / GRAPH VISUAL */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Network className="h-4 w-4 text-blue-600" />

                    <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-stone-800">
                      Live Transaction Network
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-stone-400">
                    Real-time relationship monitoring across active clusters
                  </p>
                </div>

                <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  LIVE GRAPH
                </span>
              </div>

              <div className="relative h-[220px] overflow-hidden rounded-xl border border-stone-100 bg-gradient-to-br from-stone-50 to-white">
                {/* Graph Lines */}
                <svg
                  viewBox="0 0 900 280"
                  className="absolute inset-0 h-full w-full"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="lineGradient">
                      <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>

                  <line
                    x1="100"
                    y1="150"
                    x2="300"
                    y2="70"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                  />

                  <line
                    x1="100"
                    y1="150"
                    x2="320"
                    y2="210"
                    stroke="#d6d3d1"
                    strokeWidth="2"
                  />

                  <line
                    x1="300"
                    y1="70"
                    x2="510"
                    y2="135"
                    stroke="#fb923c"
                    strokeWidth="2"
                  />

                  <line
                    x1="320"
                    y1="210"
                    x2="510"
                    y2="135"
                    stroke="#d6d3d1"
                    strokeWidth="2"
                  />

                  <line
                    x1="510"
                    y1="135"
                    x2="740"
                    y2="80"
                    stroke="#ef4444"
                    strokeWidth="2"
                  />

                  <line
                    x1="510"
                    y1="135"
                    x2="760"
                    y2="210"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                </svg>

                {/* Nodes */}
                <GraphNode
                  label="P2P-2"
                  className="left-[9%] top-[55%]"
                  color="orange"
                />

                <GraphNode
                  label="W-184"
                  className="left-[31%] top-[20%]"
                  color="blue"
                />

                <GraphNode
                  label="W-201"
                  className="left-[33%] top-[72%]"
                  color="gray"
                />

                <GraphNode
                  label="Mixer"
                  className="left-[55%] top-[48%]"
                  color="red"
                />

                <GraphNode
                  label="Sink-A"
                  className="left-[81%] top-[25%]"
                  color="orange"
                />

                <GraphNode
                  label="Wallet"
                  className="left-[83%] top-[74%]"
                  color="blue"
                />

                <div className="absolute bottom-3 left-4 rounded-lg border border-stone-200 bg-white/90 px-3 py-2 backdrop-blur">
                  <p className="font-mono text-[10px] text-stone-500">
                    1,284 active edges · 638 wallets monitored
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">

            {/* THREAT LEVEL */}
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
              <div className="border-b border-stone-100 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-stone-800">
                      Threat Level
                    </h2>

                    <p className="mt-1 text-xs text-stone-400">
                      Current network assessment
                    </p>
                  </div>

                  <ShieldAlert className="h-5 w-5 text-red-500" />
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-4xl font-bold text-red-600">HIGH</p>
                    <p className="mt-1 text-xs text-stone-500">
                      Elevated suspicious activity
                    </p>
                  </div>

                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-[6px] border-red-100 border-t-red-500">
                    <span className="text-sm font-bold text-red-600">78</span>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-2 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                    <span>Risk Score</span>
                    <span className="text-red-600">78 / 100</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                    <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* ACTIVITY FEED */}
            <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
              <div className="border-b border-stone-100 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-stone-800">
                      Intelligence Feed
                    </h2>

                    <p className="mt-1 text-xs text-stone-400">
                      Latest automated events
                    </p>
                  </div>

                  <Zap className="h-4 w-4 text-amber-500" />
                </div>
              </div>

              <div className="divide-y divide-stone-100">
                {activityFeed.map((activity, index) => (
                  <div
                    key={index}
                    className="flex gap-3 p-4 transition hover:bg-stone-50"
                  >
                    <div
                      className={`mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full ${
                        activity.type === "danger"
                          ? "bg-red-500"
                          : activity.type === "warning"
                          ? "bg-orange-500"
                          : activity.type === "success"
                          ? "bg-emerald-500"
                          : "bg-blue-500"
                      }`}
                    />

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-stone-800">
                        {activity.title}
                      </p>

                      <p className="mt-1 text-[11px] leading-relaxed text-stone-500">
                        {activity.detail}
                      </p>

                      <div className="mt-2 flex items-center gap-1 text-[10px] text-stone-400">
                        <Clock3 className="h-3 w-3" />
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SYSTEM TELEMETRY */}
            <div className="rounded-2xl border border-stone-200 bg-stone-900 p-5 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-wider">
                    Core Telemetry
                  </p>

                  <p className="mt-1 text-[10px] text-stone-400">
                    Chakravyuh Analysis Engine
                  </p>
                </div>

                <Boxes className="h-5 w-5 text-orange-400" />
              </div>

              <div className="mt-6 space-y-4">
                <TelemetryRow
                  label="Graph Engine"
                  value="ONLINE"
                  percentage={96}
                  color="bg-emerald-400"
                />

                <TelemetryRow
                  label="AI Inference"
                  value="94.6%"
                  percentage={94}
                  color="bg-blue-400"
                />

                <TelemetryRow
                  label="Sentinel Mesh"
                  value="24 / 24"
                  percentage={100}
                  color="bg-orange-400"
                />

                <TelemetryRow
                  label="Threat Pipeline"
                  value="ACTIVE"
                  percentage={78}
                  color="bg-red-400"
                />
              </div>

              <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-4 text-[10px] text-stone-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                ENCLAVE SECURE · ALL SYSTEMS MONITORED
              </div>
            </div>
          </div>
        </div>

        {/* SELECTED TRANSACTION PANEL */}
        {selectedTx && (
          <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-orange-500">
                  Selected Transaction
                </p>

                <h3 className="mt-1 font-mono text-sm font-bold text-stone-900">
                  {selectedTx.txid}
                </h3>

                <p className="mt-1 text-xs text-stone-500">
                  Source {selectedTx.sourceIp} · {selectedTx.cluster} ·{" "}
                  {selectedTx.amount}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <RiskBadge
                  level={selectedTx.level}
                  risk={selectedTx.risk}
                />

                <button
                  onClick={() => setSelectedTx(null)}
                  className="rounded-lg border border-orange-200 bg-white px-4 py-2 text-xs font-semibold text-orange-700 transition hover:bg-orange-100"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* GRAPH NODE */

function GraphNode({
  label,
  className,
  color,
}: {
  label: string;
  className: string;
  color: "orange" | "blue" | "red" | "gray";
}) {
  const colors = {
    orange: "border-orange-300 bg-orange-50 text-orange-700",
    blue: "border-blue-300 bg-blue-50 text-blue-700",
    red: "border-red-300 bg-red-50 text-red-700 animate-pulse",
    gray: "border-stone-300 bg-white text-stone-600",
  };

  return (
    <div
      className={`absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 ${className}`}
    >
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-full border-2 shadow-lg ${colors[color]}`}
      >
        <div className="h-2.5 w-2.5 rounded-full bg-current" />
      </div>

      <span className="hidden rounded-md border border-stone-200 bg-white px-2 py-1 font-mono text-[9px] font-semibold text-stone-600 shadow-sm lg:block">
        {label}
      </span>
    </div>
  );
}

/* TELEMETRY ROW */

function TelemetryRow({
  label,
  value,
  percentage,
  color,
}: {
  label: string;
  value: string;
  percentage: number;
  color: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] text-stone-400">{label}</span>

        <span className="font-mono text-[10px] font-semibold text-white">
          {value}
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}