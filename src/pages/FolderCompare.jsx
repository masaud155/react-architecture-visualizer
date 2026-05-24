import { useMemo, useState } from 'react';
import { ChevronRight, Code2, Copy, Download, File, FileCode2, FileJson, Folder, FolderOpen, Moon, Plus, RotateCcw, Search, Sun, Trash2 } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Card, CardTitle } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import {
  addChild,
  cloneTree,
  currentStructure,
  deleteNode,
  exportCommands,
  exportMarkdown,
  findNode,
  flattenTree,
  getDiff,
  getSuggestion,
  moveNode,
  recommendedStructure,
  updateNode,
} from '../utils/folderCompare.js';

const filterOptions = ['all', 'feature', 'component', 'route', 'utility', 'hook', 'service', 'config'];
const viewModes = ['Beginner', 'Intermediate', 'Advanced'];

function iconFor(node, expanded) {
  if (node.type === 'folder') return expanded ? FolderOpen : Folder;
  if (node.name.endsWith('.json')) return FileJson;
  if (/\.(jsx?|tsx?)$/.test(node.name)) return FileCode2;
  return File;
}

function matchesFilter(node, filter) {
  if (filter === 'all') return true;
  const name = node.name.toLowerCase();
  const path = node.path?.toLowerCase() ?? '';
  const checks = {
    feature: path.includes('/features/') || path.includes('/modules/') || path.includes('/domains/'),
    component: name.includes('component') || /\.(jsx|tsx)$/.test(name),
    route: name.includes('route') || path.includes('/pages/') || path.includes('/routes/'),
    utility: name.includes('util') || name.includes('helper') || path.includes('/utils/') || path.includes('/lib/'),
    hook: name.startsWith('use') || path.includes('/hooks/'),
    service: name.includes('service') || name.includes('api'),
    config: name.includes('config') || name.includes('package.json') || name.includes('vite') || name.includes('eslint'),
  };
  return checks[filter] ?? true;
}

