import {
  Activity,
  BarChart3,
  Binary,
  BookOpen,
  Boxes,
  CheckSquare,
  Gauge,
  GitBranch,
  Layers,
  LineChart,
  ListTree,
  Network,
  Route,
} from 'lucide-react';

export const navSections = [
  {
    label: 'Analyze',
    items: [
      { to: '/', label: 'Overview', icon: Gauge },
      { to: '/simulator', label: 'RenderFlow Simulator', icon: Network },
      { to: '/performance-timeline', label: 'Performance Timeline', icon: Activity },
      { to: '/architecture-score', label: 'Architecture Score', icon: LineChart },
    ],
  },
  {
    label: 'Labs',
    items: [
      { to: '/state-ownership', label: 'State Ownership', icon: Boxes },
      { to: '/prop-flow', label: 'Prop Flow', icon: GitBranch },
      { to: '/context-update', label: 'Context Update', icon: Route },
      { to: '/memoization', label: 'Memoization', icon: Binary },
      { to: '/list-rendering', label: 'List Rendering', icon: ListTree },
      { to: '/dashboard-demo', label: 'Dashboard Demo', icon: BarChart3 },
    ],
  },
  {
    label: 'Reference',
    items: [
      { to: '/anti-patterns', label: 'Anti-Patterns', icon: Layers },
      { to: '/final-checklist', label: 'Final Checklist', icon: CheckSquare },
      { to: '/guide', label: 'How to Use', icon: BookOpen },
    ],
  },
];

export const navItems = navSections.flatMap((section) => section.items);
