// 빌드할 때 링크클린 네이버 블로그 RSS에서 최신 글을 받아 public/blog.json 으로 저장합니다.
// 블로그에 새 글을 쓰면 다음 자동 배포(3시간마다) 때 홈페이지 "오늘의 링크클린 새소식"에 뜹니다.
// 실패해도 빌드는 계속됩니다(기존 blog.json 유지, 없으면 홈페이지는 블로그 바로가기만 표시).
import fs from 'node:fs';
import path from 'node:path';

const BLOG_ID = 'linkcleaning';
const RSS = `https://rss.blog.naver.com/${BLOG_ID}.xml`;
const OUT = path.resolve('public/blog.json');
const MAX = 6;

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

async function main() {
  const res = await fetch(RSS, { headers: { 'User-Agent': 'LinkClean-Website/1.0 (+https://www.linkclean.co.kr)' } });
  if (!res.ok) throw new Error(`RSS ${res.status}`);
  const xml = await res.text();
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, MAX).map(([, it]) => {
    const descHtml = tag(it, 'description');
    const img = (descHtml.match(/<img[^>]+src=["']([^"']+)["']/i) || [])[1] || '';
    const text = descHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const link = tag(it, 'link').replace(/\?.*$/, '');
    const pub = new Date(tag(it, 'pubDate'));
    return {
      title: tag(it, 'title'),
      link,
      summary: text.slice(0, 90),
      image: img.replace(/^http:/, 'https:'),
      category: tag(it, 'category'),
      date: isNaN(pub.getTime()) ? '' : kstDate(pub),
    };
  }).filter((p) => p.title && p.link);

  if (!items.length) throw new Error('글을 찾지 못함');
  fs.writeFileSync(OUT, JSON.stringify({ updatedAt: new Date().toISOString(), blog: `https://blog.naver.com/${BLOG_ID}`, posts: items }, null, 1));
  console.log(`blog.json: ${items.length}개 글 저장 (최신: ${items[0].date} ${items[0].title})`);
}

main().catch((e) => {
  console.warn('블로그 글 불러오기 실패 (건너뜀):', e.message);
});
