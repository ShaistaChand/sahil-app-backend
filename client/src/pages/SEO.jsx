import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = "Sahil App - Split Bills, Not Friendships", 
  description = "The smart way to split expenses with friends, family & colleagues. Perfect for UAE brunches, Indian trips, and group events. No more awkward money conversations.",
  keywords = "split bills, expense tracker, UAE, India, group expenses, payment collection, brunch splitting, trip expenses",
  canonical = "https://sahilapp.com",
  ogImage = "/logo.png"
}) => {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonical} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      
      {/* Additional Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Sahil App" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Sahil App",
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Web",
          "description": description,
          "offers": {
            "@type": "Offer",
            "price": "35",
            "priceCurrency": "AED"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEO;