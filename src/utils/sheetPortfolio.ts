import { PortfolioItem, PortfolioCategory } from '../types';

/**
 * 청소사례(전/후 사진)를 사장님 구글 시트에서 불러옵니다.
 *
 * 구글 시트 → 파일 → 공유 → 웹에 게시 → [청소사례] 탭, "쉼표로 구분된 값(.csv)" 으로 게시한 주소를 넣으세요.
 * 비어 있으면 홈페이지에 기본으로 들어 있는 사례를 그대로 보여줍니다.
 * 설정 방법: docs/portfolio-sheet/설정방법.md
 */
export const PORTFOLIO_SHEET_CSV_URL = '';

const CATEGORIES: PortfolioCategory[] = ['주방', '욕실', '화장실', '곰팡이', '거실', '유리창', '베란다', '상가', '쓰레기집', '기타'];

/** 따옴표·줄바꿈이 들어간 칸까지 처리하는 CSV 파서 */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;
  const src = text.replace(/^﻿/, '');

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(cell);
      cell = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && src[i + 1] === '\n') i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += ch;
    }
  }
  if (cell !== '' || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ''));
}

/**
 * 구글 드라이브 공유 링크를 이미지 주소로 바꿉니다.
 *   https://drive.google.com/file/d/파일ID/view?usp=sharing
 *   https://drive.google.com/open?id=파일ID
 * → https://lh3.googleusercontent.com/d/파일ID=w1600
 * (드라이브 파일은 '링크가 있는 모든 사용자'로 공유되어 있어야 합니다)
 */
export function toImageUrl(raw: string): string {
  const url = raw.trim();
  const m = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=\w+&)?id=)([\w-]{10,})/);
  if (m) return `https://lh3.googleusercontent.com/d/${m[1]}=w1600`;
  return url;
}

/** CSV 행 → 청소사례 목록 (헤더 이름으로 칸을 찾으므로 열 순서가 바뀌어도 됨) */
export function rowsToPortfolio(rows: string[][]): PortfolioItem[] {
  if (rows.length < 2) return [];
  const header = rows[0].map((h) => h.trim().replace(/\s/g, ''));
  const col = (...names: string[]) => header.findIndex((h) => names.includes(h));

  const iShow = col('공개', '노출');
  const iCat = col('분류', '카테고리');
  const iTitle = col('제목');
  const iLoc = col('지역', '위치');
  const iBefore = col('전_사진', '전사진', '청소전', '전');
  const iAfter = col('후_사진', '후사진', '청소후', '후');
  const iDesc = col('설명', '내용');
  const iDate = col('날짜', '작업일');

  const get = (r: string[], i: number) => (i >= 0 ? (r[i] || '').trim() : '');

  return rows
    .slice(1)
    .filter((r) => {
      const show = get(r, iShow).toUpperCase();
      return !(show === 'X' || show === 'N' || show === '숨김' || show === '아니오');
    })
    .map((r, idx): PortfolioItem | null => {
      const before = toImageUrl(get(r, iBefore));
      const after = toImageUrl(get(r, iAfter));
      const title = get(r, iTitle);
      if (!title || !after) return null;
      const catRaw = get(r, iCat) as PortfolioCategory;
      return {
        id: `sheet-${idx + 1}`,
        title,
        location: get(r, iLoc) || undefined,
        category: CATEGORIES.includes(catRaw) ? catRaw : '기타',
        representativeImage: after,
        beforeImage: before || after,
        afterImage: after,
        description: get(r, iDesc),
        createdAt: get(r, iDate),
      };
    })
    .filter((x): x is PortfolioItem => x !== null);
}

/** 시트에서 청소사례를 불러옵니다. 실패하거나 비어 있으면 null */
export async function fetchSheetPortfolio(): Promise<PortfolioItem[] | null> {
  if (!PORTFOLIO_SHEET_CSV_URL) return null;
  try {
    const sep = PORTFOLIO_SHEET_CSV_URL.includes('?') ? '&' : '?';
    // 몇 분 단위로 새로 받아오도록 시간값을 붙임 (시트 수정이 빨리 반영되게)
    const res = await fetch(`${PORTFOLIO_SHEET_CSV_URL}${sep}_t=${Math.floor(Date.now() / 120000)}`);
    if (!res.ok) return null;
    const items = rowsToPortfolio(parseCsv(await res.text()));
    return items.length ? items : null;
  } catch {
    return null;
  }
}
