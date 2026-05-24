export function getGraphHealth(nodes, edges) {
  const warnings = nodes.filter((node) => node.warning).length;
  const stateOwners = nodes.filter((node) => node.ownsState).length;
  const memoized = nodes.filter((node) => node.memoized).length;
  const contextEdges = edges.filter((edge) => edge.kind === 'context').length;
  const propEdges = edges.filter((edge) => edge.kind === 'prop').length;
  const score = Math.max(20, Math.min(98, 92 - warnings * 8 - contextEdges * 4 - Math.max(0, propEdges - 6) * 3 + memoized * 2 + stateOwners * 2));

  return {
    warnings,
    stateOwners,
    memoized,
    contextEdges,
    propEdges,
    score,
  };
}

export function getRefactorPlan(node, edges) {
  if (!node) {
    return {
      title: 'Select a component',
      severity: 'muted',
      summary: 'Click a node in the workbench to get targeted refactor guidance.',
      steps: ['Select a component node', 'Inspect ownership and dependency edges', 'Apply a focused refactor'],
      expected: 'The coach will estimate which architecture move should reduce render scope.',
    };
  }

  const outgoing = edges.filter((edge) => edge.source === node.id);
  const incoming = edges.filter((edge) => edge.target === node.id);
  const hasContext = [...incoming, ...outgoing].some((edge) => edge.kind === 'context');
  const propFanOut = outgoing.filter((edge) => edge.kind === 'prop').length;

  if (node.warning?.toLowerCase().includes('state') || (node.ownsState && propFanOut > 2)) {
    return {
      title: 'State owned too high',
      severity: 'danger',
      summary: `${node.name} owns state and fans updates into ${propFanOut} prop dependencies.`,
      steps: [
        'Identify the smallest UI zone that needs this interaction state.',
        'Move the useState/useReducer call into that section boundary.',
        'Pass only stable primitives to the table/chart children that need the result.',
        'Rerun the interaction and verify unrelated siblings stay stable.',
      ],
      expected: 'Render scope should drop to the section and direct consumers instead of the page shell.',
    };
  }

  if (hasContext || node.type === 'ContextProvider') {
    return {
      title: 'Context broadcast risk',
      severity: 'warning',
      summary: `${node.name} participates in context updates. Broad providers can invalidate unrelated consumers.`,
      steps: [
        'List context fields by update frequency.',
        'Split high-frequency values into focused providers.',
        'Move route-specific state below the route shell.',
        'Keep stable provider values with memoized value objects only after splitting.',
      ],
      expected: 'Theme/user/filter updates should stop sharing the same invalidation path.',
    };
  }

  if (node.warning?.toLowerCase().includes('unused') || (node.receivesProps && incoming.some((edge) => edge.kind === 'prop') && !node.ownsState)) {
    return {
      title: 'Prop drilling review',
      severity: 'warning',
      summary: `${node.name} receives props but may not be the component that owns the behavior.`,
      steps: [
        'Check whether this component directly reads the prop.',
        'If it only forwards the value, move data closer to the real consumer.',
        'Prefer a narrow boundary or colocated query over passing through layout shells.',
      ],
      expected: 'Intermediate components become easier to reuse and skip unrelated renders.',
    };
  }

  if (!node.memoized && (node.type === 'UserRow' || node.type === 'ChartPanel')) {
    return {
      title: 'Memo candidate',
      severity: 'success',
      summary: `${node.name} looks like a potentially expensive stable child.`,
      steps: [
        'Confirm incoming props are stable primitives or memoized values.',
        'Wrap the component in React.memo.',
        'Use useMemo only for expensive derived values.',
      ],
      expected: 'The child can skip parent renders once prop identities are stable.',
    };
  }

  return {
    title: 'Healthy boundary',
    severity: 'success',
    summary: `${node.name} does not show an obvious architecture smell in the current graph.`,
    steps: [
      'Keep responsibilities narrow.',
      'Avoid adding unrelated state here.',
      'Use the render timeline to validate behavior after changes.',
    ],
    expected: 'This component can stay stable as long as ownership remains focused.',
  };
}
