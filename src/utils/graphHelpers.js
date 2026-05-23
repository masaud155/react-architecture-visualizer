export function toReactFlowNodes(nodes) {
  return nodes.map((node) => ({
    id: node.id,
    type: 'componentNode',
    position: { x: node.x, y: node.y },
    data: node,
  }));
}

export function toReactFlowEdges(edges) {
  return edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: `${edge.kind}Flow`,
    animated: edge.kind !== 'hierarchy',
    data: { kind: edge.kind },
  }));
}
