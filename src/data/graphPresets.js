const baseNode = {
  renderCount: 0,
  memoized: false,
  ownsState: false,
  receivesProps: true,
  warning: '',
};

export const graphPresets = {
  dashboard: {
    bad: {
      nodes: [
        { id: 'app', type: 'App', name: 'App', x: 0, y: 60, ownsState: false },
        { id: 'context-provider', type: 'ContextProvider', name: 'AppContextProvider', x: 230, y: 0, ownsState: true, warning: 'Broad context value' },
        { id: 'layout', type: 'Layout', name: 'Layout', x: 230, y: 140 },
        { id: 'dashboard', type: 'Page', name: 'Dashboard', x: 470, y: 80, ownsState: true, warning: 'State owned too high' },
        { id: 'sidebar', type: 'Sidebar', name: 'Sidebar', x: 710, y: -50, receivesProps: true, warning: 'Receives unused props' },
        { id: 'search-bar', type: 'SearchBar', name: 'SearchBar', x: 710, y: 70 },
        { id: 'filter-panel', type: 'FilterPanel', name: 'FilterPanel', x: 710, y: 190 },
        { id: 'user-table', type: 'UserTable', name: 'UserTable', x: 960, y: 70, ownsState: false },
        { id: 'user-row-a', type: 'UserRow', name: 'UserRow A', x: 1210, y: -20 },
        { id: 'user-row-b', type: 'UserRow', name: 'UserRow B', x: 1210, y: 80 },
        { id: 'user-row-c', type: 'UserRow', name: 'UserRow C', x: 1210, y: 180 },
        { id: 'chart-panel', type: 'ChartPanel', name: 'ChartPanel', x: 960, y: 230 },
        { id: 'notification-panel', type: 'Modal', name: 'NotificationPanel', x: 960, y: 350 },
        { id: 'settings-modal', type: 'Modal', name: 'SettingsModal', x: 1210, y: 330 },
      ],
      edges: [
        ['app', 'context-provider', 'context'],
        ['app', 'layout', 'hierarchy'],
        ['layout', 'dashboard', 'hierarchy'],
        ['dashboard', 'sidebar', 'prop'],
        ['dashboard', 'search-bar', 'prop'],
        ['dashboard', 'filter-panel', 'prop'],
        ['dashboard', 'user-table', 'prop'],
        ['dashboard', 'chart-panel', 'prop'],
        ['dashboard', 'notification-panel', 'prop'],
        ['dashboard', 'settings-modal', 'state'],
        ['user-table', 'user-row-a', 'prop'],
        ['user-table', 'user-row-b', 'prop'],
        ['user-table', 'user-row-c', 'prop'],
        ['context-provider', 'dashboard', 'context'],
      ],
    },
    good: {
      nodes: [
        { id: 'app', type: 'App', name: 'App', x: 0, y: 80, memoized: true },
        { id: 'theme-provider', type: 'ContextProvider', name: 'ThemeProvider', x: 230, y: 0, ownsState: true },
        { id: 'layout', type: 'Layout', name: 'Layout', x: 230, y: 150, memoized: true },
        { id: 'dashboard', type: 'Page', name: 'DashboardShell', x: 470, y: 90, memoized: true },
        { id: 'sidebar', type: 'Sidebar', name: 'Sidebar', x: 710, y: -60, memoized: true },
        { id: 'search-section', type: 'StateOwner', name: 'SearchSection', x: 710, y: 70, ownsState: true },
        { id: 'search-bar', type: 'SearchBar', name: 'SearchBar', x: 960, y: 10 },
        { id: 'filter-panel', type: 'FilterPanel', name: 'FilterPanel', x: 710, y: 200, ownsState: true },
        { id: 'user-table', type: 'UserTable', name: 'UserTable', x: 960, y: 130, ownsState: true, memoized: true },
        { id: 'user-row-a', type: 'UserRow', name: 'UserRow A', x: 1210, y: 40, memoized: true },
        { id: 'user-row-b', type: 'UserRow', name: 'UserRow B', x: 1210, y: 140, memoized: true, ownsState: true },
        { id: 'user-row-c', type: 'UserRow', name: 'UserRow C', x: 1210, y: 240, memoized: true },
        { id: 'chart-panel', type: 'ChartPanel', name: 'ChartPanel', x: 960, y: 300, memoized: true },
        { id: 'modal-boundary', type: 'StateOwner', name: 'ModalBoundary', x: 710, y: 350, ownsState: true },
        { id: 'settings-modal', type: 'Modal', name: 'SettingsModal', x: 960, y: 430 },
      ],
      edges: [
        ['app', 'theme-provider', 'context'],
        ['app', 'layout', 'hierarchy'],
        ['layout', 'dashboard', 'hierarchy'],
        ['dashboard', 'sidebar', 'hierarchy'],
        ['dashboard', 'search-section', 'hierarchy'],
        ['search-section', 'search-bar', 'state'],
        ['search-section', 'user-table', 'prop'],
        ['dashboard', 'filter-panel', 'hierarchy'],
        ['filter-panel', 'user-table', 'prop'],
        ['filter-panel', 'chart-panel', 'prop'],
        ['user-table', 'user-row-a', 'prop'],
        ['user-table', 'user-row-b', 'prop'],
        ['user-table', 'user-row-c', 'prop'],
        ['dashboard', 'chart-panel', 'hierarchy'],
        ['dashboard', 'modal-boundary', 'hierarchy'],
        ['modal-boundary', 'settings-modal', 'state'],
        ['theme-provider', 'layout', 'context'],
      ],
    },
  },
};

export function getPresetNodes(scenarioId, architectureMode) {
  return graphPresets[scenarioId][architectureMode].nodes.map((node) => ({
    ...baseNode,
    ...node,
  }));
}

export function getPresetEdges(scenarioId, architectureMode) {
  return graphPresets[scenarioId][architectureMode].edges.map(([source, target, kind], index) => ({
    id: `${source}-${target}-${index}`,
    source,
    target,
    kind,
  }));
}
