const saveKey = 'react-renderflow-what-if-slots';

export const defaultWhatIfState = {
  stateOwner: 'Dashboard',
  memoizedChildren: 2,
  contextScope: 'Broad AppContext',
  listSize: 100,
  renderBudget: 8,
  costBudget: 18,
  splitComponents: 3,
};

const ownerImpact = {
  App: { renders: 18, score: 22, cost: 34 },
  Dashboard: { renders: 13, score: 40, cost: 25 },
  SearchSection: { renders: 5, score: 78, cost: 11 },
  LeafComponent: { renders: 3, score: 86, cost: 7 },
};

const contextImpact = {
  'Broad AppContext': { renders: 8, score: -18, cost: 12 },
  'Route Provider': { renders: 4, score: 4, cost: 7 },
  'Split Contexts': { renders: 2, score: 14, cost: 4 },
  'Local State': { renders: 1, score: 18, cost: 2 },
};

export function calculateWhatIf(state) {
  const owner = ownerImpact[state.stateOwner] ?? ownerImpact.Dashboard;
  const context = contextImpact[state.contextScope] ?? contextImpact['Broad AppContext'];
  const listPressure = Math.ceil(state.listSize / 80);
  const memoSavings = Math.min(state.memoizedChildren * 1.4, 8);
  const splitSavings = Math.min(state.splitComponents * 1.8, 9);

  const renders = Math.max(1, Math.round(owner.renders + context.renders + listPressure - memoSavings - splitSavings));
  const wasted = Math.max(0, Math.round(renders - (state.stateOwner === 'LeafComponent' ? 2 : state.stateOwner === 'SearchSection' ? 3 : 5)));
  const cost = Math.max(2, Number((owner.cost + context.cost + listPressure * 1.6 - memoSavings * 1.2 - splitSavings * 1.3).toFixed(1)));
  const score = Math.max(20, Math.min(98, Math.round(owner.score + context.score + state.memoizedChildren * 2 + state.splitComponents * 3 - listPressure)));
  const budgetPass = renders <= state.renderBudget && cost <= state.costBudget;

  const recommendations = [];
  if (state.stateOwner === 'App' || state.stateOwner === 'Dashboard') recommendations.push('Move interaction state closer to the section that owns the workflow.');
  if (state.contextScope === 'Broad AppContext') recommendations.push('Split context by update frequency before adding more memoization.');
  if (state.listSize > 200 && state.memoizedChildren < 4) recommendations.push('Memoize list rows and pass stable primitive props.');
  if (state.splitComponents < 3) recommendations.push('Split large page sections into responsibility-focused boundaries.');
  if (!recommendations.length) recommendations.push('Architecture is within budget. Benchmark before adding more optimization.');

  return {
    renders,
    wasted,
    cost,
    score,
    budgetPass,
    recommendations,
    efficiency: Math.round(((renders - wasted) / renders) * 100),
  };
}

export function loadWhatIfSlots() {
  try {
    return JSON.parse(localStorage.getItem(saveKey) ?? '[]');
  } catch {
    return [];
  }
}

export function saveWhatIfSlot(slot) {
  const slots = loadWhatIfSlots();
  const next = [{ ...slot, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...slots].slice(0, 6);
  localStorage.setItem(saveKey, JSON.stringify(next));
  return next;
}

export function clearWhatIfSlots() {
  localStorage.removeItem(saveKey);
  return [];
}
