import { Outlet } from 'react-router-dom';
import { Header } from './Header.jsx';
import { Sidebar } from './Sidebar.jsx';

export function AppLayout() {
  return (
    <div className="min-h-screen overflow-hidden lg:flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Header />
        <main className="h-[calc(100vh-73px)] overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
