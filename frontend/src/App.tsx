import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingView } from './components/modules/LandingView';
import { AppLayout } from './components/layout/AppLayout';
import { OverviewDashboard } from './components/modules/OverviewDashboard';
import { InvestigationsView } from './components/modules/InvestigationsView';
import { ThreatAlertsView } from './components/modules/ThreatAlertsView';
import { BlockchainGraphView } from './components/modules/BlockchainGraphView';
import { TransactionAnalysisView } from './components/modules/TransactionAnalysisView';
import { TimelineReplayView } from './components/modules/TimelineReplayView';
import { P2PSentinelsView } from './components/modules/P2PSentinelsView';
import { AIIntelligenceView } from './components/modules/AIIntelligenceView';
import { ExplainabilityView } from './components/modules/ExplainabilityView';
import { AnalystFeedbackView } from './components/modules/AnalystFeedbackView';
import { SystemSettingsView } from './components/modules/SystemSettingsView';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Cinematic Landing Page shown only on initial load */}
        <Route path="/" element={<LandingView />} />

        {/* Main C2 Dashboard Layout with individual module routes */}
        <Route element={<AppLayout />}>
          <Route path="/overview" element={<OverviewDashboard />} />
          <Route path="/investigations" element={<InvestigationsView />} />
          <Route path="/alerts" element={<ThreatAlertsView />} />
          <Route path="/graph" element={<BlockchainGraphView />} />
          <Route path="/transactions" element={<TransactionAnalysisView />} />
          <Route path="/timeline" element={<TimelineReplayView />} />
          <Route path="/sentinels" element={<P2PSentinelsView />} />
          <Route path="/ai-intelligence" element={<AIIntelligenceView />} />
          <Route path="/explainability" element={<ExplainabilityView />} />
          <Route path="/feedback" element={<AnalystFeedbackView />} />
          <Route path="/settings" element={<SystemSettingsView />} />
        </Route>

        {/* Catch-all redirect back to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;