/** The street and number of a Google address ("Wiener Str. 62, 10999"), without the postcode. */
export const shortAddress = (address: string) => address.replace(/,\s*\d{5}\s*$/, '');
