import { BookOpen, RotateCcw, Sparkles } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button.jsx';
import { SegmentedControl } from '../ui/Tabs.jsx';
import { ModeToggle } from '../simulator/ModeToggle.jsx';
import { useSimulatorStore } from '../../store/simulatorStore.js';
import { navItems } from './navItems.js';
import { cn } from '../ui/utils.js';

export function Header() {
  const developerMode = useSimulatorStore((state) => state.developerMode);
  const setDeveloperMode = useSimulatorStore((state) => state.setDeveloperMode);
  const resetSimulation = useSimulatorStore((state) => state.resetSimulation);
  const architectureMode = useSimulatorStore((state) => state.architectureMode);
  const location = useLocation();
  const currentPage = navItems.find((item) => item.to === location.pathname) ?? navItems[0];

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#080d18]/95 px-3 py-3 backdrop-blur-xl sm:px-4 lg:px-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            React architecture simulator
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h2 className="truncate text-lg font-semibold text-slate-100 sm:text-xl">React RenderFlow Simulator</h2>
            <span className="hidden rounded-md border border-white/10 bg-white/[0.045] px-2 py-1 text-[11px] text-muted-foreground md:inline-flex">
              {currentPage.label}
            </span>
            <span className="hidden rounded-md border border-primary/20 bg-primary/[0.08] px-2 py-1 text-[11px] text-primary md:inline-flex">
              {architectureMode === 'bad' ? 'Diagnostic mode' : 'Optimized mode'}
            </span>
          </div>
        </div>
        <div className="grid w-full gap-2 rounded-lg border border-white/10 bg-black/20 p-1.5 xl:w-auto xl:grid-flow-col xl:items-center">
          <div className="grid gap-2 md:grid-cols-[auto_minmax(0,1fr)] xl:flex">
            <ModeToggle className="w-full" />
            <SegmentedControl
              className="w-full"
              options={['Beginner', 'Intermediate', 'Senior Engineer']}
              value={developerMode}
              onChange={setDeveloperMode}
            />
          </div>
          <div className="hidden h-7 w-px bg-white/10 xl:block" />
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <Button variant="secondary" className="w-full sm:w-auto" onClick={resetSimulation}>
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Button variant="secondary" className="w-full sm:w-auto" asChild>
              <Link to="/guide">
                <BookOpen className="h-4 w-4" />
                Guide
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium transition',
                isActive
                  ? 'border-primary/35 bg-primary/[0.13] text-primary'
                  : 'border-white/10 bg-white/[0.04] text-muted-foreground hover:text-slate-100',
              )
            }
          >
            <item.icon className="h-3.5 w-3.5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
