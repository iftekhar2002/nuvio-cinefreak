'use strict';
const fs = require('node:fs');
const path = require('node:path');
const repo = process.argv[2];
const branch = process.argv[3] || 'main';
if (!repo || !/^[\w.-]+\/[\w.-]+$/.test(repo) || !/^[\w./-]+$/.test(branch)) {
  console.error('Usage: node configure.cjs YOUR_USERNAME/YOUR_REPOSITORY [branch]');
  process.exit(1);
}
const base = `https://raw.githubusercontent.com/${repo}/${branch}`;
const provider = { id: 'cinefreak', name: 'Cinefreak', description: 'Cinefreak movies and individual TV episodes. No API key required. Optional TMDB key supported.', version: '0.1.0', author: 'Cinefreak Plugin Community', supportedTypes: ['movie', 'tv'], filename: 'cinefreak.js', url: base + '/cinefreak.js', enabled: true, hasSettings: true, formats: ['mkv', 'mp4', 'm3u8'] };
fs.writeFileSync(path.join(__dirname, 'manifest.json'), JSON.stringify({ name: 'Cinefreak for Nuvio', version: '0.1.0', description: 'Unofficial Cinefreak provider', author: 'Cinefreak Plugin Community', scrapers: [provider], providers: [provider] }, null, 2) + '\n');
console.log('After uploading the repository, add this URL in Nuvio Settings > Plugins:');
console.log(base + '/manifest.json');


