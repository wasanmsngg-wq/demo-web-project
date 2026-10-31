import { cp, mkdir } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
for (const path of ['index.html', '404.html', '.nojekyll', 'assets', 'demos']) await cp(path, `dist/${path}`, { recursive: true });
console.log('Static site built in dist/. Only website files are included.');
