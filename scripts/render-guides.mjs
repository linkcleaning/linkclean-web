// =============================================================
//  "제주 청소 상식 Q&A" 페이지 만들기 (AI 검색 인용용)
//  - src/data/guides.json 의 질문마다 dist/guide/<slug>/index.html
//  - 목록 dist/guide/index.html
//  - 구성: 질문 → 한 줄 결론 → 원리 → 셀프 방법 → 전문가에게 맡길 때
//  - FAQPage + Article(HowTo 성격) 구조화 데이터를 넣어 AI·검색엔진이 그대로 인용하기 쉽게
//  prerender-pages.mjs 가 끝에 불러서 실행 (sitemap 에도 추가)
// =============================================================
import fs from 'node:fs';
import path from 'node:path';
import { shell } from './render-stories.mjs';

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function loadGuides() {
  const file = path.resolve('src/data/guides.json');
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf8')).filter((g) => g.slug && g.q && g.answer);
}

/** @returns {string[]} sitemap 에 넣을 경로 목록 */
export function renderGuides({ DIST, site, today }) {
  const guides = loadGuides();
  const paths = [];
  const updated = today;

  for (const g of guides) {
    const url = `${site}/guide/${g.slug}/`;
    const fullAnswer = [g.answer, ...(g.self || []).map((s, i) => `${i + 1}. ${s}`)].join(' ');
    const ld = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'FAQPage',
          mainEntity: [{ '@type': 'Question', name: g.q, acceptedAnswer: { '@type': 'Answer', text: fullAnswer } }],
        },
        {
          '@type': 'Article',
          headline: g.q,
          description: g.description,
          url,
          mainEntityOfPage: url,
          inLanguage: 'ko-KR',
          dateModified: updated,
          keywords: (g.keywords || []).join(', '),
          author: { '@type': 'Person', name: '링크클린 대표', jobTitle: '청소관리사 1급 · 청소 경력 12년', worksFor: { '@id': `${site}/#business` } },
          publisher: { '@id': `${site}/#business` },
          about: { '@id': `${site}/#business` },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: '링크클린', item: `${site}/` },
            { '@type': 'ListItem', position: 2, name: '제주 청소 상식 Q&A', item: `${site}/guide/` },
            { '@type': 'ListItem', position: 3, name: g.q, item: url },
          ],
        },
      ],
    };
    const others = guides
      .filter((o) => o.slug !== g.slug)
      .slice(0, 5)
      .map((o) => `<li><a href="/guide/${o.slug}/">${esc(o.q)}</a></li>`)
      .join('');
    const body = `<p class="crumb"><a href="/">홈</a> › <a href="/guide/">제주 청소 상식 Q&amp;A</a></p>
<article>
<h1>${esc(g.q)}</h1>
<p class="meta">${esc(updated)} 업데이트 · 링크클린 대표 (청소관리사 1급, 제주 청소 경력 12년)</p>
<div style="background:#DCEDEB;border-radius:12px;padding:14px 16px;font-weight:700">한 줄 답: ${esc(g.answer)}</div>
<h2>왜 그런가요? (현장에서 본 원리)</h2>
${(g.why || []).map((p) => `<p>${esc(p)}</p>`).join('\n')}
<h2>셀프로 할 때</h2>
<ol>${(g.self || []).map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
${g.safety ? `<p><b>⚠ 안전 주의:</b> ${esc(g.safety)}</p>` : ''}
<h2>전문가에게 맡기면 좋은 경우</h2>
<ul>${(g.pro || []).map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
<p>제주 전역은 링크클린(☎ 064-763-4545), 서귀포·타운하우스 관리는 자매업체 이케이클린(☎ 050-6744-1126)이 함께 맡고 있습니다.</p>
${g.related?.length ? `<h3>함께 보면 좋은 페이지</h3><ul>${g.related.map((r) => `<li><a href="${esc(r.href)}">${esc(r.label)}</a></li>`).join('')}</ul>` : ''}
${g.keywords?.length ? `<div class="tags">${g.keywords.map((t) => `<span>${esc(t)}</span>`).join('')}</div>` : ''}
</article>
<h3>다른 제주 청소 상식</h3>
<ul>${others}</ul>`;
    const out = path.join(DIST, 'guide', g.slug, 'index.html');
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, shell({ site, url, title: `${g.q} | 링크클린 제주 청소 상식`, description: g.description, jsonLd: ld, body }));
    paths.push(`/guide/${g.slug}/`);
  }

  // 목록 페이지
  const listLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        mainEntity: guides.map((g) => ({ '@type': 'Question', name: g.q, acceptedAnswer: { '@type': 'Answer', text: g.answer } })),
      },
    ],
  };
  const list = guides
    .map((g) => `<a href="/guide/${g.slug}/"><b>${esc(g.q)}</b><small>${esc(g.answer)}</small></a>`)
    .join('\n');
  const listBody = `<p class="crumb"><a href="/">홈</a> › 제주 청소 상식 Q&amp;A</p>
<h1>제주 청소 상식 Q&amp;A</h1>
<p>습기·해풍·결로가 많은 제주 집에서 자주 생기는 청소 고민을, 제주에서 12년 동안 청소해 온 링크클린 대표가 '한 줄 답 → 원리 → 셀프 방법 → 전문가에게 맡길 때' 순서로 정리했습니다.</p>
<div class="list">${list}</div>`;
  fs.mkdirSync(path.join(DIST, 'guide'), { recursive: true });
  fs.writeFileSync(
    path.join(DIST, 'guide', 'index.html'),
    shell({
      site,
      url: `${site}/guide/`,
      title: '제주 청소 상식 Q&A — 결로·곰팡이·소금기·새집 냄새 | 링크클린',
      description: '제주 집의 결로 곰팡이, 욕실 실리콘 곰팡이, 해풍 소금기 유리창, 새집 냄새, 공사 먼지까지 제주 청소 12년 차 링크클린의 Q&A',
      jsonLd: guides.length ? listLd : null,
      body: listBody,
    })
  );
  paths.unshift('/guide/');
  console.log(`청소 상식 Q&A ${guides.length}개 페이지 생성`);
  return paths;
}
