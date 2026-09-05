import React, { useState } from 'react';
import {
  Terminal,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileText,
  Brain,
  ShieldCheck,
  XCircle,
  Clock3,
} from 'lucide-react';

type Decision = 'confirm' | 'false-positive' | 'review';

type FinalAssessment = {
  score: number;
  riskLevel: 'LOW RISK' | 'HIGH RISK' | 'PENDING REVIEW';
  confidence: number;
  validationStatus:
    | 'CONFIRMED RISK'
    | 'FALSE POSITIVE'
    | 'PENDING REVIEW';
};

export const AnalystFeedbackView: React.FC = () => {
  const [decision, setDecision] =
    useState<Decision>('false-positive');

  const [notes, setNotes] = useState('');

  const [isRetraining, setIsRetraining] =
    useState(false);

  const [feedbackApplied, setFeedbackApplied] =
    useState(false);

  const [retrainStep, setRetrainStep] =
    useState('');

  const [finalAssessment, setFinalAssessment] =
    useState<FinalAssessment | null>(null);

  const formatTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getDecisionStyle = (
    value: Decision
  ) => {
    const active = decision === value;

    if (value === 'confirm') {
      return active
        ? 'border-rose-400 bg-rose-50 ring-1 ring-rose-200'
        : 'border-stone-200 bg-white hover:border-stone-300';
    }

    if (value === 'false-positive') {
      return active
        ? 'border-emerald-400 bg-emerald-50 ring-1 ring-emerald-200'
        : 'border-stone-200 bg-white hover:border-stone-300';
    }

    return active
      ? 'border-amber-400 bg-amber-50 ring-1 ring-amber-200'
      : 'border-stone-200 bg-white hover:border-stone-300';
  };

  const handleDecisionChange = (
    value: Decision
  ) => {
    if (feedbackApplied || isRetraining) return;

    setDecision(value);
  };

  const getOutcomeText = () => {
    if (decision === 'confirm') {
      return 'Confirm suspicious activity';
    }

    if (decision === 'false-positive') {
      return 'Confirmed false positive';
    }

    return 'Additional review required';
  };

  const generateFinalAssessment =
    (): FinalAssessment => {
      if (decision === 'confirm') {
        return {
          score: 92,
          riskLevel: 'HIGH RISK',
          confidence: 96,
          validationStatus: 'CONFIRMED RISK',
        };
      }

      if (decision === 'false-positive') {
        return {
          score: 18,
          riskLevel: 'LOW RISK',
          confidence: 94,
          validationStatus: 'FALSE POSITIVE',
        };
      }

      return {
        score: 52,
        riskLevel: 'PENDING REVIEW',
        confidence: 68,
        validationStatus: 'PENDING REVIEW',
      };
    };

  const handleFeedback = () => {
    if (
      isRetraining ||
      feedbackApplied
    ) {
      return;
    }

    setIsRetraining(true);

    setRetrainStep(
      'Recording analyst validation...'
    );

    setTimeout(() => {
      setRetrainStep(
        'Updating feedback dataset...'
      );
    }, 700);

    setTimeout(() => {
      setRetrainStep(
        'Recalculating validated assessment...'
      );
    }, 1400);

    setTimeout(() => {
      setRetrainStep(
        'Synchronising intelligence pipeline...'
      );
    }, 2100);

    setTimeout(() => {
      setFinalAssessment(
        generateFinalAssessment()
      );

      setRetrainStep('');
      setIsRetraining(false);
      setFeedbackApplied(true);
    }, 2900);
  };

  const getFinalAssessmentStyles = () => {
    if (!finalAssessment) {
      return '';
    }

    if (
      finalAssessment.validationStatus ===
      'FALSE POSITIVE'
    ) {
      return 'border-emerald-300 bg-emerald-50';
    }

    if (
      finalAssessment.validationStatus ===
      'CONFIRMED RISK'
    ) {
      return 'border-rose-300 bg-rose-50';
    }

    return 'border-amber-300 bg-amber-50';
  };

  const getFinalScoreColor = () => {
    if (!finalAssessment) {
      return '';
    }

    if (
      finalAssessment.validationStatus ===
      'FALSE POSITIVE'
    ) {
      return 'text-emerald-800';
    }

    if (
      finalAssessment.validationStatus ===
      'CONFIRMED RISK'
    ) {
      return 'text-rose-800';
    }

    return 'text-amber-800';
  };

  const getStatusBadgeStyle = () => {
    if (!finalAssessment) {
      return '';
    }

    if (
      finalAssessment.validationStatus ===
      'FALSE POSITIVE'
    ) {
      return 'border-emerald-200 bg-emerald-100 text-emerald-700';
    }

    if (
      finalAssessment.validationStatus ===
      'CONFIRMED RISK'
    ) {
      return 'border-rose-200 bg-rose-100 text-rose-700';
    }

    return 'border-amber-200 bg-amber-100 text-amber-700';
  };

  return (
    <div className="max-w-7xl mx-auto text-stone-900 font-sans space-y-5">

      {/* HEADER */}

      <div className="bg-white border border-stone-200 px-6 py-5">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          <div>

            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.15em] text-amber-800">

              <span className="w-2 h-2 bg-amber-600" />

              ANALYST REVIEW → MODEL FEEDBACK

            </div>

            <h2 className="flex items-center gap-2 text-xl font-bold mt-3">

              <Terminal className="w-5 h-5 text-amber-700" />

              Analyst Feedback

            </h2>

            <p className="text-sm text-stone-500 mt-2 max-w-2xl">

              Review AI-generated risk assessments and provide validated
              analyst feedback for the intelligence pipeline.

            </p>

          </div>

          <div
            className={`px-3 py-2 text-xs font-mono border ${
              feedbackApplied
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-stone-50 border-stone-200 text-stone-600'
            }`}
          >

            <span
              className={`inline-block w-2 h-2 mr-2 ${
                feedbackApplied
                  ? 'bg-emerald-500'
                  : 'bg-stone-400'
              }`}
            />

            {feedbackApplied
              ? 'FEEDBACK SYNCED'
              : 'AWAITING VALIDATION'}

          </div>

        </div>

      </div>


      {/* CASE CONTEXT */}

      <div className="grid grid-cols-1 lg:grid-cols-4 bg-white border border-stone-200">

        <div className="p-5 border-b lg:border-b-0 lg:border-r border-stone-200">

          <div className="text-[10px] font-mono uppercase text-stone-400">

            Investigation Case

          </div>

          <div className="font-mono font-bold text-sm mt-2">

            CHK-2026-041

          </div>

        </div>


        <div className="p-5 border-b lg:border-b-0 lg:border-r border-stone-200">

          <div className="text-[10px] font-mono uppercase text-stone-400">

            Transaction Reference

          </div>

          <div className="font-mono font-bold text-sm mt-2">

            TX-7A92F

          </div>

        </div>


        <div className="p-5 border-b lg:border-b-0 lg:border-r border-stone-200">

          <div className="text-[10px] font-mono uppercase text-stone-400">

            Cluster

          </div>

          <div className="font-mono font-bold text-sm mt-2">

            #772

          </div>

        </div>


        <div className="p-5">

          <div className="text-[10px] font-mono uppercase text-stone-400">

            Current Status

          </div>

          <div
            className={`font-mono font-bold text-sm mt-2 ${
              feedbackApplied &&
              finalAssessment?.validationStatus ===
                'FALSE POSITIVE'
                ? 'text-emerald-700'
                : feedbackApplied &&
                  finalAssessment?.validationStatus ===
                    'CONFIRMED RISK'
                ? 'text-rose-700'
                : 'text-stone-800'
            }`}
          >

            {feedbackApplied && finalAssessment
              ? finalAssessment.validationStatus
              : 'REQUIRES REVIEW'}

          </div>

        </div>

      </div>


      {/* MAIN REVIEW AREA */}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">


        {/* ORIGINAL AI ASSESSMENT */}

        <div className="lg:col-span-2 bg-white border border-stone-200">

          <div className="px-6 py-5 border-b border-stone-200">

            <div className="flex items-center justify-between gap-3">

              <div className="flex items-center gap-2">

                <Brain className="w-4 h-4 text-amber-700" />

                <h3 className="font-bold text-sm">

                  AI Assessment

                </h3>

              </div>

              <span className="text-[9px] font-mono uppercase text-stone-400">

                Original Prediction

              </span>

            </div>

            <p className="text-xs text-stone-500 mt-2">

              Original result received from the AI Intelligence analysis
              pipeline. This prediction remains preserved for audit history.

            </p>

          </div>


          <div className="p-6">

            {/* ORIGINAL SCORE - NEVER CHANGES */}

            <div className="border border-rose-200 bg-rose-50 p-5">

              <div className="flex items-center gap-2 text-rose-700">

                <AlertTriangle className="w-5 h-5" />

                <span className="font-bold text-sm">

                  HIGH RISK

                </span>

              </div>

              <div className="mt-4">

                <div className="text-[10px] font-mono uppercase text-rose-600">

                  Original AI Risk Score

                </div>

                <div className="font-mono font-bold text-3xl text-stone-900 mt-1">

                  87 / 100

                </div>

              </div>

            </div>


            <div className="mt-6 space-y-4">

              <div>

                <div className="text-[10px] font-mono uppercase text-stone-400">

                  Model Confidence

                </div>

                <div className="font-bold text-emerald-700 mt-1">

                  91%

                </div>

              </div>


              <div>

                <div className="text-[10px] font-mono uppercase text-stone-400">

                  Primary Signal

                </div>

                <div className="text-sm font-semibold mt-1">

                  Anomalous propagation pattern

                </div>

              </div>


              <div>

                <div className="text-[10px] font-mono uppercase text-stone-400">

                  Graph Correlation

                </div>

                <div className="text-sm font-semibold mt-1">

                  Investigation context detected

                </div>

              </div>

            </div>


            <div className="mt-6 pt-5 border-t border-stone-200">

              <div className="flex items-start gap-3">

                <ShieldCheck className="w-5 h-5 text-emerald-700 mt-0.5" />

                <p className="text-xs text-stone-600 leading-relaxed">

                  The original AI assessment is preserved and cannot be
                  overwritten. Analyst validation creates a separate final
                  operational assessment for investigation use.

                </p>

              </div>

            </div>

          </div>

        </div>


        {/* ANALYST VALIDATION */}

        <div className="lg:col-span-3 bg-white border border-stone-200">

          <div className="px-6 py-5 border-b border-stone-200">

            <div className="flex items-center gap-2">

              <FileText className="w-4 h-4 text-amber-700" />

              <h3 className="font-bold text-sm">

                Analyst Validation

              </h3>

            </div>

            <p className="text-xs text-stone-500 mt-2">

              Select the appropriate validation outcome based on available
              investigation evidence.

            </p>

          </div>


          <div className="p-6">

            {/* DECISION OPTIONS */}

            <div className="text-[10px] font-mono uppercase text-stone-400">

              Validation Decision

            </div>


            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">


              {/* CONFIRM RISK */}

              <button
                type="button"
                disabled={feedbackApplied || isRetraining}
                onClick={() =>
                  handleDecisionChange('confirm')
                }
                className={`text-left border p-4 transition-colors disabled:cursor-default disabled:opacity-80 ${getDecisionStyle(
                  'confirm'
                )}`}
              >

                <div className="flex items-center gap-2">

                  <AlertTriangle className="w-4 h-4 text-rose-600" />

                  <span className="font-semibold text-sm">

                    Confirm Risk

                  </span>

                </div>

                <p className="text-xs text-stone-500 mt-3 leading-relaxed">

                  Confirm the AI assessment as a valid suspicious activity.

                </p>

              </button>


              {/* FALSE POSITIVE */}

              <button
                type="button"
                disabled={feedbackApplied || isRetraining}
                onClick={() =>
                  handleDecisionChange('false-positive')
                }
                className={`text-left border p-4 transition-colors disabled:cursor-default disabled:opacity-80 ${getDecisionStyle(
                  'false-positive'
                )}`}
              >

                <div className="flex items-center gap-2">

                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />

                  <span className="font-semibold text-sm">

                    False Positive

                  </span>

                </div>

                <p className="text-xs text-stone-500 mt-3 leading-relaxed">

                  Mark this model assessment as an incorrect detection.

                </p>

              </button>


              {/* NEEDS REVIEW */}

              <button
                type="button"
                disabled={feedbackApplied || isRetraining}
                onClick={() =>
                  handleDecisionChange('review')
                }
                className={`text-left border p-4 transition-colors disabled:cursor-default disabled:opacity-80 ${getDecisionStyle(
                  'review'
                )}`}
              >

                <div className="flex items-center gap-2">

                  <FileText className="w-4 h-4 text-amber-700" />

                  <span className="font-semibold text-sm">

                    Needs Review

                  </span>

                </div>

                <p className="text-xs text-stone-500 mt-3 leading-relaxed">

                  Keep the assessment pending for further investigation.

                </p>

              </button>

            </div>


            {/* ANALYST NOTES */}

            <div className="mt-7">

              <label className="block text-[10px] font-mono uppercase text-stone-400">

                Analyst Notes

              </label>

              <textarea
                value={notes}
                disabled={
                  feedbackApplied ||
                  isRetraining
                }
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                placeholder="Add investigation evidence or analyst observations..."
                className="mt-3 w-full min-h-[130px] border border-stone-300 px-4 py-3 text-sm text-stone-700 outline-none focus:border-amber-500 resize-y disabled:bg-stone-50 disabled:text-stone-500"
              />

            </div>


            {/* SELECTED OUTCOME */}

            <div className="mt-6 border-t border-stone-200 pt-5">

              <div className="text-[10px] font-mono uppercase text-stone-400">

                Selected Outcome

              </div>

              <div className="flex items-center gap-2 mt-2">

                {decision === 'confirm' && (

                  <>
                    <AlertTriangle className="w-4 h-4 text-rose-600" />

                    <span className="font-semibold text-rose-700">

                      {getOutcomeText()}

                    </span>
                  </>

                )}

                {decision === 'false-positive' && (

                  <>
                    <XCircle className="w-4 h-4 text-emerald-600" />

                    <span className="font-semibold text-emerald-700">

                      {getOutcomeText()}

                    </span>
                  </>

                )}

                {decision === 'review' && (

                  <>
                    <Clock3 className="w-4 h-4 text-amber-700" />

                    <span className="font-semibold text-amber-800">

                      {getOutcomeText()}

                    </span>
                  </>

                )}

              </div>

            </div>


            {/* PROCESSING STATE */}

            {isRetraining && (

              <div className="mt-6 border border-amber-200 bg-amber-50 px-5 py-4">

                <div className="flex items-center gap-3">

                  <RefreshCw className="w-5 h-5 text-amber-700 animate-spin" />

                  <div>

                    <div className="text-sm font-semibold text-amber-900">

                      Processing analyst feedback

                    </div>

                    <div className="text-xs text-amber-800 mt-1">

                      {retrainStep}

                    </div>

                  </div>

                </div>

              </div>

            )}


            {/* FINAL VALIDATED ASSESSMENT */}

            {feedbackApplied &&
              finalAssessment && (

                <div
                  className={`mt-6 border px-5 py-5 ${getFinalAssessmentStyles()}`}
                >

                  <div className="flex items-start gap-3">

                    <CheckCircle2
                      className={`w-5 h-5 mt-0.5 ${
                        finalAssessment.validationStatus ===
                        'FALSE POSITIVE'
                          ? 'text-emerald-700'
                          : finalAssessment.validationStatus ===
                            'CONFIRMED RISK'
                          ? 'text-rose-700'
                          : 'text-amber-700'
                      }`}
                    />

                    <div className="flex-1">

                      {/* HEADER */}

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                        <div>

                          <div
                            className={`text-[10px] font-mono uppercase ${
                              getFinalScoreColor()
                            }`}
                          >

                            Final Validated Assessment

                          </div>

                          <div
                            className={`font-mono text-2xl font-bold mt-1 ${getFinalScoreColor()}`}
                          >

                            {finalAssessment.score} / 100

                          </div>

                        </div>


                        <span
                          className={`px-3 py-1 border text-[10px] font-mono font-bold ${getStatusBadgeStyle()}`}
                        >

                          {finalAssessment.riskLevel}

                        </span>

                      </div>


                      {/* DIVIDER */}

                      <div className="my-4 border-t border-stone-200/70" />


                      {/* FINAL DETAILS */}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <div>

                          <div className="text-[9px] font-mono uppercase text-stone-400">

                            Final Confidence

                          </div>

                          <div
                            className={`font-mono font-bold text-sm mt-1 ${getFinalScoreColor()}`}
                          >

                            {finalAssessment.confidence}%

                          </div>

                        </div>


                        <div>

                          <div className="text-[9px] font-mono uppercase text-stone-400">

                            Validation Status

                          </div>

                          <div
                            className={`font-mono font-bold text-sm mt-1 ${getFinalScoreColor()}`}
                          >

                            {
                              finalAssessment.validationStatus
                            }

                          </div>

                        </div>

                      </div>


                      {/* RESULT MESSAGE */}

                      <p className="text-xs text-stone-600 leading-relaxed mt-5">

                        {finalAssessment.validationStatus ===
                        'FALSE POSITIVE'
                          ? 'The original AI assessment was determined to be an incorrect detection after analyst validation and review of the available investigation evidence.'
                          : finalAssessment.validationStatus ===
                            'CONFIRMED RISK'
                          ? 'The original AI assessment was validated by the analyst and confirmed as a suspicious activity requiring continued investigation.'
                          : 'The available evidence was not sufficient to finalise the assessment. The transaction remains pending for additional investigation.'}

                      </p>


                      <div className="mt-4 text-[9px] font-mono uppercase text-stone-400">

                        Validated at {formatTime()}

                      </div>

                    </div>

                  </div>

                </div>

              )}


            {/* ACTION */}

            <div className="mt-7 pt-5 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div className="text-xs text-stone-500">

                Feedback will be linked to{' '}

                <span className="font-mono font-semibold text-stone-700">

                  CHK-2026-041

                </span>

                {' '}and{' '}

                <span className="font-mono font-semibold text-stone-700">

                  TX-7A92F

                </span>

              </div>


              <button
                type="button"
                onClick={handleFeedback}
                disabled={
                  isRetraining ||
                  feedbackApplied
                }
                className={`px-5 py-2.5 text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
                  feedbackApplied
                    ? 'bg-emerald-700 text-white cursor-default'
                    : isRetraining
                    ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                    : 'bg-amber-700 hover:bg-amber-800 text-white'
                }`}
              >

                {isRetraining ? (

                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />

                    Processing Feedback...
                  </>

                ) : feedbackApplied ? (

                  <>
                    <CheckCircle2 className="w-4 h-4" />

                    Feedback Applied
                  </>

                ) : (

                  <>
                    <RefreshCw className="w-4 h-4" />

                    Apply Feedback
                  </>

                )}

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};