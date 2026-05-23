import { Card } from '../ui/Card.jsx';

export function ExplanationBlock({ title, children }) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-[0.18em] text-primary">Architecture note</p>
      <h2 className="mt-2 text-lg font-semibold">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{children}</p>
    </Card>
  );
}
