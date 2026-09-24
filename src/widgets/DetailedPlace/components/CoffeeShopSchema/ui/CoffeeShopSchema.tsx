interface CoffeeShopSchemaProps {
  name: string;
  averageRating: number;
  reviewCount: number;
  address: string;
  phone?: string | null;
  image?: string;
}

export const CoffeeShopSchema = ({
  name,
  averageRating,
  reviewCount,
  address,
  image,
  phone,
}: CoffeeShopSchemaProps) => {
  const schemaData: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    name,
    telephone: phone || '',
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.split(', ')[0],
      postalCode: address.split(', ')[1],
      addressLocality: 'Berlin',
      addressCountry: 'DE',
    },
  };

  if (reviewCount) {
    schemaData.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: averageRating,
      reviewCount,
    };
  }

  if (image) {
    schemaData.image = image;
  }
  return <script type="application/ld+json">{JSON.stringify(schemaData)}</script>;
};
