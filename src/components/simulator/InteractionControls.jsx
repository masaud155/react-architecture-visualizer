import { ChevronDown, Play } from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { interactionOptions } from '../../data/scenarios.js';
import { useRenderSimulation } from '../../hooks/useRenderSimulation.js';

export function InteractionControls() {
  const { selectedInteraction, setSelectedInteraction, triggerInteraction } = useRenderSimulation();

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-black/25 p-2 shadow-[inset_0_1px_0_rgb(255_255_255/.05)] md:flex-row md:items-center">
      <label className="relative min-w-72 flex-1">
        <span className="sr-only">Interaction</span>
        <select
          value={selectedInteraction}
          onChange={(event) => setSelectedInteraction(event.target.value)}
          className="h-10 w-full appearance-none rounded-md border border-white/10 bg-slate-950/90 px-3 pr-9 text-sm text-foreground outline-none transition focus:border-primary"
        >
          {interactionOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
      </label>
      <Button onClick={triggerInteraction}>
        <Play className="h-4 w-4" />
        Trigger Interaction
      </Button>
    </div>
  );
}
