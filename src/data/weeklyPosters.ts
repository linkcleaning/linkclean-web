/**
 * 이번 주 링크클린 포스터 — 매주 월요일(제주 시간) 자동으로 다음 포스터로 바뀝니다.
 * 이미지는 public/posters/weekly-01.jpg ~ 에 있어요. 새 포스터를 넣으려면
 * 이미지를 같은 폴더에 올리고 아래 목록 끝에 한 줄만 추가하면 됩니다. (순서대로 돌아가요)
 */
export interface WeeklyPoster {
  src: string;
  title: string; // 카드에 보이는 짧은 제목
  alt: string; // 이미지 설명 (검색·접근성)
}

export const WEEKLY_POSTERS: WeeklyPoster[] = [
  { src: '/posters/weekly-01.jpg', title: '새집 냄새는 남기고 먼지는 싹! · 입주청소', alt: '제주 입주청소 링크클린 포스터 — 24~34평 기준 6~7시간, 전문 인력 3~4명 투입' },
  { src: '/posters/weekly-02.jpg', title: '보증금 지키는 마지막 한 수 · 이사청소', alt: '이사 나가는 날 이사청소 포스터 — 창틀 먼지, 주방 기름때, 욕실 물때, 베란다 곰팡이' },
  { src: '/posters/weekly-03.jpg', title: '조용히, 깨끗하게 · 특수청소', alt: '쓰레기집·저장강박·고독사 특수청소 포스터 — 비밀 보장, 오존 살균 탈취' },
  { src: '/posters/weekly-04.jpg', title: '공사는 끝! 청소는 시작 · 준공청소', alt: '제주 준공청소 포스터 — 시멘트 가루, 스티커, 페인트 자국까지' },
  { src: '/posters/weekly-05.jpg', title: '마지막까지 정성껏 · 유품정리', alt: '제주 유품정리·집안 정리 포스터 — 귀중품·서류·사진은 꼭 유족께' },
  { src: '/posters/weekly-06.jpg', title: '이 냄새, 어디서 나지? · 오존 탈취', alt: '오존 살균 탈취 포스터 — 담배, 반려동물, 곰팡이, 음식, 새집 냄새' },
  { src: '/posters/weekly-07.jpg', title: '높이? 그게 뭔데요? · 외벽·고소', alt: '링크클린 × 클린앤스카이 외벽·유리창·간판 고소 청소 포스터 — 스카이차, 로프 작업' },
  { src: '/posters/weekly-08.jpg', title: '후기 쓰면 커피가 공짜! · 이벤트', alt: '링크클린 고객 이벤트 포스터 — 네이버 플레이스 후기, 지인 소개 시 커피 1잔' },
  { src: '/posters/weekly-09.jpg', title: '버리는 날 놓쳤다면? · 문앞비움', alt: '문앞비움 문 앞 쓰레기 수거 포스터 — 소량 수거 9,900원, 밤 10시~아침 6시 수거' },
  { src: '/posters/weekly-10.jpg', title: '청소 경력 12년 · 청소관리사 1급', alt: '제주 청소업체 링크클린 포스터 — 2016년 설립, 제주 전 지역, 무료 견적' },
  { src: '/posters/weekly-11.jpg', title: '월요일 아침이 상쾌해진다 · 사무실 청소', alt: '사무실 청소 포스터 — 책상, 바닥, 탕비실, 화장실까지' },
  { src: '/posters/weekly-12.jpg', title: '제주 어디든 달려갑니다!', alt: '제주 전 지역 출장 포스터 — 연중무휴 08:30~20:00, 방문 견적 무료' },
];

/** 기준 월요일 (이 주에 1번 포스터) */
const ANCHOR_MONDAY_KST = Date.UTC(2026, 9, 26) - 9 * 3600_000; // 2026-10-26 00:00 KST
const WEEK = 7 * 24 * 3600_000;

/** 지금이 몇 번째 포스터 주인지 (제주 시간 월요일 0시에 바뀜) */
export function weeklyPosterIndex(now = Date.now()) {
  const n = WEEKLY_POSTERS.length;
  const weeks = Math.floor((now - ANCHOR_MONDAY_KST) / WEEK);
  return ((weeks % n) + n) % n;
}
