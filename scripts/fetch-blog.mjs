// 빌드할 때 링크클린 네이버 블로그 + 구글 블로그(linkdole.blogspot.com) RSS에서 최신 글을 받아 public/blog.json 으로 저장합니다.
// 블로그에 새 글을 쓰면 다음 자동 배포(3시간마다) 때 홈페이지 "오늘의 링크클린 새소식"에 뜹니다.
// 실패해도 빌드는 계속됩니다(기존 blog.json 유지, 없으면 홈페이지는 블로그 바로가기만 표시).
import fs from 'node:fs';
import path from 'node:path';

const BLOG_ID = 'linkcleaning';
const RSS = `https://rss.blog.naver.com/${BLOG_ID}.xml`;
const OUT = path.resolve('public/blog.json');
const MAX = 12;

const decode = (s = '') =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');

const tag = (xml, name) => {
  const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return m ? decode(m[1]).trim() : '';
};

const kstDate = (d) => new Date(d.getTime() + 9 * 3600 * 1000).toISOString().slice(0, 10);

const GOOGLE_RSS = 'https://linkdole.blogspot.com/feeds/posts/default?alt=rss';

async function readFeed(url, source) {
  const res = await fetch(url, { headers: { 'User-Agent': 'LinkClean-Website/1.0 (+https://www.linkclean.co.kr)' } });
  if (!res.ok) throw new Error(`${source} RSS ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, MAX).map(([, it]) => {
    const descHtml = tag(it, 'description');
    const thumb = (it.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i) || [])[1] || '';
    let img = thumb || (descHtml.match(/<img[^>]+src=["']([^"']+)["']/i) || [])[1] || '';
    img = img.replace(/\/s72-c\//, '/s400/'); // 구글 블로그 작은 썸네일 → 크게
    const text = descHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const link = source === 'naver' ? tag(it, 'link').replace(/\?.*$/, '') : tag(it, 'link');
    const pub = new Date(tag(it, 'pubDate'));
    return {
      source,
      title: tag(it, 'title'),
      link,
      summary: text.slice(0, 90),
      image: img.replace(/^http:/, 'https:'),
      category: tag(it, 'category'),
      date: isNaN(pub.getTime()) ? '' : kstDate(pub),
      ts: isNaN(pub.getTime()) ? 0 : pub.getTime(),
    };
  }).filter((p) => p.title && p.link);
}

async function main() {
  const results = await Promise.allSettled([readFeed(RSS, 'naver'), readFeed(GOOGLE_RSS, 'google')]);
  results.forEach((r) => r.status === 'rejected' && console.warn('건너뜀:', r.reason?.message));
  // 진단용: 각 블로그를 몇 개 읽었는지 기록 (public/blog-status.json)
  fs.writeFileSync(
    path.resolve('public/blog-status.json'),
    JSON.stringify({
      at: new Date().toISOString(),
      naver: results[0].status === 'fulfilled' ? results[0].value.length : String(results[0].reason?.message),
      google: results[1].status === 'fulfilled' ? results[1].value.length : String(results[1].reason?.message),
    })
  );
  const items = results
    .flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
    .sort((a, b) => b.ts - a.ts)
    .map(({ ts, ...rest }) => rest);

  if (!items.length) throw new Error('글을 찾지 못함');
  fs.writeFileSync(OUT, JSON.stringify({ updatedAt: new Date().toISOString(), blog: `https://blog.naver.com/${BLOG_ID}`, posts: items }, null, 1));
  console.log(`blog.json: ${items.length}개 글 저장 (최신: ${items[0].date} ${items[0].title})`);
}

main().catch((e) => {
  console.warn('블로그 글 불러오기 실패 (건너뜀):', e.message);
});
