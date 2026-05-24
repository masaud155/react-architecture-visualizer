import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, FolderOpen, UploadCloud } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Card, CardTitle } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { MetricCard } from '../components/ui/MetricCard.jsx';
import { analyzeProject } from '../utils/projectAnalyzer.js';

const demoFiles = [
  { path: 'src/App.jsx', content: 'import { createContext, useState } from "react";\nexport function App(){ const [filters,setFilters]=useState({}); return <Dashboard filters={filters} /> }' },
  { path: 'src/pages/Dashboard.jsx', content: Array(260).fill('const value = true;').join('\n') + '\nexport function Dashboard(){ return <UserTable options={{ dense: true }} onSelect={() => {}} /> }' },
  { path: 'src/components/UserTable.jsx', content: 'export function UserTable({ options }) { return <div /> }' },
  { path: 'src/context/AppContext.jsx', content: 'import { createContext } from "react"; export const AppContext = createContext({});' },
  { path: 'src/hooks/useUsers.js', content: 'export function useUsers(){ return [] }' },
];

function TreeNode({ node, depth = 0 }) {
  const children = [...node.children.values()].sort((a, b) => {
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-white/[0.04]" style={{ paddingLeft: `${depth * 14 + 8}px` }}>
        <span className={node.type === 'folder' ? 'font-medium text-slate-200' : 'font-mono text-xs text-muted-foreground'}>{node.name}</span>
        <span className="text-[11px] text-muted-foreground">{node.count}</span>
      </div>
      {children.slice(0, depth > 2 ? 10 : 40).map((child) => (
        <TreeNode key={`${child.name}-${depth}`} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

function getScoreTone(score) {
  if (score >= 80) return 'success';
  if (score >= 60) return 'warning';
  return 'danger';
}

async function readUploadedFiles(fileList) {
  const files = [...fileList]
    .filter((file) => !/node_modules|dist|build|coverage|\.git/.test(file.webkitRelativePath || file.name))
    .slice(0, 600);

  const readable = files.filter((file) => /\.(jsx?|tsx?|css|json|md)$/i.test(file.name) && file.size < 180_000);
  return Promise.all(
    readable.map(async (file) => ({
      path: file.webkitRelativePath || file.name,
      content: await file.text(),
      size: file.size,
    })),
  );
}

export function ProjectAnalyzer() {
  const [files, setFiles] = useState(demoFiles);
  const [selectedSmell, setSelectedSmell] = useState(null);
  const [isReading, setIsReading] = useState(false);
  const analysis = useMemo(() => analyzeProject(files), [files]);
  const activeSmell = selectedSmell ?? analysis.smells[0];

  async function handleUpload(event) {
    setIsReading(true);
    const uploaded = await readUploadedFiles(event.target.files);
    setFiles(uploaded.length ? uploaded : demoFiles);
    setSelectedSmell(null);
    setIsReading(false);
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Project Analyzer"
        title="Import a React project folder and get architecture guidance"
        description="Analyze folder structure, source files, component organization, context ownership, large files, prop identity risks, and recommended improvements. Everything runs locally in your browser."
      >
        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-primary/40 bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[0_10px_28px_rgb(20_184_166/.18)] transition hover:bg-primary/90">
          <UploadCloud className="h-4 w-4" />
          {isReading ? 'Reading...' : 'Import folder'}
          <input type="file" webkitdirectory="true" directory="" multiple className="sr-only" onChange={handleUpload} />
        </label>
      </PageHeader>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <MetricCard label="Structure score" value={analysis.score} tone={getScoreTone(analysis.score)} />
        <MetricCard label="Files scanned" value={analysis.totals.files} />
        <MetricCard label="Source files" value={analysis.totals.source} />
        <MetricCard label="Components" value={analysis.totals.components} />
        <MetricCard label="Hooks" value={analysis.totals.hooks} />
        <MetricCard label="Smells" value={analysis.smells.length} tone={analysis.smells.length ? 'warning' : 'success'} />
      </div>

      <div className="grid gap-4 2xl:grid-cols-[360px_minmax(0,1fr)_420px]">
        <Card>
          <div className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" />
            <CardTitle>Project Tree</CardTitle>
          </div>
          <div className="mt-4 max-h-[620px] overflow-auto rounded-lg border border-white/10 bg-slate-950/55 p-2">
            <TreeNode node={analysis.tree} />
          </div>
        </Card>

        <section className="space-y-4">
          <Card>
            <CardTitle>Detected Architecture Smells</CardTitle>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {analysis.smells.map((smell) => (
                <button
                  type="button"
                  key={smell.title}
                  onClick={() => setSelectedSmell(smell)}
                  className={`rounded-lg border p-4 text-left transition ${activeSmell?.title === smell.title ? 'border-primary/40 bg-primary/[0.1]' : 'border-white/10 bg-white/[0.035] hover:border-white/20'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-100">{smell.title}</p>
                    <Badge tone={smell.severity === 'danger' ? 'danger' : smell.severity === 'warning' ? 'warning' : 'muted'}>{smell.severity}</Badge>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{smell.detail}</p>
                </button>
              ))}
              {!analysis.smells.length ? (
                <div className="rounded-lg border border-success/20 bg-success/[0.08] p-4 text-sm text-emerald-100">No major structure smells detected.</div>
              ) : null}
            </div>
          </Card>

          <Card>
            <CardTitle>Recommended React Folder Structure</CardTitle>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {analysis.idealStructure.map((item) => (
                <div key={item} className="rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 font-mono text-xs text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardTitle>Large Files To Refactor First</CardTitle>
            <div className="mt-4 space-y-2">
              {analysis.largeFiles.map((file) => (
                <div key={file.path} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-3 text-sm">
                  <span className="truncate font-mono text-slate-200">{file.path}</span>
                  <Badge tone="warning">{file.lines} lines</Badge>
                </div>
              ))}
              {!analysis.largeFiles.length ? <p className="text-sm text-muted-foreground">No source files above 220 lines.</p> : null}
            </div>
          </Card>
        </section>

        <aside className="space-y-4">
          <Card>
            <div className="flex items-center gap-2">
              {activeSmell?.severity === 'danger' ? <AlertTriangle className="h-5 w-5 text-danger" /> : <CheckCircle2 className="h-5 w-5 text-primary" />}
              <CardTitle>Improvement Coach</CardTitle>
            </div>
            {activeSmell ? (
              <div className="mt-4">
                <Badge tone={activeSmell.severity === 'danger' ? 'danger' : activeSmell.severity === 'warning' ? 'warning' : 'muted'}>{activeSmell.title}</Badge>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{activeSmell.detail}</p>
                <div className="mt-4 rounded-lg border border-primary/20 bg-primary/[0.08] p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-primary">Recommended solution</p>
                  <p className="mt-2 text-sm leading-6 text-teal-100">{activeSmell.fix}</p>
                </div>
              </div>
            ) : null}
          </Card>

          <Card>
            <CardTitle>Improvement Plan</CardTitle>
            <ol className="mt-4 space-y-2">
              {analysis.recommendations.map((item, index) => (
                <li key={item} className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-3 text-sm text-slate-200">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/[0.12] text-xs text-primary">{index + 1}</span>
                  {item}
                </li>
              ))}
            </ol>
          </Card>

          <Card>
            <CardTitle>Feature Folders</CardTitle>
            <div className="mt-4 space-y-2">
              {analysis.featureFolders.map((feature) => (
                <div key={feature.name} className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-sm">
                  <span>{feature.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">{feature.count}</span>
                </div>
              ))}
              {!analysis.featureFolders.length ? <p className="text-sm text-muted-foreground">No feature/domain folders detected yet.</p> : null}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
