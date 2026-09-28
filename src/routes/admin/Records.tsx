import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Check,
  Award,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useDentistStore } from '../../store/dentistStore';
import { useDemoStore } from '../../store/demoStore';
import { DentistRecord } from '../../types/dentist';

export function Records() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('s') || '';

  const { records, toggleStatus } = useDentistStore();
  const { completeGuideStep } = useDemoStore();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive'>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [distinguishedFilter, setDistinguishedFilter] = useState<'all' | 'Yes' | 'No'>('all');

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Feedback notice state
  const [notice, setNotice] = useState<{ message: string; recordId: string; undoAction?: () => void } | null>(null);

  // Filter records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Text search on name or unique_id
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesName = r.name.toLowerCase().includes(q);
        const matchesId = r.unique_id.toLowerCase().includes(q);
        const matchesPractice = r.practice_name?.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesPractice) return false;
      }

      // Status filter
      if (statusFilter !== 'all') {
        const isActive = r.status !== 'Inactive';
        if (statusFilter === 'Active' && !isActive) return false;
        if (statusFilter === 'Inactive' && isActive) return false;
      }

      // Country filter
      if (countryFilter !== 'all' && r.country !== countryFilter) {
        return false;
      }

      // Distinguished filter
      if (distinguishedFilter !== 'all') {
        const isDist = r.distinguished === 'Yes';
        if (distinguishedFilter === 'Yes' && !isDist) return false;
        if (distinguishedFilter === 'No' && isDist) return false;
      }

      return true;
    });
  }, [records, searchQuery, statusFilter, countryFilter, distinguishedFilter]);

  // Paginated rows
  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  // Handle Quick Toggle (Active ⇄ Inactive) per PRD §8.5
  const handleToggleStatus = (record: DentistRecord) => {
    const result = toggleStatus(record.unique_id);
    completeGuideStep('admin-edit');

    const msg =
      result.newStatus === 'Inactive'
        ? `Record for ${record.name} deactivated. It is now hidden from public search.`
        : `Record for ${record.name} activated. It is now visible in public search.`;

    setNotice({
      message: msg,
      recordId: record.unique_id,
      undoAction: () => {
        toggleStatus(record.unique_id);
        setNotice(null);
      },
    });

    // Auto-dismiss notice after 8s per PRD §8.5
    setTimeout(() => {
      setNotice((prev) => (prev?.recordId === record.unique_id ? null : prev));
    }, 8000);
  };

  return (
    <div className="space-y-4 max-w-7xl">
      {/* Title & Add New Record */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#c3c4c7]">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-normal text-[#1d2327]">Dentist Records</h1>
          <Link to="/wp-admin/records/new" className="wp-button-secondary text-xs">
            Add New Record
          </Link>
        </div>

        {/* Search Box */}
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name or unique_id..."
            className="h-8 px-2.5 text-xs bg-white border border-[#8c8f94] rounded focus:border-[#2271b1] focus:outline-none w-64"
          />
          <button
            type="button"
            className="wp-button-secondary text-xs"
            onClick={() => setCurrentPage(1)}
          >
            Search Records
          </button>
        </div>
      </div>

      {/* WordPress Action Notice */}
      {notice && (
        <div className="wp-notice wp-notice-success flex items-center justify-between text-xs">
          <span>{notice.message}</span>
          {notice.undoAction && (
            <button
              type="button"
              onClick={notice.undoAction}
              className="text-[#2271b1] underline font-semibold ml-4 hover:text-[#135e96]"
            >
              Undo
            </button>
          )}
        </div>
      )}

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-2 text-xs text-[#50575e]">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="h-7 px-2 bg-white border border-[#8c8f94] rounded text-xs focus:border-[#2271b1]"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          {/* Country filter */}
          <select
            value={countryFilter}
            onChange={(e) => {
              setCountryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-7 px-2 bg-white border border-[#8c8f94] rounded text-xs focus:border-[#2271b1]"
          >
            <option value="all">All Countries</option>
            <option value="US">United States (US)</option>
            <option value="CA">Canada (CA)</option>
            <option value="UK">United Kingdom (UK)</option>
            <option value="AU">Australia (AU)</option>
          </select>

          {/* Distinguished filter */}
          <select
            value={distinguishedFilter}
            onChange={(e) => {
              setDistinguishedFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="h-7 px-2 bg-white border border-[#8c8f94] rounded text-xs focus:border-[#2271b1]"
          >
            <option value="all">All Tiers</option>
            <option value="Yes">Distinguished Only</option>
            <option value="No">Standard Only</option>
          </select>
        </div>

        {/* Pagination Controls per PRD §8.5 (No total counter!) */}
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#646970]">
            Page {currentPage} of {totalPages}
          </span>
          <div className="inline-flex rounded border border-[#8c8f94] overflow-hidden bg-white">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2 py-1 hover:bg-[#f0f0f1] disabled:opacity-40 disabled:hover:bg-white border-r border-[#8c8f94]"
              title="Previous page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-2 py-1 hover:bg-[#f0f0f1] disabled:opacity-40 disabled:hover:bg-white"
              title="Next page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* WP List Table per PRD §8.5 */}
      <div className="wp-table overflow-x-auto rounded bg-white border border-[#c3c4c7]">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th className="w-32">unique_id</th>
              <th>Name</th>
              <th>Practice</th>
              <th>Location</th>
              <th>Country</th>
              <th>Specialty</th>
              <th className="text-center">Distinguished</th>
              <th>Status</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-[#646970]">
                  No records match your search.
                </td>
              </tr>
            ) : (
              paginatedRows.map((record) => {
                const isActive = record.status !== 'Inactive';
                const isDistinguished = record.distinguished === 'Yes';

                return (
                  <tr key={record.unique_id} className="group border-b border-[#f0f0f1]">
                    {/* unique_id */}
                    <td className="font-mono text-xs text-[#50575e]">
                      {record.unique_id}
                    </td>

                    {/* Name + Row Actions */}
                    <td className="font-medium text-[#1d2327]">
                      <div>
                        <Link
                          to={`/wp-admin/records/${record.unique_id}`}
                          className="hover:text-[#2271b1] font-semibold text-[#135e96]"
                        >
                          {record.name}
                        </Link>
                      </div>

                      {/* Row Actions on Hover/Focus per PRD §8.5 */}
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-[#2271b1]">
                        <Link
                          to={`/wp-admin/records/${record.unique_id}`}
                          className="hover:underline"
                        >
                          Edit
                        </Link>
                        <span className="text-[#c3c4c7]">|</span>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(record)}
                          className={isActive ? 'text-[#b32d2e] hover:underline' : 'text-[#00a32a] hover:underline'}
                        >
                          {isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        {isDistinguished && isActive && record.slug && (
                          <>
                            <span className="text-[#c3c4c7]">|</span>
                            <Link
                              to={`/dentist/${record.slug}`}
                              target="_blank"
                              className="text-[#50575e] hover:underline flex items-center gap-0.5"
                            >
                              <span>View on site</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </Link>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Practice */}
                    <td className="text-xs text-[#50575e] truncate max-w-[160px]">
                      {record.practice_name || '—'}
                    </td>

                    {/* Location with alphanumeric/leading-zero postal */}
                    <td className="text-xs text-[#50575e]">
                      {record.city}, {record.state_province_region}{' '}
                      <span className="font-mono text-[#1d2327]">{record.postal_code}</span>
                    </td>

                    {/* Country */}
                    <td className="font-mono text-xs text-[#1d2327]">
                      {record.country}
                    </td>

                    {/* Specialty */}
                    <td className="text-xs text-[#50575e]">
                      {record.specialty || 'General'}
                    </td>

                    {/* Distinguished Badge */}
                    <td className="text-center">
                      {isDistinguished ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] bg-[#f1e8d7] text-[#7d5f2e] font-semibold border border-[#a8834a]/30">
                          <Award className="w-3 h-3 text-[#a8834a]" />
                          <span>Yes</span>
                        </span>
                      ) : (
                        <span className="text-[#c3c4c7]">—</span>
                      )}
                    </td>

                    {/* Status Pill */}
                    <td>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          isActive
                            ? 'bg-[#e3f0e8] text-[#00a32a]'
                            : 'bg-[#f6e2df] text-[#b32d2e]'
                        }`}
                      >
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Updated */}
                    <td className="text-[11px] text-[#8c8f94] whitespace-nowrap">
                      {record.updated_at ? new Date(record.updated_at).toLocaleDateString() : 'Recent'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
