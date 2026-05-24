/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AppLayout } from '../components/layout/AppLayout.jsx';

const Overview = lazy(() => import('../pages/Overview.jsx').then((module) => ({ default: module.Overview })));
const RenderFlowSimulator = lazy(() => import('../pages/RenderFlowSimulator.jsx').then((module) => ({ default: module.RenderFlowSimulator })));
const StateOwnership = lazy(() => import('../pages/StateOwnership.jsx').then((module) => ({ default: module.StateOwnership })));
const PropFlow = lazy(() => import('../pages/PropFlow.jsx').then((module) => ({ default: module.PropFlow })));
const ContextUpdate = lazy(() => import('../pages/ContextUpdate.jsx').then((module) => ({ default: module.ContextUpdate })));
const Memoization = lazy(() => import('../pages/Memoization.jsx').then((module) => ({ default: module.Memoization })));
const ListRendering = lazy(() => import('../pages/ListRendering.jsx').then((module) => ({ default: module.ListRendering })));
const AntiPatterns = lazy(() => import('../pages/AntiPatterns.jsx').then((module) => ({ default: module.AntiPatterns })));
const DashboardDemoPage = lazy(() => import('../pages/DashboardDemoPage.jsx').then((module) => ({ default: module.DashboardDemoPage })));
const PerformanceTimeline = lazy(() => import('../pages/PerformanceTimeline.jsx').then((module) => ({ default: module.PerformanceTimeline })));
const ArchitectureScorePage = lazy(() => import('../pages/ArchitectureScorePage.jsx').then((module) => ({ default: module.ArchitectureScorePage })));
const FinalChecklist = lazy(() => import('../pages/FinalChecklist.jsx').then((module) => ({ default: module.FinalChecklist })));
const Guide = lazy(() => import('../pages/Guide.jsx').then((module) => ({ default: module.Guide })));
const BeforeAfterDiff = lazy(() => import('../pages/BeforeAfterDiff.jsx').then((module) => ({ default: module.BeforeAfterDiff })));
const ExportReport = lazy(() => import('../pages/ExportReport.jsx').then((module) => ({ default: module.ExportReport })));
const ScenarioBuilder = lazy(() => import('../pages/ScenarioBuilder.jsx').then((module) => ({ default: module.ScenarioBuilder })));
const JsxImport = lazy(() => import('../pages/JsxImport.jsx').then((module) => ({ default: module.JsxImport })));
const ProfilerFlamegraph = lazy(() => import('../pages/ProfilerFlamegraph.jsx').then((module) => ({ default: module.ProfilerFlamegraph })));
const AdvisorSuite = lazy(() => import('../pages/AdvisorSuite.jsx').then((module) => ({ default: module.AdvisorSuite })));
const LearningMissions = lazy(() => import('../pages/LearningMissions.jsx').then((module) => ({ default: module.LearningMissions })));
const WhatIfStudio = lazy(() => import('../pages/WhatIfStudio.jsx').then((module) => ({ default: module.WhatIfStudio })));
const ArchitectureWorkbench = lazy(() => import('../pages/ArchitectureWorkbench.jsx').then((module) => ({ default: module.ArchitectureWorkbench })));
const ProjectAnalyzer = lazy(() => import('../pages/ProjectAnalyzer.jsx').then((module) => ({ default: module.ProjectAnalyzer })));
const FolderCompare = lazy(() => import('../pages/FolderCompare.jsx').then((module) => ({ default: module.FolderCompare })));
const CodeRefactorStudio = lazy(() => import('../pages/CodeRefactorStudio.jsx').then((module) => ({ default: module.CodeRefactorStudio })));
const ReplayDebugger = lazy(() => import('../pages/ReplayDebugger.jsx').then((module) => ({ default: module.ReplayDebugger })));

function withSuspense(element) {
  return (
    <Suspense fallback={<div className="panel p-6 text-sm text-muted-foreground">Loading workspace...</div>}>
      {element}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: withSuspense(<Overview />) },
      { path: 'simulator', element: withSuspense(<RenderFlowSimulator />) },
      { path: 'architecture-workbench', element: withSuspense(<ArchitectureWorkbench />) },
      { path: 'project-analyzer', element: withSuspense(<ProjectAnalyzer />) },
      { path: 'folder-compare', element: withSuspense(<FolderCompare />) },
      { path: 'code-refactor-studio', element: withSuspense(<CodeRefactorStudio />) },
      { path: 'replay-debugger', element: withSuspense(<ReplayDebugger />) },
      { path: 'what-if-studio', element: withSuspense(<WhatIfStudio />) },
      { path: 'scenario-builder', element: withSuspense(<ScenarioBuilder />) },
      { path: 'jsx-import', element: withSuspense(<JsxImport />) },
      { path: 'state-ownership', element: withSuspense(<StateOwnership />) },
      { path: 'prop-flow', element: withSuspense(<PropFlow />) },
      { path: 'context-update', element: withSuspense(<ContextUpdate />) },
      { path: 'memoization', element: withSuspense(<Memoization />) },
      { path: 'list-rendering', element: withSuspense(<ListRendering />) },
      { path: 'anti-patterns', element: withSuspense(<AntiPatterns />) },
      { path: 'dashboard-demo', element: withSuspense(<DashboardDemoPage />) },
      { path: 'performance-timeline', element: withSuspense(<PerformanceTimeline />) },
      { path: 'profiler', element: withSuspense(<ProfilerFlamegraph />) },
      { path: 'architecture-score', element: withSuspense(<ArchitectureScorePage />) },
      { path: 'advisor-suite', element: withSuspense(<AdvisorSuite />) },
      { path: 'before-after', element: withSuspense(<BeforeAfterDiff />) },
      { path: 'export-report', element: withSuspense(<ExportReport />) },
      { path: 'learning-missions', element: withSuspense(<LearningMissions />) },
      { path: 'final-checklist', element: withSuspense(<FinalChecklist />) },
      { path: 'guide', element: withSuspense(<Guide />) },
    ],
  },
]);
