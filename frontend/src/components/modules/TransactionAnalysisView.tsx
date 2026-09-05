import React, { useEffect, useRef, useState } from 'react';
import {
  Database,
  Search,
  CheckCircle2,
  AlertTriangle,
  Flag,
  Clock3,
} from 'lucide-react';

import mockData from './mockTransactions.json';

type InspectionStatus = 'idle' | 'success' | 'error';

type ActiveTab = 'topology' | 'heuristic' | 'scoring';

type FlaggedTransaction = {
  txid: string;
  flaggedAt: string;
  status: 'UNDER_INVESTIGATION';
};

const INVESTIGATION_STORAGE_KEY = 'chakravyuh_investigation_queue';

export const TransactionAnalysisView: React.FC = () => {
  const [selectedTx, setSelectedTx] = useState(mockData[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const [isInspecting, setIsInspecting] = useState(false);

  const [inspectionStatus, setInspectionStatus] =
    useState<InspectionStatus>('idle');

  const [statusMessage, setStatusMessage] = useState('');

  const [isFlagged, setIsFlagged] = useState(false);
  const [isFlagging, setIsFlagging] = useState(false);

  const [flaggedAt, setFlaggedAt] = useState<string | null>(null);

  const [activeTab, setActiveTab] =
    useState<ActiveTab>('topology');

  const analysisRef = useRef<HTMLDivElement>(null);

  /*
   * Check whether the currently selected transaction
   * already exists in the local investigation queue.
   */
  const getInvestigationRecord = (txid: string) => {
    try {
      const storedData = localStorage.getItem(
        INVESTIGATION_STORAGE_KEY
      );

      if (!storedData) {
        return null;
      }

      const queue: FlaggedTransaction[] =
        JSON.parse(storedData);

      return (
        queue.find((item) => item.txid === txid) || null
      );
    } catch {
      return null;
    }
  };

  /*
   * Sync investigation status whenever selected
   * transaction changes.
   */
  useEffect(() => {
    const investigationRecord =
      getInvestigationRecord(selectedTx.txid);

    if (investigationRecord) {
      setIsFlagged(true);
      setFlaggedAt(investigationRecord.flaggedAt);
    } else {
      setIsFlagged(false);
      setFlaggedAt(null);
    }
  }, [selectedTx.txid]);

  /*
   * Inspect transaction using TXID or Source IP.
   */
  const handleInspect = (e: React.FormEvent) => {
    e.preventDefault();

    const query = searchQuery.trim();

    if (!query) {
      setInspectionStatus('error');

      setStatusMessage(
        'Enter a TXID or Source IP to load a transaction for analysis.'
      );

      return;
    }

    setIsInspecting(true);

    setInspectionStatus('idle');

    setStatusMessage('');

    setTimeout(() => {
      const normalizedQuery =
        query.toLowerCase();

      const found = mockData.find(
        (tx: any) =>
          tx.txid
            .toLowerCase()
            .includes(normalizedQuery) ||
          tx.src_ip
            .toLowerCase()
            .includes(normalizedQuery)
      );

      if (found) {
        setSelectedTx(found);

        const investigationRecord =
          getInvestigationRecord(found.txid);

        if (investigationRecord) {
          setIsFlagged(true);

          setFlaggedAt(
            investigationRecord.flaggedAt
          );
        } else {
          setIsFlagged(false);

          setFlaggedAt(null);
        }

        setInspectionStatus('success');

        setStatusMessage(
          `Transaction ${found.txid} successfully loaded into the forensic analysis workspace.`
        );

        setTimeout(() => {
          analysisRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 100);
      } else {
        setInspectionStatus('error');

        setStatusMessage(
          'No matching transaction or Source IP was found in the demo dataset.'
        );
      }

      setIsInspecting(false);
    }, 600);
  };

  /*
   * Add transaction to the investigation queue.
   *
   * Currently persisted locally using localStorage
   * because this demo component does not contain
   * a backend API call.
   */
  const handleFlagTransaction = () => {
    if (isFlagged || isFlagging) {
      return;
    }

    setIsFlagging(true);

    setTimeout(() => {
      const now = new Date().toISOString();

      const investigationRecord: FlaggedTransaction = {
        txid: selectedTx.txid,
        flaggedAt: now,
        status: 'UNDER_INVESTIGATION',
      };

      try {
        const storedData =
          localStorage.getItem(
            INVESTIGATION_STORAGE_KEY
          );

        const existingQueue: FlaggedTransaction[] =
          storedData
            ? JSON.parse(storedData)
            : [];

        const alreadyExists =
          existingQueue.some(
            (item) =>
              item.txid === selectedTx.txid
          );

        if (!alreadyExists) {
          existingQueue.push(
            investigationRecord
          );

          localStorage.setItem(
            INVESTIGATION_STORAGE_KEY,
            JSON.stringify(existingQueue)
          );
        }

        setFlaggedAt(now);

        setIsFlagged(true);

        setStatusMessage(
          `Transaction ${selectedTx.txid} has been added to the investigation queue.`
        );

        setInspectionStatus('success');
      } catch {
        setStatusMessage(
          'Unable to update the investigation queue. Please try again.'
        );

        setInspectionStatus('error');
      }

      setIsFlagging(false);
    }, 700);
  };

  /*
   * Risk colour helper.
   */
  const getRiskBadgeClass = (
    riskLevel: string
  ) => {
    if (riskLevel === 'CRITICAL') {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }

    if (riskLevel === 'HIGH') {
      return 'bg-amber-50 text-amber-800 border-amber-200';
    }

    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  const getRiskTextClass = (
    riskLevel: string
  ) => {
    if (riskLevel === 'CRITICAL') {
      return 'text-rose-700';
    }

    if (riskLevel === 'HIGH') {
      return 'text-amber-700';
    }

    return 'text-emerald-700';
  };

  const formattedFlaggedTime = flaggedAt
    ? new Date(flaggedAt).toLocaleString()
    : null;

  return (
    <div className="space-y-6 text-stone-900 font-sans max-w-7xl mx-auto antialiased">

      {/* ================= TOP BANNER ================= */}

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white/90 backdrop-blur-md border border-stone-200/80 p-6 rounded-2xl shadow-xs gap-4">

        <div>
          <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-300/60 rounded-xl text-xs font-mono font-bold uppercase tracking-wider">
            Demo Forensic Transaction Analysis Engine
          </span>

          <h2 className="text-lg font-bold text-stone-900 mt-2 flex items-center tracking-tight">

            <Database className="w-5 h-5 mr-2 text-amber-700 animate-pulse" />

            Deep Transaction & Network Forensic Analysis

          </h2>
        </div>

        <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-mono font-bold flex items-center shadow-2xs">

          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-2" />

          Demo Dataset: Synchronized

        </span>

      </div>


      {/* ================= SEARCH BAR ================= */}

      <div className="bg-white/90 backdrop-blur-md border border-stone-200/80 p-5 rounded-2xl shadow-xs">

        <form
          onSubmit={handleInspect}
          className="flex flex-col sm:flex-row items-center gap-3"
        >

          <div className="relative flex-1 w-full">

            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setInspectionStatus('idle');
              }}
              placeholder="Enter TXID or Source IP for forensic analysis..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-stone-900 focus:outline-none focus:border-amber-600 focus:bg-white shadow-2xs"
            />

          </div>


          <button
            type="submit"
            disabled={isInspecting}
            className="w-full sm:w-auto px-6 py-2.5 bg-amber-700 hover:bg-amber-800 disabled:bg-amber-500 text-white rounded-xl text-xs font-mono font-bold transition-all shadow-xs flex items-center justify-center active:scale-95"
          >

            {isInspecting ? (
              <>
                <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin mr-2" />

                Parsing...

              </>
            ) : (
              'Inspect Transaction →'
            )}

          </button>

        </form>


        {/* ================= INSPECTION RESULT ================= */}

        {inspectionStatus !== 'idle' && (

          <div
            className={`mt-4 p-3 rounded-xl border flex items-center gap-2 text-xs font-mono animate-fadeIn ${
              inspectionStatus === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >

            {inspectionStatus === 'success' ? (

              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />

            ) : (

              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600" />

            )}

            <span>
              {statusMessage}
            </span>

          </div>

        )}

      </div>


      {/* ================= MAIN ANALYSIS ================= */}

      <div
        ref={analysisRef}
        className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-500 ${
          inspectionStatus === 'success'
            ? 'ring-2 ring-emerald-200 ring-offset-4 rounded-2xl'
            : ''
        }`}
      >


        {/* ================= LEFT ANALYSIS SECTION ================= */}

        <div className="lg:col-span-2 bg-white/90 backdrop-blur-md border border-stone-200/80 rounded-2xl p-6 shadow-xs space-y-6">


          {/* HEADER */}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-3">

            <div className="flex flex-wrap items-center gap-2">

              <span
                className={`px-2.5 py-0.5 border rounded text-xs font-mono font-bold ${getRiskBadgeClass(
                  selectedTx.riskLevel
                )}`}
              >
                {selectedTx.riskLevel} RISK
              </span>


              <span className="text-xs font-mono text-stone-500">

                TXID:{' '}

                <strong className="text-stone-900">
                  {selectedTx.txid}
                </strong>

              </span>


              {isFlagged && (

                <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 rounded text-xs font-mono font-bold text-emerald-700 flex items-center">

                  <Flag className="w-3 h-3 mr-1.5" />

                  UNDER INVESTIGATION

                </span>

              )}

            </div>


            {/* TABS */}

            <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-mono">

              {(
                [
                  'topology',
                  'heuristic',
                  'scoring',
                ] as const
              ).map((tab) => (

                <button
                  key={tab}
                  type="button"
                  onClick={() =>
                    setActiveTab(tab)
                  }
                  className={`px-3 py-1 rounded-lg font-bold transition-all capitalize ${
                    activeTab === tab
                      ? 'bg-white text-stone-900 shadow-2xs'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  {tab}
                </button>

              ))}

            </div>

          </div>


          {/* ================= TOPOLOGY ================= */}

          {activeTab === 'topology' && (

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs animate-fadeIn">


              <div className="p-4 bg-stone-50 border border-stone-200/80 rounded-xl space-y-2">

                <span className="text-[10px] text-stone-400 uppercase font-bold">
                  Transaction Source
                </span>

                <div className="text-stone-900 font-semibold">
                  Source: {selectedTx.source}
                </div>

                <div className="text-stone-600">
                  IP: {selectedTx.src_ip}
                </div>

                <div className="text-stone-500">
                  Geo: {selectedTx.geo_country_asn}
                </div>

              </div>


              <div className="p-4 bg-stone-50 border border-stone-200/80 rounded-xl space-y-2">

                <span className="text-[10px] text-stone-400 uppercase font-bold">
                  Transaction Relationship
                </span>

                <div className="text-amber-900 font-semibold">
                  Amount: {selectedTx.amountStr}
                </div>

                <div className="text-stone-600">
                  Risk Level: {selectedTx.riskLevel}
                </div>

                <div className="text-stone-500">
                  Demo topology generated from connected dataset.
                </div>

              </div>

            </div>

          )}


          {/* ================= HEURISTIC ================= */}

          {activeTab === 'heuristic' && (

            <div className="p-4 bg-stone-50 border border-stone-200/80 rounded-xl space-y-3 font-mono text-xs animate-fadeIn">

              <span className="text-[10px] text-stone-400 uppercase font-bold">
                Demo Heuristic Analysis
              </span>


              <div className="space-y-2">

                <div className="flex items-center justify-between p-2 bg-white border border-stone-200 rounded-lg">

                  <span>
                    Mixer Interaction Pattern
                  </span>

                  <span className="text-amber-700 font-bold">
                    REVIEW
                  </span>

                </div>


                <div className="flex items-center justify-between p-2 bg-white border border-stone-200 rounded-lg">

                  <span>
                    Network Route Association
                  </span>

                  <span className="text-stone-700 font-bold">
                    DETECTED
                  </span>

                </div>


                <div className="flex items-center justify-between p-2 bg-white border border-stone-200 rounded-lg">

                  <span>
                    Repeated Address Interaction
                  </span>

                  <span className="text-rose-700 font-bold">
                    FLAGGED
                  </span>

                </div>

              </div>


              <p className="text-stone-500 font-sans text-xs leading-relaxed">

                Prototype heuristic output generated from the seeded demo
                dataset. This is not a live blockchain finding.

              </p>

            </div>

          )}


          {/* ================= SCORING ================= */}

          {activeTab === 'scoring' && (

            <div className="p-4 bg-stone-50 border border-stone-200/80 rounded-xl space-y-4 font-mono text-xs animate-fadeIn">


              <div className="flex justify-between">

                <span>
                  Transaction Risk Classification
                </span>

                <span
                  className={`font-bold ${getRiskTextClass(
                    selectedTx.riskLevel
                  )}`}
                >
                  {selectedTx.riskLevel}
                </span>

              </div>


              <div>

                <div className="flex justify-between mb-1">

                  <span>
                    Mixer Probability
                  </span>

                  <span className="text-rose-700 font-bold">
                    Demo Score
                  </span>

                </div>

                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">

                  <div className="bg-rose-600 h-full w-[78%]" />

                </div>

              </div>


              <div>

                <div className="flex justify-between mb-1">

                  <span>
                    Network Risk
                  </span>

                  <span className="text-amber-700 font-bold">
                    Demo Score
                  </span>

                </div>

                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">

                  <div className="bg-amber-600 h-full w-[65%]" />

                </div>

              </div>


              <div>

                <div className="flex justify-between mb-1">

                  <span>
                    Behavioural Risk
                  </span>

                  <span className="text-stone-700 font-bold">
                    Demo Score
                  </span>

                </div>

                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">

                  <div className="bg-stone-700 h-full w-[52%]" />

                </div>

              </div>

            </div>

          )}


          {/* ================= SELECTED TRANSACTION ================= */}

          <div className="p-4 bg-amber-50/70 border border-amber-300/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">


            <div>

              <span className="text-amber-900 font-bold block">
                Selected Transaction Source
              </span>

              <span className="text-stone-600">

                {selectedTx.src_ip}{' '}
                ({selectedTx.geo_country_asn})

              </span>

            </div>


            <div className="text-left sm:text-right">

              <span className="text-amber-900 font-bold block">
                Transaction Amount
              </span>

              <span className="text-stone-800 font-bold">
                {selectedTx.amountStr}
              </span>

            </div>

          </div>

        </div>


        {/* ================= RIGHT RISK PANEL ================= */}

        <div className="bg-white/90 backdrop-blur-md border border-stone-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-6">


          <div className="space-y-4 font-mono text-xs">


            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 border-b border-stone-100 pb-2">

              Risk Analysis Summary

            </h3>


            {/* TRANSACTION ID */}

            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl">

              <span className="text-[10px] text-stone-400 uppercase">
                Transaction ID
              </span>

              <p className="text-xs font-bold text-stone-900 mt-1 break-all">

                {selectedTx.txid}

              </p>

            </div>


            {/* RISK CLASSIFICATION */}

            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl">

              <span className="text-[10px] text-stone-400 uppercase">
                Risk Classification
              </span>

              <p
                className={`text-lg font-bold mt-1 ${getRiskTextClass(
                  selectedTx.riskLevel
                )}`}
              >
                {selectedTx.riskLevel}
              </p>

            </div>


            {/* INVESTIGATION STATUS */}

            <div
              className={`p-3 border rounded-xl ${
                isFlagged
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-stone-50 border-stone-200'
              }`}
            >

              <span className="text-[10px] text-stone-400 uppercase">
                Investigation Status
              </span>


              <div className="flex items-center mt-2">

                {isFlagged ? (

                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2" />

                ) : (

                  <Clock3 className="w-4 h-4 text-stone-400 mr-2" />

                )}


                <span
                  className={`font-bold ${
                    isFlagged
                      ? 'text-emerald-700'
                      : 'text-stone-600'
                  }`}
                >

                  {isFlagged
                    ? 'UNDER INVESTIGATION'
                    : 'NOT FLAGGED'}

                </span>

              </div>


              {isFlagged &&
                formattedFlaggedTime && (

                  <p className="text-[10px] text-emerald-700/80 mt-2">

                    Flagged: {formattedFlaggedTime}

                  </p>

                )}

            </div>


            {/* DEMO INFORMATION */}

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">

              <p className="text-[10px] text-amber-800 leading-relaxed">

                Prototype Risk Assessment based on the connected seeded demo
                dataset and deterministic analysis logic.

              </p>

            </div>

          </div>


          {/* ================= FLAG BUTTON ================= */}

          <button
            type="button"
            onClick={handleFlagTransaction}
            disabled={isFlagged || isFlagging}
            className={`w-full py-3 rounded-xl text-xs font-mono font-bold transition-all shadow-xs flex items-center justify-center ${
              isFlagged
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-rose-600 hover:bg-rose-700 text-white active:scale-95'
            }`}
          >

            {isFlagging ? (

              <>
                <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin mr-2" />

                Adding to Investigation Queue...

              </>

            ) : isFlagged ? (

              <>

                <CheckCircle2 className="w-4 h-4 mr-2" />

                Under Investigation

              </>

            ) : (

              <>

                <Flag className="w-4 h-4 mr-2" />

                Flag for Investigation →

              </>

            )}

          </button>


          {/* DEMO PERSISTENCE NOTE */}

          <p className="text-[9px] text-stone-400 text-center font-mono">

            Investigation status is stored locally for this demo session.

          </p>

        </div>

      </div>

    </div>
  );
};