function TreeView({ tree, expanded, setExpanded, selectedId, onSelect, diff, search, filter, editable = false }) {
  function renderNode(node, depth = 0, parentPath = '') {
    const path = parentPath ? `${parentPath}/${node.name}` : node.name;
    const row = { ...node, path };
    const isExpanded = expanded.has(node.id);
    const Icon = iconFor(node, isExpanded);
    const childMatches = (node.children ?? []).some((child) => flattenTree(child, path).some((item) => item.name.toLowerCase().includes(search.toLowerCase()) && matchesFilter(item, filter)));
    const selfMatches = node.name.toLowerCase().includes(search.toLowerCase()) && matchesFilter(row, filter);
    if (search && !selfMatches && !childMatches) return null;
    if (!matchesFilter(row, filter) && !childMatches) return null;

    const tone = diff?.added.includes(path) ? 'border-success/25 bg-success/[0.08]' : diff?.removed.includes(path) ? 'border-danger/25 bg-danger/[0.08]' : 'border-white/0';

    return (
      <div key={node.id}>
        <button
          type="button"
          onClick={() => {
            onSelect(node.id);
            if (node.type === 'folder') {
              setExpanded((current) => {
                const next = new Set(current);
                if (next.has(node.id)) next.delete(node.id);
                else next.add(node.id);
                return next;
              });
            }
          }}
          className={`group flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-sm transition ${selectedId === node.id ? 'border-primary/35 bg-primary/[0.12] text-primary' : tone} hover:bg-white/[0.06]`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {node.type === 'folder' ? <ChevronRight className={`h-3.5 w-3.5 shrink-0 transition ${isExpanded ? 'rotate-90' : ''}`} /> : <span className="w-3.5" />}
          <Icon className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
          <span className="min-w-0 flex-1 truncate font-mono text-xs">{node.name}</span>
          {editable && node.smell ? <Badge tone="warning">smell</Badge> : null}
        </button>
        {node.type === 'folder' && isExpanded ? <div className="overflow-hidden">{(node.children ?? []).map((child) => renderNode(child, depth + 1, path))}</div> : null}
      </div>
    );
  }

  return <div className="space-y-1">{renderNode(tree)}</div>;
}

function downloadText(name, text, type) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

export function FolderCompare() {
  const [currentTree, setCurrentTree] = useState(() => cloneTree(currentStructure));
  const [recommendedTree] = useState(() => cloneTree(recommendedStructure));
  const [expanded, setExpanded] = useState(() => new Set(['root', 'src', 'components', 'features', 'dashboard-feature', 'shared']));
  const [selectedId, setSelectedId] = useState('dashboard-jsx');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('Intermediate');
  const [theme, setTheme] = useState('dark');
  const [draftName, setDraftName] = useState('NewFolder');
  const [moveTarget, setMoveTarget] = useState('src');
  const [exportType, setExportType] = useState('markdown');

  const diff = useMemo(() => getDiff(currentTree, recommendedTree), [currentTree, recommendedTree]);
  const selected = findNode(currentTree, selectedId)?.node ?? findNode(recommendedTree, selectedId)?.node;
  const suggestion = getSuggestion(selected);
  const folderTargets = flattenTree(currentTree).filter((item) => item.type === 'folder' && item.id !== selectedId);
  const surfaceClass = theme === 'light' ? 'bg-slate-100 text-slate-950' : '';

  function addItem(type) {
    const parent = selected?.type === 'folder' ? selected.id : findNode(currentTree, selectedId)?.parent?.id;
    if (!parent) return;
    setCurrentTree((tree) =>
      addChild(tree, parent, {
        id: `${draftName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
        name: type === 'folder' ? draftName : draftName.includes('.') ? draftName : `${draftName}.jsx`,
        type,
        children: type === 'folder' ? [] : undefined,
      }),
    );
  }

  function renameSelected(name) {
    setCurrentTree((tree) => updateNode(tree, selectedId, (node) => { node.name = name; }));
  }

  function exportStructure() {
    const output = exportType === 'json' ? JSON.stringify(recommendedTree, null, 2) : exportType === 'commands' ? exportCommands(recommendedTree) : exportMarkdown(recommendedTree);
    const extension = exportType === 'json' ? 'json' : exportType === 'commands' ? 'sh' : 'md';
    downloadText(`recommended-structure.${extension}`, output, 'text/plain;charset=utf-8');
  }

  async function copyExport() {
    const output = exportType === 'json' ? JSON.stringify(recommendedTree, null, 2) : exportType === 'commands' ? exportCommands(recommendedTree) : exportMarkdown(recommendedTree);
    await navigator.clipboard.writeText(output);
  }

  return (
    <div className={`space-y-4 rounded-lg ${surfaceClass}`}>
      <PageHeader
        eyebrow="Folder Compare"
        title="Compare and refactor React folder structures"
        description="Edit the current structure on the left, compare it with a scalable recommended structure on the right, inspect differences, and export the improved scaffold."
      >
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <Button variant="secondary" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {theme === 'dark' ? 'Light' : 'Dark'}
          </Button>
          <Button variant="secondary" onClick={() => setCurrentTree(cloneTree(currentStructure))}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </PageHeader>

      <Card>
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto] lg:items-center">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search files and folders..." className="h-10 w-full rounded-md border border-white/10 bg-slate-950 px-9 text-sm outline-none focus:border-primary" />
          </label>
          <select value={filter} onChange={(event) => setFilter(event.target.value)} className="h-10 rounded-md border border-white/10 bg-slate-950 px-3 text-sm outline-none focus:border-primary">
            {filterOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
          <div className="flex overflow-x-auto rounded-lg border border-white/10 bg-black/20 p-1">
            {viewModes.map((mode) => (
              <button key={mode} type="button" onClick={() => setViewMode(mode)} className={`min-w-max rounded-md px-3 py-1.5 text-xs font-medium transition ${viewMode === mode ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-white/[0.08]'}`}>
                {mode}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_390px]">
        <section className="grid gap-4 xl:grid-cols-2">
          <Card className="min-h-[640px]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <Badge tone="warning">Current</Badge>
                <CardTitle className="mt-2">User Project Structure</CardTitle>
              </div>
              <Badge tone="danger">{diff.removed.length} changes</Badge>
            </div>
            <TreeView tree={currentTree} expanded={expanded} setExpanded={setExpanded} selectedId={selectedId} onSelect={setSelectedId} diff={diff} search={search} filter={filter} editable />
          </Card>

          <Card className="min-h-[640px]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <Badge tone="success">Recommended</Badge>
                <CardTitle className="mt-2">Improved Scalable Structure</CardTitle>
              </div>
              <Badge tone="success">{diff.added.length} additions</Badge>
            </div>
            <TreeView tree={recommendedTree} expanded={expanded} setExpanded={setExpanded} selectedId={selectedId} onSelect={setSelectedId} diff={diff} search={search} filter={filter} />
          </Card>
        </section>

        <aside className="space-y-4">
          <Card>
            <CardTitle>Dynamic Editing</CardTitle>
            <div className="mt-4 space-y-3">
              <input value={draftName} onChange={(event) => setDraftName(event.target.value)} className="h-10 w-full rounded-md border border-white/10 bg-slate-950 px-3 text-sm outline-none focus:border-primary" placeholder="New name" />
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" onClick={() => addItem('folder')}><Plus className="h-4 w-4" />Folder</Button>
                <Button variant="secondary" onClick={() => addItem('file')}><Plus className="h-4 w-4" />File</Button>
              </div>
              {selected && (
                <>
                  <input value={selected.name} onChange={(event) => renameSelected(event.target.value)} className="h-10 w-full rounded-md border border-white/10 bg-slate-950 px-3 text-sm outline-none focus:border-primary" />
                  <select value={moveTarget} onChange={(event) => setMoveTarget(event.target.value)} className="h-10 w-full rounded-md border border-white/10 bg-slate-950 px-3 text-sm outline-none focus:border-primary">
                    {folderTargets.map((folder) => <option key={folder.id} value={folder.id}>Move to: {folder.path}</option>)}
                  </select>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="secondary" onClick={() => setCurrentTree((tree) => moveNode(tree, selectedId, moveTarget))}>Move</Button>
                    <Button variant="danger" onClick={() => setCurrentTree((tree) => deleteNode(tree, selectedId))}><Trash2 className="h-4 w-4" />Delete</Button>
                  </div>
                </>
              )}
            </div>
          </Card>

          <Card>
            <CardTitle>Improvement Suggestion</CardTitle>
            <Badge className="mt-4" tone={selected?.smell ? 'warning' : 'primary'}>{suggestion?.title}</Badge>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{suggestion?.reason}</p>
            <div className="mt-4 rounded-lg border border-primary/20 bg-primary/[0.08] p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-primary">Better location</p>
              <p className="mt-2 text-sm leading-6 text-teal-100">{suggestion?.better}</p>
            </div>
            {viewMode === 'Advanced' ? <p className="mt-3 text-xs leading-5 text-muted-foreground">Advanced note: compare ownership boundaries, update frequency, and import direction before moving shared code.</p> : null}
          </Card>

          <Card>
            <CardTitle>What Changed</CardTitle>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <Badge tone="success">+{diff.added.length} added</Badge>
              <Badge tone="danger">-{diff.removed.length} removed</Badge>
              <Badge tone="muted">{diff.unchanged.length} same</Badge>
            </div>
            <div className="mt-4 max-h-44 overflow-auto rounded-lg border border-white/10 bg-slate-950/60 p-3">
              {[...diff.added.slice(0, 8).map((path) => `+ ${path}`), ...diff.removed.slice(0, 8).map((path) => `- ${path}`)].map((line) => (
                <p key={line} className={`font-mono text-xs leading-6 ${line.startsWith('+') ? 'text-emerald-300' : 'text-rose-300'}`}>{line}</p>
              ))}
            </div>
          </Card>

          <Card>
            <CardTitle>Export Improved Structure</CardTitle>
            <div className="mt-4 space-y-3">
              <select value={exportType} onChange={(event) => setExportType(event.target.value)} className="h-10 w-full rounded-md border border-white/10 bg-slate-950 px-3 text-sm outline-none focus:border-primary">
                <option value="json">JSON</option>
                <option value="markdown">Markdown</option>
                <option value="commands">Terminal commands</option>
              </select>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" onClick={copyExport}><Copy className="h-4 w-4" />Copy</Button>
                <Button onClick={exportStructure}><Download className="h-4 w-4" />Download</Button>
              </div>
              <p className="text-xs leading-5 text-muted-foreground">ZIP scaffold generation can be added later with a small client-side ZIP dependency.</p>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
