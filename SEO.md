# SEO implementation and launch checklist

## Implemented
- Business-focused homepage H1, with Gulfam Ali displayed above it and founder/CTO roles in the opening paragraph.
- Shared public identity in src/identity.ts, used by the React hero and build-time HTML metadata.
- Canonical www HTTPS URL, descriptive title and description, Open Graph and Twitter previews.
- Person, WebSite and ProfilePage JSON-LD; GitHub and the user-confirmed LinkedIn URL are included in sameAs. Organization entities link Trenoxa Labs to its founder and both companies to the person.
- Initial HTML includes metadata and JSON-LD, plus a styled startup indicator that React replaces. A noscript fallback provides the introduction, company links, skills and contact information when JavaScript is disabled. The full portfolio requires JavaScript rendering; this is not full-page prerendering. This avoids flashing the plain summary before the app mounts.
- robots.txt and a sitemap containing only the canonical homepage (section anchors are not separate pages).
- Existing missing favicon fixed; portrait reused for social cards.
- Separate built admin HTML with noindex, Vercel admin indexing headers, and a real static 404 page. No wildcard SPA rewrite, so unknown production URLs retain 404 status.
- Vercel non-www to www permanent redirect. Navigation between public and admin pages loads the appropriate document.
- Placeholder social links excluded from display.

## Before and after deployment
1. Founder of Trenoxa Labs, CTO of MatchMesh and the LinkedIn profile were confirmed by the owner. Company cards and metadata use src/identity.ts. Keep external profiles consistent with these details. The public LinkedIn URL overrides stale Firestore values; no remote database was changed.
2. Build with npm run build and deploy dist through the existing Vercel project. Changes are local until deployed. Ensure Vercel's domain settings do not redirect www back to the apex domain.
3. Check HTTPS homepage returns 200, apex redirects once to www, robots.txt and sitemap.xml return their actual file contents, /admin has noindex in raw HTML, and a made-up URL returns 404.
4. Add a Domain property for gulfamali.me in Google Search Console and verify its DNS TXT record. Submit https://www.gulfamali.me/sitemap.xml.
5. Inspect https://www.gulfamali.me/ using URL Inspection, run the live test, check rendered content and canonical, and request indexing once. This requires the owner account; it does not guarantee indexing or a ranking position.
6. Validate the deployed structured data with Google's Rich Results Test and Schema.org validator. Profile markup does not guarantee an enhanced search result.
7. Add the canonical portfolio URL to your genuine GitHub and LinkedIn profiles. If you control Trenoxa Labs, link from a real founder biography. Publish useful project case studies with natural links, not bulk exact-match backlink campaigns.
8. Monitor Search Console Page Indexing and Performance for Gulfam Ali and Gulfam Ali developer. Record impressions/clicks over several weeks. Check mobile/desktop PageSpeed Insights and field Core Web Vitals after deployment.

## Checklist items requiring separate evidence
No Search Console access, indexed-page count, ranking baseline, backlink audit, field Core Web Vitals, real-device audit or browser visual test was available in this pass. Review existing testimonials, ratings and project claims for accuracy before publication. Firestore edits do not change build-time identity metadata: update src/identity.ts and rebuild when identity changes. Ecommerce, multilingual, Google News and local-business markup are not applicable without the corresponding content/business eligibility. No analytics or cookie banner was added without a tracking requirement.

## References
- https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
- https://developers.google.com/search/docs/appearance/structured-data/profile-page
- https://developers.google.com/search/docs/essentials/technical

## Company logo sources
MatchMesh wordmark: https://www.matchmesh.com/images/logo-full-on-dark.png
Trenoxa Labs: existing local trenoxa-logo-footer-web-Ku9Skw3c.png, a light-on-dark brand variant. Both are copied into public/brands; the inline chat attachments were not exposed as local files.
