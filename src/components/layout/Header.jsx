import { BookOpen, RotateCcw, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button.jsx';
import { SegmentedControl } from '../ui/Tabs.jsx';
import { ModeToggle } from '../simulator/ModeToggle.jsx';
import { useSimulatorStore } from '../../store/simulatorStore.js';

export function Header() {
  const developerMode = useSimulatorStore((state) => state.developerMode);
  const setDeveloperMode = useSimulatorStore((state) => state.setDeveloperMode);
  const resetSimulation = useSimulatorStore((state) => state.resetSimulation);

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-background/[0.82] px-4 py-3 backdrop-blur-xl lg:px-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            React architecture simulator
          </p>
          <h2 className="mt-1 text-xl font-semibold">React RenderFlow Simulator</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ModeToggle />
          <SegmentedControl
            options={['Beginner', 'Intermediate', 'Senior Engineer']}
            value={developerMode}
            onChange={setDeveloperMode}
          />
          <Button variant="secondary" onClick={resetSimulation}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/guide">
              <BookOpen className="h-4 w-4" />
              Guide
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
