// =============================================================
//  "현장 기록" 페이지 만들기 (찰칵 블로그 앱이 올린 글)
//  - src/data/stories.json 의 글마다 dist/stories/<slug>/index.html (React 없이 완성된 HTML)
//  - 목록 dist/stories/index.html
//  - 검색 로봇·AI가 바로 읽을 수 있게 본문·구조화 데이터(JSON-LD)를 HTML에 그대로 넣음
//  prerender-pages.mjs 가 끝에 불러서 실행 (sitemap 에도 추가)
// =============================================================
import fs from 'node:fs';
import path from 'node:path';

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function shell({ site, url, title, description, image, jsonLd, body }) {
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="${url}" />
<meta property="og:type" content="article" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${image || site + '/images/og_image.jpg'}" />
<link rel="icon" type="image/png" href="/logo.png" />
<meta name="theme-color" content="#0B3B40" />
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>` : ''}
<style>
  :root { --brand:#0B3B40; --accent:#D9691F; --paper:#F4F1EA; --ink:#14262A; --muted:#56676A; }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--paper); color:var(--ink); font-family:'Pretendard','Apple SD Gothic Neo','Malgun Gothic',system-ui,sans-serif; line-height:1.75; }
  header { background:var(--brand); color:#fff; }
  .bar { max-width:800px; margin:0 auto; padding:14px 16px; display:flex; align-items:center; justify-content:space-between; gap:12px; }
  .bar a { color:#fff; text-decoration:none; font-weight:800; display:flex; align-items:center; gap:8px; }
  .bar img { width:34px; height:34px; border-radius:8px; background:#fff; object-fit:contain; }
  .bar .cta { background:var(--accent); padding:8px 14px; border-radius:999px; font-size:14px; }
  main { max-width:800px; margin:0 auto; padding:20px 16px 40px; }
  .crumb { font-size:13px; color:var(--muted); }
  .crumb a { color:var(--muted); }
  article { background:#fff; border-radius:16px; padding:22px 18px; }
  h1 { font-size:26px; line-height:1.4; margin:6px 0 4px; }
  .meta { font-size:13px; color:var(--muted); margin-bottom:18px; }
  h2 { font-size:20px; margin:30px 0 8px; padding-left:10px; border-left:5px solid var(--accent); }
  h3 { font-size:17px; margin:22px 0 4px; }
  figure { margin:16px 0; }
  figure img { width:100%; height:auto; border-radius:12px; display:block; }
  figcaption { text-align:center; font-size:13px; color:var(--muted); margin-top:6px; }
  .tags { display:flex; flex-wrap:wrap; gap:6px; margin-top:24px; }
  .tags span { background:#DCEDEB; color:var(--brand); font-size:13px; padding:4px 10px; border-radius:999px; }
  .box { margin-top:22px; background:var(--brand); color:#fff; border-radius:16px; padding:20px 18px; }
  .box a { color:#fff; font-weight:800; }
  .list a { display:block; background:#fff; border-radius:14px; padding:14px 16px; margin-bottom:10px; color:var(--ink); text-decoration:none; }
  .list a b { display:block; font-size:17px; }
  .list a small { color:var(--muted); }
  .list img { width:100%; aspect-ratio:16/9; object-fit:cover; border-radius:10px; margin-bottom:8px; }
  footer { max-width:800px; margin:0 auto; padding:0 16px 40px; font-size:13px; color:var(--muted); }
</style>
</head>
<body>
<header><div class="bar"><a href="/"><img src="/logo.png" alt="" />링크클린</a><a class="cta" href="/reservation/">청소 날짜 예약</a></div></header>
<main>
${body}
<div class="box">
  <b>제주 입주청소·이사청소 링크클린</b><br />
  2016년 설립 · 대표 청소 경력 12년 · 청소관리사 1급 대표 직접 시공<br />
  ☎ <a href="tel:064-763-4545">064-763-4545</a> (연중무휴 08:30~20:00) · <a href="/reservation/">홈페이지에서 날짜 예약</a> · <a href="/qna/">비용·예약 Q&amp;A</a>
</div>
</main>
<footer>링크클린 · 서귀포점 서귀포시 서호호근로 86-6 · 제주시점 제주시 도령북길 8 제일상가 2층 · 064-763-4545</footer>
</body>
</html>
`;
}

/** @returns {string[]} sitemap 에 넣을 경로 목록 */
export function renderStories({ DIST, site, today }) {
  const file = path.resolve('src/data/stories.json');
  if (!fs.existsSync(file)) return [];
  const stories = JSON.parse(fs.readFileSync(file, 'utf8'))
    .filter((s) => s.slug && s.title && s.html)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const paths = [];

  for (const s of stories) {
    const url = `${site}/stories/${s.slug}/`;
    const image = s.cover ? site + s.cover : '';
    const ld = s.jsonLd && s.jsonLd['@graph'] ? JSON.parse(JSON.stringify(s.jsonLd)) : { '@context': 'https://schema.org', '@graph': [] };
    for (const g of ld['@graph']) {
      if (g['@type'] === 'BlogPosting') {
        g.mainEntityOfPage = url;
        g.url = url;
        if (image) g.image = image;
      }
    }
    ld['@graph'].push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '링크클린', item: `${site}/` },
        { '@type': 'ListItem', position: 2, name: '현장 기록', item: `${site}/stories/` },
        { '@type': 'ListItem', position: 3, name: s.title, item: url },
      ],
    });
    const body = `<p class="crumb"><a href="/">홈</a> › <a href="/stories/">현장 기록</a></p>
<article>
<h1>${esc(s.title)}</h1>
<p class="meta">${esc(s.date)} · 링크클린 대표 작성</p>
${s.html}
${s.tags?.length ? `<div class="tags">${s.tags.map((t) => `<span>${esc(t)}</span>`).join('')}</div>` : ''}
</article>`;
    const out = path.join(DIST, 'stories', s.slug, 'index.html');
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, shell({ site, url, title: `${s.title} | 링크클린 현장 기록`, description: s.description || s.title, image, jsonLd: ld, body }));
    paths.push(`/stories/${s.slug}/`);
  }

  // 목록 페이지
  const list = stories
    .map((s) => `<a href="/stories/${s.slug}/">${s.cover ? `<img src="${s.cover}" alt="" loading="lazy" />` : ''}<b>${esc(s.title)}</b><small>${esc(s.date)} · ${esc(s.description || '')}</small></a>`)
    .join('\n');
  const listBody = `<p class="crumb"><a href="/">홈</a> › 현장 기록</p>
<h1>제주 청소 현장 기록</h1>
<p>링크클린이 직접 다녀온 제주 입주청소·이사청소·특수청소 현장의 작업 전·후 기록입니다.</p>
<div class="list">${list || '<p>곧 첫 현장 기록이 올라옵니다.</p>'}</div>`;
  fs.mkdirSync(path.join(DIST, 'stories'), { recursive: true });
  fs.writeFileSync(
    path.join(DIST, 'stories', 'index.html'),
    shell({ site, url: `${site}/stories/`, title: '제주 청소 현장 기록 | 링크클린', description: '링크클린이 직접 다녀온 제주 입주청소·이사청소·특수청소 현장의 작업 전·후 기록', jsonLd: null, body: listBody })
  );
  paths.unshift('/stories/');
  console.log(`현장 기록 ${stories.length}개 페이지 생성`);
  return paths;
}
