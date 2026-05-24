export const scenarioPresets = [
  {
    id: 'ecommerce',
    name: 'Ecommerce Filters',
    domain: 'Product catalog',
    components: ['CatalogPage', 'SearchInput', 'FacetPanel', 'ProductGrid', 'ProductCard', 'CartDrawer'],
    risk: 'Filter state can re-render every product card when owned by the page.',
  },
  {
    id: 'chat',
    name: 'Chat Message List',
    domain: 'Realtime messaging',
    components: ['ChatShell', 'ThreadList', 'MessageList', 'MessageRow', 'Composer', 'PresenceBadge'],
    risk: 'Typing state and presence updates can invalidate the whole conversation.',
  },
  {
    id: 'kanban',
    name: 'Kanban Board',
    domain: 'Project management',
    components: ['Board', 'Column', 'CardList', 'TaskCard', 'AssigneeFilter', 'QuickEditModal'],
    risk: 'Dragging one card can re-render every column when board state is too broad.',
  },
  {
    id: 'form-builder',
    name: 'Form Builder',
    domain: 'Admin tooling',
    components: ['BuilderShell', 'FieldPalette', 'Canvas', 'FieldNode', 'Inspector', 'Preview'],
    risk: 'Inspector edits can re-render the canvas preview and every field node.',
  },
  {
    id: 'notifications',
    name: 'Notification Center',
    domain: 'SaaS workspace',
    components: ['NotificationHub', 'Tabs', 'NotificationList', 'NotificationRow', 'PreferencePanel', 'ToastLayer'],
    risk: 'Unread count updates can cascade through unrelated notification settings.',
  },
];

export const contextFields = [
  { name: 'theme', frequency: 'medium', consumers: 'layout chrome', recommendation: 'ThemeContext' },
  { name: 'user', frequency: 'low', consumers: 'profile and permissions', recommendation: 'UserContext' },
  { name: 'filters', frequency: 'high', consumers: 'table and charts', recommendation: 'FilterContext near dashboard route' },
  { name: 'modal state', frequency: 'medium', consumers: 'modal boundary', recommendation: 'Local ModalBoundary state' },
  { name: 'notifications', frequency: 'high', consumers: 'notification panel', recommendation: 'NotificationContext scoped to hub' },
  { name: 'permissions', frequency: 'low', consumers: 'route guards', recommendation: 'PermissionContext or loader data' },
];

export const propStabilityChecks = [
  { pattern: 'Inline object', example: '<Chart options={{ dense: true }} />', issue: 'New identity every render', fix: 'Hoist options or memoize when expensive.' },
  { pattern: 'Inline array', example: '<Table columns={[nameCol, roleCol]} />', issue: 'Breaks memoized table props', fix: 'Define columns outside render or useMemo.' },
  { pattern: 'Anonymous callback', example: '<Row onClick={() => select(row.id)} />', issue: 'New function for every row', fix: 'Pass row id payload or use stable row handler.' },
  { pattern: 'Large object prop', example: '<Panel model={dashboardState} />', issue: 'Any field update invalidates child', fix: 'Pass minimal primitive props or selectors.' },
];

export const responsibilities = [
  { component: 'DashboardShell', ui: 'Layout grid', state: 'None', data: 'Composes sections', logic: 'Routing boundary' },
  { component: 'SearchSection', ui: 'Search input and results shell', state: 'searchQuery', data: 'Filtered ids', logic: 'Search coordination' },
  { component: 'UserTable', ui: 'Table and rows', state: 'selectedUserId', data: 'Visible users', logic: 'Selection behavior' },
  { component: 'ChartPanel', ui: 'Analytics chart', state: 'None', data: 'Derived chart model', logic: 'Memoized aggregation' },
  { component: 'ModalBoundary', ui: 'Settings modal slot', state: 'isOpen', data: 'None', logic: 'Open/close workflow' },
];

export const learningMissions = [
  { title: 'Reduce search blast radius', goal: 'Move search state from Dashboard into SearchSection.', success: 'Sidebar and ChartPanel stay stable after typing.' },
  { title: 'Split global context', goal: 'Separate theme, filters, user, and notifications.', success: 'Theme toggle no longer invalidates data-heavy panels.' },
  { title: 'Isolate list rows', goal: 'Make row selection update only affected rows.', success: 'Only previous and next selected rows render.' },
  { title: 'Stabilize chart props', goal: 'Remove inline config objects from ChartPanel props.', success: 'Memoized chart skips unrelated parent renders.' },
  { title: 'Export review evidence', goal: 'Generate the architecture report after comparing before/after.', success: 'Report includes saved renders and recommendation summary.' },
];

export const memoDecisionQuestions = [
  { label: 'Is the component expensive to render?', yes: 25, no: -10 },
  { label: 'Are incoming props stable?', yes: 25, no: -25 },
  { label: 'Does the parent render often?', yes: 20, no: -5 },
  { label: 'Is state already owned at the right boundary?', yes: 20, no: -30 },
  { label: 'Would splitting the component be clearer?', yes: -20, no: 10 },
];
