import { Play } from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { interactionOptions } from '../../data/scenarios.js';
import { useRenderSimulation } from '../../hooks/useRenderSimulation.js';

export function InteractionControls() {
  const { selectedInteraction, setSelectedInteraction, triggerInteraction } = useRenderSimulation();

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-black/20 p-3 md:flex-row md:items-center">
      <select
        value={selectedInteraction}
        onChange={(event) => setSelectedInteraction(event.target.value)}
        className="h-10 flex-1 rounded-md border border-white/10 bg-slate-950 px-3 text-sm text-foreground outline-none transition focus:border-primary"
      >
        {interactionOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
      <Button onClick={triggerInteraction}>
        <Play className="h-4 w-4" />
        Trigger Interaction
      </Button>
    </div>
  );
}
