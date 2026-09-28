# Dental News Network (DNN) — Directory & Distinguished Profiles
## High-Fidelity Interactive Frontend Bid Prototype

Interactive prototype for Dental News Network proving the 30-day WordPress project's architectural, UX, and editorial requirements before writing production PHP.

---

### Key Capabilities Built & Demonstrated

1. **Custom Table Architecture & Search Engine**
   - Simulated flat InnoDB table (`wp_dnn_dentists`) with dedicated FULLTEXT and B-Tree indexes.
   - Interactive Index Router on `/how-it-works` demonstrating which index answers which search.
   - Live query telemetry chips on search results (e.g., `0.18s · FULLTEXT(...)` or `0.04s · B-Tree(postal_code)`).
   - Rate limiting (token-bucket 429 countdown) and rotating nonce expiration simulation.
   - Zero total result counter, exact empty state copy, and 12-per-page "Load More".

2. **Sitewide Floating Dual Search Bar**
   - Left field: Find a Dentist (`Search by name, city, postal code, country, or specialty...`) with 2-character validation.
   - Right field: Find Distinguished Dentist (blank search returns all distinguished).
   - Desktop dual layout, tablet segmented toggle, and mobile pill search with bottom sheet.

3. **Distinguished Editorial Profiles (`/dentist/[slug]/`)**
   - Split desktop header (5/12 cover thumbnail, 7/12 identity and contacts) and stacked mobile layout.
   - FLIP interactive Lightbox zoom with ESC, touch swipe-down, and focus trap.
   - Reading-progress brass hairline under the sticky bar.
   - Full editorial article formatted with WordPress `wpautop()` paragraph rules and lede styling.
   - "← Back to Search Results" with complete state retention (query, mode, loaded batches, and scroll position).
   - Collision-safe slugs (`dr-emily-chen-tx` vs `dr-emily-chen-ny`).

4. **WordPress-Native Admin Suite (`/wp-admin`)**
   - **Overview (`/wp-admin`):** Cached stat cards (Active 298,412, Inactive 1,588, Distinguished 412), SVG sparkline, and recent activity log.
   - **All Records (`/wp-admin/records`):** Full list table with inline quick Deactivate/Activate toggles, undo notice, and filters.
   - **Edit Record (`/wp-admin/records/:uid`):** 20 fields, live mini-card preview (RE-2), character counter, and instant synchronization with public search.
   - **Batch Importer (`/wp-admin/import`):** 3-step pipeline, 20-column header mapping table with aliases resolved, progress bar, injected timeout auto-recovery at batch 117, live log, error journal, and CSV export.

---

### Running Locally

```bash
# Install dependencies
npm install

# Start Vite local development server
npm run dev

# Build production bundle
npm run build
```

Local URL: [http://127.0.0.1:3000](http://127.0.0.1:3000)
WP-Admin: [http://127.0.0.1:3000/wp-admin](http://127.0.0.1:3000/wp-admin)
Technical Notes: [http://127.0.0.1:3000/how-it-works](http://127.0.0.1:3000/how-it-works)
