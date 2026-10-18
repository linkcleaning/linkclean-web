// 빌드할 때 src/data/instagramReels.ts 에 적힌 인스타 게시물의 "첫 화면 사진"을 받아
// public/insta/<코드>.jpg 와 public/insta/thumbs.json 으로 저장합니다. (토큰 불필요)
// 인스타가 막으면 그냥 건너뜁니다 → 홈페이지는 분홍 카드로 표시.
import fs from 'node:fs';
import path from 'node:path';

const LIST = fs.readFileSync(path.resolve('src/data/instagramReels.ts'), 'utf8');
const codes = [...new Set([...LIST.matchAll(/instagram\.com\/(?:[A-Za-z0-9_.]+\/)?(?:reel|reels|p|tv)\/([A-Za-z0-9_-]+)/g)].map((m) => m[1]))];
const DIR = path.resolve('public/insta');
fs.mkdirSync(DIR, { recursive: true });
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

const unescape = (s) =>
  s
    .replace(/\\u0026/g, '&')
    .replace(/\\\//g, '/')
    .replace(/&amp;/g, '&');

async function findImage(code) {
  for (const url of [`https://www.instagram.com/p/${code}/embed/captioned/`, `https://www.instagram.com/p/${code}/`]) {
    const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'ko-KR,ko;q=0.9' } }).catch(() => null);
    if (!res || !res.ok) continue;
    const html = await res.text();
    const m =
      html.match(/class="EmbeddedMediaImage"[^>]*?src="([^"]+)"/) ||
      html.match(/src="([^"]+)"[^>]*?class="EmbeddedMediaImage"/) ||
      html.match(/"display_url"\s*:\s*"([^"]+)"/) ||
      html.match(/"thumbnail_src"\s*:\s*"([^"]+)"/) ||
      html.match(/property="og:image"\s+content="([^"]+)"/);
    if (m && m[1]) return unescape(m[1]);
  }
  return null;
}

const out = {};
for (const code of codes) {
  try {
    const img = await findImage(code);
    if (!img) {
      console.warn(`× ${code}: 사진 주소 못 찾음`);
      continue;
    }
    const r = await fetch(img, { headers: { 'User-Agent': UA } });
    if (!r.ok) throw new Error(`이미지 ${r.status}`);
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length < 2000) throw new Error('이미지가 너무 작음');
    fs.writeFileSync(path.join(DIR, `${code}.jpg`), buf);
    out[code] = `/insta/${code}.jpg`;
    console.log(`✓ ${code} (${Math.round(buf.length / 1024)}KB)`);
  } catch (e) {
    console.warn(`× ${code}: ${e.message}`);
  }
}
fs.writeFileSync(path.join(DIR, 'thumbs.json'), JSON.stringify(out));
console.log(`인스타 표지 ${Object.keys(out).length}/${codes.length}개 저장`);
