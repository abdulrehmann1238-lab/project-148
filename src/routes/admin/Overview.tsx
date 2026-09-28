import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Database,
  UploadCloud,
  PlusCircle,
  Search,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { useDentistStore } from '../../store/dentistStore';

export function Overview() {
  const navigate = useNavigate();
  const [quickQuery, setQuickQuery] = useState('');
  const records = useDentistStore((s) => s.records);

  // Active records count in current session
  const activeCount = records.filter((r) => r.status !== 'Inactive').length;

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickQuery.trim()) {
      navigate(`/wp-admin/records?s=${encodeURIComponent(quickQuery.trim())}`);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#c3c4c7]">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-normal text-[#1d2327]">Dentist Directory</h1>
          <Link to="/wp-admin/records/new" className="wp-button-secondary text-xs">
            Add New Record
          </Link>
          <Link to="/wp-admin/import" className="wp-button-secondary text-xs flex items-center gap-1">
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </Link>
        </div>

        {/* Quick Search Box */}
        <form onSubmit={handleQuickSearch} className="flex items-center gap-1.5">
          <input
            type="text"
            value={quickQuery}
            onChange={(e) => setQuickQuery(e.target.value)}
            placeholder="Search by name or unique_id..."
            className="h-7 px-2.5 text-xs bg-white border border-[#8c8f94] rounded focus:border-[#2271b1] focus:outline-none w-56"
          />
          <button type="submit" className="wp-button-secondary text-xs">
            Search
          </button>
        </form>
      </div>

      {/* WordPress Info Notice */}
      <div className="wp-notice wp-notice-info">
        <p>
          <strong>Table Status:</strong> Flat table <code className="font-mono text-xs">wp_dnn_dentists</code> active with InnoDB FULLTEXT and B-Tree indexes. Public frontend directory queries bypass heavy WordPress post joins.
        </p>
      </div>

      {/* Cached Stat Cards (4) per PRD §8.4 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active */}
        <div className="wp-postbox p-4">
          <div className="text-xs text-[#646970] uppercase font-semibold">Active Records</div>
          <div className="text-2xl font-semibold text-[#1d2327] mt-1">298,412</div>
          <div className="text-[11px] text-[#646970] mt-1.5">
            Updated 06:00 · cached hourly
          </div>
        </div>

        {/* Card 2: Inactive */}
        <div className="wp-postbox p-4">
          <div className="text-xs text-[#646970] uppercase font-semibold">Inactive (Hidden)</div>
          <div className="text-2xl font-semibold text-[#b32d2e] mt-1">1,588</div>
          <div className="text-[11px] text-[#646970] mt-1.5">
            Excluded from search results
          </div>
        </div>

        {/* Card 3: Distinguished */}
        <div className="wp-postbox p-4">
          <div className="text-xs text-[#646970] uppercase font-semibold">Distinguished Tier</div>
          <div className="text-2xl font-semibold text-[#A8834A] mt-1">412</div>
          <div className="text-[11px] text-[#646970] mt-1.5">
            Editorial magazine covers active
          </div>
        </div>

        {/* Card 4: Last Import */}
        <div className="wp-postbox p-4">
          <div className="text-xs text-[#646970] uppercase font-semibold">Last Batch Import</div>
          <div className="text-sm font-semibold text-[#1d2327] mt-1 truncate">
            Today 09:14 (Incremental)
          </div>
          <div className="text-[11px] text-[#00a32a] font-medium mt-1.5">
            1,850 rows · 0 errors
          </div>
        </div>
      </div>

      {/* Sparkline + Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sparkline: Records Added per Import */}
        <div className="lg:col-span-6 wp-postbox p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#f0f0f1] mb-4">
            <h2 className="text-sm font-semibold text-[#1d2327] flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#2271b1]" />
              <span>Records Ingested per Batch (Last 7 Days)</span>
            </h2>
            <span className="text-[11px] text-[#646970]">Total 48,250 rows</span>
          </div>

          {/* Hand-built SVG Sparkline (No chart library per PRD §23) */}
          <div className="h-36 w-full">
            <svg viewBox="0 0 400 120" className="w-full h-full overflow-visible">
              {/* Grid lines */}
              <line x1="0" y1="20" x2="400" y2="20" stroke="#f0f0f1" strokeWidth="1" />
              <line x1="0" y1="60" x2="400" y2="60" stroke="#f0f0f1" strokeWidth="1" />
              <line x1="0" y1="100" x2="400" y2="100" stroke="#f0f0f1" strokeWidth="1" />

              {/* Sparkline fill area */}
              <polygon
                points="0,110 50,85 100,90 150,55 200,60 250,30 300,45 350,25 400,20 400,120 0,120"
                fill="#2271b1"
                opacity="0.1"
              />

              {/* Sparkline path */}
              <polyline
                fill="none"
                stroke="#2271b1"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="0,110 50,85 100,90 150,55 200,60 250,30 300,45 350,25 400,20"
              />

              {/* Points */}
              {[[0, 110], [50, 85], [100, 90], [150, 55], [200, 60], [250, 30], [300, 45], [350, 25], [400, 20]].map(
                ([x, y], idx) => (
                  <circle key={idx} cx={x} cy={y} r="3.5" fill="#fff" stroke="#2271b1" strokeWidth="2" />
                )
              )}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#646970] mt-2 pt-2 border-t border-[#f0f0f1]">
            <span>Mon: 2,100</span>
            <span>Wed: 4,800</span>
            <span>Fri: 12,500</span>
            <span>Sun: 1,850</span>
          </div>
        </div>

        {/* Recent Directory Activity (5 items per PRD §8.4) */}
        <div className="lg:col-span-6 wp-postbox p-5">
          <div className="pb-3 border-b border-[#f0f0f1] mb-3">
            <h2 className="text-sm font-semibold text-[#1d2327]">Recent Directory Activity</h2>
          </div>

          <ul className="divide-y divide-[#f0f0f1] text-xs">
            <li className="py-2.5 flex items-start justify-between">
              <div>
                <span className="font-semibold text-[#1d2327]">Batch Import: Incremental file</span>
                <p className="text-[#646970] text-[11.5px]">1,850 records processed · 3 updated, 2 inserted</p>
              </div>
              <span className="text-[11px] text-[#8c8f94] shrink-0">Today 09:14 by Maya R.</span>
            </li>
            <li className="py-2.5 flex items-start justify-between">
              <div>
                <span className="font-semibold text-[#1d2327]">Status Changed: Dr. Kevin Marsh</span>
                <p className="text-[#b32d2e] text-[11.5px]">Deactivated (Hidden from public search)</p>
              </div>
              <span className="text-[11px] text-[#8c8f94] shrink-0">Yesterday 16:30 by Sarah T.</span>
            </li>
            <li className="py-2.5 flex items-start justify-between">
              <div>
                <span className="font-semibold text-[#1d2327]">Record Updated: Dr. Emily Chen, DDS</span>
                <p className="text-[#646970] text-[11.5px]">Updated phone number & practice website</p>
              </div>
              <span className="text-[11px] text-[#8c8f94] shrink-0">28 Feb 11:20 by Maya R.</span>
            </li>
            <li className="py-2.5 flex items-start justify-between">
              <div>
                <span className="font-semibold text-[#1d2327]">Profile Published: Dr. Marcus Whitfield</span>
                <p className="text-[#00a32a] text-[11.5px]">Promoted to Distinguished Tier (Boston, MA)</p>
              </div>
              <span className="text-[11px] text-[#8c8f94] shrink-0">25 Feb 14:05 by Editorial</span>
            </li>
            <li className="py-2.5 flex items-start justify-between">
              <div>
                <span className="font-semibold text-[#1d2327]">Database Index Maintenance</span>
                <p className="text-[#646970] text-[11.5px]">OPTIMIZE TABLE wp_dnn_dentists completed</p>
              </div>
              <span className="text-[11px] text-[#8c8f94] shrink-0">24 Feb 02:00 by System</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
