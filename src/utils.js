export function slugifyString(string) {
  return string.replace(/\s+/g, '-').toLowerCase();
}
