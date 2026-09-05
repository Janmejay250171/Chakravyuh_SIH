import React, { useMemo, useState } from 'react';
import {
  Eye,
  CheckCircle2,
  FileText,
  Brain,
  Network,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';

type Feature = {
  id: number;
  name: string;
  contribution: number;
  description: string;
  source: string;
  direction: 'risk' | 'neutral';
};

const initialFeatures: Feature[] = [
  {
    id: 1,
    name: 'Transaction propagation pattern',
    contribution: 42.1,
    description:
      'The transaction was observed across multiple monitored peers with a propagation pattern outside the expected baseline for the selected network sector.',
    source: 'P2P Sentinel Network',
    direction: 'risk',
  },
  {
    id: 2,
    name: 'Network relationship correlation',
    contribution: 35.4,
    description:
      'Graph analysis identified relevant relationships between the transaction, monitored peers and the linked investigation context.',
    source: 'Graph Relationship Analysis',
    direction: 'risk',
  },
  {
    id: 3,
    name: 'Behavioural anomaly score',
    contribution: 28.7,
    description:
      'Transaction behaviour received an elevated anomaly score compared with the expected behavioural baseline.',
    source: 'Behavioural Analysis Layer',
    direction: 'risk',
  },
  {
    id: 4,
    name: 'Investigation context match',
    contribution: 19.6,
    description:
      'The analysed entities were found to have a relevant relationship with the currently linked investigation case.',
    source: 'Investigation Correlation',
    direction: 'risk',
  },
  {
    id: 5,
    name: 'Mixer activity separation',
    contribution: 8.2,
    description:
      'Possible CoinJoin or mixer-related activity was evaluated separately to avoid incorrectly linking unrelated entities.',
    source: 'Entity Resolution Layer',
    direction: 'neutral',
  },
];

export const ExplainabilityView: React.FC = () => {
  const [expandedFeature, setExpandedFeature] =
    useState<number | null>(null);

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const [refreshStatus, setRefreshStatus] =
    useState<'idle' | 'success'>('idle');

  const [lastUpdated, setLastUpdated] =
    useState('Explanation generated from current analysis');

  const [features, setFeatures] =
    useState<Feature[]>(initialFeatures);

  const [riskScore, setRiskScore] =
    useState(87);

  const [modelConfidence, setModelConfidence] =
    useState(91);

  const formatTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return 'HIGH';
    if (score >= 50) return 'MEDIUM';
    return 'LOW';
  };

  const riskLevel = getRiskLevel(riskScore);

  const refreshExplanation = () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    setRefreshStatus('idle');

    // Close expanded explanation while recalculating
    setExpandedFeature(null);

    setTimeout(() => {
      /*
        Recalculate feature contributions.

        Small deterministic/random variation is used here
        because this is a demo prototype. In a backend-connected
        version, these values should come from the API.
      */
      const refreshedFeatures = initialFeatures.map((feature) => {
        const variation =
          (Math.random() * 6 - 3);

        let newContribution =
          feature.contribution + variation;

        newContribution = Math.max(
          1,
          Math.min(
            100,
            Number(newContribution.toFixed(1))
          )
        );

        return {
          ...feature,
          contribution: newContribution,
        };
      });

      // Rank refreshed features by contribution
      refreshedFeatures.sort(
        (a, b) =>
          b.contribution - a.contribution
      );

      setFeatures(refreshedFeatures);

      /*
        Calculate refreshed risk score based on
        current feature contribution values.
      */
      const riskFeatures =
        refreshedFeatures.filter(
          (feature) =>
            feature.direction === 'risk'
        );

      const totalRiskContribution =
        riskFeatures.reduce(
          (sum, feature) =>
            sum + feature.contribution,
          0
        );

      const calculatedScore =
        Math.round(
          Math.min(
            97,
            Math.max(
              65,
              totalRiskContribution / 1.45
            )
          )
        );

      setRiskScore(calculatedScore);

      /*
        Refresh model confidence.
      */
      const newConfidence =
        Math.min(
          99,
          Math.max(
            75,
            calculatedScore +
              Math.floor(
                Math.random() * 8 - 4
              )
          )
        );

      setModelConfidence(newConfidence);

      setLastUpdated(
        `Explanation refreshed at ${formatTime()}`
      );

      setIsRefreshing(false);
      setRefreshStatus('success');

      // Remove success status after a few seconds
      setTimeout(() => {
        setRefreshStatus('idle');
      }, 3500);
    }, 1200);
  };

  const maxContribution = useMemo(() => {
    return Math.max(
      ...features.map(
        (feature) =>
          feature.contribution
      )
    );
  }, [features]);

  const getRiskStyles = () => {
    if (riskLevel === 'HIGH') {
      return {
        text: 'text-rose-700',
        border: 'border-rose-200',
        bg: 'bg-rose-50',
        icon: 'text-rose-600',
        label: 'High-risk assessment',
      };
    }

    if (riskLevel === 'MEDIUM') {
      return {
        text: 'text-amber-700',
        border: 'border-amber-200',
        bg: 'bg-amber-50',
        icon: 'text-amber-600',
        label: 'Medium-risk assessment',
      };
    }

    return {
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      bg: 'bg-emerald-50',
      icon: 'text-emerald-600',
      label: 'Low-risk assessment',
    };
  };

  const riskStyles = getRiskStyles();

  return (
    <div className="max-w-7xl mx-auto text-stone-900 font-sans space-y-5">

      {/* HEADER */}

      <div className="bg-white border border-stone-200 px-6 py-5">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          <div>

            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.15em] text-amber-800">

              <span className="w-2 h-2 bg-amber-600" />

              AI ASSESSMENT → FEATURE EXPLANATION

            </div>

            <h2 className="flex items-center gap-2 text-xl font-bold mt-3">

              <Eye className="w-5 h-5 text-amber-700" />

              Explainability Review

            </h2>

            <p className="text-sm text-stone-500 mt-2 max-w-2xl">

              Review the factors and evidence that contributed to the
              current AI-generated risk assessment.

            </p>

          </div>


          <div className="flex flex-wrap items-center gap-3">

            <div className="border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-mono text-emerald-700">

              <span className="inline-block w-2 h-2 bg-emerald-500 mr-2" />

              EXPLANATION AVAILABLE

            </div>


            <button
              type="button"
              onClick={refreshExplanation}
              disabled={isRefreshing}
              className="flex items-center gap-2 border border-stone-300 hover:bg-stone-50 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-2 text-xs font-semibold transition-all"
            >

              <RefreshCw
                className={`w-4 h-4 ${
                  isRefreshing
                    ? 'animate-spin'
                    : ''
                }`}
              />

              {isRefreshing
                ? 'Recalculating...'
                : 'Refresh'}

            </button>

          </div>

        </div>


        {/* REFRESH SUCCESS MESSAGE */}

        {refreshStatus === 'success' && (

          <div className="mt-4 border border-emerald-200 bg-emerald-50 px-4 py-3 flex items-center gap-2 animate-fadeIn">

            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />

            <span className="text-xs font-mono text-emerald-800">

              Explanation refreshed successfully. Feature contributions
              and assessment values have been recalculated.

            </span>

          </div>

        )}

      </div>


      {/* ANALYSIS CONTEXT */}

      <div className="grid grid-cols-1 md:grid-cols-4 bg-white border border-stone-200">

        <div className="p-5 border-b md:border-b-0 md:border-r border-stone-200">

          <div className="text-[10px] font-mono uppercase text-stone-400">

            Transaction

          </div>

          <div className="font-mono font-bold text-sm mt-2">

            TX-7A92F

          </div>

        </div>


        <div className="p-5 border-b md:border-b-0 md:border-r border-stone-200">

          <div className="text-[10px] font-mono uppercase text-stone-400">

            Investigation Case

          </div>

          <div className="font-mono font-bold text-sm mt-2">

            CHK-2026-041

          </div>

        </div>


        <div className="p-5 border-b md:border-b-0 md:border-r border-stone-200">

          <div className="text-[10px] font-mono uppercase text-stone-400">

            Risk Assessment

          </div>

          <div className="flex items-center gap-2 mt-2">

            <AlertTriangle
              className={`w-4 h-4 ${riskStyles.icon}`}
            />

            <span
              className={`font-bold text-sm ${riskStyles.text}`}
            >

              {riskLevel}

            </span>

          </div>

        </div>


        <div className="p-5">

          <div className="text-[10px] font-mono uppercase text-stone-400">

            Model Confidence

          </div>

          <div className="font-mono font-bold text-sm text-emerald-700 mt-2">

            {modelConfidence}%

          </div>

        </div>

      </div>


      {/* SUMMARY */}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">


        {/* EXPLANATION SUMMARY */}

        <div className="lg:col-span-2 bg-white border border-stone-200">

          <div className="px-6 py-5 border-b border-stone-200">

            <div className="flex items-center gap-2">

              <Brain className="w-4 h-4 text-amber-700" />

              <h3 className="font-bold text-sm">

                Assessment Summary

              </h3>

            </div>

          </div>


          <div className="p-6">

            <div
              className={`border ${riskStyles.border} ${riskStyles.bg} p-5 transition-all duration-500`}
            >

              <div
                className={`text-[10px] font-mono uppercase ${riskStyles.text}`}
              >

                Dynamic Risk Score

              </div>

              <div className="font-mono text-3xl font-bold text-stone-900 mt-2">

                {riskScore} / 100

              </div>

              <div
                className={`flex items-center gap-2 mt-4 ${riskStyles.text}`}
              >

                <AlertTriangle className="w-4 h-4" />

                <span className="text-xs font-semibold">

                  {riskStyles.label}

                </span>

              </div>

            </div>


            <div className="mt-6">

              <div className="text-[10px] font-mono uppercase text-stone-400">

                Explanation Method

              </div>

              <div className="text-sm font-semibold mt-2">

                Feature attribution with graph context

              </div>

              <p className="text-xs text-stone-500 leading-relaxed mt-2">

                The explanation combines behavioural signals and graph
                relationships to show which observed factors contributed
                most to the risk assessment.

              </p>

            </div>


            <div className="mt-6 pt-5 border-t border-stone-200">

              <div className="flex items-start gap-3">

                <ShieldCheck className="w-5 h-5 text-emerald-700 mt-0.5" />

                <div>

                  <div className="text-sm font-semibold">

                    Analyst-readable output

                  </div>

                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">

                    Each factor can be reviewed together with its
                    supporting analysis source and investigation context.

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* FEATURE ATTRIBUTION */}

        <div className="lg:col-span-3 bg-white border border-stone-200">

          <div className="px-6 py-5 border-b border-stone-200">

            <div className="flex items-center justify-between gap-4">

              <div>

                <div className="flex items-center gap-2">

                  <Eye className="w-4 h-4 text-amber-700" />

                  <h3 className="font-bold text-sm">

                    Feature Contribution

                  </h3>

                </div>

                <p className="text-xs text-stone-500 mt-2">

                  Relative contribution of observed features to the
                  current risk assessment.

                </p>

              </div>


              <div className="hidden sm:block text-[10px] font-mono text-stone-400">

                RANKED BY CONTRIBUTION

              </div>

            </div>

          </div>


          <div className="divide-y divide-stone-200">

            {features.map(
              (feature, index) => {

                const isExpanded =
                  expandedFeature === feature.id;

                const width =
                  (feature.contribution /
                    maxContribution) *
                  100;

                return (

                  <div
                    key={feature.id}
                    className="px-6 py-5"
                  >

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedFeature(
                          isExpanded
                            ? null
                            : feature.id
                        )
                      }
                      className="w-full text-left"
                    >

                      <div className="flex items-start gap-4">

                        <div className="font-mono text-xs text-amber-700 pt-1">

                          {String(index + 1).padStart(
                            2,
                            '0'
                          )}

                        </div>


                        <div className="flex-1 min-w-0">

                          <div className="flex items-start justify-between gap-4">

                            <div>

                              <div className="font-semibold text-sm text-stone-800">

                                {feature.name}

                              </div>

                              <div className="text-[10px] font-mono text-stone-400 mt-1">

                                {feature.source}

                              </div>

                            </div>


                            <div className="flex items-center gap-3">

                              <span
                                className={`font-mono font-bold text-sm ${
                                  feature.direction === 'risk'
                                    ? 'text-amber-700'
                                    : 'text-stone-600'
                                }`}
                              >

                                +{feature.contribution.toFixed(1)}%

                              </span>

                              {isExpanded ? (

                                <ChevronUp className="w-4 h-4 text-stone-400" />

                              ) : (

                                <ChevronDown className="w-4 h-4 text-stone-400" />

                              )}

                            </div>

                          </div>


                          {/* CONTRIBUTION BAR */}

                          <div className="mt-4 w-full h-1.5 bg-stone-100">

                            <div
                              className={`h-full transition-all duration-700 ${
                                feature.direction === 'risk'
                                  ? 'bg-amber-600'
                                  : 'bg-stone-400'
                              }`}
                              style={{
                                width: `${width}%`,
                              }}
                            />

                          </div>


                          {/* EXPANDED EXPLANATION */}

                          {isExpanded && (

                            <div className="mt-4 border-l-2 border-stone-200 pl-4 animate-fadeIn">

                              <div className="text-[10px] font-mono uppercase text-stone-400">

                                Explanation

                              </div>

                              <p className="text-xs text-stone-600 leading-relaxed mt-2">

                                {feature.description}

                              </p>

                            </div>

                          )}

                        </div>

                      </div>

                    </button>

                  </div>

                );
              }
            )}

          </div>

        </div>

      </div>


      {/* EVIDENCE AND AUDIT CONTEXT */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">


        {/* LINKED SOURCES */}

        <div className="bg-white border border-stone-200">

          <div className="px-6 py-5 border-b border-stone-200">

            <div className="flex items-center gap-2">

              <Network className="w-4 h-4 text-amber-700" />

              <h3 className="font-bold text-sm">

                Linked Analysis Sources

              </h3>

            </div>

          </div>


          <div className="divide-y divide-stone-200">

            <div className="px-6 py-4 flex items-center justify-between gap-4">

              <div>

                <div className="text-sm font-semibold">

                  P2P Sentinel Activity

                </div>

                <div className="text-xs text-stone-500 mt-1">

                  Network propagation observations from monitored peers.

                </div>

              </div>

              <span className="font-mono text-xs text-stone-600">

                SEN-01

              </span>

            </div>


            <div className="px-6 py-4 flex items-center justify-between gap-4">

              <div>

                <div className="text-sm font-semibold">

                  AI Intelligence Analysis

                </div>

                <div className="text-xs text-stone-500 mt-1">

                  Behavioural anomaly and graph relationship assessment.

                </div>

              </div>

              <span className="font-mono text-xs text-stone-600">

                {riskScore} / 100

              </span>

            </div>


            <div className="px-6 py-4 flex items-center justify-between gap-4">

              <div>

                <div className="text-sm font-semibold">

                  Investigation Context

                </div>

                <div className="text-xs text-stone-500 mt-1">

                  Linked case information used for correlation analysis.

                </div>

              </div>

              <span className="font-mono text-xs text-stone-600">

                CHK-2026-041

              </span>

            </div>

          </div>

        </div>


        {/* AUDIT RECORD */}

        <div className="bg-white border border-stone-200">

          <div className="px-6 py-5 border-b border-stone-200">

            <div className="flex items-center gap-2">

              <FileText className="w-4 h-4 text-amber-700" />

              <h3 className="font-bold text-sm">

                Explanation Record

              </h3>

            </div>

          </div>


          <div className="p-6">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">

              <div>

                <div className="text-[10px] font-mono uppercase text-stone-400">

                  Transaction Reference

                </div>

                <div className="font-mono font-bold text-sm mt-2">

                  TX-7A92F

                </div>

              </div>


              <div>

                <div className="text-[10px] font-mono uppercase text-stone-400">

                  Case Reference

                </div>

                <div className="font-mono font-bold text-sm mt-2">

                  CHK-2026-041

                </div>

              </div>


              <div>

                <div className="text-[10px] font-mono uppercase text-stone-400">

                  Explanation Status

                </div>

                <div className="flex items-center gap-2 mt-2 text-emerald-700">

                  <CheckCircle2 className="w-4 h-4" />

                  <span className="font-semibold text-sm">

                    Generated

                  </span>

                </div>

              </div>


              <div>

                <div className="text-[10px] font-mono uppercase text-stone-400">

                  Last Updated

                </div>

                <div className="text-sm text-stone-700 mt-2">

                  {lastUpdated}

                </div>

              </div>

            </div>


            <div className="mt-6 pt-5 border-t border-stone-200">

              <p className="text-xs text-stone-500 leading-relaxed">

                The explanation record preserves the relationship between
                the AI assessment, contributing features and linked
                investigation context for analyst review.

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};