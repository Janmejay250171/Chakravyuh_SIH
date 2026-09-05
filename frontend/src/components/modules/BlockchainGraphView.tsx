import React, { useMemo, useState } from 'react';
import {
  Share2,
  RefreshCw,
  Layers,
  Globe,
  GitMerge,
  Network,
  CircleDot,
  Activity,
  Maximize2,
  Minimize2,
  Database,
  ArrowRight,
  Terminal,
  Radio,
  RotateCcw,
  Eye,
  MapPin,
  X,
} from 'lucide-react';

import mockData from './mockTransactions.json';

/* =========================================================
   TYPES
========================================================= */

type GraphTab =
  | 'topology'
  | 'entropy'
  | 'heatmap'
  | 'sankey';

type NodeColor =
  | 'rose'
  | 'amber'
  | 'emerald';

type GraphNode = {
  id: string;
  label: string;
  subLabel: string;
  color: NodeColor;
  x: number;
  y: number;
  txIndex: number;
  isolated: boolean;
  type: 'core' | 'node';
};

type DensityData = {
  label: string;
  description: string;
  value: number;
  color: NodeColor;
};

type GeoData = {
  country: string;
  asn: string;
  transactions: number;
  risk: string;
  tone: NodeColor;
};

type FundFlowData = {
  sourceValue: string;
  mixerValue: string;
  exitValue: string;
  sourceHops: string;
  mixerPools: string;
  exitRoutes: string;
};

/* =========================================================
   SAFE GRAPH LAYOUTS

   IMPORTANT:
   These layouts are predefined intentionally.

   We DO NOT use random positions because random positions
   were causing node overlap.
========================================================= */

const GRAPH_LAYOUTS = [
  {
    core: { x: 50, y: 50 },

    escrow: { x: 16, y: 20 },

    mixer: { x: 84, y: 20 },

    tor: { x: 16, y: 80 },

    exchange: { x: 84, y: 80 },
  },

  {
    core: { x: 50, y: 50 },

    escrow: { x: 14, y: 28 },

    mixer: { x: 86, y: 28 },

    tor: { x: 28, y: 84 },

    exchange: { x: 72, y: 84 },
  },

  {
    core: { x: 50, y: 50 },

    escrow: { x: 22, y: 16 },

    mixer: { x: 78, y: 16 },

    tor: { x: 10, y: 72 },

    exchange: { x: 90, y: 72 },
  },
];

/* =========================================================
   INITIAL GRAPH NODES
========================================================= */

const createInitialNodes = (): GraphNode[] => [
  {
    id: 'core',
    label: 'Core Cluster',
    subLabel: 'Transaction Network',
    color: 'amber',
    x: 50,
    y: 50,
    txIndex: 0,
    isolated: false,
    type: 'core',
  },

  {
    id: 'escrow',
    label: 'Escrow Cluster',
    subLabel: 'High Risk',
    color: 'rose',
    x: 16,
    y: 20,
    txIndex: 10,
    isolated: false,
    type: 'node',
  },

  {
    id: 'mixer',
    label: 'Mixer Node',
    subLabel: 'Wasabi Relay',
    color: 'amber',
    x: 84,
    y: 20,
    txIndex: 25,
    isolated: false,
    type: 'node',
  },

  {
    id: 'tor',
    label: 'Tor Relay',
    subLabel: 'Peer #04',
    color: 'amber',
    x: 16,
    y: 80,
    txIndex: 40,
    isolated: false,
    type: 'node',
  },

  {
    id: 'exchange',
    label: 'Exchange Exit',
    subLabel: 'Destination',
    color: 'emerald',
    x: 84,
    y: 80,
    txIndex: 50,
    isolated: false,
    type: 'node',
  },
];

/* =========================================================
   INITIAL ANALYSIS DATA
========================================================= */

const createInitialDensity = (): DensityData[] => [
  {
    label: 'Cluster #772',
    description: 'Equal-output transaction chunking',
    value: 94.2,
    color: 'rose',
  },

  {
    label: 'Wasabi Relay Network',
    description: 'Recursive mixing activity',
    value: 81.5,
    color: 'amber',
  },

  {
    label: 'Gateway Alpha',
    description: 'Low-density transaction routing',
    value: 42.1,
    color: 'emerald',
  },
];

