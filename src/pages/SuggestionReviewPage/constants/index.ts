/** Where a published Place may stand; the server enforces the same box (`isInsideBerlin`). */
export const BERLIN_BOUNDS = {
  minLat: 52.33,
  maxLat: 52.68,
  minLng: 13.08,
  maxLng: 13.77,
} as const;

/** Berlin's twelve Bezirke, spelled as Places store their Neighborhood; the server accepts only these. */
export const BERLIN_NEIGHBORHOODS = [
  'Mitte',
  'Friedrichshain-Kreuzberg',
  'Pankow',
  'Charlottenburg-Wilmersdorf',
  'Spandau',
  'Steglitz-Zehlendorf',
  'Tempelhof-Schöneberg',
  'Neukölln',
  'Treptow-Köpenick',
  'Marzahn-Hellersdorf',
  'Lichtenberg',
  'Reinickendorf',
] as const;
