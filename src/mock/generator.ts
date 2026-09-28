import { DentistRecord, CountryCode } from '../types/dentist';
import { ANCHOR_RECORDS } from './anchorRecords';
import { createRng } from './seed';
import { generateSlug } from '../lib/slug';

const FIRST_NAMES = [
  'Alexander', 'Beatrice', 'Cameron', 'Daphne', 'Edward', 'Farah', 'Gabriel', 'Helena',
  'Isaac', 'Jocelyn', 'Kieran', 'Leila', 'Maxwell', 'Nadia', 'Orson', 'Penelope',
  'Quinton', 'Rowan', 'Siddharth', 'Talia', 'Victor', 'Wendy', 'Xavier', 'Yasmin',
  'Zachary', 'Arthur', 'Clara', 'Declan', 'Eleanor', 'Felix', 'Gemma', 'Harrison'
];

const LAST_NAMES = [
  'Sterling', 'Vance', 'Holloway', 'Sinclair', 'Fairchild', 'Blackwood', 'Mercer', 'Gallagher',
  'Thornton', 'Montgomery', 'Calloway', 'Ellington', 'Vanderbilt', 'Carrington', 'Winslow', 'Prescott',
  'Chambers', 'Ashford', 'Beaumont', 'Kensington', 'Pembroke', 'Stratford', 'Kingsley', 'Wellington',
  'Adler', 'Bauer', 'Lindqvist', 'Nakamura', 'O’Connor', 'Patel', 'Dubois', 'MacDonald'
];

const DEGREES = ['DDS', 'DMD', 'BDS', 'BDSc'];

const SPECIALTIES = [
  'General', 'General', 'General', // weighted
  'Orthodontist', 'Pediatric', 'Periodontist', 'Endodontist', 'Prosthodontist', 'Oral Surgeon'
];

interface LocationData {
  city: string;
  region: string;
  postal: string;
  country: CountryCode;
  phonePrefix: string;
}

const LOCATIONS: LocationData[] = [
  // US
  { city: 'Austin', region: 'TX', postal: '78704', country: 'US', phonePrefix: '+1 (512) 555-01' },
  { city: 'Austin', region: 'TX', postal: '78701', country: 'US', phonePrefix: '+1 (512) 555-01' },
  { city: 'Dallas', region: 'TX', postal: '75201', country: 'US', phonePrefix: '+1 (214) 555-01' },
  { city: 'Boston', region: 'MA', postal: '02108', country: 'US', phonePrefix: '+1 (617) 555-01' }, // Leading zero
  { city: 'Boston', region: 'MA', postal: '02116', country: 'US', phonePrefix: '+1 (617) 555-01' },
  { city: 'Hoboken', region: 'NJ', postal: '07030', country: 'US', phonePrefix: '+1 (201) 555-01' }, // Leading zero
  { city: 'Stamford', region: 'CT', postal: '06901', country: 'US', phonePrefix: '+1 (203) 555-01' }, // Leading zero
  { city: 'Chicago', region: 'IL', postal: '60614', country: 'US', phonePrefix: '+1 (312) 555-01' },
  { city: 'Seattle', region: 'WA', postal: '98101', country: 'US', phonePrefix: '+1 (206) 555-01' },
  { city: 'Denver', region: 'CO', postal: '80202', country: 'US', phonePrefix: '+1 (303) 555-01' },
  { city: 'San Francisco', region: 'CA', postal: '94104', country: 'US', phonePrefix: '+1 (415) 555-01' },
  { city: 'Atlanta', region: 'GA', postal: '30309', country: 'US', phonePrefix: '+1 (404) 555-01' },
  // CA
  { city: 'Toronto', region: 'ON', postal: 'M5V 2T6', country: 'CA', phonePrefix: '+1 (416) 555-01' },
  { city: 'Vancouver', region: 'BC', postal: 'V6B 1A1', country: 'CA', phonePrefix: '+1 (604) 555-01' },
  { city: 'Calgary', region: 'AB', postal: 'T2P 1J9', country: 'CA', phonePrefix: '+1 (403) 555-01' },
  { city: 'Ottawa', region: 'ON', postal: 'K1P 5J2', country: 'CA', phonePrefix: '+1 (613) 555-01' },
  // UK
  { city: 'London', region: 'Greater London', postal: 'W1G 9PF', country: 'UK', phonePrefix: '+44 20 7946 01' },
  { city: 'London', region: 'Greater London', postal: 'SW1A 1AA', country: 'UK', phonePrefix: '+44 20 7946 02' },
  { city: 'Manchester', region: 'Greater Manchester', postal: 'M2 3WQ', country: 'UK', phonePrefix: '+44 161 496 01' },
  { city: 'Edinburgh', region: 'Midlothian', postal: 'EH2 2LE', country: 'UK', phonePrefix: '+44 131 496 01' },
  { city: 'Bristol', region: 'City of Bristol', postal: 'BS1 4XE', country: 'UK', phonePrefix: '+44 117 496 01' },
  // AU
  { city: 'Sydney', region: 'NSW', postal: '2000', country: 'AU', phonePrefix: '+61 2 5550 01' },
  { city: 'Melbourne', region: 'VIC', postal: '3000', country: 'AU', phonePrefix: '+61 3 5550 01' },
  { city: 'Brisbane', region: 'QLD', postal: '4000', country: 'AU', phonePrefix: '+61 7 5550 01' },
  { city: 'Perth', region: 'WA', postal: '6000', country: 'AU', phonePrefix: '+61 8 5550 01' }
];

