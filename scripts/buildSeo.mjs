import { readFile, writeFile, mkdir } from 'node:fs/promises';
const home = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const admin = home
  .replace(/<title>[\s\S]*?<\/title>/, '<title>Admin | Gulfam Ali</title>')
  .replace(/<meta name="robots"[^>]*>/, '<meta name="robots" content="noindex,nofollow" />')
  .replace(/<meta (?:name="(?:description|twitter:[^"]+)"|property="og:[^"]+")[^>]*>/g, '')
  .replace(/<link rel="canonical"[^>]*>/, '')
  .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, '')
  .replace(/<noscript>[\s\S]*?<\/noscript>/, '<noscript><style>.startup { display: none; }</style><p>Admin sign-in requires JavaScript.</p></noscript>');
await mkdir(new URL('../dist/admin/', import.meta.url), { recursive: true });
await writeFile(new URL('../dist/admin/index.html', import.meta.url), admin);
