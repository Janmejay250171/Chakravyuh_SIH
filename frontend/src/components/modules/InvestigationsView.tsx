import React, { useState } from 'react';

import {
  FolderSearch,
  Plus,
  RefreshCw,
  X,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ChevronRight,
  Network,
  Brain,
  Eye,
  FileText,
  Database,
  Printer,
  ArrowLeft,
  BarChart3,
  FileWarning,
  UserCheck,
} from 'lucide-react';

type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

type DossierStatus =
  | 'INVESTIGATING'
  | 'OPEN'
  | 'UNDER REVIEW';

type Dossier = {
  id: string;
  title: string;
  volume: string;
  risk: RiskLevel;
  status: DossierStatus;
  transactions: number;
  networkAnalysis: string;
  confidence: string;
  analyst: string;
  route: string;
};

type ActiveTab = 'overview' | 'clusters' | 'xai';

type XaiSection =
  | 'feature-attribution'
  | 'risk-evidence'
  | 'analyst-report'
  | null;

export const InvestigationsView: React.FC = () => {
  const [dossiers, setDossiers] = useState<Dossier[]>([
    {
      id: 'CHK-2026-041',
      title: 'Operation Dark Vortex',
      volume: '22.83 BTC',
      risk: 'CRITICAL',
      status: 'INVESTIGATING',
      transactions: 18,
      networkAnalysis: 'Demo mixer interaction',
      confidence: '98.4%',
      analyst: 'Demo Analyst',
      route: 'Seeded demo network route',
    },
    {
      id: 'CHK-2026-042',
      title: 'Project Ghost Ledger',
      volume: '49.11 BTC',
      risk: 'HIGH',
      status: 'OPEN',
      transactions: 11,
      networkAnalysis: 'Peer propagation anomaly',
      confidence: '87.2%',
      analyst: 'Demo Analyst',
      route: 'Cross-network peer route',
    },
    {
      id: 'CHK-2026-043',
      title: 'Syndicate P2P Hop',
      volume: '75.39 BTC',
      risk: 'MEDIUM',
      status: 'OPEN',
      transactions: 9,
      networkAnalysis: 'Clustered relay activity',
      confidence: '76.8%',
      analyst: 'Demo Analyst',
      route: 'Multi-hop routing pattern',
    },
    {
      id: 'CHK-2026-044',
      title: 'Tor Relay Sinks Alpha',
      volume: '101.67 BTC',
      risk: 'CRITICAL',
      status: 'OPEN',
      transactions: 26,
      networkAnalysis: 'Tor relay correlation',
      confidence: '95.1%',
      analyst: 'Demo Analyst',
      route: 'Privacy network route',
    },
    {
      id: 'CHK-2026-045',
      title: 'Cross Border Relay',
      volume: '127.95 BTC',
      risk: 'HIGH',
      status: 'OPEN',
      transactions: 14,
      networkAnalysis: 'Cross-border network anomaly',
      confidence: '89.6%',
      analyst: 'Demo Analyst',
      route: 'International relay path',
    },
  ]);

  const [selectedId, setSelectedId] =
    useState('CHK-2026-041');

  const [showCreatePanel, setShowCreatePanel] =
    useState(false);

  const [isCreating, setIsCreating] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState('');

  const [activeTab, setActiveTab] =
    useState<ActiveTab>('overview');

  const [activeXaiSection, setActiveXaiSection] =
    useState<XaiSection>(null);

  const [newDossierTitle, setNewDossierTitle] =
    useState('');

  const [newTransaction, setNewTransaction] =
    useState('');

  const [newRisk, setNewRisk] =
    useState<RiskLevel>('HIGH');

  const selectedDossier =
    dossiers.find(
      (dossier) => dossier.id === selectedId
    ) || dossiers[0];

  const getRiskClass = (risk: RiskLevel) => {
    switch (risk) {
      case 'CRITICAL':
        return 'bg-rose-50 border-rose-200 text-rose-700';

      case 'HIGH':
        return 'bg-amber-50 border-amber-200 text-amber-800';

      case 'MEDIUM':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';

      case 'LOW':
        return 'bg-emerald-50 border-emerald-200 text-emerald-700';

      default:
        return 'bg-stone-50 border-stone-200 text-stone-700';
    }
  };

  const getStatusClass = (
    status: DossierStatus
  ) => {
    switch (status) {
      case 'INVESTIGATING':
        return 'bg-blue-50 border-blue-200 text-blue-700';

      case 'UNDER REVIEW':
        return 'bg-amber-50 border-amber-200 text-amber-700';

      case 'OPEN':
        return 'bg-emerald-50 border-emerald-200 text-emerald-700';

      default:
        return 'bg-stone-50 border-stone-200 text-stone-700';
    }
  };

  const initializeNewDossier = () => {
    setSuccessMessage('');
    setShowCreatePanel(true);

    setTimeout(() => {
      document
        .getElementById('create-dossier-panel')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
    }, 100);
  };

  const closeCreatePanel = () => {
    if (isCreating) return;

    setShowCreatePanel(false);
    setNewDossierTitle('');
    setNewTransaction('');
    setNewRisk('HIGH');
  };

  const createNewDossier = () => {
    if (isCreating) return;

    if (!newDossierTitle.trim()) {
      return;
    }

    setIsCreating(true);

    setTimeout(() => {
      const highestNumber = dossiers.reduce(
        (highest, dossier) => {
          const number = Number(
            dossier.id.split('-').pop()
          );

          return number > highest
            ? number
            : highest;
        },
        0
      );

      const newId = `CHK-2026-${String(
        highestNumber + 1
      ).padStart(3, '0')}`;

      const newDossier: Dossier = {
        id: newId,
        title: newDossierTitle.trim(),
        volume: '0.00 BTC',
        risk: newRisk,
        status: 'UNDER REVIEW',
        transactions: newTransaction.trim()
          ? 1
          : 0,
        networkAnalysis:
          'Awaiting network intelligence analysis',
        confidence:
          'Pending AI analysis',
        analyst:
          'Unassigned',
        route: newTransaction.trim()
          ? `Seed reference: ${newTransaction.trim()}`
          : 'No seed transaction linked yet',
      };

      setDossiers((previous) => [
        newDossier,
        ...previous,
      ]);

      setSelectedId(newId);
      setActiveTab('overview');
      setActiveXaiSection(null);

      setIsCreating(false);
      setShowCreatePanel(false);

      setNewDossierTitle('');
      setNewTransaction('');
      setNewRisk('HIGH');

      setSuccessMessage(
        `${newId} created successfully and is now the active investigation dossier.`
      );

      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    }, 1200);
  };

  const refreshDossiers = () => {
    setSuccessMessage(
      'Dossier intelligence records refreshed successfully.'
    );

    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const openXaiSection = (
    section: XaiSection
  ) => {
    setActiveXaiSection(section);
  };

  const closeXaiSection = () => {
    setActiveXaiSection(null);
  };

  const printDossier = () => {
    const printWindow = window.open(
      '',
      '_blank',
      'width=900,height=700'
    );

    if (!printWindow) {
      return;
    }

    const currentDate =
      new Date().toLocaleString();

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>
            ${selectedDossier.id} - Investigation Dossier
          </title>

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              font-family: Arial, sans-serif;
              color: #1c1917;
              margin: 0;
              padding: 40px;
              background: #ffffff;
            }

            .header {
              border-bottom: 2px solid #b45309;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }

            .badge {
              display: inline-block;
              border: 1px solid #d97706;
              background: #fffbeb;
              color: #92400e;
              padding: 6px 10px;
              font-size: 12px;
              font-weight: bold;
              margin-bottom: 15px;
            }

            h1 {
              margin: 0;
              font-size: 26px;
            }

            .subtitle {
              color: #78716c;
              margin-top: 10px;
              font-size: 14px;
            }

            .section {
              margin-top: 25px;
            }

            .section-title {
              font-size: 12px;
              font-weight: bold;
              color: #78716c;
              text-transform: uppercase;
              border-bottom: 1px solid #d6d3d1;
              padding-bottom: 8px;
              margin-bottom: 15px;
            }

            .grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
            }

            .card {
              border: 1px solid #d6d3d1;
              padding: 18px;
            }

            .label {
              font-size: 11px;
              color: #78716c;
              text-transform: uppercase;
              margin-bottom: 8px;
            }

            .value {
              font-size: 16px;
              font-weight: bold;
            }

            .risk-critical {
              color: #be123c;
            }

            .risk-high {
              color: #b45309;
            }

            .risk-medium {
              color: #a16207;
            }

            .risk-low {
              color: #047857;
            }

            .footer {
              margin-top: 40px;
              border-top: 1px solid #d6d3d1;
              padding-top: 15px;
              color: #78716c;
              font-size: 11px;
            }

            @media print {
              body {
                padding: 20px;
              }
            }
          </style>
        </head>

        <body>

          <div class="header">

            <div class="badge">
              NTRO FORENSIC DIVISION
              &nbsp; • &nbsp;
              INVESTIGATION DOSSIER
            </div>

            <h1>
              ${selectedDossier.title}
            </h1>

            <div class="subtitle">
              Dossier ID:
              <strong>${selectedDossier.id}</strong>
              &nbsp; | &nbsp;
              Generated:
              ${currentDate}
            </div>

          </div>

          <div class="section">

            <div class="section-title">
              Investigation Summary
            </div>

            <div class="grid">

              <div class="card">
                <div class="label">
                  Risk Priority
                </div>

                <div class="value risk-${selectedDossier.risk.toLowerCase()}">
                  ${selectedDossier.risk}
                </div>
              </div>

              <div class="card">
                <div class="label">
                  Investigation Status
                </div>

                <div class="value">
                  ${selectedDossier.status}
                </div>
              </div>

              <div class="card">
                <div class="label">
                  Transaction Volume
                </div>

                <div class="value">
                  ${selectedDossier.volume}
                </div>
              </div>

              <div class="card">
                <div class="label">
                  Linked Transactions
                </div>

                <div class="value">
                  ${selectedDossier.transactions} Nodes
                </div>
              </div>

            </div>

          </div>

          <div class="section">

            <div class="section-title">
              Intelligence Analysis
            </div>

            <div class="grid">

              <div class="card">
                <div class="label">
                  Network Analysis
                </div>

                <div class="value">
                  ${selectedDossier.networkAnalysis}
                </div>
              </div>

              <div class="card">
                <div class="label">
                  Risk Confidence
                </div>

                <div class="value">
                  ${selectedDossier.confidence}
                </div>
              </div>

              <div class="card">
                <div class="label">
                  Assigned Analyst
                </div>

                <div class="value">
                  ${selectedDossier.analyst}
                </div>
              </div>

              <div class="card">
                <div class="label">
                  Routing Path
                </div>

                <div class="value">
                  ${selectedDossier.route}
                </div>
              </div>

            </div>

          </div>

          <div class="footer">

            CONFIDENTIAL INVESTIGATION INTELLIGENCE DOCUMENT

            <br />

            Generated from CHAKRAVYUH forensic intelligence system.

          </div>

          <script>
            window.onload = function () {
              window.print();
            };
          </script>

        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <div className="max-w-7xl mx-auto text-stone-900 font-sans space-y-5">

      {/* HEADER */}

      <div className="bg-white border border-stone-200 px-6 py-5">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          <div>

            <div className="inline-flex items-center gap-2 px-3 py-1 border border-amber-200 bg-amber-50 text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-amber-800">

              NTRO FORENSIC DIVISION

              <span className="text-amber-500">
                •
              </span>

              MULTI-HOP C2 INTELLIGENCE

            </div>

            <h2 className="flex items-center gap-2 text-xl font-bold mt-3">

              <FolderSearch className="w-5 h-5 text-amber-700" />

              Active Case Dossiers

            </h2>

            <p className="text-sm text-stone-500 mt-2 font-mono">

              Investigation intelligence synchronized from the
              case analysis environment

            </p>

          </div>

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={refreshDossiers}
              className="w-10 h-10 border border-stone-200 hover:bg-stone-50 flex items-center justify-center transition-colors"
              title="Refresh dossiers"
            >

              <RefreshCw className="w-4 h-4 text-stone-600" />

            </button>

            <button
              type="button"
              onClick={initializeNewDossier}
              className="flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-5 py-3 text-xs font-mono font-bold transition-colors"
            >

              <Plus className="w-4 h-4" />

              Initialize New Dossier

            </button>

          </div>

        </div>

      </div>


      {/* SUCCESS MESSAGE */}

      {successMessage && (

        <div className="border border-emerald-200 bg-emerald-50 px-5 py-4 flex items-center gap-3">

          <CheckCircle2 className="w-5 h-5 text-emerald-700" />

          <div>

            <div className="text-sm font-semibold text-emerald-800">

              Dossier Update

            </div>

            <div className="text-xs text-emerald-700 mt-1">

              {successMessage}

            </div>

          </div>

        </div>

      )}


      {/* CREATE DOSSIER PANEL */}

      {showCreatePanel && (

        <div
          id="create-dossier-panel"
          className="border-2 border-amber-400 bg-white shadow-md"
        >

          <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between">

            <div className="flex items-center gap-2">

              <div className="w-8 h-8 bg-amber-50 border border-amber-200 flex items-center justify-center">

                <Plus className="w-4 h-4 text-amber-700" />

              </div>

              <div>

                <h3 className="font-bold text-sm">

                  Initialize New Investigation Dossier

                </h3>

                <p className="text-xs text-stone-500 mt-1">

                  Create a new investigation record and
                  assign initial intelligence context.

                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={closeCreatePanel}
              disabled={isCreating}
              className="w-9 h-9 border border-stone-200 hover:bg-stone-50 flex items-center justify-center"
            >

              <X className="w-4 h-4" />

            </button>

          </div>


          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">

            <div>

              <label className="text-[10px] font-mono uppercase font-bold text-stone-500">

                Operation Name *

              </label>

              <input
                value={newDossierTitle}
                onChange={(event) =>
                  setNewDossierTitle(
                    event.target.value
                  )
                }
                placeholder="e.g. Operation Shadow Relay"
                className="w-full mt-2 border border-stone-300 px-3 py-3 text-sm outline-none focus:border-amber-500"
              />

            </div>


            <div>

              <label className="text-[10px] font-mono uppercase font-bold text-stone-500">

                Seed Transaction / Reference

              </label>

              <input
                value={newTransaction}
                onChange={(event) =>
                  setNewTransaction(
                    event.target.value
                  )
                }
                placeholder="TXID or intelligence reference"
                className="w-full mt-2 border border-stone-300 px-3 py-3 text-sm outline-none focus:border-amber-500"
              />

            </div>


            <div>

              <label className="text-[10px] font-mono uppercase font-bold text-stone-500">

                Initial Risk Priority

              </label>

              <select
                value={newRisk}
                onChange={(event) =>
                  setNewRisk(
                    event.target.value as RiskLevel
                  )
                }
                className="w-full mt-2 border border-stone-300 px-3 py-3 text-sm bg-white outline-none focus:border-amber-500"
              >

                <option value="CRITICAL">
                  CRITICAL
                </option>

                <option value="HIGH">
                  HIGH
                </option>

                <option value="MEDIUM">
                  MEDIUM
                </option>

                <option value="LOW">
                  LOW
                </option>

              </select>

            </div>

          </div>


          <div className="px-6 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

            <div className="text-xs text-stone-400">

              The dossier will be added to the investigation
              list and automatically selected.

            </div>

            <div className="flex gap-2">

              <button
                type="button"
                onClick={closeCreatePanel}
                disabled={isCreating}
                className="px-4 py-2.5 border border-stone-300 hover:bg-stone-50 text-xs font-semibold"
              >

                Cancel

              </button>

              <button
                type="button"
                onClick={createNewDossier}
                disabled={
                  isCreating ||
                  !newDossierTitle.trim()
                }
                className="px-4 py-2.5 bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2"
              >

                {isCreating ? (

                  <RefreshCw className="w-4 h-4 animate-spin" />

                ) : (

                  <FolderSearch className="w-4 h-4" />

                )}

                {isCreating
                  ? 'Creating Dossier...'
                  : 'Create Dossier'}

              </button>

            </div>

          </div>

        </div>

      )}


      {/* MAIN DOSSIER AREA */}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">


        {/* LEFT DOSSIER LIST */}

        <div className="lg:col-span-2 bg-white border border-stone-200">

          <div className="px-5 py-5 border-b border-stone-200 flex items-center justify-between">

            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-600">

              Assigned Dossiers ({dossiers.length})

            </div>

            <div className="border border-emerald-200 bg-emerald-50 text-emerald-700 px-3 py-1 text-[10px] font-mono">

              Live State

            </div>

          </div>


          <div className="p-5 space-y-3 max-h-[720px] overflow-y-auto">

            {dossiers.map((dossier) => {

              const isSelected =
                dossier.id === selectedId;

              return (

                <button
                  key={dossier.id}
                  type="button"
                  onClick={() => {

                    setSelectedId(dossier.id);

                    setActiveTab('overview');

                    setActiveXaiSection(null);

                    setSuccessMessage('');

                  }}
                  className={`w-full text-left border p-4 transition-all ${
                    isSelected
                      ? 'border-amber-400 bg-amber-50/40 shadow-sm'
                      : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >

                  <div className="flex items-center justify-between gap-3">

                    <span className="font-mono text-xs font-bold text-amber-800">

                      {dossier.id}

                    </span>

                    <span
                      className={`px-2 py-1 border text-[9px] font-mono font-bold ${getRiskClass(
                        dossier.risk
                      )}`}
                    >

                      {dossier.risk}

                    </span>

                  </div>


                  <div className="font-semibold text-sm mt-2">

                    {dossier.title}

                  </div>


                  <div className="flex items-center justify-between mt-4">

                    <span className="font-mono text-[10px] text-stone-500">

                      Vol: {dossier.volume}

                    </span>

                    <span
                      className={`px-2 py-1 border text-[9px] font-mono ${getStatusClass(
                        dossier.status
                      )}`}
                    >

                      {dossier.status}

                    </span>

                  </div>

                </button>

              );

            })}

          </div>

        </div>


        {/* RIGHT DOSSIER DETAILS */}

        <div className="lg:col-span-3 bg-white border border-stone-200">

          <div className="px-6 py-5 border-b border-stone-200">

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

              <div>

                <div className="flex items-center gap-2 flex-wrap">

                  <span className="px-2.5 py-1 border border-amber-200 bg-amber-50 text-amber-800 text-[10px] font-mono font-bold">

                    {selectedDossier.id}

                  </span>

                  <span
                    className={`px-2 py-1 border text-[9px] font-mono font-bold ${getStatusClass(
                      selectedDossier.status
                    )}`}
                  >

                    {selectedDossier.status}

                  </span>

                </div>


                <h3 className="font-bold text-lg mt-3">

                  {selectedDossier.title}

                </h3>


                <p className="text-xs text-stone-500 mt-2">

                  {selectedDossier.status ===
                  'UNDER REVIEW'
                    ? 'Newly initialized investigation dossier awaiting intelligence analysis.'
                    : 'Connected investigation intelligence record.'}

                </p>

              </div>


              <div className="flex flex-wrap items-center gap-2 self-start">

                <button
                  type="button"
                  onClick={printDossier}
                  className="flex items-center gap-2 px-4 py-2 border border-stone-300 bg-white hover:bg-stone-50 text-[10px] font-mono font-bold transition-colors"
                  title="Print current dossier"
                >

                  <Printer className="w-4 h-4 text-amber-700" />

                  Print Dossier

                </button>


                {/* TABS */}

                <div className="flex border border-stone-200">

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('overview');
                      setActiveXaiSection(null);
                    }}
                    className={`px-4 py-2 text-[10px] font-mono ${
                      activeTab === 'overview'
                        ? 'bg-stone-100 font-bold text-stone-900'
                        : 'text-stone-500 hover:bg-stone-50'
                    }`}
                  >

                    Overview

                  </button>


                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('clusters');
                      setActiveXaiSection(null);
                    }}
                    className={`px-4 py-2 text-[10px] font-mono border-l border-stone-200 ${
                      activeTab === 'clusters'
                        ? 'bg-stone-100 font-bold text-stone-900'
                        : 'text-stone-500 hover:bg-stone-50'
                    }`}
                  >

                    Clusters

                  </button>


                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('xai');
                      setActiveXaiSection(null);
                    }}
                    className={`px-4 py-2 text-[10px] font-mono border-l border-stone-200 ${
                      activeTab === 'xai'
                        ? 'bg-stone-100 font-bold text-stone-900'
                        : 'text-stone-500 hover:bg-stone-50'
                    }`}
                  >

                    XAI Audit

                  </button>

                </div>

              </div>

            </div>

          </div>


          {/* OVERVIEW TAB */}

          {activeTab === 'overview' && (

            <div className="p-6 space-y-4">

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                <div className="border border-stone-200 p-5">

                  <div className="text-[9px] font-mono uppercase text-stone-400">

                    Linked Transactions

                  </div>

                  <div className="font-mono text-xl font-bold mt-3">

                    {selectedDossier.transactions} Nodes

                  </div>

                </div>


                <div className="border border-stone-200 p-5">

                  <div className="text-[9px] font-mono uppercase text-stone-400">

                    Network Analysis

                  </div>

                  <div className="font-mono text-xs font-bold mt-4 text-rose-700">

                    {selectedDossier.networkAnalysis}

                  </div>

                </div>


                <div className="border border-stone-200 p-5">

                  <div className="text-[9px] font-mono uppercase text-stone-400">

                    Risk Confidence

                  </div>

                  <div className="font-mono text-xl font-bold mt-3 text-emerald-700">

                    {selectedDossier.confidence}

                  </div>

                </div>

              </div>


              <div className="border border-stone-200 p-5">

                <div className="text-[9px] font-mono uppercase text-stone-400">

                  Cross-Border Geo-ASN Routing Path

                </div>

                <div className="flex items-center gap-2 mt-3">

                  <Network className="w-4 h-4 text-amber-700" />

                  <span className="font-mono text-xs font-semibold">

                    {selectedDossier.route}

                  </span>

                </div>

              </div>


              <div className="border border-stone-200 p-5">

                <div className="text-[9px] font-mono uppercase text-stone-400">

                  Assigned Analyst

                </div>

                <div className="font-mono text-sm font-bold mt-3">

                  {selectedDossier.analyst}

                </div>

              </div>


              {selectedDossier.status ===
                'UNDER REVIEW' && (

                <div className="border border-amber-300 bg-amber-50 p-5">

                  <div className="flex items-start gap-3">

                    <AlertTriangle className="w-5 h-5 text-amber-700 mt-0.5" />

                    <div>

                      <div className="font-semibold text-sm text-amber-900">

                        Newly Initialized Dossier

                      </div>

                      <p className="text-xs text-amber-800 mt-2 leading-relaxed">

                        This dossier was created successfully and
                        is currently awaiting network intelligence,
                        blockchain graph correlation and AI-based
                        risk analysis.

                      </p>

                    </div>

                  </div>

                </div>

              )}

            </div>

          )}


          {/* CLUSTERS TAB */}

          {activeTab === 'clusters' && (

            <div className="p-6">

              <div className="border border-stone-200 p-6">

                <div className="flex items-center gap-3">

                  <Network className="w-5 h-5 text-amber-700" />

                  <div>

                    <div className="font-semibold text-sm">

                      Network Cluster Intelligence

                    </div>

                    <div className="text-xs text-stone-500 mt-1">

                      Cluster correlation for{' '}
                      {selectedDossier.id}

                    </div>

                  </div>

                </div>


                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="border border-stone-200 p-4">

                    <div className="text-[10px] font-mono text-stone-400">

                      PRIMARY CLUSTER

                    </div>

                    <div className="font-bold mt-2">

                      CLUSTER-
                      {selectedDossier.id.slice(-3)}

                    </div>

                  </div>


                  <div className="border border-stone-200 p-4">

                    <div className="text-[10px] font-mono text-stone-400">

                      CONNECTED NODES

                    </div>

                    <div className="font-bold mt-2">

                      {selectedDossier.transactions}

                    </div>

                  </div>

                </div>


                {selectedDossier.status ===
                  'UNDER REVIEW' && (

                  <div className="mt-4 border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">

                    Cluster intelligence will be populated after
                    network analysis is completed.

                  </div>

                )}

              </div>

            </div>

          )}


          {/* XAI TAB */}

          {activeTab === 'xai' && (

            <div className="p-6">

              {/* XAI MAIN MENU */}

              {!activeXaiSection && (

                <div className="border border-stone-200 p-6">

                  <div className="flex items-center gap-3">

                    <Brain className="w-5 h-5 text-amber-700" />

                    <div>

                      <div className="font-semibold text-sm">

                        Explainable Intelligence Audit

                      </div>

                      <div className="text-xs text-stone-500 mt-1">

                        AI evidence references associated with{' '}

                        {selectedDossier.id}

                      </div>

                    </div>

                  </div>


                  <div className="mt-6 space-y-3">


                    {/* FEATURE ATTRIBUTION */}

                    <button
                      type="button"
                      onClick={() =>
                        openXaiSection(
                          'feature-attribution'
                        )
                      }
                      className="w-full border border-stone-200 p-4 flex items-center justify-between text-left hover:bg-stone-50 hover:border-amber-300 transition-all group"
                    >

                      <div className="flex items-center gap-3">

                        <Eye className="w-4 h-4 text-amber-700" />

                        <div>

                          <div className="text-sm font-medium">

                            Feature Attribution

                          </div>

                          <div className="text-[10px] text-stone-400 mt-1">

                            View AI model feature influence

                          </div>

                        </div>

                      </div>

                      <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-700" />

                    </button>


                    {/* RISK EVIDENCE */}

                    <button
                      type="button"
                      onClick={() =>
                        openXaiSection(
                          'risk-evidence'
                        )
                      }
                      className="w-full border border-stone-200 p-4 flex items-center justify-between text-left hover:bg-stone-50 hover:border-amber-300 transition-all group"
                    >

                      <div className="flex items-center gap-3">

                        <ShieldAlert className="w-4 h-4 text-amber-700" />

                        <div>

                          <div className="text-sm font-medium">

                            Risk Evidence

                          </div>

                          <div className="text-[10px] text-stone-400 mt-1">

                            View supporting intelligence signals

                          </div>

                        </div>

                      </div>

                      <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-700" />

                    </button>


                    {/* ANALYST REPORT */}

                    <button
                      type="button"
                      onClick={() =>
                        openXaiSection(
                          'analyst-report'
                        )
                      }
                      className="w-full border border-stone-200 p-4 flex items-center justify-between text-left hover:bg-stone-50 hover:border-amber-300 transition-all group"
                    >

                      <div className="flex items-center gap-3">

                        <FileText className="w-4 h-4 text-amber-700" />

                        <div>

                          <div className="text-sm font-medium">

                            Analyst Report

                          </div>

                          <div className="text-[10px] text-stone-400 mt-1">

                            View investigation analyst findings

                          </div>

                        </div>

                      </div>

                      <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-700" />

                    </button>

                  </div>


                  {selectedDossier.status ===
                    'UNDER REVIEW' && (

                    <div className="mt-5 border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">

                      <Database className="w-4 h-4 text-amber-700 mt-0.5" />

                      <div>

                        <div className="text-xs font-semibold text-amber-900">

                          Analysis Pending

                        </div>

                        <div className="text-xs text-amber-800 mt-1">

                          AI explainability data will be generated
                          when this dossier receives linked
                          transaction intelligence.

                        </div>

                      </div>

                    </div>

                  )}

                </div>

              )}


              {/* FEATURE ATTRIBUTION PAGE */}

              {activeXaiSection ===
                'feature-attribution' && (

                <div className="border border-stone-200">

                  <div className="px-6 py-5 border-b border-stone-200 flex items-center gap-4">

                    <button
                      type="button"
                      onClick={closeXaiSection}
                      className="w-9 h-9 border border-stone-200 hover:bg-stone-50 flex items-center justify-center"
                    >

                      <ArrowLeft className="w-4 h-4" />

                    </button>

                    <div>

                      <div className="flex items-center gap-2">

                        <Eye className="w-5 h-5 text-amber-700" />

                        <h4 className="font-bold text-sm">

                          Feature Attribution

                        </h4>

                      </div>

                      <p className="text-xs text-stone-500 mt-1">

                        AI model decision factors for{' '}

                        {selectedDossier.id}

                      </p>

                    </div>

                  </div>


                  <div className="p-6 space-y-4">

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                      <div className="border border-stone-200 p-5">

                        <div className="text-[10px] font-mono text-stone-400 uppercase">

                          Network Pattern

                        </div>

                        <div className="font-bold text-amber-700 text-lg mt-3">

                          42.8%

                        </div>

                        <div className="text-xs text-stone-500 mt-2">

                          Influence on AI decision

                        </div>

                      </div>


                      <div className="border border-stone-200 p-5">

                        <div className="text-[10px] font-mono text-stone-400 uppercase">

                          Transaction Behaviour

                        </div>

                        <div className="font-bold text-rose-700 text-lg mt-3">

                          31.4%

                        </div>

                        <div className="text-xs text-stone-500 mt-2">

                          Influence on AI decision

                        </div>

                      </div>


                      <div className="border border-stone-200 p-5">

                        <div className="text-[10px] font-mono text-stone-400 uppercase">

                          Geo-ASN Correlation

                        </div>

                        <div className="font-bold text-blue-700 text-lg mt-3">

                          25.8%

                        </div>

                        <div className="text-xs text-stone-500 mt-2">

                          Influence on AI decision

                        </div>

                      </div>

                    </div>


                    <div className="border border-stone-200 p-5">

                      <div className="flex items-center gap-2">

                        <BarChart3 className="w-4 h-4 text-amber-700" />

                        <div className="font-semibold text-sm">

                          Model Explanation

                        </div>

                      </div>

                      <p className="text-sm text-stone-600 mt-4 leading-relaxed">

                        The AI risk classification for{' '}

                        <strong>
                          {selectedDossier.title}
                        </strong>

                        {' '}is primarily influenced by
                        detected network behaviour, transaction
                        relationships and cross-network routing
                        patterns.

                      </p>

                    </div>

                  </div>

                </div>

              )}


              {/* RISK EVIDENCE PAGE */}

              {activeXaiSection ===
                'risk-evidence' && (

                <div className="border border-stone-200">

                  <div className="px-6 py-5 border-b border-stone-200 flex items-center gap-4">

                    <button
                      type="button"
                      onClick={closeXaiSection}
                      className="w-9 h-9 border border-stone-200 hover:bg-stone-50 flex items-center justify-center"
                    >

                      <ArrowLeft className="w-4 h-4" />

                    </button>

                    <div>

                      <div className="flex items-center gap-2">

                        <ShieldAlert className="w-5 h-5 text-amber-700" />

                        <h4 className="font-bold text-sm">

                          Risk Evidence

                        </h4>

                      </div>

                      <p className="text-xs text-stone-500 mt-1">

                        Intelligence evidence supporting the risk
                        classification

                      </p>

                    </div>

                  </div>


                  <div className="p-6 space-y-3">

                    <div className="border border-rose-200 bg-rose-50/40 p-5">

                      <div className="flex items-center gap-3">

                        <FileWarning className="w-5 h-5 text-rose-700" />

                        <div>

                          <div className="font-semibold text-sm">

                            Risk Classification

                          </div>

                          <div className="text-xs text-stone-500 mt-1">

                            Current priority assessment

                          </div>

                        </div>

                      </div>

                      <div className="mt-4 text-xl font-bold text-rose-700">

                        {selectedDossier.risk}

                      </div>

                    </div>


                    <div className="border border-stone-200 p-5">

                      <div className="text-[10px] font-mono uppercase text-stone-400">

                        Network Evidence

                      </div>

                      <div className="font-semibold text-sm mt-3">

                        {selectedDossier.networkAnalysis}

                      </div>

                    </div>


                    <div className="border border-stone-200 p-5">

                      <div className="text-[10px] font-mono uppercase text-stone-400">

                        Routing Evidence

                      </div>

                      <div className="font-semibold text-sm mt-3">

                        {selectedDossier.route}

                      </div>

                    </div>


                    <div className="border border-stone-200 p-5">

                      <div className="text-[10px] font-mono uppercase text-stone-400">

                        Linked Intelligence Nodes

                      </div>

                      <div className="font-mono text-xl font-bold mt-3">

                        {selectedDossier.transactions}

                      </div>

                    </div>

                  </div>

                </div>

              )}


              {/* ANALYST REPORT PAGE */}

              {activeXaiSection ===
                'analyst-report' && (

                <div className="border border-stone-200">

                  <div className="px-6 py-5 border-b border-stone-200 flex items-center gap-4">

                    <button
                      type="button"
                      onClick={closeXaiSection}
                      className="w-9 h-9 border border-stone-200 hover:bg-stone-50 flex items-center justify-center"
                    >

                      <ArrowLeft className="w-4 h-4" />

                    </button>

                    <div>

                      <div className="flex items-center gap-2">

                        <FileText className="w-5 h-5 text-amber-700" />

                        <h4 className="font-bold text-sm">

                          Analyst Report

                        </h4>

                      </div>

                      <p className="text-xs text-stone-500 mt-1">

                        Investigation findings and analyst review

                      </p>

                    </div>

                  </div>


                  <div className="p-6 space-y-5">

                    <div className="border border-stone-200 p-5">

                      <div className="flex items-center gap-3">

                        <UserCheck className="w-5 h-5 text-amber-700" />

                        <div>

                          <div className="text-[10px] font-mono uppercase text-stone-400">

                            Assigned Analyst

                          </div>

                          <div className="font-bold text-sm mt-1">

                            {selectedDossier.analyst}

                          </div>

                        </div>

                      </div>

                    </div>


                    <div className="border border-stone-200 p-5">

                      <div className="text-[10px] font-mono uppercase text-stone-400">

                        Investigation Summary

                      </div>

                      <p className="text-sm text-stone-600 leading-relaxed mt-3">

                        Investigation dossier{' '}

                        <strong>
                          {selectedDossier.id}
                        </strong>

                        {' '}for{' '}

                        <strong>
                          {selectedDossier.title}
                        </strong>

                        {' '}contains{' '}

                        {selectedDossier.transactions}

                        {' '}linked intelligence nodes with a
                        current risk classification of{' '}

                        <strong>
                          {selectedDossier.risk}
                        </strong>

                        .

                      </p>

                    </div>


                    <div className="border border-stone-200 p-5">

                      <div className="text-[10px] font-mono uppercase text-stone-400">

                        Analyst Assessment

                      </div>

                      <p className="text-sm text-stone-600 leading-relaxed mt-3">

                        Current intelligence indicates{' '}

                        {selectedDossier.networkAnalysis.toLowerCase()}

                        . The routing path identified as{' '}

                        <strong>
                          {selectedDossier.route}
                        </strong>

                        {' '}requires continued monitoring and
                        correlation with incoming blockchain and
                        network intelligence.

                      </p>

                    </div>


                    <div className="border border-emerald-200 bg-emerald-50 p-5">

                      <div className="text-[10px] font-mono uppercase text-emerald-700">

                        AI Risk Confidence

                      </div>

                      <div className="text-2xl font-bold text-emerald-700 mt-2">

                        {selectedDossier.confidence}

                      </div>

                    </div>

                  </div>

                </div>

              )}

            </div>

          )}

        </div>

      </div>

    </div>
  );
};