import { BaseEdge, getBezierPath } from '@xyflow/react';

export function HierarchyFlowEdge(props) {
  const [path] = getBezierPath(props);
  return <BaseEdge path={path} style={{ stroke: '#64748b', strokeWidth: 1.8 }} />;
}
