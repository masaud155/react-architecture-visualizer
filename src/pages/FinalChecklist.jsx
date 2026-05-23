import { ChecklistCard } from '../components/education/ChecklistCard.jsx';
import { checklist } from '../data/checklist.js';

export function FinalChecklist() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-primary">Review before shipping</p>
        <h1 className="mt-2 text-3xl font-semibold">React Architecture Final Checklist</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">Use this as a practical review pass before a feature grows into a render performance problem.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {checklist.map((item, index) => (
          <ChecklistCard key={item} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}
