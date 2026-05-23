import { BaseEdge, getBezierPath } from '@xyflow/react';

export function PropFlowEdge(props) {
  const [path] = getBezierPath(props);
  return <BaseEdge path={path} style={{ stroke: '#8b5cf6', strokeWidth: 2.4, strokeDasharray: '7 5' }} />;
}
