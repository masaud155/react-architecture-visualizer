import { ArchitectureScore } from '../components/simulator/ArchitectureScore.jsx';
import { Card, CardTitle } from '../components/ui/Card.jsx';
import { WarningCard } from '../components/ui/WarningCard.jsx';
import { TakeawayCard } from '../components/ui/TakeawayCard.jsx';
import { useSimulatorStore } from '../store/simulatorStore.js';

export function ArchitectureScorePage() {
  const mode = useSimulatorStore((state) => state.architectureMode);

  return (
    <div className="grid gap-4 xl:grid-cols-[420px_1fr]">
      <ArchitectureScore />
      <Card>
        <CardTitle>{mode === 'bad' ? 'Recommended Fix' : 'What Improved'}</CardTitle>
        <div className="mt-5 space-y-4">
          {mode === 'bad' ? (
            <>
              <WarningCard title="Problems">
                State is owned too high, unnecessary props cross multiple boundaries, and one context update can affect the entire dashboard.
              </WarningCard>
              <TakeawayCard>Move search state into SearchSection, isolate list rows, and split dashboard state by responsibility.</TakeawayCard>
            </>
          ) : (
            <>
              <TakeawayCard>Local state, focused providers, stable props, and smaller render zones keep the architecture understandable as the product grows.</TakeawayCard>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
