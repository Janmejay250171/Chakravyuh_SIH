import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  ChevronDown,
  Network,
  ShieldCheck,
  Waypoints,
  Radar,
  Database,
  Cpu,
  Shuffle,
  Microscope,
  FileCheck2,
  Radio,
} from "lucide-react";
import logoImage from "../../assets/logo.png";

/* ------------------------------------------------------------------ */
/* Data: the six defense layers                                      */
/* ------------------------------------------------------------------ */

type LayerParam = { label: string; value: string; live?: boolean };

type Layer = {
  id: number;
  name: string;
  tagline: string;
  icon: React.ElementType;
  accent: string; // tailwind color token used for glow/border
  params: LayerParam[];
};

const LAYERS: Layer[] = [
  {
    id: 1,
    name: "P2P Air-Gapped Sentinels",
    tagline: "Perimeter collection nodes, physically isolated from the open net",
    icon: Radar,
    accent: "terracotta",
    params: [
      { label: "Sentinel nodes online", value: "24", live: true },
      { label: "Egress permitted", value: "0 bytes" },
      { label: "Transport encryption", value: "AES-256-GCM" },
      { label: "Sync interval", value: "180 ms", live: true },
    ],
  },
  {
    id: 2,
    name: "Memgraph In-Memory Graph",
    tagline: "The full transaction universe, held resident for sub-second traversal",
    icon: Database,
    accent: "amber",
    params: [
      { label: "Graph engine", value: "Memgraph 2.x" },
      { label: "Nodes resident", value: "42.1M", live: true },
      { label: "Query p95", value: "38 ms", live: true },
      { label: "Storage mode", value: "RAM-resident" },
    ],
  },
  {
    id: 3,
    name: "GNN v4.2 Heuristics",
    tagline: "A GraphSAGE and attention ensemble scoring wallet-cluster likelihood",
    icon: Cpu,
    accent: "bronze",
    params: [
      { label: "Model", value: "GraphSAGE + GAT ensemble" },
      { label: "Cluster precision", value: "94.6%", live: true },
      { label: "Inference latency", value: "11 ms", live: true },
      { label: "Training set", value: "3.8B labeled edges" },
    ],
  },
  {
    id: 4,
    name: "Recursive Mixer Decoupling",
    tagline: "Peels apart coinjoin rounds until the anonymity set collapses",
    icon: Shuffle,
    accent: "terracotta",
    params: [
      { label: "Protocols covered", value: "Wasabi / Samourai / Whirlpool" },
      { label: "Max hops traced", value: "17", live: true },
      { label: "Rounds decoupled", value: "1,204", live: true },
      { label: "Confidence floor", value: "0.82" },
    ],
  },
  {
    id: 5,
    name: "SHAP / LIME Explainability",
    tagline: "Every model verdict is decomposed back into human-readable reasons",
    icon: Microscope,
    accent: "sage",
    params: [
      { label: "SHAP values / sec", value: "6,300", live: true },
      { label: "LIME sample width", value: "5,000 perturbations" },
      { label: "Feature attribution", value: "Per-hop, signed" },
      { label: "Audit coverage", value: "100% of verdicts" },
    ],
  },
  {
    id: 6,
    name: "Judicial Dossier Export",
    tagline: "Findings leave the enclave only as sealed, chain-of-custody evidence",
    icon: FileCheck2,
    accent: "amber",
    params: [
      { label: "Export format", value: "PDF/A + hash manifest" },
      { label: "Admissibility standard", value: "IEA Sec. 65B" },
      { label: "Custody hash", value: "SHA-256 sealed", live: true },
      { label: "Avg. export time", value: "4.1 s", live: true },
    ],
  },
];

const ACCENT_MAP: Record<
  string,
  { border: string; text: string; bg: string; glow: string; dot: string }
> = {
  terracotta: {
    border: "border-orange-300",
    text: "text-orange-800",
    bg: "bg-orange-50",
    glow: "shadow-[0_0_40px_-12px_rgba(194,101,31,0.55)]",
    dot: "bg-orange-500",
  },
  amber: {
    border: "border-amber-300",
    text: "text-amber-800",
    bg: "bg-amber-50",
    glow: "shadow-[0_0_40px_-12px_rgba(180,83,9,0.55)]",
    dot: "bg-amber-600",
  },
  bronze: {
    border: "border-yellow-700/30",
    text: "text-yellow-900",
    bg: "bg-yellow-50",
    glow: "shadow-[0_0_40px_-12px_rgba(133,77,14,0.5)]",
    dot: "bg-yellow-700",
  },
  sage: {
    border: "border-emerald-300",
    text: "text-emerald-800",
    bg: "bg-emerald-50",
    glow: "shadow-[0_0_40px_-12px_rgba(52,110,88,0.45)]",
    dot: "bg-emerald-600",
  },
};

