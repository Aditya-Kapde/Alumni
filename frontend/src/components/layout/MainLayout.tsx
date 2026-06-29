import { Outlet } from 'react-router-dom';
import GlobalNavbar from './GlobalNavbar';
import GlobalAnnouncementBanner from './GlobalAnnouncementBanner';

export default function MainLayout() {
  return (
    <div className="min-h-screen">
      <GlobalAnnouncementBanner />
      <GlobalNavbar />
      <main className="pb-24 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
}
