/**
 * WordPress-style wpautop simulation.
 * Replaces double line breaks with <p> blocks and single line breaks with <br>.
 */
export function wpautop(pee: string, br: boolean = true): string[] {
  if (!pee || pee.trim() === '') return [];

  // Normalize newlines
  let text = pee.replace(/\r\n|\r/g, '\n') + '\n';

  // Split on double or more newlines
  const paragraphs = text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  return paragraphs;
}
