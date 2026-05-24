import { useState } from 'react';
import { Trophy } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Card, CardTitle } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { MetricCard } from '../components/ui/MetricCard.jsx';
import { learningMissions } from '../data/featureData.js';

export function LearningMissions() {
  const [completed, setCompleted] = useState([]);
  const progress = Math.round((completed.length / learningMissions.length) * 100);

  function toggle(title) {
    setCompleted((items) => (items.includes(title) ? items.filter((item) => item !== title) : [...items, title]));
  }

  return (
    <div className="space-y-4">
      <PageHeader eyebrow="Missions" title="Guided learning missions" description="Turn architecture concepts into short practice challenges with clear success criteria." />
      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard label="Completed" value={completed.length} />
        <MetricCard label="Total missions" value={learningMissions.length} />
        <MetricCard label="Progress" value={`${progress}%`} tone={progress === 100 ? 'success' : 'primary'} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {learningMissions.map((mission) => {
          const done = completed.includes(mission.title);
          return (
            <Card key={mission.title} className={done ? 'border-primary/35' : ''}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge tone={done ? 'success' : 'muted'}>{done ? 'complete' : 'mission'}</Badge>
                  <CardTitle className="mt-3">{mission.title}</CardTitle>
                </div>
                <button type="button" onClick={() => toggle(mission.title)} className="rounded-md border border-white/10 bg-white/[0.04] p-2 text-muted-foreground transition hover:text-primary">
                  <Trophy className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">Goal: {mission.goal}</p>
              <p className="mt-2 text-sm leading-6 text-primary">Success: {mission.success}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
