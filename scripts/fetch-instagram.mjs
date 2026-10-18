// 빌드할 때 링크클린 인스타그램 최신 게시물을 받아 public/instagram.json 으로 저장합니다.
// 깃허브 저장소 Settings → Secrets 에 INSTAGRAM_TOKEN(인스타 장기 토큰)이 있을 때만 동작합니다.
// 토큰이 없거나 실패하면 아무것도 하지 않고, 홈페이지는 src/data/instagramReels.ts 목록을 씁니다.
import fs from 'node:fs';
import path from 'node:path';

const TOKEN = process.env.INSTAGRAM_TOKEN;
const OUT = path.resolve('public/instagram.json');

async function main() {
  if (!TOKEN) {
    console.log('INSTAGRAM_TOKEN 없음 → 수동 목록 사용');
    return;
  }
  // 토큰 유효기간(60일) 연장 시도 (실패해도 계속)
  await fetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${TOKEN}`).catch(() => null);

  const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
  const res = await fetch(`https://graph.instagram.com/me/media?fields=${fields}&limit=12&access_token=${TOKEN}`);
  if (!res.ok) throw new Error(`Instagram API ${res.status} ${await res.text()}`);
  const data = await res.json();
  const posts = (data.data || [])
    .map((m) => ({
      url: m.permalink,
      caption: (m.caption || '').split('\n')[0].slice(0, 60),
      thumbnail: m.media_type === 'VIDEO' ? m.thumbnail_url : m.media_url,
      date: (m.timestamp || '').slice(0, 10),
    }))
    .filter((p) => p.url);
  if (!posts.length) throw new Error('게시물 없음');
  fs.writeFileSync(OUT, JSON.stringify({ updatedAt: new Date().toISOString(), posts }, null, 1));
  console.log(`instagram.json: ${posts.length}개 저장 (최신 ${posts[0].date})`);
}

main().catch((e) => console.warn('인스타 불러오기 실패 (건너뜀):', e.message));
