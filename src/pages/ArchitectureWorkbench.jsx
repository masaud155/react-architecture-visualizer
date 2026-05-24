import { useMemo, useState } from 'react';
import { Background, Controls, MiniMap, ReactFlow, useEdgesState, useNodesState } from '@xyflow/react';
import { Plus, Trash2, Wand2 } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Card, CardTitle } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { MetricCard } from '../components/ui/MetricCard.jsx';
import { ComponentNode } from '../components/simulator/ComponentNode.jsx';
import { PropFlowEdge } from '../components/simulator/PropFlowEdge.jsx';
import { ContextFlowEdge } from '../components/simulator/ContextFlowEdge.jsx';
import { StateFlowEdge } from '../components/simulator/StateFlowEdge.jsx';
import { HierarchyFlowEdge } from '../components/simulator/HierarchyFlowEdge.jsx';
import { getPresetEdges, getPresetNodes } from '../data/graphPresets.js';
import { getGraphHealth, getRefactorPlan } from '../utils/refactorCoach.js';

const nodeTypes = { componentNode: ComponentNode };
const edgeTypes = {
  hierarchyFlow: HierarchyFlowEdge,
  propFlow: PropFlowEdge,
  contextFlow: ContextFlowEdge,
  stateFlow: StateFlowEdge,
};

function createFlowNode(node) {
  return {
    id: node.id,
    type: 'componentNode',
    position: { x: node.x, y: node.y },
    data: node,
  };
}

function createFlowEdge(edge) {
  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: `${edge.kind}Flow`,
    animated: edge.kind !== 'hierarchy',
    data: { kind: edge.kind },
  };
}

function fromFlowNode(node) {
  return {
    ...node.data,
    x: node.position.x,
    y: node.position.y,
  };
}

function fromFlowEdge(edge) {
  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    kind: edge.data?.kind ?? edge.type?.replace('Flow', '') ?? 'hierarchy',
  };
}

