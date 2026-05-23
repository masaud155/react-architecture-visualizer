import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout.jsx';
import { Overview } from '../pages/Overview.jsx';
import { RenderFlowSimulator } from '../pages/RenderFlowSimulator.jsx';
import { StateOwnership } from '../pages/StateOwnership.jsx';
import { PropFlow } from '../pages/PropFlow.jsx';
import { ContextUpdate } from '../pages/ContextUpdate.jsx';
import { Memoization } from '../pages/Memoization.jsx';
import { ListRendering } from '../pages/ListRendering.jsx';
import { AntiPatterns } from '../pages/AntiPatterns.jsx';
import { DashboardDemoPage } from '../pages/DashboardDemoPage.jsx';
import { PerformanceTimeline } from '../pages/PerformanceTimeline.jsx';
import { ArchitectureScorePage } from '../pages/ArchitectureScorePage.jsx';
import { FinalChecklist } from '../pages/FinalChecklist.jsx';
import { Guide } from '../pages/Guide.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Overview /> },
      { path: 'simulator', element: <RenderFlowSimulator /> },
      { path: 'state-ownership', element: <StateOwnership /> },
      { path: 'prop-flow', element: <PropFlow /> },
      { path: 'context-update', element: <ContextUpdate /> },
      { path: 'memoization', element: <Memoization /> },
      { path: 'list-rendering', element: <ListRendering /> },
      { path: 'anti-patterns', element: <AntiPatterns /> },
      { path: 'dashboard-demo', element: <DashboardDemoPage /> },
      { path: 'performance-timeline', element: <PerformanceTimeline /> },
      { path: 'architecture-score', element: <ArchitectureScorePage /> },
      { path: 'final-checklist', element: <FinalChecklist /> },
      { path: 'guide', element: <Guide /> },
    ],
  },
]);
