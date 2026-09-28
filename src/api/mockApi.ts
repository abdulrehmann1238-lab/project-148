import { DentistRecord, SearchParams, SearchResult } from '../types/dentist';
import { useDentistStore } from '../store/dentistStore';
import { useDemoStore } from '../store/demoStore';

// In-memory token bucket for public searches: max 6 searches per 10s
const requestTimestamps: number[] = [];

export async function searchDentists(params: SearchParams): Promise<SearchResult> {
  const { q, mode, offset = 0, limit = 12 } = params;
  const demo = useDemoStore.getState();

  // 1. Check Scraper throttle / rate limit
  const now = Date.now();
  if (demo.scraperThrottledUntil && demo.scraperThrottledUntil > now) {
    const remainingSec = Math.ceil((demo.scraperThrottledUntil - now) / 1000);
    const err: any = new Error(`Rate limit exceeded`);
    err.status = 429;
    err.retryAfter = remainingSec;
    throw err;
  }

  // Token bucket check
  while (requestTimestamps.length > 0 && requestTimestamps[0] < now - 10000) {
    requestTimestamps.shift();
  }
  if (requestTimestamps.length >= 6) {
    demo.triggerScraperBurst();
    const err: any = new Error(`Rate limit exceeded`);
    err.status = 429;
    err.retryAfter = 8;
    throw err;
  }
  requestTimestamps.push(now);

  // 2. Check Expired Nonce simulation
  if (demo.expiredNonce) {
    const err: any = new Error('Nonce verification failed (session expired)');
    err.status = 403;
    err.code = 'NONCE_EXPIRED';
    throw err;
  }

  // 3. Check Server Error simulation
  if (demo.serverErrorNext) {
    demo.setServerErrorNext(false);
    const err: any = new Error('Internal search server error (MySQL connection interrupted)');
    err.status = 500;
    throw err;
  }

  // 4. Latency
  const latency = demo.slowNetwork ? 1600 : Math.floor(180 + Math.random() * 200);
  await new Promise((r) => setTimeout(r, latency));

  const allRecords = useDentistStore.getState().records;

  // 5. Filter active only (blank status or 'Active')
  let filtered = allRecords.filter((r) => r.status !== 'Inactive');

  // Mode filter
  if (mode === 'distinguished') {
    filtered = filtered.filter((r) => r.distinguished === 'Yes');
  }

  // Text search
  const cleanQ = q.trim().toLowerCase();
  let matchedIndex = 'FULLTEXT(name, practice_name, city, specialty)';

  if (cleanQ.length > 0) {
    const tokens = cleanQ.split(/\s+/).filter(Boolean);

    // Index detection heuristic for telemetry
    const isPostal = /^[0-9]{4,5}$|^[a-z][0-9][a-z]\s?[0-9][a-z][0-9]$|^[a-z]{1,2}[0-9][a-z0-9]?\s?[0-9][a-z]{2}$/i.test(cleanQ);
    const isRegionOrCountry = /^(tx|ny|on|bc|nsw|vic|qld|wa|ma|il|co|or|us|ca|uk|au|united\s+states|canada|united\s+kingdom|australia)$/i.test(cleanQ);

    if (isPostal) {
      matchedIndex = 'B-Tree(postal_code)';
    } else if (isRegionOrCountry) {
      matchedIndex = 'B-Tree(state_province_region, country)';
    }

    filtered = filtered.filter((record) => {
      return tokens.every((token) => {
        // Normalize country searches
        let tokenMatch = token;
        if (token === 'uk' || token === 'britain') tokenMatch = 'uk';
        if (token === 'us' || token === 'usa') tokenMatch = 'us';
        if (token === 'ca') tokenMatch = 'ca';
        if (token === 'au') tokenMatch = 'au';

        const nameMatch = record.name.toLowerCase().includes(token);
        const practiceMatch = record.practice_name?.toLowerCase().includes(token);
        const cityMatch = record.city?.toLowerCase().includes(token);
        const regionMatch = record.state_province_region?.toLowerCase().includes(token);
        const postalMatch = record.postal_code?.toLowerCase().startsWith(token);
        const countryMatch = record.country?.toLowerCase() === tokenMatch;
        const specialtyMatch = record.specialty?.toLowerCase().includes(token);

        return (
          nameMatch ||
          practiceMatch ||
          cityMatch ||
          regionMatch ||
          postalMatch ||
          countryMatch ||
          specialtyMatch
        );
      });
    });
  }

  // 6. Sort: Distinguished first (Yes desc), then alphabetical by name asc
  filtered.sort((a, b) => {
    const aDist = a.distinguished === 'Yes' ? 1 : 0;
    const bDist = b.distinguished === 'Yes' ? 1 : 0;
    if (aDist !== bDist) return bDist - aDist;
    return a.name.localeCompare(b.name);
  });

  // Slice for pagination (offset to offset + limit)
  // We fetch limit + 1 to know if hasMore without a total count
  const slice = filtered.slice(offset, offset + limit);
  const hasMore = filtered.length > offset + limit;

  const simulatedQueryTime = matchedIndex.includes('B-Tree')
    ? (0.03 + Math.random() * 0.02).toFixed(2)
    : (0.12 + Math.random() * 0.08).toFixed(2);

  return {
    items: slice,
    hasMore,
    queryTimeMs: parseFloat(simulatedQueryTime),
    matchedIndex,
  };
}

export async function getDentistBySlug(slug: string): Promise<DentistRecord | null> {
  const allRecords = useDentistStore.getState().records;
  // A5: Only records with distinguished = Yes have profile pages; inactive or non-distinguished return null (404)
  const found = allRecords.find((r) => r.slug === slug);
  if (!found) return null;
  if (found.status === 'Inactive') return null;
  if (found.distinguished !== 'Yes') return null;
  return found;
}