const createInitialGeo = (): GeoData[] => [
  {
    country: 'RU',
    asn: 'AS48852',
    transactions: 457,
    risk: 'Critical',
    tone: 'rose',
  },

  {
    country: 'SG',
    asn: 'AS45102',
    transactions: 312,
    risk: 'High',
    tone: 'amber',
  },

  {
    country: 'IN',
    asn: 'AS9498',
    transactions: 231,
    risk: 'Monitored',
    tone: 'emerald',
  },
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

export const BlockchainGraphView: React.FC = () => {
  /* =======================================================
     STATE
  ======================================================= */

  const [activeGraphTab, setActiveGraphTab] =
    useState<GraphTab>('topology');

  const [selectedNode, setSelectedNode] =
    useState<any>(mockData[0]);

  const [graphNodes, setGraphNodes] =
    useState<GraphNode[]>(
      createInitialNodes()
    );

  const [densityData, setDensityData] =
    useState<DensityData[]>(
      createInitialDensity()
    );

  const [geoData, setGeoData] =
    useState<GeoData[]>(
      createInitialGeo()
    );

  const [fundFlow, setFundFlow] =
    useState<FundFlowData>({
      sourceValue: '45.0 BTC',
      mixerValue: '12 Active',
      exitValue: 'Exchange',
      sourceHops: '18',
      mixerPools: '12',
      exitRoutes: '27',
    });

  const [isProcessing, setIsProcessing] =
    useState(false);

  const [isIsolating, setIsIsolating] =
    useState(false);

  const [isIsolated, setIsIsolated] =
    useState(false);

  const [isFullscreen, setIsFullscreen] =
    useState(false);

  const [graphVersion, setGraphVersion] =
    useState(1);

  const [analysisVersion, setAnalysisVersion] =
    useState(1);

  const [layoutIndex, setLayoutIndex] =
    useState(0);

  const [lastUpdated, setLastUpdated] =
    useState(
      new Date().toLocaleTimeString()
    );

  const [statusMessage, setStatusMessage] =
    useState(
      'Graph intelligence ready'
    );

  /* =======================================================
     GRAPH STATISTICS
  ======================================================= */

  const graphStats = useMemo(() => {
    const critical = mockData.filter(
      (tx: any) =>
        tx.riskLevel === 'CRITICAL'
    ).length;

    const highRisk = mockData.filter(
      (tx: any) =>
        tx.riskLevel === 'CRITICAL' ||
        tx.riskLevel === 'HIGH'
    ).length;

    return {
      totalNodes: mockData.length,
      critical,
      highRisk,
    };
  }, []);

  /* =======================================================
     TABS
  ======================================================= */

  const tabs: {
    id: GraphTab;
    label: string;
    icon: React.ElementType;
  }[] = [
    {
      id: 'topology',
      label: 'P2P Topology',
      icon: Network,
    },

    {
      id: 'entropy',
      label: 'Mixing Density',
      icon: GitMerge,
    },

    {
      id: 'heatmap',
      label: 'Geo-ASN Risk',
      icon: Globe,
    },

    {
      id: 'sankey',
      label: 'Fund Flow',
      icon: Layers,
    },
  ];

  /* =======================================================
     CONTEXTUAL ACTION CONFIG
  ======================================================= */

  const actionConfig = {
    topology: {
      idleLabel: 'Resync Graph',
      loadingLabel: 'Synchronizing...',
      icon: RefreshCw,
      description:
        'Reload transaction topology and rebuild active node relationships.',
    },

    entropy: {
      idleLabel: 'Recalculate Density',
      loadingLabel: 'Calculating...',
      icon: Activity,
      description:
        'Recalculate transaction mixing density and entropy scores.',
    },

    heatmap: {
      idleLabel: 'Refresh Geo Risk',
      loadingLabel: 'Updating...',
      icon: Globe,
      description:
        'Refresh geographic routing intelligence and ASN risk scores.',
    },

    sankey: {
      idleLabel: 'Rebuild Fund Flow',
      loadingLabel: 'Tracing Flow...',
      icon: GitMerge,
      description:
        'Reconstruct multi-hop fund movement across mixer clusters.',
    },
  };

  const currentAction =
    actionConfig[activeGraphTab];

  const ActionIcon =
    currentAction.icon;

  /* =======================================================
     TAB CHANGE
  ======================================================= */

  const handleTabChange = (
    tab: GraphTab
  ) => {
    setActiveGraphTab(tab);

    const tabLabel =
      tabs.find(
        (item) =>
          item.id === tab
      )?.label;

    setStatusMessage(
      `${tabLabel} intelligence view active`
    );
  };

  /* =======================================================
     UPDATE TIME
  ======================================================= */

  const updateTimestamp = () => {
    setLastUpdated(
      new Date().toLocaleTimeString()
    );
  };

  /* =======================================================
     MAIN CONTEXTUAL ACTION
  ======================================================= */

  const handleGraphAction = () => {
    if (isProcessing) {
      return;
    }

    setIsProcessing(true);

    setStatusMessage(
      currentAction.loadingLabel
    );

    /* =====================================================
       TOPOLOGY RESYNC
    ===================================================== */

    if (
      activeGraphTab ===
      'topology'
    ) {
      setTimeout(() => {
        const nextLayoutIndex =
          (layoutIndex + 1) %
          GRAPH_LAYOUTS.length;

        const nextLayout =
          GRAPH_LAYOUTS[
            nextLayoutIndex
          ];

        setGraphNodes(
          (previousNodes) =>
            previousNodes.map(
              (node) => {
                const position =
                  nextLayout[
                    node.id as keyof typeof nextLayout
                  ];

                return {
                  ...node,
                  x: position.x,
                  y: position.y,
                  isolated: false,
                };
              }
            )
        );

        setLayoutIndex(
          nextLayoutIndex
        );

        setIsIsolated(false);

        const randomTransaction =
          mockData[
            Math.floor(
              Math.random() *
                mockData.length
            )
          ];

        setSelectedNode(
          randomTransaction
        );

        setGraphVersion(
          (previous) =>
            previous + 1
        );

        updateTimestamp();

        setStatusMessage(
          'Graph topology synchronized successfully'
        );

        setIsProcessing(false);
      }, 900);
    }

    /* =====================================================
       MIXING DENSITY
    ===================================================== */

    if (
      activeGraphTab ===
      'entropy'
    ) {
      setTimeout(() => {
        setDensityData(
          (previousData) =>
            previousData.map(
              (item) => {
                const variation =
                  Math.random() *
                    12 -
                  6;

                const nextValue =
                  Math.max(
                    10,
                    Math.min(
                      99,
                      item.value +
                        variation
                    )
                  );

                return {
                  ...item,
                  value: Number(
                    nextValue.toFixed(
                      1
                    )
                  ),
                };
              }
            )
        );

        setAnalysisVersion(
          (previous) =>
            previous + 1
        );

        updateTimestamp();

        setStatusMessage(
          'Mixing density recalculated successfully'
        );

        setIsProcessing(false);
      }, 1000);
    }

    /* =====================================================
       GEO RISK
    ===================================================== */

    if (
      activeGraphTab ===
      'heatmap'
    ) {
      setTimeout(() => {
        setGeoData(
          (previousData) =>
            previousData.map(
              (item) => {
                const variation =
                  Math.floor(
                    Math.random() *
                      100 -
                      35
                  );

                return {
                  ...item,
                  transactions:
                    Math.max(
                      20,
                      item.transactions +
                        variation
                    ),
                };
              }
            )
        );

        setAnalysisVersion(
          (previous) =>
            previous + 1
        );

        updateTimestamp();

        setStatusMessage(
          'Geo-ASN risk intelligence refreshed'
        );

        setIsProcessing(false);
      }, 1000);
    }

    /* =====================================================
       FUND FLOW
    ===================================================== */

    if (
      activeGraphTab ===
      'sankey'
    ) {
      setTimeout(() => {
        const hops =
          Math.floor(
            Math.random() *
              10
          ) + 16;

        const pools =
          Math.floor(
            Math.random() *
              8
          ) + 9;

        const routes =
          Math.floor(
            Math.random() *
              18
          ) + 22;

        const btc =
          (
            Math.random() *
              30 +
            35
          ).toFixed(1);

        setFundFlow({
          sourceValue:
            `${btc} BTC`,

          mixerValue:
            `${pools} Active`,

          exitValue:
            Math.random() >
            0.5
              ? 'Exchange Cluster'
              : 'Cold Wallet Network',

          sourceHops:
            String(hops),

          mixerPools:
            String(pools),

          exitRoutes:
            String(routes),
        });

        setGraphVersion(
          (previous) =>
            previous + 1
        );

        updateTimestamp();

        setStatusMessage(
          'Multi-hop fund flow reconstructed successfully'
        );

        setIsProcessing(false);
      }, 1100);
    }
  };

  /* =======================================================
     NODE SELECTION
  ======================================================= */

  const handleNodeSelect = (
    node: GraphNode
  ) => {
    const transaction =
      mockData[
        Math.min(
          node.txIndex,
          mockData.length - 1
        )
      ];

    setSelectedNode(
      transaction
    );

    setStatusMessage(
      `${node.label} selected for investigation`
    );
  };

  /* =======================================================
     ISOLATE CLUSTER

     CORE NODE REMAINS ACTIVE.

     ALL OTHER NODES:
     - become disconnected
     - move to outer positions
     - become visually muted
     - connection lines disappear
  ======================================================= */

  const handleIsolateCluster = () => {
    if (
      isIsolating ||
      isIsolated
    ) {
      return;
    }

    setIsIsolating(true);

    setStatusMessage(
      'Analyzing selected graph relationships...'
    );

    setTimeout(() => {
      setStatusMessage(
        'Disconnecting non-core relationships...'
      );
    }, 300);

    setTimeout(() => {
      setGraphNodes(
        (previousNodes) =>
          previousNodes.map(
            (node) => {
              if (
                node.id ===
                'core'
              ) {
                return {
                  ...node,
                  x: 50,
                  y: 50,
                  isolated: false,
                };
              }

              /* ------------------------------------------
                 ISOLATED NODE POSITIONS

                 Spread nodes around canvas edges.
                 This prevents overlap.
              ------------------------------------------ */

              const isolatedPositions:
                Record<
                  string,
                  {
                    x: number;
                    y: number;
                  }
                > = {
                escrow: {
                  x: 12,
                  y: 16,
                },

                mixer: {
                  x: 88,
                  y: 16,
                },

                tor: {
                  x: 12,
                  y: 84,
                },

                exchange: {
                  x: 88,
                  y: 84,
                },
              };

              const position =
                isolatedPositions[
                  node.id
                ];

              return {
                ...node,
                x: position.x,
                y: position.y,
                isolated: true,
              };
            }
          )
      );

      setIsIsolated(true);

      setSelectedNode(
        mockData[0]
      );

      setGraphVersion(
        (previous) =>
          previous + 1
      );

      updateTimestamp();

      setIsolating(false);

      setStatusMessage(
        'Sub-graph isolated successfully. Non-core nodes are disconnected from the active investigation graph.'
      );
    }, 900);
  };

  /* =======================================================
     RESTORE FULL GRAPH
  ======================================================= */

  const handleRestoreGraph = () => {
    const currentLayout =
      GRAPH_LAYOUTS[
        layoutIndex
      ];

    setGraphNodes(
      (previousNodes) =>
        previousNodes.map(
          (node) => {
            const position =
              currentLayout[
                node.id as keyof typeof currentLayout
              ];

            return {
              ...node,
              x: position.x,
              y: position.y,
              isolated: false,
            };
          }
        )
    );

    setIsIsolated(false);

    setGraphVersion(
      (previous) =>
        previous + 1
    );

    updateTimestamp();

    setStatusMessage(
      'Full transaction graph restored successfully.'
    );
  };

  /* =======================================================
     GRAPH TITLE
  ======================================================= */

  const graphTitle =
    activeGraphTab ===
    'topology'
      ? 'P2P Transaction Topology'
      : activeGraphTab ===
        'entropy'
      ? 'UTXO Mixing Density Analysis'
      : activeGraphTab ===
        'heatmap'
      ? 'Cross-Border Geo-ASN Risk'
      : 'Multi-Hop Fund Flow';

  /* =======================================================
     FIND CORE NODE
  ======================================================= */

  const coreNode =
    graphNodes.find(
      (node) =>
        node.id === 'core'
    );

  /* =======================================================
     GET NODE BY ID
  ======================================================= */

  const getNode = (
    id: string
  ) =>
    graphNodes.find(
      (node) =>
        node.id === id
    );

  /* =======================================================
     GRAPH CANVAS COMPONENT

     Used in:
     - Normal Mode
     - Fullscreen Mode

     Same graph logic in both modes.
  ======================================================= */

  const GraphCanvas = ({
    fullscreen = false,
  }: {
    fullscreen?: boolean;
  }) => {
    return (
      <div
        className={`
          relative
          overflow-hidden
          bg-stone-50
          transition-all
          duration-300

          ${
            fullscreen
              ? 'h-full w-full rounded-none border-0'
              : 'min-h-[420px] rounded-2xl border'
          }

          ${
            isIsolated
              ? 'border-rose-300'
              : 'border-stone-200'
          }
        `}
      >
        {/* =============================================
            BACKGROUND GRID
        ============================================= */}

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(#d6d3d1_1px,transparent_1px)]
            [background-size:22px_22px]
            opacity-60
          "
        />

        {/* =============================================
            GRAPH AREA LABEL
        ============================================= */}

        <div
          className="
            absolute
            top-4
            left-4
            z-20
            flex
            items-center
            gap-2
          "
        >
          <div
            className="
              px-3
              py-1.5
              rounded-lg
              bg-white/90
              backdrop-blur
              border
              border-stone-200
              text-[10px]
              font-mono
              text-stone-500
              shadow-sm
            "
          >
            {isIsolated
              ? 'ISOLATED VIEW'
              : 'ACTIVE TOPOLOGY'}
          </div>
        </div>

        {/* =============================================
            CONNECTION SVG

            IMPORTANT:
            Lines are only rendered when graph
            is NOT isolated.

            During isolation, non-core nodes
            become disconnected.
        ============================================= */}

        <svg
          className="
            absolute
            inset-0
            w-full
            h-full
            pointer-events-none
          "
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* ------------------------------------------
              NORMAL GRAPH CONNECTIONS
          ------------------------------------------ */}

          {!isIsolated &&
            graphNodes
              .filter(
                (node) =>
                  node.id !==
                  'core'
              )
              .map(
                (node) => (
                  <line
                    key={
                      `connection-${node.id}`
                    }
                    x1={
                      node.x
                    }
                    y1={
                      node.y
                    }
                    x2={
                      coreNode?.x ??
                      50
                    }
                    y2={
                      coreNode?.y ??
                      50
                    }
                    stroke="#d6d3d1"
                    strokeWidth="0.5"
                    vectorEffect="non-scaling-stroke"
                  />
                )
              )}

          {/* ------------------------------------------
              ISOLATION BOUNDARY
          ------------------------------------------ */}

          {isIsolated && (
            <>
              <circle
                cx="50"
                cy="50"
                r="18"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="0.45"
                strokeDasharray="2 2"
                opacity="0.7"
              />

              <circle
                cx="50"
                cy="50"
                r="28"
                fill="none"
                stroke="#fecdd3"
                strokeWidth="0.35"
                strokeDasharray="1.5 2"
              />
            </>
          )}

          {/* ------------------------------------------
              INTELLIGENCE PATH
          ------------------------------------------ */}

          {!isIsolated && (
            <line
              x1="50"
              y1="5"
              x2="50"
              y2="42"
              stroke="#f59e0b"
              strokeWidth="0.4"
              strokeDasharray="2 2"
            />
          )}
        </svg>

        {/* =============================================
            GRAPH NODES
        ============================================= */}

        {graphNodes.map(
          (node) => {
            const isCore =
              node.id ===
              'core';

            return (
              <button
                key={
                  node.id
                }
                onClick={() =>
                  handleNodeSelect(
                    node
                  )
                }
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                }}
                className={`
                  absolute
                  z-10
                  -translate-x-1/2
                  -translate-y-1/2

                  flex
                  flex-col
                  items-center
                  justify-center

                  bg-white
                  rounded-2xl
                  border-2

                  transition-all
                  duration-500
                  ease-out

                  ${
                    fullscreen
                      ? isCore
                        ? 'w-44 h-36'
                        : 'w-40 h-24'
                      : isCore
                      ? 'w-32 h-28'
                      : 'w-36 h-20'
                  }

                  ${
                    node.color ===
                    'rose'
                      ? 'border-rose-400'
                      : node.color ===
                        'emerald'
                      ? 'border-emerald-400'
                      : 'border-amber-400'
                  }

                  ${
                    node.isolated
                      ? `
                        opacity-45
                        grayscale
                        scale-95
                      `
                      : `
                        opacity-100
                        shadow-md
                        hover:shadow-xl
                        hover:scale-105
                      `
                  }

                  ${
                    isCore &&
                    isIsolated
                      ? `
                        ring-4
                        ring-amber-100
                        shadow-xl
                      `
                      : ''
                  }
                `}
              >
                {/* DOT */}

                <span
                  className={`
                    rounded-full
                    mb-2

                    ${
                      fullscreen
                        ? 'w-3 h-3'
                        : 'w-2.5 h-2.5'
                    }

                    ${
                      node.color ===
                      'rose'
                        ? 'bg-rose-500'
                        : node.color ===
                          'emerald'
                        ? 'bg-emerald-500'
                        : 'bg-amber-500'
                    }

                    ${
                      isCore
                        ? 'animate-pulse'
                        : ''
                    }
                  `}
                />

                {/* LABEL */}

                <span
                  className={`
                    font-mono
                    font-bold
                    text-stone-900

                    ${
                      fullscreen
                        ? 'text-xs'
                        : 'text-[10px]'
                    }
                  `}
                >
                  {node.label}
                </span>

                {/* SUBLABEL */}

                <span
                  className={`
                    text-stone-400
                    mt-1

                    ${
                      fullscreen
                        ? 'text-[10px]'
                        : 'text-[9px]'
                    }
                  `}
                >
                  {node.isolated
                    ? 'ISOLATED'
                    : node.subLabel}
                </span>
              </button>
            );
          }
        )}

        {/* =============================================
            CORE STATUS
        ============================================= */}

        {isIsolated && (
          <div
            className="
              absolute
              top-4
              right-16
              z-20

              px-3
              py-1.5

              rounded-lg

              bg-rose-50
              border
              border-rose-200

              text-[10px]
              font-mono
              font-bold
              text-rose-700
            "
          >
            ● ISOLATION ACTIVE
          </div>
        )}

        {/* =============================================
            RECORD COUNT
        ============================================= */}

        <div
          className="
            absolute
            bottom-4
            left-4
            z-20

            bg-white/90
            backdrop-blur

            border
            border-stone-200

            rounded-xl

            px-3
            py-2

            text-[10px]
            font-mono
            text-stone-500

            shadow-sm
          "
        >
          <span
            className="
              text-stone-900
              font-bold
            "
          >
            {
              graphStats.totalNodes
            }
          </span>{' '}
          records mapped
        </div>

        {/* =============================================
            FULLSCREEN BUTTON
        ============================================= */}

        {!fullscreen && (
          <button
            onClick={() =>
              setIsFullscreen(
                true
              )
            }
            className="
              absolute
              top-4
              right-4
              z-30

              p-2

              bg-white
              border
              border-stone-200

              rounded-lg

              text-stone-500

              hover:text-amber-700
              hover:border-amber-300

              transition-all
              shadow-sm
            "
            title="Expand Graph"
          >
            <Maximize2
              className="
                w-4
                h-4
              "
            />
          </button>
        )}

        {/* =============================================
            FULLSCREEN CLOSE
        ============================================= */}

        {fullscreen && (
          <button
            onClick={() =>
              setIsFullscreen(
                false
              )
            }
            className="
              absolute
              top-5
              right-5
              z-30

              px-4
              py-2.5

              bg-stone-900
              hover:bg-stone-800

              text-white

              rounded-xl

              text-xs
              font-mono
              font-bold

              flex
              items-center
              gap-2

              transition-all
            "
          >
            <Minimize2
              className="
                w-4
                h-4
              "
            />

            Exit Expanded View
          </button>
        )}

        {/* =============================================
            ISOLATION EXPLANATION
        ============================================= */}

        {isIsolated && (
          <div
            className="
              absolute
              bottom-4
              right-4
              z-20

              max-w-xs

              bg-white/95
              backdrop-blur

              border
              border-rose-200

              rounded-xl

              px-4
              py-3

              shadow-sm
            "
          >
            <div
              className="
                text-[10px]
                font-bold
                text-rose-700
              "
            >
              Sub-Graph Isolated
            </div>

            <div
              className="
                text-[9px]
                text-stone-500
                mt-1
              "
            >
              Non-core nodes have been
              disconnected from the active
              investigation graph.
            </div>
          </div>
        )}
      </div>
    );
  };

  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <>
      <div
        className="
          space-y-6
          text-stone-900
          font-sans
          max-w-7xl
          mx-auto
          antialiased
          pb-8
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            bg-white/95
            backdrop-blur-md

            border
            border-stone-200

            rounded-2xl

            p-5
            md:p-6

            shadow-sm
          "
        >
          <div
            className="
              flex
              flex-col
              xl:flex-row
              xl:items-center
              justify-between
              gap-5
            "
          >
            {/* TITLE */}

            <div>
              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-2
                  mb-2
                "
              >
                <span
                  className="
                    px-3
                    py-1

                    bg-amber-50
                    text-amber-800

                    border
                    border-amber-200

                    rounded-lg

                    text-[10px]
                    md:text-xs

                    font-mono
                    font-bold
                    uppercase
                    tracking-wider
                  "
                >
                  Blockchain Intelligence Engine
                </span>

                <span
                  className="
                    flex
                    items-center
                    gap-1.5

                    text-[10px]
                    font-mono
                    text-emerald-700
                  "
                >
                  <span
                    className="
                      w-2
                      h-2

                      rounded-full

                      bg-emerald-500

                      animate-pulse
                    "
                  />

                  GRAPH ENGINE ONLINE
                </span>
              </div>

              <h2
                className="
                  text-lg
                  md:text-xl

                  font-bold
                  text-stone-900

                  flex
                  items-center

                  tracking-tight
                "
              >
                <Share2
                  className="
                    w-5
                    h-5
                    mr-2
                    text-amber-700
                  "
                />

                Blockchain Network Intelligence
              </h2>

              <p
                className="
                  text-xs
                  text-stone-500
                  mt-1.5
                  max-w-2xl
                "
              >
                Analyze transaction relationships,
                P2P routing patterns,
                mixer density and
                cross-border network activity.
              </p>
            </div>

            {/* HEADER STATS */}

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-3
              "
            >
              <div
                className="
                  px-3.5
                  py-2

                  bg-stone-50

                  border
                  border-stone-200

                  rounded-xl

                  text-xs
                  font-mono
                "
              >
                <span
                  className="
                    text-stone-500
                  "
                >
                  Graph Nodes:
                </span>{' '}

                <strong
                  className="
                    text-amber-800
                  "
                >
                  {
                    graphStats.totalNodes
                  }
                </strong>
              </div>

              <div
                className="
                  px-3.5
                  py-2

                  bg-stone-50

                  border
                  border-stone-200

                  rounded-xl

                  text-xs
                  font-mono
                "
              >
                <span
                  className="
                    text-stone-500
                  "
                >
                  High Risk:
                </span>{' '}

                <strong
                  className="
                    text-rose-700
                  "
                >
                  {
                    graphStats.highRisk
                  }
                </strong>
              </div>

              {/* CONTEXTUAL ACTION */}

              <button
                onClick={
                  handleGraphAction
                }
                disabled={
                  isProcessing
                }
                className="
                  px-4
                  py-2.5

                  bg-amber-700
                  hover:bg-amber-800

                  disabled:opacity-70
                  disabled:cursor-not-allowed

                  text-white

                  rounded-xl

                  text-xs
                  font-mono
                  font-bold

                  flex
                  items-center

                  transition-all
                  shadow-sm

                  active:scale-95
                "
              >
                <ActionIcon
                  className={`
                    w-4
                    h-4
                    mr-2

                    ${
                      isProcessing
                        ? 'animate-spin'
                        : ''
                    }
                  `}
                />

                {isProcessing
                  ? currentAction.loadingLabel
                  : currentAction.idleLabel}
              </button>

              {/* VERSION */}

              <div
                className="
                  hidden
                  md:flex

                  flex-col
                  gap-1

                  text-[9px]
                  font-mono
                  text-stone-400
                "
              >
                <div>
                  Updated:

                  <span
                    className="
                      ml-1
                      text-stone-700
                    "
                  >
                    {
                      lastUpdated
                    }
                  </span>
                </div>

                <div>
                  Version:

                  <span
                    className="
                      ml-1
                      text-amber-700
                      font-bold
                    "
                  >
                    G{
                      graphVersion
                    }
                    .A{
                      analysisVersion
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            TAB NAVIGATION
        ================================================= */}

        <div
          className="
            bg-white/95

            border
            border-stone-200

            rounded-2xl

            p-2

            shadow-sm
          "
        >
          <div
            className="
              flex
              flex-wrap
              gap-2
            "
          >
            {tabs.map(
              (tab) => {
                const Icon =
                  tab.icon;

                const isActive =
                  activeGraphTab ===
                  tab.id;

                return (
                  <button
                    key={
                      tab.id
                    }
                    onClick={() =>
                      handleTabChange(
                        tab.id
                      )
                    }
                    className={`
                      px-4
                      py-2.5

                      rounded-xl

                      text-xs
                      font-mono
                      font-bold

                      flex
                      items-center

                      transition-all

                      ${
                        isActive
                          ? `
                            bg-amber-700
                            text-white
                            shadow-sm
                          `
                          : `
                            bg-stone-50
                            text-stone-600

                            hover:bg-stone-100
                            hover:text-stone-900
                          `
                      }
                    `}
                  >
                    <Icon
                      className="
                        w-4
                        h-4
                        mr-2
                      "
                    />

                    {
                      tab.label
                    }
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* =================================================
            STATUS BAR
        ================================================= */}

        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            justify-between
            gap-3

            bg-stone-900

            rounded-xl

            px-4
            py-3

            text-xs
            font-mono
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
              text-stone-300
            "
          >
            <Terminal
              className="
                w-4
                h-4
                text-amber-400
              "
            />

            <span>
              {
                statusMessage
              }
            </span>
          </div>

          <div
            className="
              flex
              items-center
              gap-2

              text-emerald-400
            "
          >
            <Radio
              className="
                w-3
                h-3
                animate-pulse
              "
            />

            LIVE SESSION
          </div>
        </div>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div
          className="
            grid
            grid-cols-1
            xl:grid-cols-3
            gap-6
          "
        >
          {/* =============================================
              MAIN VISUALIZATION
          ============================================= */}

          <div
            className="
              xl:col-span-2

              bg-white/95

              border
              border-stone-200

              rounded-2xl

              shadow-sm

              overflow-hidden
            "
          >
            {/* GRAPH HEADER */}

            <div
              className="
                flex
                flex-col
                sm:flex-row
                sm:items-center

                justify-between

                gap-3

                p-5

                border-b
                border-stone-100
              "
            >
              <div>
                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <Activity
                    className="
                      w-4
                      h-4
                      text-amber-700
                    "
                  />

                  <h3
                    className="
                      text-sm
                      font-bold
                      text-stone-900
                    "
                  >
                    {
                      graphTitle
                    }
                  </h3>
                </div>

                <p
                  className="
                    text-[10px]
                    font-mono
                    text-stone-400
                    mt-1
                  "
                >
                  {
                    currentAction.description
                  }
                </p>
              </div>

              <div
                className="
                  flex
                  items-center
                  gap-2

                  text-[10px]
                  font-mono
                "
              >
                <span
                  className="
                    px-2.5
                    py-1

                    bg-emerald-50

                    border
                    border-emerald-200

                    text-emerald-700

                    rounded-lg
                  "
                >
                  LIVE DATA
                </span>

                <span
                  className="
                    px-2.5
                    py-1

                    bg-stone-50

                    border
                    border-stone-200

                    text-stone-500

                    rounded-lg
                  "
                >
                  MEMGRAPH READY
                </span>
              </div>
            </div>

            {/* =============================================
                GRAPH CONTENT
            ============================================= */}

            <div
              className="
                p-5
                min-h-[540px]
              "
            >
              {/* ===========================================
                  TOPOLOGY
              =========================================== */}

              {activeGraphTab ===
                'topology' && (
                <div
                  className="
                    h-full
                    flex
                    flex-col
                  "
                >
                  {/* QUERY BAR */}

                  <div
                    className="
                      flex
                      flex-col
                      sm:flex-row
                      sm:items-center

                      justify-between

                      gap-3

                      text-[10px]
                      font-mono

                      border
                      border-stone-200

                      bg-stone-50

                      rounded-xl

                      px-4
                      py-3

                      mb-5
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        text-stone-500
                      "
                    >
                      <TerminalIcon />

                      <span>
                        MATCH (peer)-[:ROUTES_TO]-&gt;(wallet)
                      </span>
                    </div>

                    <div
                      className="
                        flex
                        items-center
                        gap-3
                      "
                    >
                      {isIsolated && (
                        <span
                          className="
                            text-rose-600
                            font-bold
                          "
                        >
                          ● SUB-GRAPH ISOLATED
                        </span>
                      )}

                      <span
                        className="
                          text-emerald-700
                          font-bold
                        "
                      >
                        ● CLUSTER ACTIVE
                      </span>
                    </div>
                  </div>

                  {/* GRAPH */}

                  <GraphCanvas />

                  <p
                    className="
                      text-[10px]
                      font-mono
                      text-stone-400
                      mt-4
                    "
                  >
                    Click any node to inspect routing,
                    transaction metadata and
                    risk classification.
                  </p>
                </div>
              )}

              {/* ===========================================
                  MIXING DENSITY
              =========================================== */}

              {activeGraphTab ===
                'entropy' && (
                <div
                  className="
                    h-full
                    flex
                    flex-col
                    justify-between
                    space-y-7
                  "
                >
                  <div
                    className="
                      flex
                      justify-between
                      items-center

                      border-b
                      border-stone-100

                      pb-5

                      text-xs
                      font-mono
                    "
                  >
                    <div>
                      <span
                        className="
                          text-stone-400
                        "
                      >
                        Analysis Metric
                      </span>

                      <div
                        className="
                          font-bold
                          text-stone-900
                          mt-1
                        "
                      >
                        Shannon Entropy & Mixing Density
                      </div>
                    </div>

                    <div
                      className="
                        text-right
                      "
                    >
                      <span
                        className="
                          text-stone-400
                        "
                      >
                        Analysis Version
                      </span>

                      <div
                        className="
                          text-lg
                          font-bold
                          text-amber-700
                        "
                      >
                        A{
                          analysisVersion
                        }
                      </div>
                    </div>
                  </div>

                  <div
                    className="
                      space-y-7
                    "
                  >
                    {densityData.map(
                      (item) => (
                        <DensityBar
                          key={
                            item.label
                          }
                          label={
                            item.label
                          }
                          description={
                            item.description
                          }
                          value={
                            item.value
                          }
                          color={
                            item.color
                          }
                          status={`${item.value.toFixed(
                            1
                          )}% DENSITY`}
                        />
                      )
                    )}
                  </div>

                  <div
                    className="
                      grid
                      grid-cols-1
                      sm:grid-cols-3
                      gap-3
                    "
                  >
                    <MetricBox
                      label="Critical Mixers"
                      value={String(
                        graphStats.critical
                      )}
                      tone="rose"
                    />

                    <MetricBox
                      label="High-Risk Routes"
                      value={String(
                        graphStats.highRisk
                      )}
                      tone="amber"
                    />

                    <MetricBox
                      label="Network Confidence"
                      value={`${Math.min(
                        99.8,
                        95 +
                          analysisVersion *
                            0.4
                      ).toFixed(1)}%`}
                      tone="emerald"
                    />
                  </div>
                </div>
              )}

              {/* ===========================================
                  GEO ASN
              =========================================== */}

              {activeGraphTab ===
                'heatmap' && (
                <div
                  className="
                    h-full
                    flex
                    flex-col
                    justify-between
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      mb-6
                    "
                  >
                    <div>
                      <div
                        className="
                          text-xs
                          font-bold
                          text-stone-900
                        "
                      >
                        Active Geo Intelligence
                      </div>

                      <div
                        className="
                          text-[10px]
                          text-stone-400
                          mt-1
                        "
                      >
                        ASN routing and
                        cross-border transaction exposure
                      </div>
                    </div>

                    <MapPin
                      className="
                        w-5
                        h-5
                        text-amber-700
                      "
                    />
                  </div>

                  <div
                    className="
                      grid
                      grid-cols-1
                      sm:grid-cols-3
                      gap-4
                      my-auto
                    "
                  >
                    {geoData.map(
                      (geo) => (
                        <GeoCard
                          key={
                            geo.country
                          }
                          country={
                            geo.country
                          }
                          asn={
                            geo.asn
                          }
                          transactions={String(
                            geo.transactions
                          )}
                          risk={
                            geo.risk
                          }
                          tone={
                            geo.tone
                          }
                        />
                      )
                    )}
                  </div>

                  <div
                    className="
                      mt-8

                      bg-stone-50

                      border
                      border-stone-200

                      rounded-2xl

                      p-5
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        mb-4
                      "
                    >
                      <Globe
                        className="
                          w-4
                          h-4
                          text-amber-700
                        "
                      />

                      <span
                        className="
                          text-xs
                          font-bold
                        "
                      >
                        Cross-Border Routing Summary
                      </span>
                    </div>

                    <div
                      className="
                        flex
                        flex-wrap
                        items-center
                        gap-3

                        text-xs
                        font-mono
                      "
                    >
                      {geoData.map(
                        (
                          geo,
                          index
                        ) => (
                          <React.Fragment
                            key={
                              geo.country
                            }
                          >
                            <span
                              className="
                                px-3
                                py-2

                                bg-white

                                border
                                border-stone-200

                                rounded-lg
                              "
                            >
                              {
                                geo.country
                              } / {
                                geo.asn
                              }
                            </span>

                            {index <
                              geoData.length -
                                1 && (
                              <ArrowRight
                                className="
                                  w-4
                                  h-4
                                  text-stone-400
                                "
                              />
                            )}
                          </React.Fragment>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ===========================================
                  FUND FLOW
              =========================================== */}

              {activeGraphTab ===
                'sankey' && (
                <div
                  className="
                    h-full
                    flex
                    flex-col
                    justify-between
                  "
                >
                  <div
                    className="
                      text-xs
                      font-mono

                      border-b
                      border-stone-100

                      pb-4

                      flex
                      justify-between
                    "
                  >
                    <span
                      className="
                        text-stone-500
                      "
                    >
                      Multi-Hop Fund Flow Analysis
                    </span>

                    <span
                      className="
                        text-amber-700
                        font-bold
                      "
                    >
                      Recursive Routing Detected
                    </span>
                  </div>

                  <div
                    className="
                      flex
                      flex-col
                      md:flex-row

                      items-center
                      justify-between

                      gap-4

                      my-auto
                    "
                  >
                    <FlowNode
                      title="Source Escrows"
                      value={
                        fundFlow.sourceValue
                      }
                      tone="stone"
                    />

                    <FlowConnector
                      label="Split"
                      tone="amber"
                    />

                    <FlowNode
                      title="Mixer Pools"
                      value={
                        fundFlow.mixerValue
                      }
                      tone="amber"
                    />

                    <FlowConnector
                      label="Route"
                      tone="emerald"
                    />

                    <FlowNode
                      title="Exit Wallets"
                      value={
                        fundFlow.exitValue
                      }
                      tone="emerald"
                    />
                  </div>

                  <div
                    className="
                      grid
                      grid-cols-3
                      gap-3
                      mt-6
                    "
                  >
                    <MetricBox
                      label="Source Hops"
                      value={
                        fundFlow.sourceHops
                      }
                      tone="stone"
                    />

                    <MetricBox
                      label="Mixer Pools"
                      value={
                        fundFlow.mixerPools
                      }
                      tone="amber"
                    />

                    <MetricBox
                      label="Exit Routes"
                      value={
                        fundFlow.exitRoutes
                      }
                      tone="emerald"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* =============================================
              NODE INSPECTOR
          ============================================= */}

          <div
            className="
              bg-white/95

              border
              border-stone-200

              rounded-2xl

              shadow-sm

              flex
              flex-col
            "
          >
            {/* HEADER */}

            <div
              className="
                p-5

                border-b
                border-stone-100
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >
                <div>
                  <span
                    className="
                      text-[10px]
                      font-mono
                      uppercase
                      tracking-widest
                      text-stone-400
                    "
                  >
                    Selected Node
                  </span>

                  <h3
                    className="
                      text-sm
                      font-bold
                      text-stone-900
                      mt-1
                      truncate
                    "
                  >
                    {
                      selectedNode?.source ||
                      'Unknown Node'
                    }
                  </h3>
                </div>

                <div
                  className={`
                    w-9
                    h-9

                    rounded-xl

                    flex
                    items-center
                    justify-center

                    border

                    ${
                      isIsolated
                        ? `
                          bg-rose-50
                          border-rose-200
                        `
                        : `
                          bg-amber-50
                          border-amber-200
                        `
                    }
                  `}
                >
                  <CircleDot
                    className={`
                      w-4
                      h-4

                      ${
                        isIsolated
                          ? 'text-rose-700'
                          : 'text-amber-700'
                      }
                    `}
                  />
                </div>
              </div>
            </div>

            {/* DETAILS */}

            <div
              className="
                p-5
                space-y-3
                flex-1
              "
            >
              <InspectorItem
                label="Transaction ID"
                value={
                  selectedNode?.txid ||
                  'N/A'
                }
                highlight
              />

              <InspectorItem
                label="Source IP"
                value={`${selectedNode?.src_ip || 'N/A'}:${
                  selectedNode?.src_port ||
                  'N/A'
                }`}
              />

              <InspectorItem
                label="Geo / ASN"
                value={
                  selectedNode?.geo_country_asn ||
                  'N/A'
                }
              />

              <InspectorItem
                label="Risk Classification"
                value={`${selectedNode?.riskLevel || 'UNKNOWN'} RISK`}
                risk
              />

              {/* GRAPH INTELLIGENCE */}

              <div
                className="
                  p-4

                  rounded-xl

                  bg-stone-50

                  border
                  border-stone-200
                "
              >
                <span
                  className="
                    text-[10px]
                    font-mono
                    uppercase
                    text-stone-400
                  "
                >
                  Graph Intelligence
                </span>

                <div
                  className="
                    mt-3
                    space-y-2

                    text-[11px]
                    font-mono
                  "
                >
                  <div
                    className="
                      flex
                      justify-between
                    "
                  >
                    <span
                      className="
                        text-stone-500
                      "
                    >
                      Dataset Status
                    </span>

                    <span
                      className="
                        text-emerald-700
                        font-bold
                      "
                    >
                      CONNECTED
                    </span>
                  </div>

                  <div
                    className="
                      flex
                      justify-between
                    "
                  >
                    <span
                      className="
                        text-stone-500
                      "
                    >
                      Node Confidence
                    </span>

                    <span
                      className="
                        text-stone-900
                        font-bold
                      "
                    >
                      {Math.min(
                        99.8,
                        96 +
                          graphVersion *
                            0.4
                      ).toFixed(1)}
                      %
                    </span>
                  </div>

                  <div
                    className="
                      flex
                      justify-between
                    "
                  >
                    <span
                      className="
                        text-stone-500
                      "
                    >
                      Isolation Status
                    </span>

                    <span
                      className={`
                        font-bold

                        ${
                          isIsolated
                            ? 'text-rose-700'
                            : 'text-amber-700'
                        }
                      `}
                    >
                      {isIsolated
                        ? 'ISOLATED'
                        : 'READY'}
                    </span>
                  </div>

                  <div
                    className="
                      flex
                      justify-between
                    "
                  >
                    <span
                      className="
                        text-stone-500
                      "
                    >
                      Graph Version
                    </span>

                    <span
                      className="
                        text-amber-700
                        font-bold
                      "
                    >
                      G{
                        graphVersion
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* ISOLATION INFO */}

              {isIsolated && (
                <div
                  className="
                    p-4

                    bg-rose-50

                    border
                    border-rose-200

                    rounded-xl
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      gap-2
                    "
                  >
                    <Database
                      className="
                        w-4
                        h-4

                        text-rose-700

                        mt-0.5
                      "
                    />

                    <div>
                      <div
                        className="
                          text-xs
                          font-bold
                          text-rose-800
                        "
                      >
                        Sub-Graph Isolated
                      </div>

                      <div
                        className="
                          text-[10px]
                          text-rose-600
                          mt-1
                        "
                      >
                        Non-core nodes are currently
                        disconnected from the active
                        investigation graph.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* =========================================
                ACTION AREA
            ========================================= */}

            <div
              className="
                p-5

                border-t
                border-stone-100

                space-y-3
              "
            >
              {!isIsolated ? (
                <button
                  onClick={
                    handleIsolateCluster
                  }
                  disabled={
                    isIsolating
                  }
                  className="
                    w-full
                    py-3

                    bg-stone-900
                    hover:bg-stone-800

                    disabled:opacity-70
                    disabled:cursor-not-allowed

                    text-white

                    rounded-xl

                    text-xs
                    font-mono
                    font-bold

                    transition-all

                    shadow-sm

                    flex
                    items-center
                    justify-center

                    active:scale-95
                  "
                >
                  {isIsolating ? (
                    <>
                      <RefreshCw
                        className="
                          w-4
                          h-4
                          mr-2
                          animate-spin
                        "
                      />

                      Isolating Cluster...
                    </>
                  ) : (
                    <>
                      <Database
                        className="
                          w-4
                          h-4
                          mr-2
                        "
                      />

                      Isolate Sub-Graph Cluster
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={
                    handleRestoreGraph
                  }
                  className="
                    w-full
                    py-3

                    bg-rose-700
                    hover:bg-rose-800

                    text-white

                    rounded-xl

                    text-xs
                    font-mono
                    font-bold

                    transition-all

                    shadow-sm

                    flex
                    items-center
                    justify-center

                    active:scale-95
                  "
                >
                  <RotateCcw
                    className="
                      w-4
                      h-4
                      mr-2
                    "
                  />

                  Restore Full Graph
                </button>
              )}

              <div
                className="
                  flex
                  items-center
                  justify-center
                  gap-2

                  text-[9px]
                  font-mono
                  text-stone-400
                "
              >
                {isIsolated ? (
                  <>
                    <CircleDot
                      className="
                        w-3
                        h-3
                        text-rose-600
                      "
                    />

                    Isolation applied locally
                  </>
                ) : (
                  <>
                    <Eye
                      className="
                        w-3
                        h-3
                      "
                    />

                    Action limited to current session
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          REAL FULLSCREEN MODE

          This is what was missing before.

          When Expand is clicked, this overlay actually
          fills the viewport.
      ================================================= */}

      {isFullscreen && (
        <div
          className="
            fixed
            inset-0

            z-[9999]

            bg-stone-950

            p-4
            md:p-6
          "
        >
          <div
            className="
              h-full

              bg-white

              rounded-2xl

              overflow-hidden

              flex
              flex-col
            "
          >
            {/* FULLSCREEN HEADER */}

            <div
              className="
                flex
                items-center
                justify-between

                px-5
                py-4

                border-b
                border-stone-200
              "
            >
              <div>
                <div
                  className="
                    text-sm
                    font-bold
                    text-stone-900
                  "
                >
                  P2P Transaction Topology
                </div>

                <div
                  className="
                    text-[10px]
                    font-mono
                    text-stone-400
                    mt-1
                  "
                >
                  Expanded graph investigation mode
                </div>
              </div>

              <button
                onClick={() =>
                  setIsFullscreen(
                    false
                  )
                }
                className="
                  w-10
                  h-10

                  rounded-xl

                  border
                  border-stone-200

                  flex
                  items-center
                  justify-center

                  text-stone-500

                  hover:text-rose-700
                  hover:border-rose-300

                  transition-all
                "
              >
                <X
                  className="
                    w-5
                    h-5
                  "
                />
              </button>
            </div>

            {/* FULLSCREEN CANVAS */}

            <div
              className="
                flex-1
                relative
              "
            >
              <GraphCanvas
                fullscreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* =========================================================
   SMALL COMPONENTS
========================================================= */

const TerminalIcon: React.FC =
  () => (
    <span
      className="
        font-bold
        text-amber-700
      "
    >
      &gt;_
    </span>
  );

/* =========================================================
   DENSITY BAR
========================================================= */

const DensityBar: React.FC<{
  label: string;
  description: string;
  value: number;
  color: NodeColor;
  status: string;
}> = ({
  label,
  description,
  value,
  color,
  status,
}) => {
  const barColor = {
    rose: 'bg-rose-500',
    amber: 'bg-amber-500',
    emerald: 'bg-emerald-500',
  };

  const textColor = {
    rose: 'text-rose-700',
    amber: 'text-amber-700',
    emerald: 'text-emerald-700',
  };

  return (
    <div>
      <div
        className="
          flex
          items-end
          justify-between
          mb-2
        "
      >
        <div>
          <div
            className="
              text-xs
              font-bold
              text-stone-800
            "
          >
            {label}
          </div>

          <div
            className="
              text-[10px]
              text-stone-400
              mt-0.5
            "
          >
            {description}
          </div>
        </div>

        <span
          className={`
            text-xs
            font-mono
            font-bold

            ${textColor[color]}
          `}
        >
          {status}
        </span>
      </div>

      <div
        className="
          h-3

          bg-stone-100

          border
          border-stone-200

          rounded-full

          overflow-hidden
        "
      >
        <div
          className={`
            h-full
            rounded-full

            transition-all
            duration-700

            ${barColor[color]}
          `}
          style={{
            width: `${value}%`,
          }}
        />
      </div>
    </div>
  );
};

/* =========================================================
   METRIC BOX
========================================================= */

const MetricBox: React.FC<{
  label: string;
  value: string;
  tone:
    | 'rose'
    | 'amber'
    | 'emerald'
    | 'stone';
}> = ({
  label,
  value,
  tone,
}) => {
  const valueColor = {
    rose: 'text-rose-700',
    amber: 'text-amber-700',
    emerald: 'text-emerald-700',
    stone: 'text-stone-900',
  };

  return (
    <div
      className="
        p-4

        bg-stone-50

        border
        border-stone-200

        rounded-xl
      "
    >
      <span
        className="
          text-[9px]
          font-mono
          uppercase
          tracking-wide
          text-stone-400
        "
      >
        {label}
      </span>

      <div
        className={`
          text-lg
          font-bold
          font-mono
          mt-1

          ${valueColor[tone]}
        `}
      >
        {value}
      </div>
    </div>
  );
};

/* =========================================================
   GEO CARD
========================================================= */

const GeoCard: React.FC<{
  country: string;
  asn: string;
  transactions: string;
  risk: string;
  tone: NodeColor;
}> = ({
  country,
  asn,
  transactions,
  risk,
  tone,
}) => {
  const styleMap = {
    rose: {
      box: 'bg-rose-50 border-rose-200',
      title: 'text-rose-700',
      value: 'text-rose-800',
    },

    amber: {
      box: 'bg-amber-50 border-amber-200',
      title: 'text-amber-700',
      value: 'text-amber-800',
    },

    emerald: {
      box: 'bg-emerald-50 border-emerald-200',
      title: 'text-emerald-700',
      value: 'text-emerald-800',
    },
  };

  const styles =
    styleMap[tone];

  return (
    <div
      className={`
        p-6

        rounded-2xl

        border

        text-center

        transition-all

        hover:-translate-y-1

        ${styles.box}
      `}
    >
      <div
        className={`
          text-xs
          font-mono
          font-bold

          ${styles.title}
        `}
      >
        {country} ({asn})
      </div>

      <div
        className={`
          text-3xl
          font-bold
          mt-3

          ${styles.value}
        `}
      >
        {transactions}
      </div>

      <div
        className="
          text-[10px]
          text-stone-500
          mt-1
        "
      >
        Transactions
      </div>

      <div
        className={`
          text-xs
          font-mono
          font-bold
          mt-4

          ${styles.title}
        `}
      >
        {risk}
      </div>
    </div>
  );
};

/* =========================================================
   FLOW NODE
========================================================= */

const FlowNode: React.FC<{
  title: string;
  value: string;
  tone:
    | 'stone'
    | 'amber'
    | 'emerald';
}> = ({
  title,
  value,
  tone,
}) => {
  const borderMap = {
    stone: 'border-stone-300',
    amber: 'border-amber-300',
    emerald: 'border-emerald-300',
  };

  return (
    <div
      className={`
        w-full
        md:w-40

        p-5

        bg-white

        border-2

        ${borderMap[tone]}

        rounded-2xl

        text-center

        shadow-sm
      `}
    >
      <div
        className="
          text-[10px]
          font-mono
          uppercase
          text-stone-400
        "
      >
        {title}
      </div>

      <div
        className="
          text-sm
          font-bold
          text-stone-900
          mt-2
        "
      >
        {value}
      </div>
    </div>
  );
};

/* =========================================================
   FLOW CONNECTOR
========================================================= */

const FlowConnector: React.FC<{
  label: string;
  tone:
    | 'amber'
    | 'emerald';
}> = ({
  label,
  tone,
}) => {
  const color =
    tone === 'amber'
      ? 'bg-amber-500'
      : 'bg-emerald-500';

  return (
    <div
      className="
        flex
        md:flex-col

        items-center

        gap-2

        flex-1
      "
    >
      <div
        className={`
          w-full
          md:w-2

          h-2
          md:h-16

          rounded-full

          ${color}
        `}
      />

      <span
        className="
          text-[9px]
          font-mono
          text-stone-400
        "
      >
        {label}
      </span>
    </div>
  );
};

/* =========================================================
   INSPECTOR ITEM
========================================================= */

const InspectorItem: React.FC<{
  label: string;
  value: string;
  highlight?: boolean;
  risk?: boolean;
}> = ({
  label,
  value,
  highlight,
  risk,
}) => (
  <div
    className="
      p-3.5

      bg-stone-50

      border
      border-stone-200

      rounded-xl
    "
  >
    <span
      className="
        text-[9px]
        font-mono
        uppercase
        tracking-wide
        text-stone-400
      "
    >
      {label}
    </span>

    <div
      className={`
        text-xs
        font-mono
        font-bold

        mt-1

        truncate

        ${
          highlight
            ? 'text-amber-800'
            : risk
            ? 'text-rose-700'
            : 'text-stone-800'
        }
      `}
    >
      {value}
    </div>
  </div>
);