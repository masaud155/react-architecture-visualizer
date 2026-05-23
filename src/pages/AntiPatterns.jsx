import { AntiPatternCard } from '../components/education/AntiPatternCard.jsx';
import { antiPatterns } from '../data/antiPatterns.js';

export function AntiPatterns() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-primary">Anti-pattern library</p>
        <h1 className="mt-2 text-3xl font-semibold">React Architecture Anti-Patterns</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">Common mistakes that create unnecessary renders, unstable props, and teams that fear touching the dashboard.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {antiPatterns.map((pattern) => (
          <AntiPatternCard key={pattern.title} pattern={pattern} />
        ))}
      </div>
    </div>
  );
}
