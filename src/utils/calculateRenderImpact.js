export function calculateRenderImpact(nodes, interaction) {
  const necessary = new Set(interaction.necessary);
  const wasted = new Set(interaction.wasted);

  return nodes.map((node) => {
    const status = wasted.has(node.id) ? 'wasted' : necessary.has(node.id) ? 'necessary' : 'idle';
    const shouldIncrement = status !== 'idle';

    return {
      ...node,
      renderStatus: status,
      renderCount: node.renderCount + (shouldIncrement ? 1 : 0),
      lastReason: shouldIncrement
        ? {
            event: interaction.event,
            state: interaction.state,
            prop: interaction.changedProp,
            necessary: status === 'necessary',
            parentCaused: status === 'wasted',
          }
        : node.lastReason,
    };
  });
}
