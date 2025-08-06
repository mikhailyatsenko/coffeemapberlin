interface CoffeeShopSchemaProps {
  name: string;
  averageRating: number;
  reviewCount: number;
  address: string;
  image?: string;
}

export const CoffeeShopSchema = ({ name, averageRating, reviewCount, address, image }: CoffeeShopSchemaProps) => {
  const schemaData: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address,
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