/* ------------------------------------------------------------------ */
/* Small reusable hook: 3D tilt that follows the cursor                */
/* ------------------------------------------------------------------ */

function useTilt(maxDeg = 6) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const onMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setStyle({
      transform: `perspective(900px) rotateX(${(-py * maxDeg).toFixed(
        2
      )}deg) rotateY(${(px * maxDeg).toFixed(2)}deg) translateZ(0)`,
      transition: "transform 60ms linear",
    });
  };

  const onMouseLeave = () => {
    setStyle({
      transform: "perspective(900px) rotateX(0deg) rotateY(0deg)",
      transition: "transform 400ms cubic-bezier(0.22, 1, 0.36, 1)",
    });
  };

  return { ref, style, onMouseMove, onMouseLeave };
}

/* ------------------------------------------------------------------ */
/* Small reusable hook: reveal-on-scroll for whole sections             */
/* ------------------------------------------------------------------ */

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

/* ------------------------------------------------------------------ */
/* Signature motif: the recurring trace-graph watermark                */
/* ------------------------------------------------------------------ */

const TraceGraphMotif: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    viewBox="0 0 400 200"
    className={className}
    aria-hidden="true"
    preserveAspectRatio="xMidYMid slice"
  >
    <g fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M20 100 L110 50 L200 100 L290 50 L380 100" strokeDasharray="4 6">
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="-40"
          dur="6s"
          repeatCount="indefinite"
        />
      </path>
      <path d="M20 100 L110 150 L200 100 L290 150 L380 100" strokeDasharray="4 6">
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="40"
          dur="7s"
          repeatCount="indefinite"
        />
      </path>
    </g>
    <g fill="currentColor">
      <circle cx="20" cy="100" r="3" />
      <circle cx="110" cy="50" r="2.5" />
      <circle cx="110" cy="150" r="2.5" />
      <circle cx="200" cy="100" r="3" />
      <circle cx="290" cy="50" r="2.5" />
      <circle cx="290" cy="150" r="2.5" />
      <circle cx="380" cy="100" r="3" />
    </g>
  </svg>
);

/* ------------------------------------------------------------------ */
/* Main component                                                    */
/* ------------------------------------------------------------------ */

