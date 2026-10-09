import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Circle, Share2, MessageCircle, RotateCcw, Copy, Check, Calendar } from 'lucide-react';

/**
 * 새집 입주 체크리스트 — 손님이 휴대폰으로 직접 체크하는 페이지
 * 주소: https://www.linkclean.co.kr/?view=checklist  (카톡으로 보내서 현장에서 열기)
 * 체크 상태는 그 휴대폰에만 저장됩니다.
 */
const KAKAO_URL = 'https://pf.kakao.com/_xfxdrxmM?from=qr';

type Group = { zone: string; emoji: string; note?: string; items: string[] };
export type ChecklistKind = 'newhome' | 'defect';

const CONFIGS: Record<
  ChecklistKind,
  { view: 'checklist' | 'defect'; title: string; subtitle: string; tab: string; shareUrl: string; storageKey: string; shareText: string; groups: Group[] }
> = {
  newhome: {
    view: 'checklist',
    title: '새집 입주 체크리스트',
    subtitle: '입주 전부터 입주 후까지, 할 일을 하나씩 눌러서 체크하세요.',
    tab: '📋 새집 입주 일정',
    shareUrl: 'https://www.linkclean.co.kr/?view=checklist',
    storageKey: 'linkclean_newhome_checklist_v1',
    shareText: '새집 입주 전·당일·입주 후 할 일 — 눌러서 직접 체크해 보세요.',
    groups: [
  {
    zone: '입주 2~4주 전',
    emoji: '🗓️',
    items: [
      '이사 날짜 확정 · 이사업체 예약',
      '입주청소 날짜 예약 (짐 들어오기 2~3일 전 빈집일 때)',
      '인터넷·TV 설치 예약',
      '관리사무소 연락 (입주 등록, 엘리베이터 사용 예약)',
    ],
  },
  {
    zone: '입주 1주 전 (빈집일 때)',
    emoji: '🏠',
    items: [
      '하자 점검 — 찍힘·긁힘·누수·문 작동 확인',
      '발견한 하자는 사진 찍어 관리사무소·시공사에 접수',
      '신축이라면 베이크아웃 (보일러 가열 + 환기 3~5회)',
      '입주청소 + 피톤치드 도포',
      '방충망·창문 잠금장치 확인',
      '도시가스 개통 신청 (입주 당일로)',
    ],
  },
  {
    zone: '입주 당일',
    emoji: '📦',
    items: [
      '도어락 비밀번호·카드키 새로 등록',
      '전기·수도·가스 계량기 숫자 사진 찍어두기',
      '가구 들이기 전 바닥 찍힘 방지 패드 붙이기',
      '냉장고·세탁기 설치 후 수평과 배수 확인',
      '수납장·서랍 안쪽 한 번 더 닦고 짐 넣기',
    ],
  },
  {
    zone: '입주 후 2주 안에',
    emoji: '✅',
    items: [
      '전입신고 (이사 후 14일 이내)',
      '전·월세라면 확정일자 받기',
      '은행·카드·택배 등 주소 변경',
      '하자 보수 일정 확인',
      '몇 달간 하루 2~3번, 30분 이상 맞바람 환기',
    ],
  },
],
  },
  defect: {
    view: 'defect',
    title: '하자 점검 체크리스트',
    subtitle: '사전점검·입주 전에 공간별로 하자를 찾아 체크하고, 사진을 찍어 접수하세요.',
    tab: '🔧 하자 점검',
    shareUrl: 'https://www.linkclean.co.kr/?view=defect',
    storageKey: 'linkclean_defect_checklist_v1',
    shareText: '새집 하자 점검 체크리스트 — 공간별로 눌러서 직접 체크해 보세요.',
    groups: [
  {
    zone: '점검 준비물',
    emoji: '🎒',
    note: '하자는 입주 전 빈집일 때 찾아야 쉽습니다. 사전점검 날이나 입주 1주 전에 진행하세요.',
    items: [
      '마스킹테이프(하자 표시용)와 펜',
      '휴대폰 손전등·카메라 (날짜가 보이게 촬영)',
      '휴대폰 충전기(콘센트 작동 확인용)',
      '수평계 앱 또는 작은 구슬(바닥·배수 기울기 확인)',
    ],
  },
  {
    zone: '현관',
    emoji: '🚪',
    items: [
      '현관문 열림·닫힘, 도어클로저 속도',
      '도어락 작동과 비상 키',
      '신발장 문 수평·경첩 흔들림',
      '바닥 타일 깨짐·들뜸 (두드려서 빈 소리 확인)',
      '중문 레일 작동과 유리 상태',
    ],
  },
  {
    zone: '거실·방',
    emoji: '🛋️',
    items: [
      '벽지 들뜸·찢김·오염, 이음매 벌어짐',
      '바닥재 찍힘·긁힘·들뜸, 밟을 때 삐걱거림',
      '걸레받이·몰딩 틈과 찍힘',
      '방문 열림·닫힘, 문틀 찍힘, 손잡이·잠금',
      '창문 열림·닫힘·잠금, 방충망 찢김',
      '유리 금감·흠집, 창호 실리콘 누락',
      '콘센트(충전기로)·스위치·조명 작동',
    ],
  },
  {
    zone: '주방',
    emoji: '🍳',
    items: [
      '상·하부장 문 수평과 경첩, 서랍 레일',
      '상판 깨짐·흠집·이음매',
      '수전 누수와 온수, 싱크대 배수',
      '후드·가스레인지·인덕션 작동',
      '빌트인 가전(식기세척기 등) 작동',
    ],
  },
  {
    zone: '욕실',
    emoji: '🚿',
    items: [
      '벽·바닥 타일 깨짐·들뜸 (두드려 확인)',
      '줄눈·실리콘 빠진 곳',
      '바닥 물 고임 (물 뿌려서 배수 방향 확인)',
      '변기 물 내림·고정 상태, 주변 누수',
      '세면대·수전·샤워기 누수',
      '환풍기·비데 전원 작동, 샤워부스 문',
    ],
  },
  {
    zone: '베란다·다용도실',
    emoji: '🧺',
    items: [
      '벽·천장 결로·누수 흔적 (얼룩, 곰팡이)',
      '배수구 배수 상태',
      '세탁기 수전·배수구 위치와 누수',
      '창호 실리콘·실외기실 그릴',
    ],
  },
  {
    zone: '설비·기타',
    emoji: '⚙️',
    items: [
      '보일러·난방 작동, 바닥이 고르게 따뜻한지',
      '인터폰·월패드·환기장치 작동',
      '화재감지기·스프링클러 헤드 상태',
      '분전반 차단기 이름 표시',
    ],
  },
],
  },
};