export function ArchitectureWorkbench() {
  const initialNodes = useMemo(() => getPresetNodes('dashboard', 'bad').map(createFlowNode), []);
  const initialEdges = useMemo(() => getPresetEdges('dashboard', 'bad').map(createFlowEdge), []);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState('dashboard');
  const [newNodeName, setNewNodeName] = useState('NewBoundary');
  const [edgeDraft, setEdgeDraft] = useState({ source: 'dashboard', target: 'user-table', kind: 'prop' });

  const plainNodes = nodes.map(fromFlowNode);
  const plainEdges = edges.map(fromFlowEdge);
  const selectedNode = plainNodes.find((node) => node.id === selectedNodeId);
  const health = getGraphHealth(plainNodes, plainEdges);
  const coach = getRefactorPlan(selectedNode, plainEdges);

  function updateSelectedNode(updates) {
    setNodes((items) =>
      items.map((node) =>
        node.id === selectedNodeId
          ? {
              ...node,
              data: {
                ...node.data,
                ...updates,
              },
            }
          : node,
      ),
    );
  }

  function addNode() {
    const name = newNodeName.trim() || 'NewBoundary';
    const id = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${nodes.length + 1}`;
    setNodes((items) => [
      ...items,
      createFlowNode({
        id,
        name,
        type: 'StateOwner',
        x: 220 + items.length * 24,
        y: 120 + items.length * 18,
        renderCount: 0,
        memoized: false,
        ownsState: false,
        receivesProps: true,
        warning: '',
      }),
    ]);
    setSelectedNodeId(id);
    setNewNodeName('');
  }

  function removeSelectedNode() {
    if (!selectedNodeId) return;
    setNodes((items) => items.filter((node) => node.id !== selectedNodeId));
    setEdges((items) => items.filter((edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId));
    setSelectedNodeId(nodes.find((node) => node.id !== selectedNodeId)?.id ?? '');
  }

  function addEdge() {
    if (!edgeDraft.source || !edgeDraft.target || edgeDraft.source === edgeDraft.target) return;
    const id = `${edgeDraft.source}-${edgeDraft.target}-${edgeDraft.kind}-${Date.now()}`;
    setEdges((items) => [...items, createFlowEdge({ ...edgeDraft, id })]);
  }

  function loadPreset(mode) {
    const nextNodes = getPresetNodes('dashboard', mode).map(createFlowNode);
    const nextEdges = getPresetEdges('dashboard', mode).map(createFlowEdge);
    setNodes(nextNodes);
    setEdges(nextEdges);
    setSelectedNodeId(nextNodes[0]?.id ?? '');
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Workbench"
        title="Editable Graph Mode + Refactor Coach"
        description="Edit component boundaries, dependency edges, state ownership, memoization, and warnings. Select any node to get a guided refactor plan."
      >
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <Button variant="secondary" onClick={() => loadPreset('bad')}>Load bad</Button>
          <Button variant="secondary" onClick={() => loadPreset('good')}>Load good</Button>
        </div>
      </PageHeader>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Workbench score" value={health.score} tone={health.score > 75 ? 'success' : health.score > 55 ? 'warning' : 'danger'} />
        <MetricCard label="Warnings" value={health.warnings} tone={health.warnings ? 'warning' : 'success'} />
        <MetricCard label="State owners" value={health.stateOwners} />
        <MetricCard label="Context edges" value={health.contextEdges} tone={health.contextEdges > 2 ? 'warning' : 'primary'} />
        <MetricCard label="Memoized" value={health.memoized} tone="success" />
      </div>

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="panel overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-white/10 bg-white/[0.035] p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Editable Architecture Graph</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">Drag nodes, select boundaries, and add dependency edges.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                value={newNodeName}
                onChange={(event) => setNewNodeName(event.target.value)}
                className="h-10 rounded-md border border-white/10 bg-slate-950 px-3 text-sm outline-none focus:border-primary"
                placeholder="ComponentName"
              />
              <Button onClick={addNode}>
                <Plus className="h-4 w-4" />
                Add node
              </Button>
            </div>
          </div>
          <div className="h-[460px] bg-slate-950/70 code-grid xl:h-[660px]">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={(_, node) => setSelectedNodeId(node.id)}
              fitView
              fitViewOptions={{ padding: 0.18 }}
            >
              <Background color="rgb(255 255 255 / 0.08)" gap={28} />
              <Controls className="!border-white/10 !bg-slate-950/90 !text-foreground" />
              <MiniMap maskColor="rgb(2 6 23 / 0.72)" nodeColor={(node) => (node.data.warning ? '#f43f5e' : node.data.ownsState ? '#14b8a6' : '#64748b')} />
            </ReactFlow>
          </div>
        </section>

        <aside className="space-y-4">
          <Card>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Selected Boundary</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">{selectedNode?.name ?? 'No node selected'}</p>
              </div>
              <Button variant="danger" size="sm" onClick={removeSelectedNode}>
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>
            {selectedNode ? (
              <div className="mt-4 space-y-3">
                <label className="block text-sm">
                  <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-muted-foreground">Name</span>
                  <input
                    value={selectedNode.name}
                    onChange={(event) => updateSelectedNode({ name: event.target.value })}
                    className="h-10 w-full rounded-md border border-white/10 bg-slate-950 px-3 outline-none focus:border-primary"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-muted-foreground">Type</span>
                  <select
                    value={selectedNode.type}
                    onChange={(event) => updateSelectedNode({ type: event.target.value })}
                    className="h-10 w-full rounded-md border border-white/10 bg-slate-950 px-3 outline-none focus:border-primary"
                  >
                    {['App', 'Layout', 'Page', 'SearchBar', 'FilterPanel', 'UserTable', 'UserRow', 'ChartPanel', 'Modal', 'Sidebar', 'ContextProvider', 'StateOwner'].map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => updateSelectedNode({ ownsState: !selectedNode.ownsState })} className={`rounded-md border px-3 py-2 text-sm ${selectedNode.ownsState ? 'border-primary/40 bg-primary/[0.12] text-primary' : 'border-white/10 bg-white/[0.035] text-muted-foreground'}`}>
                    State owner
                  </button>
                  <button type="button" onClick={() => updateSelectedNode({ memoized: !selectedNode.memoized })} className={`rounded-md border px-3 py-2 text-sm ${selectedNode.memoized ? 'border-success/40 bg-success/[0.12] text-emerald-200' : 'border-white/10 bg-white/[0.035] text-muted-foreground'}`}>
                    Memoized
                  </button>
                </div>
                <label className="block text-sm">
                  <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-muted-foreground">Warning</span>
                  <input
                    value={selectedNode.warning ?? ''}
                    onChange={(event) => updateSelectedNode({ warning: event.target.value })}
                    className="h-10 w-full rounded-md border border-white/10 bg-slate-950 px-3 outline-none focus:border-primary"
                    placeholder="State owned too high"
                  />
                </label>
              </div>
            ) : null}
          </Card>

          <Card>
            <CardTitle>Add Dependency Edge</CardTitle>
            <div className="mt-4 grid gap-2">
              {['source', 'target'].map((field) => (
                <select
                  key={field}
                  value={edgeDraft[field]}
                  onChange={(event) => setEdgeDraft((draft) => ({ ...draft, [field]: event.target.value }))}
                  className="h-10 rounded-md border border-white/10 bg-slate-950 px-3 text-sm capitalize outline-none focus:border-primary"
                >
                  {plainNodes.map((node) => <option key={node.id} value={node.id}>{field}: {node.name}</option>)}
                </select>
              ))}
              <select
                value={edgeDraft.kind}
                onChange={(event) => setEdgeDraft((draft) => ({ ...draft, kind: event.target.value }))}
                className="h-10 rounded-md border border-white/10 bg-slate-950 px-3 text-sm outline-none focus:border-primary"
              >
                {['hierarchy', 'prop', 'context', 'state'].map((kind) => <option key={kind} value={kind}>{kind}</option>)}
              </select>
              <Button onClick={addEdge}>Add edge</Button>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-primary" />
              <CardTitle>Refactor Coach</CardTitle>
            </div>
            <Badge className="mt-4" tone={coach.severity}>{coach.title}</Badge>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{coach.summary}</p>
            <ol className="mt-4 space-y-2">
              {coach.steps.map((step, index) => (
                <li key={step} className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-3 text-sm text-slate-200">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/[0.12] text-xs text-primary">{index + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
            <p className="mt-4 rounded-lg border border-primary/20 bg-primary/[0.08] p-3 text-sm leading-6 text-teal-100">{coach.expected}</p>
          </Card>
        </aside>
      </div>
    </div>
  );
}
