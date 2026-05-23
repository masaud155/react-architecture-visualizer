import { NavLink } from 'react-router-dom';
import { Network } from 'lucide-react';
import { cn } from '../ui/utils.js';
import { navSections } from './navItems.js';

export function Sidebar() {
  return (
    <aside className="hidden h-screen w-72 shrink-0 border-r border-white/10 bg-[#060b14]/[0.88] p-4 backdrop-blur-xl lg:flex lg:flex-col">
      <div className="mb-5 rounded-lg border border-white/10 bg-white/[0.035] p-4 hairline">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-glow">
            <Network className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-100">React RenderFlow</h1>
            <p className="mt-0.5 text-[11px] uppercase tracking-[0.16em] text-primary">Simulator</p>
          </div>
        </div>
        <p className="mt-4 text-xs leading-5 text-muted-foreground">Learn React rendering behavior visually through architecture labs and render timelines.</p>
      </div>

      <nav className="min-h-0 flex-1 space-y-5 overflow-auto pr-1">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">{section.label}</p>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition duration-200',
                      isActive
                        ? 'bg-primary/[0.13] text-primary shadow-[inset_3px_0_0_rgb(20_184_166)]'
                        : 'text-muted-foreground hover:bg-white/[0.055] hover:text-slate-100',
                    )
                  }
                >
                  <item.icon className="h-4 w-4 shrink-0 transition group-hover:text-primary" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-3">
        <p className="text-xs font-medium text-slate-200">Architecture score</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">Use the score page after each lab to connect UI behavior with design quality.</p>
      </div>
    </aside>
  );
}
