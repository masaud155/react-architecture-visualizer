import { useMemo } from 'react';
import { Background, Controls, MiniMap, ReactFlow } from '@xyflow/react';
import { ComponentNode } from './ComponentNode.jsx';
import { PropFlowEdge } from './PropFlowEdge.jsx';
import { ContextFlowEdge } from './ContextFlowEdge.jsx';
import { StateFlowEdge } from './StateFlowEdge.jsx';
import { HierarchyFlowEdge } from './HierarchyFlowEdge.jsx';
import { useSimulatorStore } from '../../store/simulatorStore.js';
import { toReactFlowEdges, toReactFlowNodes } from '../../utils/graphHelpers.js';

const nodeTypes = { componentNode: ComponentNode };
const edgeTypes = {
  hierarchyFlow: HierarchyFlowEdge,
  propFlow: PropFlowEdge,
  contextFlow: ContextFlowEdge,
  stateFlow: StateFlowEdge,
};

export function RenderFlowCanvas() {
  const nodes = useSimulatorStore((state) => state.nodes);
  const edges = useSimulatorStore((state) => state.edges);
  const selectNode = useSimulatorStore((state) => state.selectNode);
  const flowNodes = useMemo(() => toReactFlowNodes(nodes), [nodes]);
  const flowEdges = useMemo(() => toReactFlowEdges(edges), [edges]);

  return (
    <div className="h-[560px] overflow-hidden rounded-lg border border-white/10 bg-slate-950/70 code-grid">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.18 }}
        onNodeClick={(_, node) => selectNode(node.id)}
        nodesDraggable
      >
        <Background color="rgb(255 255 255 / 0.08)" gap={28} />
        <Controls className="!border-white/10 !bg-slate-950/90 !text-foreground" />
        <MiniMap pannable zoomable nodeColor={(node) => (node.data.renderStatus === 'wasted' ? '#f43f5e' : node.data.renderStatus === 'necessary' ? '#22c55e' : '#475569')} />
      </ReactFlow>
    </div>
  );
}
