import { BaseEdge, getBezierPath } from '@xyflow/react';

export function StateFlowEdge(props) {
  const [path] = getBezierPath(props);
  return <BaseEdge path={path} style={{ stroke: '#14b8a6', strokeWidth: 2.8 }} />;
}
