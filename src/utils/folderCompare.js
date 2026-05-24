export const currentStructure = {
  id: 'root',
  name: 'project',
  type: 'folder',
  children: [
    {
      id: 'src',
      name: 'src',
      type: 'folder',
      children: [
        { id: 'app-jsx', name: 'App.jsx', type: 'file' },
        { id: 'main-jsx', name: 'main.jsx', type: 'file' },
        {
          id: 'components',
          name: 'components',
          type: 'folder',
          children: [
            { id: 'dashboard-jsx', name: 'Dashboard.jsx', type: 'file', smell: 'Large page component mixed with state and UI sections.' },
            { id: 'user-table-jsx', name: 'UserTable.jsx', type: 'file' },
            { id: 'chart-panel-jsx', name: 'ChartPanel.jsx', type: 'file' },
          ],
        },
        {
          id: 'context',
          name: 'context',
          type: 'folder',
          children: [{ id: 'app-context-jsx', name: 'AppContext.jsx', type: 'file', smell: 'Broad context provider likely mixes unrelated state.' }],
        },
        {
          id: 'utils',
          name: 'utils',
          type: 'folder',
          children: [{ id: 'helpers-js', name: 'helpers.js', type: 'file' }],
        },
      ],
    },
    { id: 'package-json', name: 'package.json', type: 'file' },
  ],
};

export const recommendedStructure = {
  id: 'root',
  name: 'project',
  type: 'folder',
  children: [
    {
      id: 'src',
      name: 'src',
      type: 'folder',
      children: [
        {
          id: 'app',
          name: 'app',
          type: 'folder',
          note: 'Application shell, routes, and providers live here.',
          children: [
            { id: 'app-root', name: 'App.jsx', type: 'file' },
            { id: 'routes', name: 'routes.jsx', type: 'file' },
            { id: 'providers', name: 'providers.jsx', type: 'file' },
          ],
        },
        {
          id: 'features',
          name: 'features',
          type: 'folder',
          note: 'Product features own their local UI, state, hooks, and tests.',
          children: [
            {
              id: 'dashboard-feature',
              name: 'dashboard',
              type: 'folder',
              children: [
                { id: 'dashboard-page', name: 'DashboardPage.jsx', type: 'file' },
                { id: 'dashboard-components', name: 'components', type: 'folder', children: [{ id: 'dashboard-shell', name: 'DashboardShell.jsx', type: 'file' }] },
                { id: 'dashboard-hooks', name: 'hooks', type: 'folder', children: [{ id: 'use-dashboard', name: 'useDashboardModel.js', type: 'file' }] },
                { id: 'dashboard-state', name: 'state', type: 'folder', children: [{ id: 'dashboard-store', name: 'dashboardStore.js', type: 'file' }] },
              ],
            },
            {
              id: 'users-feature',
              name: 'users',
              type: 'folder',
              children: [
                { id: 'users-components', name: 'components', type: 'folder', children: [{ id: 'user-table', name: 'UserTable.jsx', type: 'file' }] },
                { id: 'users-hooks', name: 'hooks', type: 'folder', children: [{ id: 'use-users', name: 'useUsers.js', type: 'file' }] },
              ],
            },
          ],
        },
        {
          id: 'shared',
          name: 'shared',
          type: 'folder',
          note: 'Reusable primitives that do not belong to one feature.',
          children: [
            { id: 'shared-ui', name: 'ui', type: 'folder', children: [{ id: 'button', name: 'Button.jsx', type: 'file' }] },
            { id: 'shared-lib', name: 'lib', type: 'folder', children: [{ id: 'formatters', name: 'formatters.js', type: 'file' }] },
          ],
        },
      ],
    },
    { id: 'package-json', name: 'package.json', type: 'file' },
  ],
};

export function cloneTree(tree) {
  return JSON.parse(JSON.stringify(tree));
}