export const LandingView: React.FC = () => {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState("");
  const [activeLayer, setActiveLayer] = useState<Layer>(LAYERS[1]);
  const [tick, setTick] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const consoleLog =
    "$ chakravyuh --init\n> secure enclave ....... established\n> graph neural net v4.2 ... loaded\n> p2p sentinel mesh ...... online";

  const heroTilt = useTilt(5);
  const architectureReveal = useReveal<HTMLDivElement>();
  const missionReveal = useReveal<HTMLDivElement>();
  const ctaReveal = useReveal<HTMLDivElement>();

  // Typewriter effect for the console panel
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < consoleLog.length) {
        setTypedText((prev) => prev + consoleLog.charAt(index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 22);
    return () => clearInterval(timer);
  }, []);

  // "Live" telemetry heartbeat driving the flickering param values
  useEffect(() => {
    const heartbeat = setInterval(() => setTick((t) => t + 1), 1400);
    return () => clearInterval(heartbeat);
  }, []);

  // Slim scroll-progress indicator, ties the page together as you move down it
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      setScrollProgress(Math.min(1, Math.max(0, scrolled)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToArchitecture = () => {
    document.getElementById("architecture")?.scrollIntoView({ behavior: "smooth" });
  };

  // Deterministic small jitter for "live" numeric params, without a full re-render storm
  const jitteredParams = useMemo(() => {
    return activeLayer.params.map((p) => {
      if (!p.live) return p;
      const numeric = parseFloat(p.value);
      if (Number.isNaN(numeric)) return p;
      const wobble = ((tick * (activeLayer.id + 1)) % 7) - 3;
      const next = Math.max(0, numeric + wobble * (numeric > 100 ? 37 : numeric > 10 ? 0.6 : 0.02));
      const decimals = p.value.includes(".") ? 1 : 0;
      const suffix = p.value.replace(/^[\d.,]+/, "");
      return { ...p, value: `${next.toFixed(decimals)}${suffix}` };
    });
  }, [tick, activeLayer]);

  const accent = ACCENT_MAP[activeLayer.accent];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans antialiased selection:bg-amber-200 selection:text-stone-900 overflow-x-hidden">
      <style>{`
        @keyframes drift {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(3%, -4%) scale(1.06); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes drift-slow {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(-4%, 3%) scale(1.04); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(180, 83, 9, 0.35), 0 8px 24px -8px rgba(180,83,9,0.45); }
          50%      { box-shadow: 0 0 0 10px rgba(180, 83, 9, 0), 0 8px 28px -6px rgba(180,83,9,0.55); }
        }
        @keyframes rise-fade {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.25; }
        }
        .anim-drift { animation: drift 16s ease-in-out infinite; }
        .anim-drift-slow { animation: drift-slow 22s ease-in-out infinite; }
        .anim-cta-glow { animation: pulse-glow 2.6s ease-in-out infinite; }
        .anim-reveal { animation: rise-fade 700ms cubic-bezier(0.22, 1, 0.36, 1) both; }
        .anim-blink { animation: blink 1.6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .anim-drift, .anim-drift-slow, .anim-cta-glow, .anim-reveal, .anim-blink {
            animation: none !important;
          }
        }
      `}</style>

      {/* Scroll progress rail — a thin trace line that fills as the case unfolds */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-50 bg-stone-200/60">
        <div
          className="h-full bg-gradient-to-r from-orange-500 via-amber-600 to-emerald-600"
          style={{ width: `${scrollProgress * 100}%`, transition: "width 80ms linear" }}
        />
      </div>

      {/* Top bar */}
      <header className="border-b border-stone-200 bg-stone-50/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="Chakravyuh logo" className="w-14 h-14 object-contain rounded-xl" />
            <span className="font-semibold tracking-tight text-stone-900">Chakravyuh</span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs text-stone-500">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 anim-blink" />
            </span>
            Built for Smart India Hackathon 2026, with NTRO
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32 grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] gap-16 items-center">
        {/* Ambient warm gradient wash, unique to the hero */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -left-20 w-[26rem] h-[26rem] rounded-full bg-orange-300/25 blur-3xl anim-drift"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-10 right-0 w-[22rem] h-[22rem] rounded-full bg-emerald-200/25 blur-3xl anim-drift-slow"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/3 w-[18rem] h-[18rem] rounded-full bg-amber-300/20 blur-3xl anim-drift"
        />

        <div className="relative space-y-7">
          <h1 className="text-4xl md:text-[3.25rem] leading-[1.08] font-semibold tracking-tight text-stone-900">
            See through recursive coinjoin mixers, in real time.
          </h1>
          <p className="text-base md:text-lg text-stone-600 max-w-lg leading-relaxed">
            Chakravyuh is a forensic command center for tracing obfuscated
            cryptocurrency flows across decentralized mixing networks —
            built to give NTRO investigators a clear line from wallet to
            wallet, even after a dozen hops.
          </p>
          <div className="flex flex-wrap items-center gap-5 pt-2">
            <button
              onClick={() => navigate("/overview")}
              className="anim-cta-glow inline-flex items-center gap-2 px-6 py-3.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-medium text-sm transition-colors"
            >
              Launch command center
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={scrollToArchitecture}
              className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 transition-colors"
            >
              See the six layers
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Floating console panel with cursor-following tilt */}
        <div className="relative h-full min-h-[260px] flex items-center justify-center [perspective:1000px]">
          <div className="absolute w-full max-w-sm h-full max-h-[230px] bg-gradient-to-br from-amber-100/70 to-orange-100/50 border border-amber-200 rounded-2xl rotate-[4deg] translate-x-3 translate-y-3" />
          <div
            ref={heroTilt.ref}
            onMouseMove={heroTilt.onMouseMove}
            onMouseLeave={heroTilt.onMouseLeave}
            style={heroTilt.style}
            className="relative w-full max-w-sm bg-white/80 backdrop-blur-md border border-stone-200/80 rounded-2xl shadow-xl p-5"
          >
            <div className="flex items-center gap-1.5 pb-3 mb-3 border-b border-stone-100">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-200" />
              <span className="w-2.5 h-2.5 rounded-full bg-stone-200" />
              <span className="w-2.5 h-2.5 rounded-full bg-stone-200" />
              <span className="ml-auto text-[11px] text-stone-400">trace-console</span>
            </div>
            <pre className="font-mono text-[11px] leading-relaxed text-stone-600 whitespace-pre-wrap min-h-[80px]">
              {typedText}
              <span className="inline-block w-1.5 h-3 bg-amber-700 align-middle animate-pulse ml-0.5" />
            </pre>
            <div className="mt-4 pt-4 border-t border-stone-100">
              <svg viewBox="0 0 220 70" className="w-full h-16">
                <line x1="16" y1="35" x2="80" y2="16" stroke="#e7e5e4" strokeWidth="1.5" />
                <line x1="16" y1="35" x2="80" y2="54" stroke="#e7e5e4" strokeWidth="1.5" />
                <line x1="80" y1="16" x2="150" y2="35" stroke="#e7e5e4" strokeWidth="1.5" />
                <line x1="80" y1="54" x2="150" y2="35" stroke="#e7e5e4" strokeWidth="1.5" />
                <line x1="150" y1="35" x2="205" y2="35" stroke="#b45309" strokeWidth="1.5">
                  <animate attributeName="stroke-dasharray" values="0,60;60,0" dur="1.8s" repeatCount="indefinite" />
                </line>
                <circle cx="16" cy="35" r="5" fill="#78350f" />
                <circle cx="80" cy="16" r="4" fill="#d6d3d1" />
                <circle cx="80" cy="54" r="4" fill="#d6d3d1" />
                <circle cx="150" cy="35" r="4" fill="#d6d3d1" />
                <circle cx="205" cy="35" r="5" fill="#b45309" />
              </svg>
              <p className="text-[11px] text-stone-400 mt-1">Live trace preview, wallet A to wallet B</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive 6-layer architecture */}
      <section
        id="architecture"
        ref={architectureReveal.ref}
        className="relative border-t border-stone-200 bg-stone-100/60"
      >
        <TraceGraphMotif className="pointer-events-none absolute inset-x-0 top-0 h-40 w-full text-stone-300/70" />
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28 space-y-12">
          <div
            className={`max-w-2xl space-y-4 ${architectureReveal.visible ? "anim-reveal" : "opacity-0"}`}
          >
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-stone-900">
              Six layers, one continuous chain of custody
            </h2>
            <p className="text-stone-600 leading-relaxed">
              Every trace moves through the same defense stack — from raw
              packet collection to a dossier a court can accept. Select a
              layer to inspect its live parameters.
            </p>
          </div>

          <div
            className={`grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6 ${
              architectureReveal.visible ? "anim-reveal" : "opacity-0"
            }`}
            style={{ animationDelay: "120ms" }}
          >
            {/* Layer stack selector */}
            <div className="space-y-2">
              {LAYERS.map((layer) => {
                const isActive = layer.id === activeLayer.id;
                const layerAccent = ACCENT_MAP[layer.accent];
                const Icon = layer.icon;
                return (
                  <button
                    key={layer.id}
                    onClick={() => setActiveLayer(layer)}
                    onMouseEnter={() => setActiveLayer(layer)}
                    className={`w-full text-left flex items-center gap-4 rounded-xl border px-4 py-3.5 transition-all duration-200 backdrop-blur-md ${
                      isActive
                        ? `bg-white/80 ${layerAccent.border} ${layerAccent.glow}`
                        : "bg-white/40 border-stone-200/70 hover:bg-white/70"
                    }`}
                  >
                    <span
                      className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-mono border ${
                        isActive
                          ? `${layerAccent.bg} ${layerAccent.text} ${layerAccent.border}`
                          : "bg-stone-50 text-stone-400 border-stone-200"
                      }`}
                    >
                      L{layer.id}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="flex items-center gap-2">
                        <Icon
                          className={`w-4 h-4 flex-shrink-0 ${
                            isActive ? layerAccent.text : "text-stone-400"
                          }`}
                        />
                        <span
                          className={`text-sm font-medium truncate ${
                            isActive ? "text-stone-900" : "text-stone-600"
                          }`}
                        >
                          {layer.name}
                        </span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Live detail panel */}
            <div
              className={`relative rounded-2xl border ${accent.border} bg-white/80 backdrop-blur-md p-7 ${accent.glow} transition-shadow duration-300`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-mono ${accent.text}`}>
                    <Radio className="w-3 h-3" />
                    LAYER {activeLayer.id} — LIVE TELEMETRY
                  </span>
                  <h3 className="text-xl font-semibold text-stone-900">{activeLayer.name}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed max-w-md">{activeLayer.tagline}</p>
                </div>
                <span className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${accent.bg} ${accent.text}`}>
                  <activeLayer.icon className="w-5 h-5" />
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                {jitteredParams.map((param) => (
                  <div
                    key={param.label}
                    className="rounded-xl border border-stone-200/70 bg-stone-50/70 px-4 py-3"
                  >
                    <p className="text-[11px] text-stone-400 mb-1">{param.label}</p>
                    <p className="text-sm font-mono text-stone-800 flex items-center gap-1.5">
                      {param.value}
                      {param.live && (
                        <span className={`inline-block w-1.5 h-1.5 rounded-full ${accent.dot} anim-blink`} />
                      )}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                <span>Layer {activeLayer.id} of 6</span>
                <div className="flex gap-1">
                  {LAYERS.map((l) => (
                    <span
                      key={l.id}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        l.id === activeLayer.id ? `w-6 ${accent.dot}` : "w-2 bg-stone-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission section */}
      <section
        id="mission"
        ref={missionReveal.ref}
        className="max-w-6xl mx-auto px-6 py-20 md:py-28 space-y-14"
      >
        <div className={`max-w-2xl space-y-4 ${missionReveal.visible ? "anim-reveal" : "opacity-0"}`}>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-stone-900">
            How Chakravyuh sees through the noise
          </h2>
          <p className="text-stone-600 leading-relaxed">
            Designed for National Technical Research Organisation operations,
            the platform is built to dismantle sophisticated financial
            cybercrime syndicates without slowing down the investigators who
            rely on it.
          </p>
        </div>

        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${missionReveal.visible ? "anim-reveal" : "opacity-0"}`}
          style={{ animationDelay: "120ms" }}
        >
          <MissionCard
            icon={Waypoints}
            title="Recursive coinjoin tracing"
            description="Wasabi- and Samourai-style mixing protocols get pulled apart by heuristic clustering, restoring broken anonymity sets one hop at a time."
          />
          <MissionCard
            icon={Network}
            title="Graph neural network v4.2"
            description="Multi-hop transaction tracing runs live on an in-memory Memgraph database, extracting sub-graph patterns in milliseconds instead of hours."
            highlighted
          />
          <MissionCard
            icon={ShieldCheck}
            title="Air-gapped enclave"
            description="Zero-egress firewall rules and SHAP/LIME explainability keep every finding auditable and admissible, with nothing leaving the enclave."
          />
        </div>
      </section>

      {/* Closing CTA */}
      <section
        ref={ctaReveal.ref}
        className="relative border-t border-stone-200 bg-gradient-to-b from-stone-50 via-amber-50 to-orange-50 overflow-hidden"
      >
        <TraceGraphMotif className="pointer-events-none absolute inset-0 h-full w-full text-orange-300/30 anim-drift-slow" />
        <div
          className={`relative max-w-6xl mx-auto px-6 py-20 text-center space-y-6 ${
            ctaReveal.visible ? "anim-reveal" : "opacity-0"
          }`}
        >
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-stone-900">
            Ready to see it trace a live case?
          </h2>
          <button
            onClick={() => navigate("/overview")}
            className="anim-cta-glow inline-flex items-center gap-2 px-7 py-3.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-medium text-sm transition-colors"
          >
            Launch interactive prototype
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Mission card, with its own subtle cursor tilt                     */
/* ------------------------------------------------------------------ */

const MissionCard: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
  highlighted?: boolean;
}> = ({ icon: Icon, title, description, highlighted }) => {
  const tilt = useTilt(4);
  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      style={tilt.style}
      className={`[transform-style:preserve-3d] bg-white/80 backdrop-blur-md rounded-2xl p-7 space-y-4 transition-shadow duration-300 ${
        highlighted
          ? "border border-amber-300/80 shadow-lg md:-translate-y-2"
          : "border border-stone-200/80 shadow-sm hover:shadow-md"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          highlighted ? "bg-amber-100 text-amber-800" : "bg-stone-100 text-stone-600"
        }`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-medium text-stone-900">{title}</h3>
      <p className="text-sm text-stone-500 leading-relaxed">{description}</p>
    </div>
  );
};