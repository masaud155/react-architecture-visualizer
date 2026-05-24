export const starterRefactorCode = `function Dashboard({ users, theme }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const chartOptions = { dense: true, theme };

  return (
    <DashboardLayout>
      <Sidebar searchQuery={searchQuery} />
      <SearchBar value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />
      <UserTable
        users={users}
        selectedUserId={selectedUserId}
        onSelect={(id) => setSelectedUserId(id)}
      />
      <ChartPanel options={chartOptions} />
    </DashboardLayout>
  );
}`;

export const refactorActions = [
  {
    id: 'move-state-down',
    label: 'Move state down',
    impact: 'Reduces unrelated renders by keeping search and selection state inside focused sections.',
  },
  {
    id: 'extract-hook',
    label: 'Extract hook',
    impact: 'Separates state coordination from visual layout and makes behavior easier to test.',
  },
  {
    id: 'stabilize-props',
    label: 'Stabilize props',
    impact: 'Prevents memoized children from re-rendering due to new object/function identities.',
  },
  {
    id: 'memoize-row',
    label: 'Memoize row',
    impact: 'Helps large lists update only the selected/changed rows when props are stable.',
  },
  {
    id: 'split-boundaries',
    label: 'Split boundaries',
    impact: 'Turns one broad page render zone into smaller interaction-focused sections.',
  },
];

export function analyzeReactCode(source) {
  const lines = source.split(/\r?\n/).length;
  const smells = [];

  if (lines > 90) {
    smells.push({
      id: 'large-component',
      title: 'Large component body',
      severity: 'warning',
      detail: `${lines} lines in one component. Large React components often mix layout, state, and business rules.`,
      action: 'split-boundaries',
    });
  }

  if (/function\s+(App|Dashboard|.*Page)|const\s+(App|Dashboard|.*Page)\s*=/.test(source) && /useState|useReducer/.test(source)) {
    smells.push({
      id: 'state-too-high',
      title: 'State may be owned too high',
      severity: 'danger',
      detail: 'A page/shell component owns interaction state. This often re-renders unrelated siblings.',
      action: 'move-state-down',
    });
  }

  if (/=\{\{[^}]+}}/.test(source) || /const\s+\w+\s*=\s*\{[^}]+}/.test(source)) {
    smells.push({
      id: 'inline-object',
      title: 'Unstable object props',
      severity: 'warning',
      detail: 'Object values are created during render and can break child memoization.',
      action: 'stabilize-props',
    });
  }

  if (/=\{\(?[^}]*\)?\s*=>/.test(source)) {
    smells.push({
      id: 'inline-callback',
      title: 'Inline callback props',
      severity: 'warning',
      detail: 'Callbacks created inside JSX can change identity on every render.',
      action: 'stabilize-props',
    });
  }

  if (/\.map\(/.test(source) && !/memo\(/.test(source)) {
    smells.push({
      id: 'list-risk',
      title: 'List rendering isolation risk',
      severity: 'warning',
      detail: 'A mapped list appears without an obvious memoized row boundary.',
      action: 'memoize-row',
    });
  }

  if (/createContext|useContext/.test(source) && /theme|user|filters|modal|permissions|notifications/.test(source)) {
    smells.push({
      id: 'broad-context',
      title: 'Possible broad context usage',
      severity: 'warning',
      detail: 'Multiple unrelated values appear near context usage. Split providers by update frequency.',
      action: 'split-boundaries',
    });
  }

  const score = Math.max(24, 92 - smells.reduce((sum, smell) => sum + (smell.severity === 'danger' ? 18 : 10), 0));
  return {
    lines,
    smells,
    score,
    actions: [...new Set(smells.map((smell) => smell.action))],
  };
}

export function generateRefactor(source, selectedActions) {
  const actions = new Set(selectedActions);
  const sections = [];

  if (actions.has('extract-hook') || actions.has('move-state-down')) {
    sections.push(`function useDashboardSelection() {
  const [selectedUserId, setSelectedUserId] = useState(null);

  return { selectedUserId, setSelectedUserId };
}`);
  }

  if (actions.has('move-state-down') || actions.has('split-boundaries')) {
    sections.push(`function SearchSection() {
  const [searchQuery, setSearchQuery] = useState('');

  return <SearchBar value={searchQuery} onChange={setSearchQuery} />;
}`);
  }

  if (actions.has('stabilize-props')) {
    sections.push(`function AnalyticsSection({ theme }) {
  const chartOptions = useMemo(() => ({ dense: true, theme }), [theme]);

  return <ChartPanel options={chartOptions} />;
}`);
  }

  if (actions.has('memoize-row')) {
    sections.push(`const MemoUserRow = memo(function UserRow({ user, isSelected, onSelect }) {
  return <UserRow user={user} isSelected={isSelected} onSelect={onSelect} />;
});`);
  }

  sections.push(`function Dashboard({ users, theme }) {
  const { selectedUserId, setSelectedUserId } = useDashboardSelection();
  const handleSelect = useCallback((id) => setSelectedUserId(id), [setSelectedUserId]);

  return (
    <DashboardLayout>
      <Sidebar />
      <SearchSection />
      <UserTable
        users={users}
        selectedUserId={selectedUserId}
        onSelect={handleSelect}
        RowComponent={MemoUserRow}
      />
      <AnalyticsSection theme={theme} />
    </DashboardLayout>
  );
}`);

  if (!selectedActions.length) {
    return source;
  }

  return sections.join('\n\n');
}

export function getRefactorImpact(selectedActions) {
  const count = selectedActions.length;
  return {
    renderReduction: Math.min(68, count * 14),
    wastedReduction: Math.min(80, count * 17),
    maintainabilityLift: Math.min(45, count * 9),
    confidence: count >= 3 ? 'High' : count >= 1 ? 'Medium' : 'Low',
  };
}