export function generateAllRecords(): DentistRecord[] {
  const rng = createRng(1984);
  const records: DentistRecord[] = [...ANCHOR_RECORDS];

  // We need ~240 total records
  const targetTotal = 240;
  const needToGenerate = targetTotal - ANCHOR_RECORDS.length;

  for (let i = 0; i < needToGenerate; i++) {
    const loc = LOCATIONS[Math.floor(rng() * LOCATIONS.length)];
    const firstName = FIRST_NAMES[Math.floor(rng() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(rng() * LAST_NAMES.length)];
    const degree = loc.country === 'UK' || loc.country === 'AU'
      ? (rng() > 0.5 ? 'BDS' : 'BDSc')
      : (rng() > 0.5 ? 'DDS' : 'DMD');
    const name = `Dr. ${firstName} ${lastName}, ${degree}`;
    const specialty = SPECIALTIES[Math.floor(rng() * SPECIALTIES.length)];
    const practiceNoun = specialty === 'General' ? 'Dental Studio' : `${specialty} Clinic`;
    const practiceName = `${lastName} ${practiceNoun}`;
    const streetNum = 100 + Math.floor(rng() * 899);
    const streetNames = ['Market St', 'King St', 'Highland Ave', 'Main St', 'Park Ave', 'Victoria Rd', 'Commonwealth Ave', 'Queen St'];
    const street = streetNames[Math.floor(rng() * streetNames.length)];
    const address = `${streetNum} ${street}`;

    // Unique ID
    const paddedIndex = String(i + 15).padStart(5, '0');
    const unique_id = `DNN-${loc.country}-${paddedIndex}`;

    // Status: 90% blank (=Active), 8% 'Active', 2% 'Inactive'
    const statusRoll = rng();
    const status = statusRoll < 0.88 ? '' : (statusRoll < 0.97 ? 'Active' : 'Inactive');

    // Phone
    const phoneSuffix = String(Math.floor(rng() * 90) + 10);
    const phone = `${loc.phonePrefix}${phoneSuffix}`;

    // Domain
    const domainSlug = `${lastName.toLowerCase()}dental`.replace(/[^a-z]/g, '');
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domainSlug}.example`;
    const website = `https://www.${domainSlug}.example`;

    // Photo: ~55% present (headshots 1-6), ~30% blank, ~15% broken URLs
    const photoRoll = rng();
    let photo_url = '';
    if (photoRoll < 0.55) {
      photo_url = `headshot-${(i % 6) + 1}`;
    } else if (photoRoll > 0.85) {
      photo_url = `https://broken-asset-server-${i}.example/image.jpg`; // Broken to trigger onError
    }

    // Socials (conditional)
    const hasSocials = rng() > 0.4;
    const facebook_url = hasSocials && rng() > 0.4 ? `https://facebook.com/${domainSlug}` : '';
    const instagram_url = hasSocials && rng() > 0.5 ? `https://instagram.com/${domainSlug}` : '';
    const linkedin_url = hasSocials && rng() > 0.6 ? `https://linkedin.com/in/${firstName.toLowerCase()}${lastName.toLowerCase()}` : '';
    const x_url = hasSocials && rng() > 0.7 ? `https://x.com/${domainSlug}` : '';

    records.push({
      unique_id,
      status,
      name,
      practice_name: practiceName,
      address_line_1: address,
      city: loc.city,
      state_province_region: loc.region,
      postal_code: loc.postal,
      country: loc.country,
      phone,
      email,
      website,
      photo_url,
      distinguished: '', // regular directory entry
      about: '',
      facebook_url,
      instagram_url,
      linkedin_url,
      x_url,
      specialty,
      slug: undefined,
      updated_at: '2026-02-15T08:00:00Z',
    });
  }

  return records;
}
