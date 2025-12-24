export default function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Slow Tunisia",
    description: "Thoughtful private journeys across Tunisia — designed for travellers who prefer ease and deep immersion.",
    url: "https://slowtunisia.com",
    email: "hello@slowtunisia.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tunis",
      addressCountry: "TN",
    },
    areaServed: {
      "@type": "Country",
      name: "Tunisia",
    },
    image: "https://slowtunisia.com/og-image.jpg",
    priceRange: "€€€",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Tunisia Private Journeys",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "TouristTrip",
            name: "Carthage & Sidi Bou Said",
            description: "Ancient ruins and blue-white villages",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "TouristTrip",
            name: "Sahara & Ksour",
            description: "Desert oases and fortified granaries",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "TouristTrip",
            name: "Djerba & The South",
            description: "Island life and Star Wars landscapes",
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