export function flattenTree(node, parentPath = '') {
  const path = parentPath ? `${parentPath}/${node.name}` : node.name;
  const rows = [{ ...node, path, children: undefined }];
  if (node.children) {
    node.children.forEach((child) => rows.push(...flattenTree(child, path)));
  }
  return rows;
}

export function findNode(node, id, parent = null) {
  if (node.id === id) return { node, parent };
  for (const child of node.children ?? []) {
    const found = findNode(child, id, node);
    if (found) return found;
  }
  return null;
}

export function updateNode(tree, id, updater) {
  const next = cloneTree(tree);
  const found = findNode(next, id);
  if (found) updater(found.node, found.parent);
  return next;
}

export function deleteNode(tree, id) {
  const next = cloneTree(tree);
  const found = findNode(next, id);
  if (found?.parent) {
    found.parent.children = found.parent.children.filter((child) => child.id !== id);
  }
  return next;
}

export function addChild(tree, parentId, child) {
  return updateNode(tree, parentId, (node) => {
    if (node.type !== 'folder') return;
    node.children = [...(node.children ?? []), child];
  });
}

export function moveNode(tree, nodeId, targetFolderId) {
  const next = cloneTree(tree);
  const found = findNode(next, nodeId);
  const target = findNode(next, targetFolderId);
  if (!found?.parent || !target?.node || target.node.type !== 'folder' || nodeId === targetFolderId) return tree;
  found.parent.children = found.parent.children.filter((child) => child.id !== nodeId);
  target.node.children = [...(target.node.children ?? []), found.node];
  return next;
}

export function getDiff(current, recommended) {
  const currentPaths = new Set(flattenTree(current).map((item) => item.path));
  const recommendedPaths = new Set(flattenTree(recommended).map((item) => item.path));
  return {
    added: [...recommendedPaths].filter((path) => !currentPaths.has(path)),
    removed: [...currentPaths].filter((path) => !recommendedPaths.has(path)),
    unchanged: [...currentPaths].filter((path) => recommendedPaths.has(path)),
  };
}

export function getSuggestion(node) {
  if (!node) return null;
  const name = node.name.toLowerCase();
  if (node.smell) {
    return {
      title: 'Questionable placement',
      better: 'Move feature-owned code into src/features/<feature>.',
      reason: node.smell,
    };
  }
  if (name.includes('context')) {
    return {
      title: 'Provider boundary review',
      better: 'Use src/app/providers for app-wide providers or feature/state for route-specific context.',
      reason: 'Context files become risky when ownership and update frequency are unclear.',
    };
  }
  if (name.includes('dashboard')) {
    return {
      title: 'Feature ownership candidate',
      better: 'Move dashboard-specific UI and hooks into src/features/dashboard.',
      reason: 'Feature folders keep UI, state, hooks, and tests close to the behavior they support.',
    };
  }
  if (name.includes('helper') || name.includes('utils')) {
    return {
      title: 'Shared utility review',
      better: 'Use src/shared/lib for reusable utilities and feature utils for feature-only helpers.',
      reason: 'A single utils folder often becomes a dumping ground with unclear ownership.',
    };
  }
  return {
    title: 'Looks reasonable',
    better: 'Keep this item near the feature or layer that owns its behavior.',
    reason: 'Good React structure is mostly about ownership clarity.',
  };
}

export function exportMarkdown(tree) {
  function walk(node, depth = 0) {
    const prefix = `${'  '.repeat(depth)}- ${node.type === 'folder' ? '📁' : '📄'} ${node.name}`;
    return [prefix, ...(node.children ?? []).flatMap((child) => walk(child, depth + 1))];
  }
  return walk(tree).join('\n');
}

export function exportCommands(tree) {
  const folders = flattenTree(tree).filter((item) => item.type === 'folder' && item.path !== 'project');
  const files = flattenTree(tree).filter((item) => item.type === 'file');
  return [
    ...folders.map((item) => `mkdir -p "${item.path.replace(/^project\//, '')}"`),
    ...files.map((item) => `touch "${item.path.replace(/^project\//, '')}"`),
  ].join('\n');
}
