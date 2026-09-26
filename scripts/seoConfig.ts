import { identity } from '../src/identity';
const escape = (s: string) => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
export function seoPlugin() {
  return { name: 'portfolio-seo', transformIndexHtml(html: string) {
    const person = identity.url + '#person';
    const schema = { '@context': 'https://schema.org', '@graph': [
      { '@type': 'Person', '@id': person, name: identity.name, url: identity.url, jobTitle: [identity.role, "Founder of Trenoxa Labs", "CTO of MatchMesh"], worksFor: identity.organizations.map(org => ({ "@id": identity.url + "#" + org.id })), description: identity.introduction, image: identity.url + 'profile.png', sameAs: [identity.github, identity.linkedin] },
      ...identity.organizations.map(org => ({ '@type': 'Organization', '@id': identity.url + '#' + org.id, name: org.name, url: org.url, logo: new URL(org.logo, identity.url).href, ...(org.id === 'trenoxa-labs' ? { founder: { '@id': person } } : {}) })),
      { '@type': 'WebSite', '@id': identity.url + '#website', name: identity.name, url: identity.url, publisher: { '@id': person } },
      { '@type': 'ProfilePage', '@id': identity.url + '#profile', url: identity.url, name: identity.title, mainEntity: { '@id': person }, isPartOf: { '@id': identity.url + '#website' } }
    ] };
    const tags = [
      '<title>' + escape(identity.title) + '</title>',
      '<meta name="description" content="' + escape(identity.description) + '" />',
      '<meta name="robots" content="index,follow,max-image-preview:large" />',
      '<link rel="canonical" href="' + identity.url + '" />',
      ...Object.entries({ 'og:type': 'profile', 'og:site_name': identity.name, 'og:title': identity.title, 'og:description': identity.description, 'og:url': identity.url, 'og:image': identity.url + 'profile.png', 'og:image:alt': 'Portrait of Gulfam Ali' }).map(([key, value]) => '<meta property="' + key + '" content="' + escape(value) + '" />'),
      ...Object.entries({ 'twitter:card': 'summary', 'twitter:title': identity.title, 'twitter:description': identity.description, 'twitter:image': identity.url + 'profile.png', 'twitter:image:alt': 'Portrait of Gulfam Ali' }).map(([key, value]) => '<meta name="' + key + '" content="' + escape(value) + '" />'),
      '<script type="application/ld+json">' + JSON.stringify(schema).replaceAll('<', '\u003c') + '</script>'
    ];
    const leadership = '<section aria-label="Leadership roles">' + identity.organizations.map(org => '<h2>' + escape(org.role) + ' at ' + escape(org.name) + '</h2><a href="' + org.url + '"><img src="' + org.logo + '" alt="' + escape(org.name) + ' logo" width="220" style="max-width:100%;height:auto;background:#060606;padding:8px" /></a>').join('') + '</section>';
    const content = '<main style="max-width:60rem;padding:3rem;font-family:sans-serif"><h1>Gulfam Ali &mdash; Full Stack Developer</h1><p>' + escape(identity.introduction) + '</p>' + leadership + '<h2>Web, mobile, and AI development</h2><p>React, Node.js, Flutter, Firebase, REST APIs, AI integrations, and automation systems.</p><p><a href="' + identity.github + '">Gulfam Ali on GitHub</a> | <a href="' + identity.linkedin + '">Gulfam Ali on LinkedIn</a></p><h2>Contact Gulfam Ali</h2><p><a href="mailto:gulfamoffi62@gmail.com">gulfamoffi62@gmail.com</a></p></main>';
    return html.replace('<!--seo-head-->', tags.join('\n')).replace('<!--seo-content-->', content);
  }};
}
