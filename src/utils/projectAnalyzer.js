const sourceExtensions = new Set(['.js', '.jsx', '.ts', '.tsx']);
const testPatterns = [/\.test\./, /\.spec\./, /__tests__/];

function extensionOf(path) {
  const match = path.match(/\.[a-z0-9]+$/i);
  return match?.[0]?.toLowerCase() ?? '';
}

function isSourceFile(path) {
  return sourceExtensions.has(extensionOf(path));
}

function hasAnyPath(files, patterns) {
  return files.some((file) => patterns.some((pattern) => file.path.includes(pattern)));
}

function detectFeatureFolders(files) {
  const featureRoots = new Map();
  files.forEach((file) => {
    const parts = file.path.split('/');
    const featureIndex = parts.findIndex((part) => ['features', 'modules', 'domains'].includes(part));
    if (featureIndex >= 0 && parts[featureIndex + 1]) {
      const feature = parts[featureIndex + 1];
      featureRoots.set(feature, (featureRoots.get(feature) ?? 0) + 1);
    }
  });
  return [...featureRoots.entries()].map(([name, count]) => ({ name, count }));
}

function getLargeFiles(files) {
  return files
    .filter((file) => isSourceFile(file.path))
    .map((file) => ({ ...file, lines: file.content.split(/\r?\n/).length }))
    .filter((file) => file.lines > 220)
    .sort((a, b) => b.lines - a.lines)
    .slice(0, 8);
}