export const ChecklistView: React.FC<{ kind?: ChecklistKind }> = ({ kind = 'newhome' }) => {
  const { goToReservationWithService, setCurrentView } = useApp();
  const cfg = CONFIGS[kind];
  const GROUPS = cfg.groups;
  const ALL = GROUPS.flatMap((g) => g.items);
  const SHARE_URL = cfg.shareUrl;
  const STORAGE_KEY = cfg.storageKey;
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch {
      return {};
    }
  });
  const [copied, setCopied] = useState<'link' | 'result' | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
    } catch {
      /* 저장 안 되는 브라우저는 무시 */
    }
  }, [checked]);

  const done = ALL.filter((i) => checked[i]).length;
  const pct = Math.round((done / ALL.length) * 100);

  const resultText = useMemo(() => {
    const lines = GROUPS.map(
      (g) => `[${g.zone}]\n` + g.items.map((i) => `${checked[i] ? '✅' : '⬜'} ${i}`).join('\n')
    ).join('\n\n');
    return `${cfg.title} (${done}/${ALL.length})\n\n${lines}`;
  }, [checked, done, cfg.title, GROUPS, ALL.length]);

  const copy = async (text: string, kind: 'link' | 'result') => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 2000);
  };

  // 체크리스트 주소를 카톡 등으로 보내기 (휴대폰 공유창 → 카카오톡 선택)
  const shareLink = async () => {
    const data = {
      title: `${cfg.title} (링크클린)`,
      text: cfg.shareText,
      url: SHARE_URL,
    };
    if (navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch {
        /* 취소 시 아무것도 안 함 */
        return;
      }
    }
    copy(`${data.text}\n${SHARE_URL}`, 'link');
  };

  // 체크 결과(미흡한 곳)를 링크클린 카톡으로 보내기: 결과를 복사한 뒤 카톡 상담창 열기
  const sendResult = async () => {
    await copy(resultText, 'result');
    window.open(KAKAO_URL, '_blank', 'noopener');
  };

  return (
    <div className="py-6 sm:py-12 bg-[#F8FAFC]">
      <div className="max-w-2xl mx-auto px-4 space-y-4 sm:space-y-6">
        <div className="text-center">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#38BDF8] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            CHECKLIST
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A1D37] tracking-tight mt-2">{cfg.title}</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{cfg.subtitle}</p>
        </div>

        {/* 체크리스트 종류 선택 */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-2xl">
          {(Object.keys(CONFIGS) as ChecklistKind[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => {
                setCurrentView(CONFIGS[k].view);
                window.scrollTo({ top: 0 });
              }}
              className={`py-2.5 rounded-xl text-xs sm:text-sm font-black cursor-pointer ${
                k === kind ? 'bg-white text-[#0A1D37] shadow-sm' : 'text-slate-500'
              }`}
            >
              {CONFIGS[k].tab}
            </button>
          ))}
        </div>

        {/* 카톡으로 받기 */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={shareLink}
            className="py-3 rounded-xl bg-[#FEE500] text-[#3A1D1D] font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-[#3A1D1D]" />
            {copied === 'link' ? '주소 복사됨!' : '카톡으로 받기'}
          </button>
          <button
            type="button"
            onClick={() => copy(SHARE_URL, 'link')}
            className="py-3 rounded-xl border border-slate-200 bg-white text-[#0A1D37] font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            {copied === 'link' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            주소 복사
          </button>
        </div>
        <p className="-mt-2 text-[11px] text-slate-400 text-center">
          '카톡으로 받기'를 누르고 카카오톡 → 나와의 채팅을 고르면 이사 준비 내내 꺼내 볼 수 있어요.
        </p>

        {/* 진행률 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sticky top-[72px] z-10 shadow-sm">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-[#0A1D37]">
            <span>확인 완료 {done} / {ALL.length}</span>
            <span className={pct === 100 ? 'text-emerald-600' : 'text-[#38BDF8]'}>{pct === 100 ? '모두 확인! 🎉' : `${pct}%`}</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-[#38BDF8] transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* 체크 항목 */}
        {GROUPS.map((g) => (
          <section key={g.zone} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <h2 className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-sm font-black text-[#0A1D37]">
              {g.emoji} {g.zone}
            </h2>
            {g.note && <p className="px-4 pt-2.5 text-[11px] text-amber-700 leading-snug">{g.note}</p>}
            <ul>
              {g.items.map((item) => {
                const on = !!checked[item];
                return (
                  <li key={item} className="border-b last:border-b-0 border-slate-100">
                    <button
                      type="button"
                      onClick={() => setChecked((c) => ({ ...c, [item]: !c[item] }))}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 text-left cursor-pointer ${on ? 'bg-emerald-50/60' : ''}`}
                    >
                      {on ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-300 shrink-0" />
                      )}
                      <span className={`text-sm leading-snug ${on ? 'text-slate-400 line-through' : 'text-slate-800 font-medium'}`}>{item}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}

        {kind === 'defect' ? (
          <section className="bg-amber-50 rounded-2xl border border-amber-200 p-4 text-xs sm:text-sm text-slate-700 space-y-1.5">
            <p className="font-black text-[#0A1D37]">📸 하자 접수 요령</p>
            <p>• 하자 부위에 마스킹테이프로 표시하고, 멀리서 한 장·가까이서 한 장 찍어두세요.</p>
            <p>• 사진은 날짜가 보이게 저장하고, 공간별로 정리해 관리사무소·시공사에 접수하세요.</p>
            <p>• 하자 접수 기한과 보수 일정을 꼭 확인하고, 보수 후 다시 확인하세요.</p>
            <p>• 가구가 들어오기 전 빈집일 때 점검해야 바닥·벽 하자가 잘 보여요.</p>
          </section>
        ) : (
        <section className="bg-sky-50 rounded-2xl border border-sky-200 p-4 text-xs sm:text-sm text-slate-700 space-y-1.5">
          <p className="font-black text-[#0A1D37]">💡 링크클린이 도와드려요</p>
          <p>• 입주청소 때 공사 분진 제거와 피톤치드 도포를 함께 해드려요.</p>
          <p>• 청소 전·후를 구역별 사진으로 보내드려서 제주에 안 계셔도 확인할 수 있어요.</p>
        </section>
        )}

        {/* 결과 보내기 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={sendResult}
            className="py-3 rounded-xl bg-[#0A1D37] text-white font-bold text-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Share2 className="w-4 h-4 text-[#38BDF8]" />
            {copied === 'result' ? '복사됨 → 카톡에 붙여넣기' : '체크 내용 카톡으로 보내기'}
          </button>
          <button
            type="button"
            onClick={() => setChecked({})}
            className="py-3 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold text-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            처음부터 다시 체크
          </button>
        </div>
        <p className="text-[11px] text-slate-400 text-center -mt-2">
          체크 내용은 이 휴대폰에만 저장됩니다. '카톡으로 보내기'를 누르면 목록이 복사되고 링크클린 카톡이 열려요.
        </p>

        <button
          type="button"
          onClick={() => goToReservationWithService('move-in')}
          className="w-full py-3.5 rounded-xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-white font-black text-sm flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Calendar className="w-4 h-4" /> 링크클린 입주청소 견적 예약
        </button>
      </div>
    </div>
  );
};
