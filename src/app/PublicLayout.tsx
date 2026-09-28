import React from 'react';
import { Outlet } from 'react-router-dom';
import { SiteNav } from '../components/shell/SiteNav';
import { StickySearch } from '../components/shell/StickySearch';
import { Footer } from '../components/shell/Footer';
import { DemoControls } from '../components/shell/DemoControls';
import { DemoGuide } from '../components/shell/DemoGuide';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-ink selection:bg-primary-t selection:text-primary">
      {/* Site Navigation (Non-sticky per PRD §7.1) */}
      <SiteNav />

      {/* Sitewide Sticky Dual Search Bar per PRD §7.2 */}
      <StickySearch />

      {/* Page Body */}
      <div className="flex-1">
        <Outlet />
      </div>

      {/* Footer Closing Element per PRD §20 */}
      <Footer />

      {/* Global Reviewer Demo Aids */}
      <DemoControls />
      <DemoGuide />
    </div>
  );
}
