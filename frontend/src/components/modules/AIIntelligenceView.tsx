import React, { useState } from 'react';
import {
  Cpu,
  Play,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Network,
  Brain,
  ShieldCheck,
  Database,
  Sparkles,
} from 'lucide-react';

type AnalysisStep = {
  title: string;
  description: string;
};

export const AIIntelligenceView: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Added only for analyst feedback actions
  const [isMarkingReview, setIsMarkingReview] = useState(false);
  const [isSendingInvestigation, setIsSendingInvestigation] =
    useState(false);

  const [reviewReference, setReviewReference] =
    useState<string | null>(null);

  const [investigationReference, setInvestigationReference] =
    useState<string | null>(null);

  const analysisSteps: AnalysisStep[] = [
    {
      title: 'Loading transaction and network context',
      description:
        'Preparing blockchain and monitored network metadata for analysis.',
    },
    {
      title: 'Running behavioural anomaly detection',
      description:
        'Evaluating transaction behaviour using the anomaly detection layer.',
    },
    {
      title: 'Analysing graph relationships',
      description:
        'Checking wallet, transaction and network relationships through the graph model.',
    },
    {
      title: 'Checking mixer participation',
      description:
        'Separating possible CoinJoin or mixer activity to avoid incorrect wallet linking.',
    },
    {
      title: 'Generating explainable risk assessment',
      description:
        'Preparing evidence-backed explanation and confidence score.',
    },
  ];

  const runAnalysis = () => {
    if (isRunning) return;

    setIsRunning(true);
    setAnalysisComplete(false);
    setCurrentStep(0);

    // Reset previous analyst action references
    setReviewReference(null);
    setInvestigationReference(null);

    let step = 0;

    const interval = window.setInterval(() => {
      step += 1;

      if (step >= analysisSteps.length) {
        window.clearInterval(interval);

        setTimeout(() => {
          setCurrentStep(analysisSteps.length);
          setAnalysisComplete(true);
          setIsRunning(false);
        }, 500);

        return;
      }

      setCurrentStep(step);
    }, 850);
  };

  const resetAnalysis = () => {
    setIsRunning(false);
    setAnalysisComplete(false);
    setCurrentStep(0);

    setReviewReference(null);
    setInvestigationReference(null);
    setIsMarkingReview(false);
    setIsSendingInvestigation(false);
  };

  const handleMarkForReview = () => {
    if (
      isMarkingReview ||
      isSendingInvestigation ||
      reviewReference
    ) {
      return;
    }

    setIsMarkingReview(true);

    window.setTimeout(() => {
      const reference =
        `REV-2026-${String(
          Math.floor(Math.random() * 9000) + 1000
        )}`;

      setReviewReference(reference);
      setIsMarkingReview(false);
    }, 1200);
  };

  const handleSendToInvestigation = () => {
    if (
      isSendingInvestigation ||
      isMarkingReview ||
      investigationReference
    ) {
      return;
    }

    setIsSendingInvestigation(true);

    window.setTimeout(() => {
      const reference =
        `INV-2026-${String(
          Math.floor(Math.random() * 9000) + 1000
        )}`;

      setInvestigationReference(reference);
      setIsSendingInvestigation(false);
    }, 1600);
  };

  const getStepStatus = (index: number) => {
    if (analysisComplete) return 'complete';

    if (isRunning && index < currentStep) {
      return 'complete';
    }

    if (isRunning && index === currentStep) {
      return 'running';
    }

    return 'pending';
  };

  return (
    <div className="max-w-7xl mx-auto text-stone-900 font-sans space-y-5">

      {/* HEADER */}

      <div className="bg-white border border-stone-200 px-6 py-5">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          <div>

            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.15em] text-amber-800">

              <span className="w-2 h-2 bg-amber-600" />

              AI / ML CORE → XAI RISK ENGINE

            </div>

            <h2 className="flex items-center gap-2 text-xl font-bold mt-3">

              <Cpu className="w-5 h-5 text-amber-700" />

              AI Intelligence

            </h2>

            <p className="text-sm text-stone-500 mt-2 max-w-2xl">

              Behavioural anomaly detection and graph-based relationship
              analysis with explainable risk assessment.

            </p>

          </div>

          <div className="flex items-center gap-3">

            <div className="border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-mono text-emerald-700">

              <span className="inline-block w-2 h-2 bg-emerald-500 mr-2 rounded-full" />

              MODEL READY

            </div>

            {!isRunning && !analysisComplete && (

              <button
                type="button"
                onClick={runAnalysis}
                className="flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-4 py-2.5 text-xs font-bold transition-colors"
              >

                <Play className="w-4 h-4" />

                Run Analysis

              </button>

            )}

            {analysisComplete && (

              <button
                type="button"
                onClick={resetAnalysis}
                className="flex items-center gap-2 border border-stone-300 hover:bg-stone-50 px-4 py-2.5 text-xs font-bold transition-colors"
              >

                <RefreshCw className="w-4 h-4" />

                New Analysis

              </button>

            )}

          </div>

        </div>

      </div>


      {/* SELECTED CONTEXT */}

      <div className="grid grid-cols-1 lg:grid-cols-3 border border-stone-200 bg-white">

        <div className="lg:col-span-2 p-6 border-b lg:border-b-0 lg:border-r border-stone-200">

          <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">

            Selected Analysis Context

          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">

            <div>

              <div className="text-[10px] font-mono uppercase text-stone-400">

                Transaction

              </div>

              <div className="font-mono font-bold text-sm mt-1">

                TX-7A92F

              </div>

            </div>

            <div>

              <div className="text-[10px] font-mono uppercase text-stone-400">

                Network Source

              </div>

              <div className="font-mono font-bold text-sm mt-1">

                10.144.20.12

              </div>

            </div>

            <div>

              <div className="text-[10px] font-mono uppercase text-stone-400">

                Investigation Case

              </div>

              <div className="font-mono font-bold text-sm mt-1">

                CHK-2026-041

              </div>

            </div>

            <div>

              <div className="text-[10px] font-mono uppercase text-stone-400">

                Analysis Mode

              </div>

              <div className="font-mono font-bold text-sm mt-1">

                Network + Blockchain

              </div>

            </div>

          </div>

        </div>


        {/* MODEL STACK */}

        <div className="p-6 bg-stone-50">

          <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">

            Analysis Stack

          </div>

          <div className="mt-4 space-y-3 text-xs font-mono">

            <div className="flex justify-between">

              <span className="text-stone-500">

                Behavioural Layer

              </span>

              <span className="font-bold">

                XGBoost / iForest

              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-stone-500">

                Graph Layer

              </span>

              <span className="font-bold">

                HGT

              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-stone-500">

                Pattern Detection

              </span>

              <span className="font-bold">

                HDBSCAN

              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-stone-500">

                Explainability

              </span>

              <span className="font-bold">

                TreeSHAP / GraphSHAP

              </span>

            </div>

          </div>

        </div>

      </div>


      {/* MAIN AREA */}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">


        {/* ANALYSIS PROCESS */}

        <div className="lg:col-span-2 bg-white border border-stone-200">

          <div className="px-6 py-5 border-b border-stone-200">

            <div className="flex items-center gap-2">

              <ActivityIcon />

              <h3 className="font-bold text-sm">

                Analysis Process

              </h3>

            </div>

            <p className="text-xs text-stone-500 mt-2">

              Current AI/ML processing pipeline.

            </p>

          </div>


          <div className="p-6 space-y-0">

            {analysisSteps.map((step, index) => {

              const status = getStepStatus(index);

              return (

                <div
                  key={step.title}
                  className="flex gap-4 relative"
                >

                  <div className="flex flex-col items-center">

                    <div
                      className={`w-8 h-8 flex items-center justify-center text-xs font-mono border ${
                        status === 'complete'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                          : status === 'running'
                          ? 'bg-amber-50 border-amber-400 text-amber-700'
                          : 'bg-white border-stone-200 text-stone-400'
                      }`}
                    >

                      {status === 'complete' ? (

                        <CheckCircle2 className="w-4 h-4" />

                      ) : status === 'running' ? (

                        <RefreshCw className="w-4 h-4 animate-spin" />

                      ) : (

                        String(index + 1).padStart(2, '0')

                      )}

                    </div>

                    {index !== analysisSteps.length - 1 && (

                      <div
                        className={`w-px h-10 ${
                          status === 'complete'
                            ? 'bg-emerald-300'
                            : 'bg-stone-200'
                        }`}
                      />

                    )}

                  </div>


                  <div className="pb-7 pt-1">

                    <div
                      className={`text-sm font-semibold ${
                        status === 'running'
                          ? 'text-amber-800'
                          : 'text-stone-800'
                      }`}
                    >

                      {step.title}

                    </div>

                    <div className="text-xs text-stone-500 mt-1 leading-relaxed">

                      {step.description}

                    </div>

                    {status === 'running' && (

                      <div className="flex gap-1 mt-3">

                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />

                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse delay-100" />

                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse delay-200" />

                      </div>

                    )}

                  </div>

                </div>

              );
            })}

          </div>

        </div>


        {/* OUTPUT */}

        <div className="lg:col-span-3 bg-white border border-stone-200">

          <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between">

            <div>

              <div className="flex items-center gap-2">

                <Brain className="w-4 h-4 text-amber-700" />

                <h3 className="font-bold text-sm">

                  Analysis Output

                </h3>

              </div>

              <p className="text-xs text-stone-500 mt-2">

                Explainable evidence generated from the selected analysis context.

              </p>

            </div>

            {analysisComplete && (

              <div className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5">

                ANALYSIS COMPLETE

              </div>

            )}

          </div>


          {!isRunning && !analysisComplete && (

            <div className="min-h-[460px] flex flex-col items-center justify-center text-center px-6">

              <Cpu className="w-10 h-10 text-stone-300" />

              <div className="font-semibold text-stone-700 mt-5">

                No active analysis

              </div>

              <p className="text-sm text-stone-500 mt-2 max-w-md">

                Run the AI analysis to evaluate behavioural anomalies,
                graph relationships and explainable risk signals.

              </p>

            </div>

          )}


          {isRunning && (

            <div className="min-h-[460px] flex flex-col items-center justify-center text-center px-6">

              <RefreshCw className="w-9 h-9 text-amber-700 animate-spin" />

              <div className="font-semibold text-stone-800 mt-5">

                Processing analysis

              </div>

              <p className="text-sm text-stone-500 mt-2">

                {analysisSteps[currentStep]?.title}

              </p>

              <div className="w-full max-w-sm h-1 bg-stone-100 mt-6 overflow-hidden">

                <div
                  className="h-full bg-amber-600 transition-all duration-500"
                  style={{
                    width: `${Math.max(
                      10,
                      (currentStep / analysisSteps.length) * 100
                    )}%`,
                  }}
                />

              </div>

            </div>

          )}


          {analysisComplete && (

            <div className="p-6">

              {/* RISK SUMMARY */}

              <div className="grid grid-cols-1 md:grid-cols-3 border border-stone-200">

                <div className="p-5 border-b md:border-b-0 md:border-r border-stone-200">

                  <div className="text-[10px] font-mono uppercase text-stone-400">

                    Risk Tier

                  </div>

                  <div className="flex items-center gap-2 mt-3 text-rose-700 font-bold text-lg">

                    <AlertTriangle className="w-5 h-5" />

                    HIGH

                  </div>

                </div>


                <div className="p-5 border-b md:border-b-0 md:border-r border-stone-200">

                  <div className="text-[10px] font-mono uppercase text-stone-400">

                    Dynamic Risk Score

                  </div>

                  <div className="text-2xl font-bold font-mono mt-2">

                    87 / 100

                  </div>

                </div>


                <div className="p-5">

                  <div className="text-[10px] font-mono uppercase text-stone-400">

                    Confidence

                  </div>

                  <div className="text-2xl font-bold font-mono text-emerald-700 mt-2">

                    91%

                  </div>

                </div>

              </div>


              {/* WHY FLAGGED */}

              <div className="mt-6">

                <div className="flex items-center gap-2">

                  <Sparkles className="w-4 h-4 text-amber-700" />

                  <h4 className="font-bold text-sm">

                    Why was this activity flagged?

                  </h4>

                </div>

                <p className="text-xs text-stone-500 mt-2">

                  Evidence-backed explanation generated by the analysis pipeline.

                </p>


                <div className="mt-4 border-t border-stone-200">

                  <div className="py-4 border-b border-stone-200 flex gap-4">

                    <div className="text-amber-700 mt-0.5">

                      01

                    </div>

                    <div>

                      <div className="font-semibold text-sm">

                        Unusual propagation pattern

                      </div>

                      <p className="text-xs text-stone-500 mt-1 leading-relaxed">

                        The transaction was observed propagating across multiple
                        monitored peers in a pattern outside the expected
                        baseline for the selected network sector.

                      </p>

                    </div>

                  </div>


                  <div className="py-4 border-b border-stone-200 flex gap-4">

                    <div className="text-amber-700 mt-0.5">

                      02

                    </div>

                    <div>

                      <div className="font-semibold text-sm">

                        Graph relationship correlation

                      </div>

                      <p className="text-xs text-stone-500 mt-1 leading-relaxed">

                        The graph analysis identified a relationship pattern
                        between the transaction, monitored peers and the
                        currently linked investigation context.

                      </p>

                    </div>

                  </div>


                  <div className="py-4 border-b border-stone-200 flex gap-4">

                    <div className="text-amber-700 mt-0.5">

                      03

                    </div>

                    <div>

                      <div className="font-semibold text-sm">

                        Mixer activity checked separately

                      </div>

                      <p className="text-xs text-stone-500 mt-1 leading-relaxed">

                        Possible mixer or CoinJoin participation was evaluated
                        separately so unrelated wallet entities are not merged
                        incorrectly during graph analysis.

                      </p>

                    </div>

                  </div>

                </div>

              </div>


              {/* MODEL CONTRIBUTION */}

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="border border-stone-200 p-5">

                  <div className="flex items-center gap-2">

                    <Database className="w-4 h-4 text-stone-600" />

                    <span className="text-[10px] font-mono uppercase text-stone-400">

                      Behavioural Layer

                    </span>

                  </div>

                  <div className="font-semibold text-sm mt-4">

                    Suspicious activity pattern detected

                  </div>

                  <p className="text-xs text-stone-500 mt-2 leading-relaxed">

                    Early anomaly scoring identified transaction behaviour
                    requiring further graph-based analysis.

                  </p>

                </div>


                <div className="border border-stone-200 p-5">

                  <div className="flex items-center gap-2">

                    <Network className="w-4 h-4 text-stone-600" />

                    <span className="text-[10px] font-mono uppercase text-stone-400">

                      Graph Layer

                    </span>

                  </div>

                  <div className="font-semibold text-sm mt-4">

                    Relational pattern detected

                  </div>

                  <p className="text-xs text-stone-500 mt-2 leading-relaxed">

                    The heterogeneous graph revealed relevant relationships
                    across transaction, wallet and monitored network entities.

                  </p>

                </div>

              </div>


              {/* XAI */}

              <div className="mt-6 border border-emerald-200 bg-emerald-50/40 p-5">

                <div className="flex items-start gap-3">

                  <ShieldCheck className="w-5 h-5 text-emerald-700 mt-0.5" />

                  <div>

                    <div className="font-bold text-sm text-stone-800">

                      Explainable assessment

                    </div>

                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">

                      The risk tier is not based on a single static rule.
                      Behavioural signals and graph relationships are combined
                      to generate a dynamic score with a ranked confidence
                      assessment and analyst-readable evidence.

                    </p>

                  </div>

                </div>

              </div>


              {/* ANALYST FEEDBACK */}

              <div className="mt-6 pt-5 border-t border-stone-200">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                  <div>

                    <div className="text-sm font-semibold">

                      Analyst review required

                    </div>

                    <div className="text-xs text-stone-500 mt-1">

                      Analyst feedback can be captured for the continuous learning loop.

                    </div>

                  </div>

                  <div className="flex flex-wrap gap-2">

                    {!reviewReference && (

                      <button
                        type="button"
                        onClick={handleMarkForReview}
                        disabled={
                          isMarkingReview ||
                          isSendingInvestigation
                        }
                        className="px-4 py-2 border border-stone-300 hover:bg-stone-50 disabled:opacity-60 disabled:cursor-not-allowed text-xs font-semibold transition-colors flex items-center gap-2"
                      >

                        {isMarkingReview && (

                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />

                        )}

                        {isMarkingReview
                          ? 'Marking for Review...'
                          : 'Mark for Review'}

                      </button>

                    )}


                    {!investigationReference && (

                      <button
                        type="button"
                        onClick={handleSendToInvestigation}
                        disabled={
                          isSendingInvestigation ||
                          isMarkingReview
                        }
                        className="px-4 py-2 bg-amber-700 hover:bg-amber-800 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors flex items-center gap-2"
                      >

                        {isSendingInvestigation && (

                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />

                        )}

                        {isSendingInvestigation
                          ? 'Creating Investigation...'
                          : 'Send to Investigation'}

                      </button>

                    )}

                  </div>

                </div>


                {/* ACTION REFERENCES */}

                {(reviewReference || investigationReference) && (

                  <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">

                    {reviewReference && (

                      <div className="border border-stone-200 bg-stone-50 px-4 py-3">

                        <div className="text-[10px] font-mono uppercase text-stone-400">

                          Review Reference Created

                        </div>

                        <div className="flex items-center justify-between gap-3 mt-2">

                          <span className="font-mono font-bold text-sm text-stone-800">

                            {reviewReference}

                          </span>

                          <span className="text-[10px] font-mono text-amber-700">

                            PENDING REVIEW

                          </span>

                        </div>

                        <div className="text-[10px] text-stone-500 mt-2">

                          Linked to TX-7A92F and case CHK-2026-041

                        </div>

                      </div>

                    )}


                    {investigationReference && (

                      <div className="border border-amber-200 bg-amber-50/40 px-4 py-3">

                        <div className="text-[10px] font-mono uppercase text-amber-700">

                          Investigation Reference Created

                        </div>

                        <div className="flex items-center justify-between gap-3 mt-2">

                          <span className="font-mono font-bold text-sm text-stone-800">

                            {investigationReference}

                          </span>

                          <span className="text-[10px] font-mono text-amber-700">

                            REFERRED

                          </span>

                        </div>

                        <div className="text-[10px] text-stone-500 mt-2">

                          Linked to TX-7A92F and case CHK-2026-041

                        </div>

                      </div>

                    )}

                  </div>

                )}

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
};


const ActivityIcon: React.FC = () => {
  return (
    <div className="w-4 h-4 flex items-end gap-[2px]">

      <span className="w-[3px] h-[7px] bg-amber-700" />

      <span className="w-[3px] h-[13px] bg-amber-700" />

      <span className="w-[3px] h-[9px] bg-amber-700" />

    </div>
  );
};