import { NavLink } from 'react-router-dom';
import {
  Activity,
  BarChart3,
  Binary,
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
import { cn } from '../ui/utils.js';

const navItems = [
  { to: '/', label: 'Overview', icon: Gauge },
  { to: '/simulator', label: 'RenderFlow Simulator', icon: Network },
  { to: '/state-ownership', label: 'State Ownership Lab', icon: Boxes },
  { to: '/prop-flow', label: 'Prop Flow Visualizer', icon: GitBranch },
  { to: '/context-update', label: 'Context Update Lab', icon: Route },
  { to: '/memoization', label: 'Memoization Lab', icon: Binary },
  { to: '/list-rendering', label: 'List Rendering Lab', icon: ListTree },
  { to: '/anti-patterns', label: 'Architecture Anti-Patterns', icon: Layers },
  { to: '/dashboard-demo', label: 'Real-World Dashboard Demo', icon: BarChart3 },
  { to: '/performance-timeline', label: 'Performance Timeline', icon: Activity },
  { to: '/architecture-score', label: 'Architecture Score', icon: LineChart },
  { to: '/final-checklist', label: 'Final Checklist', icon: CheckSquare },
];

export function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-slate-950/[0.55] p-4 backdrop-blur-xl lg:block">
      <div className="mb-7">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-glow">
          <Network className="h-5 w-5" />
        </div>
        <h1 className="mt-4 text-lg font-semibold">React RenderFlow</h1>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">Learn React rendering behavior visually.</p>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition',
                isActive ? 'bg-primary/[0.14] text-primary' : 'text-muted-foreground hover:bg-white/[0.07] hover:text-foreground',
              )
            }
          >
            <item.icon className="h-4 w-4" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
