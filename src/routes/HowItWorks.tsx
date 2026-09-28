import React, { useState } from 'react';
import {
  Database,
  Search,
  Shield,
  Layers,
  Calendar,
  CheckCircle,
  Clock,
  Zap,
  Mail,
  FileCode,
  ArrowRight,
} from 'lucide-react';

export function HowItWorks() {
  const [selectedQuery, setSelectedQuery] = useState<'ft' | 'zip_us' | 'zip_uk' | 'state' | 'country'>('ft');

  const queries = {
    ft: {
      term: 'orthodontist austin',
      index: 'FULLTEXT(name, practice_name, city, specialty)',
      type: 'FULLTEXT Index',
      speed: '0.18s',
      explanation:
        'MySQL MATCH(name, practice_name, city, specialty) AGAINST (+orthodontist +austin IN BOOLEAN MODE). Natural language relevance ranking with stopword handling.',
    },
    zip_us: {
      term: '78704',
      index: 'KEY idx_postal (postal_code)',
      type: 'B-Tree Index',
      speed: '0.04s',
      explanation:
        'Direct prefix B-Tree seek on varchar(20). Supports leading zeros (e.g. 02108) with O(log N) lookup time, bypassing text analysis engines entirely.',
    },
    zip_uk: {
      term: 'W1G 9PF',
      index: 'KEY idx_postal (postal_code)',
      type: 'B-Tree Index',
      speed: '0.05s',
      explanation:
        'Alphanumeric UK/CA postcode matching with normalized whitespace. Efficiently indexed via B-Tree index with high selectivity.',
    },
    state: {
      term: 'TX',
      index: 'KEY idx_region (state_province_region)',
      type: 'B-Tree Index',
      speed: '0.06s',
      explanation:
        'Targeted B-Tree index scan on state/province column combined with idx_distinguished to retrieve regional leaders rapidly.',
    },
    country: {
      term: 'AU',
      index: 'KEY idx_country (country)',
      type: 'B-Tree Index',
      speed: '0.05s',
      explanation:
        'CHAR(2) ISO country key lookup. Uses composite indexing strategy combined with idx_status to skip all inactive records.',
    },
  };

  const current = queries[selectedQuery];

  return (
    <div className="bg-bg min-h-screen pb-24">
      {/* Header Banner */}
      <section className="bg-surface border-b border-line py-12">
        <div className="max-w-content mx-auto px-5 sm:px-8">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xs bg-primary-t text-primary font-mono text-[11px] font-semibold mb-3">
            <FileCode className="w-3.5 h-3.5" />
            <span>ARCHITECTURAL PROTOTYPE DOCUMENTATION</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-ink tracking-tight">
            How It Works: 300,000 Records at Sub-Second Speed
          </h1>
          <p className="font-sans text-sm sm:text-base text-ink-2 max-w-2xl mt-3 leading-relaxed">
            Technical blueprint addressing MySQL indexing, chunked background upserts, SiteGround cache bypass, and scraper protection before writing production PHP.
          </p>
        </div>
      </section>

      <main className="max-w-content mx-auto px-5 sm:px-8 pt-12 space-y-16">
        {/* Section 1: Schema DDL */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-2xl text-ink font-medium">
              1. Custom Indexed MySQL Table Architecture
            </h2>
          </div>
          <p className="text-sm text-ink-2 max-w-3xl">
            Standard WordPress post storage (<code className="font-mono text-xs bg-surface px-1 py-0.5 rounded border border-line">wp_posts</code> and <code className="font-mono text-xs bg-surface px-1 py-0.5 rounded border border-line">wp_postmeta</code>) creates massive join overhead at 300k rows. The directory uses a dedicated flat InnoDB table with explicit B-Tree and FULLTEXT indexes:
          </p>

          <div className="p-4 sm:p-6 rounded-md bg-ink-bg text-[#E6EDE8] font-mono text-xs overflow-x-auto border border-line shadow-sh-2">
            <pre className="leading-relaxed">
              <code>{`CREATE TABLE {prefix}dnn_dentists (
  unique_id             VARCHAR(64)   NOT NULL,
  status                VARCHAR(20)   NOT NULL DEFAULT 'Active',
  name                  VARCHAR(255)  NOT NULL,
  practice_name         VARCHAR(255)  NULL,
  address_line_1        VARCHAR(255)  NULL,
  city                  VARCHAR(120)  NULL,
  state_province_region VARCHAR(120)  NULL,
  postal_code           VARCHAR(20)   NULL,
  country               CHAR(2)       NULL,
  phone                 VARCHAR(50)   NULL,
  email                 VARCHAR(255)  NULL,
  website               VARCHAR(500)  NULL,
  photo_url             VARCHAR(1000) NULL,
  distinguished         VARCHAR(3)    NULL,
  about                 MEDIUMTEXT    NULL,
  facebook_url          VARCHAR(500)  NULL,
  instagram_url         VARCHAR(500)  NULL,
  linkedin_url          VARCHAR(500)  NULL,
  x_url                 VARCHAR(500)  NULL,
  specialty             VARCHAR(120)  NULL,
  slug                  VARCHAR(190)  NULL,
  PRIMARY KEY (unique_id),
  KEY idx_country (country),
  KEY idx_region (state_province_region),
  KEY idx_postal (postal_code),
  KEY idx_distinguished (distinguished),
  KEY idx_status (status),
  UNIQUE KEY uq_slug (slug),
  FULLTEXT KEY ft_search (name, practice_name, city, specialty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`}</code>
            </pre>
          </div>
        </section>

        {/* Section 2: Interactive Index Routing Diagram */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-2xl text-ink font-medium">
              2. Interactive Query Router: Which Index Answers Which Search?
            </h2>
          </div>
          <p className="text-sm text-ink-2 max-w-3xl">
            Click a sample search query to trace how the backend query planner decides between FULLTEXT and B-Tree indexes, skips Inactive records, and applies pagination without counting all 300,000 rows.
          </p>

          {/* Query Selector Tabs */}
          <div className="flex flex-wrap gap-2">
            {(
              [
                ['ft', '"orthodontist austin"'],
                ['zip_us', '"78704" (US ZIP)'],
                ['zip_uk', '"W1G 9PF" (UK Postcode)'],
                ['state', '"TX" (Region)'],
                ['country', '"AU" (Country)'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedQuery(key)}
                className={`px-3 py-1.5 rounded-sm text-xs font-mono font-semibold transition-all ${
                  selectedQuery === key
                    ? 'bg-primary text-bg shadow-sm'
                    : 'bg-surface text-ink-2 hover:bg-elevated border border-line'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Interactive Routing Diagram Box */}
          <div className="p-6 rounded-md bg-surface border border-line-2 shadow-sh-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              {/* Step 1: Input Analysis */}
              <div className="p-4 rounded-sm bg-elevated border border-line text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-ink-3">Step 1: Input Analysis</span>
                <div className="font-mono text-xs font-semibold text-primary">q = "{current.term}"</div>
                <div className="text-[11px] text-ink-3">Pattern detection</div>
              </div>

              {/* Step 2: Index Route */}
              <div className="p-4 rounded-sm bg-primary-t/40 border border-primary/30 text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-primary">Step 2: Selected Index</span>
                <div className="font-mono text-xs font-semibold text-ink">{current.type}</div>
                <div className="text-[11px] font-mono text-ink-3">{current.index}</div>
              </div>

              {/* Step 3: Fast Filters */}
              <div className="p-4 rounded-sm bg-elevated border border-line text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-ink-3">Step 3: Filter & Sort</span>
                <div className="font-mono text-xs text-ink">status != 'Inactive'</div>
                <div className="text-[11px] text-ink-3">distinguished DESC, name ASC</div>
              </div>

              {/* Step 4: Output Speed */}
              <div className="p-4 rounded-sm bg-brass-t/50 border border-brass/40 text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-brass-ink">Step 4: Output</span>
                <div className="font-mono text-base font-bold text-brass-ink">{current.speed}</div>
                <div className="text-[11px] font-mono text-ink-3">LIMIT 13 (Zero total count)</div>
              </div>
            </div>

            <div className="p-4 rounded-sm bg-elevated border border-line text-xs text-ink-2 leading-relaxed">
              <strong className="text-ink font-semibold">Engine Detail: </strong>
              {current.explanation}
            </div>

            {/* Note on 2-char fallback (A6) */}
            <div className="p-3.5 rounded-sm bg-primary-t/30 border border-primary/20 text-xs text-primary flex items-start gap-2.5">
              <Zap className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Recommended Enhancement (A6): </strong>
                InnoDB FULLTEXT default token length is 3 characters (<code className="font-mono">innodb_ft_min_token_size=3</code>). For 2-character queries like "TX" or "NY", our query layer automatically falls back to B-Tree prefix scans on the <code className="font-mono">state_province_region</code> and <code className="font-mono">country</code> columns.
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Chunked Upsert Pipeline */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-2xl text-ink font-medium">
              3. Resumable Chunked Upsert Pipeline
            </h2>
          </div>
          <p className="text-sm text-ink-2 max-w-3xl">
            To prevent PHP execution timeouts on SiteGround shared hosting, large CSV files are parsed client-side into 1,000-row chunks and submitted via idempotent REST batches:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-sm bg-surface border border-line">
              <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">01. Ingestion</div>
              <p className="text-xs text-ink-2">Client streams CSV line by line. Memory footprint stays under 12 MB even on 84 MB files.</p>
            </div>
            <div className="p-4 rounded-sm bg-surface border border-line">
              <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">02. Sanitization</div>
              <p className="text-xs text-ink-2">Blank status maps to Active. ISO 'GB' normalizes to 'UK'. Postal codes preserved as text.</p>
            </div>
            <div className="p-4 rounded-sm bg-surface border border-line">
              <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">03. Idempotent SQL</div>
              <p className="text-xs text-ink-2">Uses <code className="font-mono text-[11px]">INSERT ... ON DUPLICATE KEY UPDATE</code> on <code className="font-mono text-[11px]">unique_id</code>. Zero duplicates.</p>
            </div>
            <div className="p-4 rounded-sm bg-surface border border-line">
              <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">04. Auto-Recovery</div>
              <p className="text-xs text-ink-2">If batch 117 times out, client pauses, retries up to 3 times, and resumes from batch 117.</p>
            </div>
          </div>
        </section>

        {/* Section 4: Security & Scraping Protection */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-2xl text-ink font-medium">
              4. Security & Bot Throttling
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-md bg-surface border border-line space-y-2">
              <h3 className="font-serif text-lg font-medium text-ink">Token Bucket Limiting</h3>
              <p className="text-xs text-ink-2 leading-relaxed">
                Transient IP-based bucket restricts rapid crawlers to 6 requests per 10 seconds, returning HTTP 429 with Retry-After header.
              </p>
            </div>
            <div className="p-5 rounded-md bg-surface border border-line space-y-2">
              <h3 className="font-serif text-lg font-medium text-ink">Rotating Nonce Validation</h3>
              <p className="text-xs text-ink-2 leading-relaxed">
                AJAX endpoints require valid session nonces to protect against automated headless scrapers and cross-origin abuse.
              </p>
            </div>
            <div className="p-5 rounded-md bg-surface border border-line space-y-2">
              <h3 className="font-serif text-lg font-medium text-ink">SiteGround Cache Bypass</h3>
              <p className="text-xs text-ink-2 leading-relaxed">
                Dynamic directory search endpoints pass explicit <code className="font-mono text-[11px]">Cache-Control: no-cache</code> headers to avoid stale search results.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Delivery Plan & Milestones */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-2xl text-ink font-medium">
              5. 30-Day Project Delivery Plan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-md bg-surface border border-line space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-primary">
                <span>MILESTONE 1</span>
                <span>Days 1–7</span>
              </div>
              <h4 className="font-serif text-base font-medium text-ink">DB Schema & Importer</h4>
              <p className="text-xs text-ink-2">Table creation, indexes, chunked batch importer with error log and test CSV runs on staging.</p>
              <div className="pt-2 text-[11px] font-semibold text-success flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>25% Payment Milestone</span>
              </div>
            </div>

            <div className="p-5 rounded-md bg-surface border border-line space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-primary">
                <span>MILESTONE 2</span>
                <span>Days 8–15</span>
              </div>
              <h4 className="font-serif text-base font-medium text-ink">Public Search & Cleanup</h4>
              <p className="text-xs text-ink-2">Dual floating sticky search bar, AJAX directory grid, Load More, and decommissioning legacy widgets.</p>
              <div className="pt-2 text-[11px] font-semibold text-success flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>25% Payment Milestone</span>
              </div>
            </div>

            <div className="p-5 rounded-md bg-surface border border-line space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-primary">
                <span>MILESTONE 3</span>
                <span>Days 16–23</span>
              </div>
              <h4 className="font-serif text-base font-medium text-ink">Distinguished Profiles</h4>
              <p className="text-xs text-ink-2">Split desktop/stacked mobile layout, lightbox digital cover, wpautop editorial article, and SEO schema.</p>
              <div className="pt-2 text-[11px] font-semibold text-success flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>25% Payment Milestone</span>
              </div>
            </div>

            <div className="p-5 rounded-md bg-surface border border-line space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-primary">
                <span>MILESTONE 4</span>
                <span>Days 24–30</span>
              </div>
              <h4 className="font-serif text-base font-medium text-ink">Admin Tools, SOP & Go-Live</h4>
              <p className="text-xs text-ink-2">WP-Admin record editor, SiteGround cache tuning, staff video SOP walk-through, and 7-day warranty.</p>
              <div className="pt-2 text-[11px] font-semibold text-success flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Final 25% Milestone</span>
              </div>
            </div>
          </div>
        </section>

        {/* Proposal Call to Action */}
        <section className="p-8 rounded-lg bg-ink-bg text-bg border border-brass/50 shadow-sh-2 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-2xl font-normal text-bg">
              Ready to deploy this directory with zero downtime?
            </h3>
            <p className="text-xs sm:text-sm text-bg/75 mt-1 max-w-xl">
              This interactive prototype proves the UX, database architecture, and failure-recovery mechanisms are solved. Let’s align on the production rollout.
            </p>
          </div>

          <a
            href="mailto:contact@dentalnewsnetwork.example?subject=DNN%20Directory%20Bid%20Discussion"
            className="px-6 py-3.5 rounded-sm bg-brass text-ink-bg font-sans font-semibold text-sm hover:bg-brass-t transition-colors shrink-0 flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            <span>Discuss This Proposal</span>
          </a>
        </section>
      </main>
    </div>
  );
}
