export type CountryCode = 'US' | 'CA' | 'UK' | 'AU';

export interface DentistRecord {
  unique_id: string;
  status: string; // 'Active' | 'Inactive' | '' (blank = Active)
  name: string;
  practice_name: string;
  address_line_1: string;
  city: string;
  state_province_region: string;
  postal_code: string;
  country: CountryCode | string;
  phone: string;
  email: string;
  website: string;
  photo_url: string;
  distinguished: string; // 'Yes' | ''
  about: string;
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;
  x_url: string;
  specialty: string;
  slug?: string;
  updated_at?: string;
}

export type SearchMode = 'all' | 'distinguished';

export interface SearchParams {
  q: string;
  mode: SearchMode;
  offset?: number;
  limit?: number;
}

export interface SearchResult {
  items: DentistRecord[];
  hasMore: boolean;
  queryTimeMs: number;
  matchedIndex: string; // e.g. 'FULLTEXT(name,practice_name,city,specialty)' or 'B-Tree(postal_code)'
}

export interface StoredSearchState {
  q: string;
  mode: SearchMode;
  loadedCount: number;
  scrollY: number;
}