function detectSmells(files) {
  const smells = [];
  const sourceFiles = files.filter((file) => isSourceFile(file.path));
  const largeFiles = getLargeFiles(files);
  const contextFiles = sourceFiles.filter((file) => /context|provider/i.test(file.path) || /createContext\(/.test(file.content));
  const hookFiles = sourceFiles.filter((file) => /\/hooks?\//.test(file.path) || /use[A-Z]\w+/.test(file.content));
  const componentFiles = sourceFiles.filter((file) => /\/components?\//.test(file.path) || /function\s+[A-Z]\w+|const\s+[A-Z]\w+\s*=/.test(file.content));
  const inlineRisks = sourceFiles.filter((file) => /={{\s*[^}]+}}|=\{\[[^\]]+\]\}|=\{\(\)\s*=>/.test(file.content));
  const broadState = sourceFiles.filter((file) => /(App|Dashboard|Page)\.(jsx|tsx|js|ts)$/.test(file.path) && /useState|useReducer|createContext/.test(file.content));

  if (!hasAnyPath(files, ['/src/features/', '/src/modules/', '/src/domains/'])) {
    smells.push({
      title: 'No feature/domain layer detected',
      severity: 'warning',
      detail: 'The project appears organized mostly by technical type. Larger React apps usually scale better with feature/domain folders.',
      fix: 'Introduce src/features/<feature> with local components, hooks, state, and tests.',
    });
  }

  if (!hasAnyPath(files, ['/src/hooks/', '/src/shared/hooks/', '/src/features/']) && hookFiles.length > 3) {
    smells.push({
      title: 'Hooks are not clearly organized',
      severity: 'warning',
      detail: 'Custom hooks exist, but there is no clear hooks or feature ownership folder.',
      fix: 'Move shared hooks to src/shared/hooks and feature-specific hooks inside their feature folder.',
    });
  }

  if (largeFiles.length) {
    smells.push({
      title: 'Large component files detected',
      severity: 'danger',
      detail: `${largeFiles.length} source files exceed 220 lines. Large files often mix UI, state, effects, and business rules.`,
      fix: 'Extract sections, hooks, and pure helpers. Start with the largest page or dashboard file.',
    });
  }

  if (contextFiles.length > 4 && !hasAnyPath(files, ['/src/providers/', '/src/app/providers/'])) {
    smells.push({
      title: 'Context/provider ownership is unclear',
      severity: 'warning',
      detail: 'Several context-like files exist without an obvious provider boundary folder.',
      fix: 'Group app-wide providers under src/app/providers and keep route-specific providers near their routes.',
    });
  }

  if (inlineRisks.length > 3) {
    smells.push({
      title: 'Inline prop identity risks',
      severity: 'warning',
      detail: 'Several files contain inline object, array, or callback props that can break memoization.',
      fix: 'Stabilize expensive child props with local constants, useMemo, useCallback, or smaller boundaries.',
    });
  }

  if (broadState.length) {
    smells.push({
      title: 'State may be owned too high',
      severity: 'danger',
      detail: 'Top-level page/app files contain useState/useReducer/context logic.',
      fix: 'Move interaction state to the smallest section boundary that needs to coordinate it.',
    });
  }

  if (!sourceFiles.some((file) => testPatterns.some((pattern) => pattern.test(file.path)))) {
    smells.push({
      title: 'No tests detected',
      severity: 'warning',
      detail: 'No test/spec files were found in the imported folder.',
      fix: 'Add focused tests for hooks, reducers, and important interaction zones.',
    });
  }

  if (!hasAnyPath(files, ['/src/shared/', '/src/lib/', '/src/utils/'])) {
    smells.push({
      title: 'Shared utilities layer missing',
      severity: 'muted',
      detail: 'No obvious shared/lib/utils layer was detected.',
      fix: 'Create src/shared or src/lib for reusable primitives that are not owned by one feature.',
    });
  }

  return {
    smells,
    largeFiles,
    contextFiles,
    componentFiles,
    hookFiles,
    inlineRisks,
    featureFolders: detectFeatureFolders(files),
  };
}

function scoreProject(files, signals) {
  let score = 88;
  if (!hasAnyPath(files, ['/src/app/', '/src/pages/', '/src/routes/'])) score -= 8;
  if (!hasAnyPath(files, ['/src/features/', '/src/modules/', '/src/domains/'])) score -= 14;
  if (!hasAnyPath(files, ['/src/components/', '/src/shared/components/', '/src/ui/'])) score -= 8;
  if (!hasAnyPath(files, ['/src/hooks/', '/src/shared/hooks/']) && signals.hookFiles.length > 2) score -= 6;
  if (signals.largeFiles.length) score -= Math.min(18, signals.largeFiles.length * 5);
  if (signals.inlineRisks.length > 3) score -= 8;
  if (!files.some((file) => testPatterns.some((pattern) => pattern.test(file.path)))) score -= 8;
  if (signals.featureFolders.length >= 2) score += 8;
  return Math.max(18, Math.min(98, score));
}

function buildTree(files) {
  const root = { name: 'project', type: 'folder', children: new Map(), count: 0 };
  files.forEach((file) => {
    const parts = file.path.split('/').filter(Boolean);
    let current = root;
    current.count += 1;
    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      if (!current.children.has(part)) {
        current.children.set(part, { name: part, type: isFile ? 'file' : 'folder', children: new Map(), count: 0 });
      }
      current = current.children.get(part);
      current.count += 1;
    });
  });
  return root;
}

export function analyzeProject(files) {
  const sourceFiles = files.filter((file) => isSourceFile(file.path));
  const signals = detectSmells(files);
  const score = scoreProject(files, signals);
  const recommendations = [
    'Prefer feature/domain folders for product-owned behavior.',
    'Keep shared UI primitives in src/shared or src/components/ui.',
    'Move interaction state to the smallest responsible route or section.',
    'Split broad context providers by update frequency.',
    'Keep large pages thin by extracting hooks, sections, and pure helpers.',
  ];

  return {
    score,
    files,
    tree: buildTree(files),
    totals: {
      files: files.length,
      source: sourceFiles.length,
      components: signals.componentFiles.length,
      hooks: signals.hookFiles.length,
      contexts: signals.contextFiles.length,
      largeFiles: signals.largeFiles.length,
      inlineRisks: signals.inlineRisks.length,
      features: signals.featureFolders.length,
    },
    smells: signals.smells,
    largeFiles: signals.largeFiles,
    featureFolders: signals.featureFolders,
    recommendations,
    idealStructure: [
      'src/app',
      'src/app/routes',
      'src/app/providers',
      'src/features/<feature>/components',
      'src/features/<feature>/hooks',
      'src/features/<feature>/state',
      'src/features/<feature>/utils',
      'src/shared/components',
      'src/shared/hooks',
      'src/shared/lib',
      'src/shared/ui',
    ],
  };
}
