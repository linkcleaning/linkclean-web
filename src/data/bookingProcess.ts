/**
 * 링크클린 청소 예약 진행 순서 + 하루 2팀 운영 일정표
 *
 * ▸ 진행 순서를 바꾸려면 BOOKING_STEPS만 고치면 사이트 전체(첫 화면·예약 화면·링크클린은 다르다)에 같이 바뀝니다.
 * ▸ 달력의 예약 현황: 하루 TEAMS_PER_DAY팀 운영. BUSY_UNTIL 날짜까지는 기존 예약 일정이
 *   날짜마다 0~2팀씩 채워져 보이고, 그 이후는 모두 비어 있습니다.
 *   (날짜별로 항상 같은 결과 → 새로고침해도 바뀌지 않음)
 */

export const TEAMS_PER_DAY = 2;
export const BUSY_UNTIL = '2026-11-20';

/** 실제로 예약이 꽉 찬 날 (무조건 '마감' 표시). 날짜만 추가/삭제하면 됩니다. */
export const FULL_DATES: string[] = ['2026-10-26', '2026-11-15'];

export interface BookingStep {
  no: number;
  title: string;
  short: string;
  desc: string;
  optional?: boolean;
}

export const BOOKING_STEPS: BookingStep[] = [
  {
    no: 1,
    title: '청소 날짜 예약',
    short: '날짜 예약',
    desc: '달력에서 원하는 청소 날짜를 먼저 잡아주세요. 하루 2팀만 운영해 날짜가 빨리 찹니다.',
  },
  {
    no: 2,
    title: '링크클린 확인 전화',
    short: '확인 전화',
    desc: '담당자가 직접 전화드려 평수·오염 상태·요청사항을 확인하고 예상 금액을 안내합니다.',
  },
  {
    no: 3,
    title: '방문 견적 (필요할 때만)',
    short: '방문 견적',
    desc: '사진·통화만으로 판단이 어려운 현장은 무료로 방문해 정확히 실측합니다.',
    optional: true,
  },
  {
    no: 4,
    title: '예약 확정 (계약금)',
    short: '예약 확정',
    desc: '금액과 작업 범위에 동의하시면 계약금 입금으로 청소 날짜가 확정됩니다.',
  },
  {
    no: 5,
    title: '청소 진행',
    short: '청소',
    desc: '약속한 날 청소팀이 방문해 작업하고, 사진 리포트·검수 후 잔금을 결제합니다.',
  },
];

/** 한 줄 요약 (문자·작은 안내문용) */
export const BOOKING_FLOW_TEXT = '청소 날짜 예약 → 확인 전화 → (필요시) 방문 견적 → 계약금으로 확정 → 청소';

// 날짜 문자열로 항상 같은 난수를 만드는 시드 난수
const seeded = (text: string) => {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h += 0x6d2b79f5;
  let t = h;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/** 기존 일정으로 이미 잡혀 있는 팀 수 (0~2) */
export const getScheduledTeams = (dateString: string, isSonEopNeunNal = false): number => {
  if (FULL_DATES.includes(dateString)) return TEAMS_PER_DAY;
  if (dateString > BUSY_UNTIL) return 0;
  const r = seeded(`linkclean-team-${dateString}`);
  const dow = new Date(dateString + 'T00:00:00').getDay();
  const weekend = dow === 0 || dow === 6;
  // 주말·손없는날은 더 빨리 참
  const fullP = isSonEopNeunNal ? 0.55 : weekend ? 0.4 : 0.25;
  const oneP = 0.35;
  if (r < fullP) return 2;
  if (r < fullP + oneP) return 1;
  return 0;
};
