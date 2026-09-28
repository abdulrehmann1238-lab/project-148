/**
 * Generates an SEO and collision-safe slug for a dentist.
 * Matches PRD slug rules: e.g. dr-emily-chen-tx vs dr-emily-chen-ny
 */
export function generateSlug(name: string, region?: string, uniqueId?: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  const cleanRegion = region
    ? region.toLowerCase().replace(/[^\w]/g, '').slice(0, 4)
    : '';

  if (cleanRegion) {
    return `${base}-${cleanRegion}`;
  }

  if (uniqueId) {
    const cleanId = uniqueId.toLowerCase().replace(/[^\w]/g, '-');
    return `${base}-${cleanId}`;
  }

  return base;
}
