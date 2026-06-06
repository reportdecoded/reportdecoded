// lib/schema.js
//
// JSON-LD schema.org helpers. Output of each function is a plain JS
// object — wrap with <script type="application/ld+json">{JSON.stringify(...)}</script>
// or use the <JsonLd> React helper below for inline injection.
//
// Why schema markup matters: Google uses these structured-data hints
// to (a) understand WHAT each page is about beyond text on the page
// and (b) render rich results (FAQ accordions, sitelinks search box,
// org logo in knowledge panel, breadcrumbs, app star ratings). Without
// schema, every page is a flat HTML doc to the crawler.
//
// All URLs are absolute (Google requires it for these schemas).

const BASE = 'https://www.reportdecoded.com.au';
const LOGO = `${BASE}/logo-dark.png`;
const OG_IMAGE = `${BASE}/opengraph-image`;

/**
 * Organization — appears in Google's Knowledge Panel + alongside
 * sitelinks. Should live on every page (typically in <head>).
 */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE}#organization`,
    name: 'Report Decoded',
    legalName: 'Report Decoded',
    url: BASE,
    logo: {
      '@type': 'ImageObject',
      url: LOGO,
      width: 512,
      height: 128,
    },
    image: OG_IMAGE,
    description:
      'AI-powered Australian building & pest inspection report interpreter. Plain-English verdict, repair cost estimates, local tradies, and negotiation language — in under 2 minutes.',
    foundingDate: '2026',
    foundingLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'AU',
      },
    },
    areaServed: {
      '@type': 'Country',
      name: 'Australia',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: `${BASE}/contact`,
      availableLanguage: ['en-AU'],
    },
    sameAs: [
      'https://www.facebook.com/profile.php?id=61590529500524',
      'https://www.instagram.com/reportdecoded',
      'https://twitter.com/reportdecoded',
      'https://www.tiktok.com/@reportdecoded',
    ],
  };
}

/**
 * WebSite — enables Google's sitelinks search box (a search box
 * inside Google results that searches your site directly). The
 * potentialAction is required for that feature.
 */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE}#website`,
    url: BASE,
    name: 'Report Decoded',
    description:
      'AI Building Inspection Report Interpreter for Australian Property Buyers.',
    publisher: { '@id': `${BASE}#organization` },
    inLanguage: 'en-AU',
  };
}

/**
 * SoftwareApplication — Google recognises SaaS tools and shows rich
 * results (pricing, ratings when available). We mark up as a
 * WebApplication subtype since we run in the browser.
 */
export function softwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${BASE}#webapp`,
    name: 'Report Decoded',
    url: BASE,
    description:
      'Upload an Australian AS4349.1 building & pest inspection PDF. Get a plain-English verdict, AU repair costs, local tradies for each defect, and ready-to-send negotiation language.',
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Real Estate Tool',
    operatingSystem: 'All',
    offers: [
      {
        '@type': 'Offer',
        name: 'Single Report (Consumer)',
        price: '59',
        priceCurrency: 'AUD',
        availability: 'https://schema.org/InStock',
        description: 'One AS4349.1 inspection PDF analysis. No subscription.',
      },
      {
        '@type': 'Offer',
        name: 'Agent Starter',
        price: '79',
        priceCurrency: 'AUD',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: 79,
          priceCurrency: 'AUD',
          unitText: 'MONTH',
        },
        description: '12 reports/month for buyer\'s + selling agents. White-label PDFs.',
      },
      {
        '@type': 'Offer',
        name: 'Agent Pro',
        price: '149',
        priceCurrency: 'AUD',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: 149,
          priceCurrency: 'AUD',
          unitText: 'MONTH',
        },
        description: 'Unlimited reports, dashboard, priority support, first report free.',
      },
    ],
    featureList: [
      'AS4349.1 building & pest inspection analysis',
      'Plain-English verdict (Proceed / Negotiate / Walk Away)',
      'Australian repair cost estimates per defect',
      'Local tradie matching across 22 trade categories',
      '5-year capital expenditure forecast',
      'State-specific rental compliance gaps (Vic / NSW / QLD)',
      'Ready-to-send negotiation language for the agent',
      'Citation to inspector PDF pages on every defect',
      'White-label PDF export for buyer\'s agents',
    ],
    provider: { '@id': `${BASE}#organization` },
  };
}

/**
 * FAQPage — eligible for the expandable-FAQ rich result in Google
 * search results. Pass `[{ q: '...', a: '...' }, ...]`.
 *
 * Best practice: FAQ content must be visible to the user on the page
 * (not just in JSON-LD). Match the items you mark up to what's
 * actually rendered in your <FAQ> accordion.
 */
export function faqPageSchema(items) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: typeof a === 'string' ? a : String(a),
      },
    })),
  };
}

/**
 * BreadcrumbList — feeds Google's breadcrumb rich result above the
 * page title in SERPs. Pass `[{ name, url }]` in path order.
 */
export function breadcrumbSchema(crumbs) {
  if (!Array.isArray(crumbs) || crumbs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url.startsWith('http') ? c.url : `${BASE}${c.url}`,
    })),
  };
}

/**
 * Article — for /resources/ long-form content. Tells Google this is
 * an editorial piece, not a marketing landing page. Required for
 * Google News + Discover surface eligibility, and for the article
 * rich result with author / published-date / headline metadata.
 */
export function articleSchema({
  title,
  description,
  slug,
  published,
  updated,
  author = 'Morgan Smith',
  imageUrl,
} = {}) {
  const url = `${BASE}/resources/${slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: title,
    description,
    image: imageUrl || OG_IMAGE,
    datePublished: published,
    dateModified: updated || published,
    author: {
      '@type': 'Person',
      name: author,
      url: BASE,
    },
    publisher: { '@id': `${BASE}#organization` },
    inLanguage: 'en-AU',
  };
}

/**
 * Service — for the analysis service itself. Used on suburb pages to
 * tell Google "this page is offering a service to buyers in [Suburb]".
 */
export function serviceSchema({ suburb, state = 'VIC' } = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Building inspection report analysis',
    provider: { '@id': `${BASE}#organization` },
    areaServed: suburb
      ? {
          '@type': 'Place',
          name: `${suburb}, ${state}`,
          address: { '@type': 'PostalAddress', addressLocality: suburb, addressRegion: state, addressCountry: 'AU' },
        }
      : { '@type': 'Country', name: 'Australia' },
    offers: {
      '@type': 'Offer',
      price: '59',
      priceCurrency: 'AUD',
    },
  };
}

/**
 * React component that emits a JSON-LD <script> tag. Use as:
 *   <JsonLd data={organizationSchema()} />
 * Multiple schemas: render multiple <JsonLd /> in <head> or page body.
 */
export function JsonLd({ data }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
