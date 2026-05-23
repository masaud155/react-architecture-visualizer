import { BaseEdge, getBezierPath } from '@xyflow/react';

export function ContextFlowEdge(props) {
  const [path] = getBezierPath(props);
  return <BaseEdge path={path} style={{ stroke: '#f59e0b', strokeWidth: 2.2, strokeDasharray: '3 5' }} />;
}
