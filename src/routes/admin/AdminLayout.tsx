import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  Database,
  UploadCloud,
  FileText,
  Users,
  Settings,
  Menu,
  ExternalLink,
  ChevronRight,
  PlusCircle,
  Home,
} from 'lucide-react';
import '../../styles/admin.css';

export function AdminLayout() {
  const location = useLocation();
  const [menuCollapsed, setMenuCollapsed] = useState(false);

  return (
    <div className="wp-admin-root min-h-screen flex flex-col font-sans text-[#3c434a]">
      {/* 32px WordPress Admin Top Bar */}
      <header className="wp-admin-bar flex items-center justify-between px-3 text-xs select-none sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-white hover:text-[#72aee6] font-semibold"
            title="Return to Public Site"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Dental News Network</span>
          </Link>

          <Link
            to="/find-a-dentist"
            className="hidden sm:flex items-center gap-1 text-[#c3c4c7] hover:text-white"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Visit Site</span>
          </Link>

          <div className="hidden md:flex items-center gap-2 text-[#a7aaad] pl-2 border-l border-[#3c434a]">
            <span>+ New</span>
            <Link to="/wp-admin/records/new" className="text-[#c3c4c7] hover:text-white">
              Dentist Record
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#c3c4c7]">
            <span className="w-2 h-2 rounded-full bg-[#00a32a]" />
            <span>Howdy, <strong className="text-white">Maya R. (Editor)</strong></span>
          </div>

          <Link
            to="/"
            className="ml-2 px-2 py-0.5 rounded text-[11px] bg-[#2c3338] text-[#72aee6] hover:bg-[#3c434a] hover:text-white"
          >
            Exit to Public Site ↗
          </Link>
        </div>
      </header>

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex">
        {/* Left WordPress Menu (#1D2327) */}
        <aside
          className={`wp-admin-menu shrink-0 select-none transition-all duration-200 ${
            menuCollapsed ? 'w-12' : 'w-44'
          }`}
        >
          <div className="py-2">
            {/* Non-functional core items (faithful WP styling) */}
            <div className="px-3 py-1.5 text-[#8c8f94] text-xs flex items-center gap-2">
              <span className="w-4 h-4 opacity-50">📊</span>
              {!menuCollapsed && <span>Dashboard</span>}
            </div>
            <div className="px-3 py-1.5 text-[#8c8f94] text-xs flex items-center gap-2">
              <span className="w-4 h-4 opacity-50">📝</span>
              {!menuCollapsed && <span>Posts</span>}
            </div>
            <div className="px-3 py-1.5 text-[#8c8f94] text-xs flex items-center gap-2">
              <span className="w-4 h-4 opacity-50">🖼</span>
              {!menuCollapsed && <span>Media</span>}
            </div>
            <div className="px-3 py-1.5 text-[#8c8f94] text-xs flex items-center gap-2">
              <span className="w-4 h-4 opacity-50">📄</span>
              {!menuCollapsed && <span>Pages</span>}
            </div>

            {/* Active Dentist Directory Menu */}
            <div className="mt-2 pt-2 border-t border-[#3c434a]">
              <Link
                to="/wp-admin"
                className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold ${
                  location.pathname === '/wp-admin'
                    ? 'bg-[#2271b1] text-white'
                    : 'text-white hover:bg-[#2c3338]'
                }`}
              >
                <Database className="w-4 h-4 text-[#72aee6]" />
                {!menuCollapsed && <span>Dentist Directory</span>}
              </Link>

              {!menuCollapsed && (
                <div className="bg-[#2c3338] py-1 text-xs space-y-0.5">
                  <Link
                    to="/wp-admin/records"
                    className={`block px-5 py-1.5 text-xs ${
                      location.pathname === '/wp-admin/records'
                        ? 'text-white font-semibold'
                        : 'text-[#c3c4c7] hover:text-[#72aee6]'
                    }`}
                  >
                    All Records
                  </Link>
                  <Link
                    to="/wp-admin/records/new"
                    className={`block px-5 py-1.5 text-xs ${
                      location.pathname === '/wp-admin/records/new'
                        ? 'text-white font-semibold'
                        : 'text-[#c3c4c7] hover:text-[#72aee6]'
                    }`}
                  >
                    Add New Record
                  </Link>
                  <Link
                    to="/wp-admin/import"
                    className={`block px-5 py-1.5 text-xs ${
                      location.pathname === '/wp-admin/import'
                        ? 'text-white font-semibold'
                        : 'text-[#c3c4c7] hover:text-[#72aee6]'
                    }`}
                  >
                    Import CSV
                  </Link>
                </div>
              )}
            </div>

            {/* Collapse toggle */}
            <div className="mt-6 px-3">
              <button
                type="button"
                onClick={() => setMenuCollapsed(!menuCollapsed)}
                className="text-[#a7aaad] hover:text-white text-xs flex items-center gap-1.5"
              >
                <Menu className="w-3.5 h-3.5" />
                {!menuCollapsed && <span>Collapse menu</span>}
              </button>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-[#f0f0f1] p-5 sm:p-7 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
