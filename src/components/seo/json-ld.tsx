import Script from "next/script";

export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ConvertHQ",
    "description": "High-performance file converter and compressor. Support for Images, Video, and Audio.",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "4.00",
      "priceCurrency": "USD",
      "interval": "Mo"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "1240"
    }
  };

  return (
    <Script
      id="software-jsonld"
      type="application/ld+json"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
