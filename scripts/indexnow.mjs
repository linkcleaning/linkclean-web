// 배포 후 IndexNow로 "페이지가 바뀌었어요" 알림 → Bing(ChatGPT 검색이 사용)·네이버 등이 빨리 다시 수집
// 키 파일: public/<키>.txt (사이트 루트에 그대로 올라감)
import fs from 'node:fs';
import path from 'node:path';

const { site, pages } = JSON.parse(fs.readFileSync(path.resolve('src/data/seoPages.json'), 'utf8'));
const keyFile = fs.readdirSync('public').find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) {
  console.log('IndexNow 키 파일이 없어 건너뜁니다');
  process.exit(0);
}
const key = keyFile.replace('.txt', '');
const host = new URL(site).host;
const body = {
  host,
  key,
  keyLocation: `${site}/${keyFile}`,
  urlList: [...pages.map((p) => site + p.path), `${site}/llms.txt`],
};

for (const endpoint of ['https://api.indexnow.org/indexnow', 'https://searchadvisor.naver.com/indexnow']) {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    });
    console.log(`${endpoint} → ${res.status}`);
  } catch (e) {
    console.log(`${endpoint} 실패: ${e.message}`);
  }
}
