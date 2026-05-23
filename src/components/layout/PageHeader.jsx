import { Badge } from '../ui/Badge.jsx';

export function PageHeader({ eyebrow = 'Workspace', title, description, children }) {
  return (
    <section className="mb-5 rounded-lg border border-white/10 bg-gradient-to-br from-white/[0.075] via-white/[0.035] to-transparent p-5 shadow-[inset_0_1px_0_rgb(255_255_255/.06)] md:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <Badge tone="primary">{eyebrow}</Badge>
          <h1 className="mt-3 text-2xl font-semibold tracking-normal text-slate-50 md:text-3xl">{title}</h1>
          {description ? <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p> : null}
        </div>
        {children ? <div className="shrink-0">{children}</div> : null}
      </div>
    </section>
  );
}
