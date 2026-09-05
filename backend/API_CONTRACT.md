# CHAKRAVYUH Backend API Contract
Base URL: `http://localhost:5000` · All JSON responses use `{ success, data }` or `{ success:false, message }`.

| Method | Endpoint | Frontend Page | Purpose |
|---|---|---|---|
| GET | /api/dashboard/summary | OverviewDashboard.tsx | Metrics + recent activity |
| GET | /api/dashboard/recent-transactions | OverviewDashboard.tsx | Recent transactions |
| GET | /api/alerts | ThreatAlertsView.tsx | Filter/search alerts |
| GET/PATCH | /api/alerts/:id, /status | ThreatAlertsView.tsx | Alert details/status |
| POST | /api/alerts/:id/investigate | ThreatAlertsView.tsx | Alert → case flow |
| GET/POST/PATCH | /api/cases, /api/cases/:id | InvestigationsView.tsx | Case CRUD |
| GET | /api/cases/:id/overview|clusters|xai | InvestigationsView.tsx | Case tabs |
| GET | /api/cases/:id/export | InvestigationsView.tsx | PDF dossier |
| GET/POST | /api/transactions, /api/transactions/analyze | TransactionAnalysisView.tsx | Search/analyze |
| GET | /api/transactions/:id/topology|heuristics|scoring | TransactionAnalysisView.tsx | Analysis tabs |
| POST | /api/transactions/:id/isolate | TransactionAnalysisView.tsx | Create/open investigation |
| GET | /api/graph | BlockchainGraphView.tsx | Graph data |
| POST | /api/graph/resync | BlockchainGraphView.tsx | Deterministic resync |
| GET | /api/graph/topology|entropy|heatmap|sankey | BlockchainGraphView.tsx | Graph tabs |
| GET/POST | /api/graph/nodes/:id, /api/graph/isolate | BlockchainGraphView.tsx | Node/cluster inspection |
| GET | /api/timeline | TimelineReplayView.tsx | Replay events |
| GET/POST | /api/sentinels, /api/sentinels/:id/check | P2PSentinelsView.tsx | Demo sentinel health |
| GET | /api/ai/summary, /api/ai/analyses | AIIntelligenceView.tsx | Prototype analysis data |
| GET | /api/explainability, /api/explainability/:transactionId | ExplainabilityView.tsx | XAI records |
| GET/POST | /api/feedback | AnalystFeedbackView.tsx | Feedback history/action |
| GET/PUT | /api/settings | SystemSettingsView.tsx | Demo settings |
| GET | /api/search?q= | AppLayout.tsx | Global search |

## Integration notes
- IDs are deterministic (`TX-001`, `ALT-001`, `CASE-001`).
- The same transaction is used across alerts, cases, graph nodes, timeline, scoring and explainability.
- Current frontend still imports `mockTransactions.json`; backend is ready for independent frontend integration without redesign.
- This MVP intentionally reports **seeded demo/prototype analysis**, not live blockchain, P2P, GNN, or model-retraining intelligence.
