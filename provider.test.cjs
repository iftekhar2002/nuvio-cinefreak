const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const source = fs.readFileSync(require('node:path').join(__dirname, 'cinefreak.js'), 'utf8');
function runtime(fetch) {
  const ctx = { module: { exports: {} }, console, setTimeout, clearTimeout, AbortController, fetch };
  vm.createContext(ctx); vm.runInContext(source, ctx); return ctx;
}
test('movie matching rejects wrong title and remake year', () => {
  const c = runtime();
  assert.equal(c.matches({t:'Dune (2021) Hindi'}, {title:'Dune',year:2021}, 'movie'), true);
  assert.equal(c.matches({t:'Dune (1984) Hindi'}, {title:'Dune',year:2021}, 'movie'), false);
  assert.equal(c.matches({t:'Dune: Part Two (2024)'}, {title:'Dune'}, 'movie'), false);
});
test('episode selection respects season and rejects packs and ranges', () => {
  const c = runtime();
  const data = {type:'series',seasons:[{season_name:'Season 05',episodes:[{k:'e',ep_num:'113',sources:{'720p':'correct'}},{k:'p',ep_num:'113',sources:{'720p':'pack'}},{k:'e',ep_num:'113-120',sources:{'720p':'range'}}]}]};
  assert.equal(c.selectSources(data,'tv',5,113)['720p'],'correct');
  assert.equal(Object.keys(c.selectSources(data,'tv',1,113)).length,0);
  assert.equal(Object.keys(c.selectSources(data,'tv',5,114)).length,0);
});
test('numeric TMDB lookup through search, page and resolver returns direct streams', async () => {
  const urls=[];
  const c=runtime(async url => {
    urls.push(url);
    let data;
    if (url.includes('themoviedb')) data={title:'Example',release_date:'2023-01-01'};
    else if (url.includes('/search?')) data={hits:[{document:{title:'Example (2023) Hindi',slug:'example'}}]};
    else if (url.includes('/example/')) return {ok:true,text:async()=> 'const dataset = {"type":"movie","sources":{"720p":"abc"}};\nconst STREAM_API_BASE = "https://player.example/api";\nconst STREAM_API_KEY = "public-player-key";'};
    else data={resolutions:[{quality:'720p',url:'https://media.example/movie.mkv'},{quality:'bad',url:'javascript:bad'}]};
    return {ok:true,json:async()=>data};
  });
  c.SCRAPER_SETTINGS={tmdbApiKey:'test-key'};
  const rows=await c.getStreams('123','movie');
  assert.equal(rows.length,1); assert.equal(rows[0].url,'https://media.example/movie.mkv');
  assert.equal(urls.length,4);
});
test('missing settings and network failures return an empty array', async () => {
  const c=runtime(()=>Promise.reject(new Error('offline')));
  assert.equal((await c.getStreams('123','movie')).length,0);
  assert.equal((await c.getStreams({title:'Example'},'movie')).length,0);
});
test('provider contains no dynamic evaluation or async syntax', () => {
  assert.doesNotMatch(source,/\basync\s+function|\beval\s*\(|new Function\s*\(/);
});

