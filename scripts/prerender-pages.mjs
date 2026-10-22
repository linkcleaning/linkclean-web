// 빌드가 끝난 뒤(dist) 페이지별 검색용 HTML을 만듭니다.
//  - dist/index.html, dist/about/index.html, dist/services/index.html ... (src/data/seoPages.json 기준)
//  - 각 페이지에 고유 제목·설명·대표주소(canonical)를 넣고,
//    자바스크립트를 실행하지 않는 검색 로봇도 읽을 수 있게 본문 글을 #root 안에 미리 넣어둡니다.
//    (화면이 뜨면 React가 이 글을 실제 화면으로 바꿉니다)
//  - dist/sitemap.xml(오늘 날짜), dist/404.html 도 같이 만듭니다.
//  - 서비스 상세 페이지(/services/move-in/ 등)는 src/data/initialData.ts 의 서비스 설명으로 본문을 채웁니다.
//    (TS 파일을 읽으므로 tsx 로 실행: npx tsx scripts/prerender-pages.mjs)
import fs from 'node:fs';
import path from 'node:path';
import { SERVICE_DETAILS } from '../src/data/initialData.ts';

const DIST = path.resolve('dist');
const { site, pages } = JSON.parse(fs.readFileSync(path.resolve('src/data/seoPages.json'), 'utf8'));
const base = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const today = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const nav = pages
  .filter((p) => p.view !== 'home')
  .map((p) => `<li><a href="${p.path}">${esc(p.h1)}</a></li>`)
  .join('');

// 서비스 상세 페이지 본문: 추천 대상·작업 범위·진행 순서·자주 묻는 질문
function serviceBody(id) {
  const d = SERVICE_DETAILS[id];
  if (!d) return [];
  return [
    d.tagline,
    d.description,
    '이런 분께 추천합니다: ' + d.recommendedFor.join(' / '),
    ...d.scopeList.map((s) => `${s.title}: ${s.items.join(', ')}`),
    '진행 순서: ' + d.processSteps.map((p) => `${p.step}. ${p.title} - ${p.desc}`).join(' '),
    ...d.faqs.map((f) => `Q. ${f.question} A. ${f.answer}`),
    '서비스 지역: 제주시, 서귀포시 등 제주 전지역. 전화 064-763-4545 (연중무휴 08:30~20:00).',
  ];
}
for (const p of pages) if (p.service && p.body.length === 0) p.body = serviceBody(p.service);

function render(page) {
  const url = site + page.path;
  let html = base
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(page.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(page.description)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(page.title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(page.description)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(page.title)}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(page.description)}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);

  const content = `
      <div id="seo-content" style="max-width:860px;margin:0 auto;padding:24px 16px;font-family:sans-serif;color:#0A1D37">
        <h1>${esc(page.h1)}</h1>
        ${page.body.map((t) => `<p>${esc(t)}</p>`).join('\n        ')}
        <p><a href="/reservation/">청소 날짜 예약하기</a> · <a href="tel:064-763-4545">전화 064-763-4545</a></p>
        <nav aria-label="링크클린 페이지"><ul>${page.view === 'home' ? nav : `<li><a href="/">링크클린 홈</a></li>${nav}`}</ul></nav>
      </div>`;
  html = html.replace('<div id="root"></div>', `<div id="root">${content}\n    </div>`);
  return html;
}

for (const page of pages) {
  const out = page.path === '/' ? path.join(DIST, 'index.html') : path.join(DIST, page.path, 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, render(page));
}

// 없는 주소로 들어와도 홈페이지가 뜨도록 (검색엔진에는 404로 알림)
const home = pages.find((p) => p.view === 'home');
fs.writeFileSync(
  path.join(DIST, '404.html'),
  render(home).replace('<meta name="robots" content="index, follow" />', '<meta name="robots" content="noindex" />')
);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>${site}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);
console.log(`검색용 페이지 ${pages.length}개 + sitemap.xml + 404.html 생성`);
