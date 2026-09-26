/** A display name from the URL slug, for when no Place has told us the real one. */
export const normalizeNeighborhoodName = (slug: string) => {
  const decoded = decodeURIComponent(slug);
  return decoded.charAt(0).toUpperCase() + decoded.slice(1).toLowerCase();
};
