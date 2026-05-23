export const codeSamples = {
  ownership: {
    bad: `function Dashboard() {\n  const [searchQuery, setSearchQuery] = useState('');\n  const [selectedUser, setSelectedUser] = useState(null);\n\n  return <AppShell searchQuery={searchQuery} selectedUser={selectedUser} />;\n}`,
    good: `function SearchSection() {\n  const [searchQuery, setSearchQuery] = useState('');\n\n  return <SearchResults query={searchQuery} onSearch={setSearchQuery} />;\n}`,
    takeaway: 'State should live as close as possible to the components that need it.',
  },
  propFlow: {
    bad: `<Dashboard user={user}>\n  <Layout user={user}>\n    <Sidebar user={user}>\n      <ProfileBadge user={user} />\n    </Sidebar>\n  </Layout>\n</Dashboard>`,
    good: `<Sidebar>\n  <UserBoundary>\n    <ProfileBadge />\n  </UserBoundary>\n</Sidebar>`,
    takeaway: 'Avoid making intermediate components understand data they do not use.',
  },
  context: {
    bad: `<AppContext.Provider value={{ user, theme, filters, modal, permissions }}>\n  <Dashboard />\n</AppContext.Provider>`,
    good: `<ThemeProvider>\n  <UserProvider>\n    <Dashboard />\n  </UserProvider>\n</ThemeProvider>`,
    takeaway: 'Context is a broadcast mechanism. Split values by update frequency.',
  },
  memo: {
    bad: `const Dashboard = memo(function Dashboard(props) {\n  const options = { dense: true };\n  return <HugeTree options={options} {...props} />;\n});`,
    good: `function Dashboard() {\n  return <DashboardShell analytics={<MemoizedChart />} />;\n}`,
    takeaway: 'Memoization reduces repeated work. It does not fix bad ownership.',
  },
  list: {
    bad: `rows.map((row) => <UserRow row={row} selectedId={selectedId} />)`,
    good: `rows.map((row) => <MemoUserRow id={row.id} isSelected={row.id === selectedId} />)`,
    takeaway: 'Rows should receive stable, minimal props so one item can update alone.',
  },
};
