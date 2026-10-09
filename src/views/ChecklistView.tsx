import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Circle, Share2, MessageCircle, RotateCcw, Copy, Check, Calendar } from 'lucide-react';

/**
 * 새집 입주 체크리스트 — 손님이 휴대폰으로 직접 체크하는 페이지
 * 주소: https://www.linkclean.co.kr/?view=checklist  (카톡으로 보내서 현장에서 열기)
 * 체크 상태는 그 휴대폰에만 저장됩니다.
 */
const SHARE_URL = 'https://www.linkclean.co.kr/?view=checklist';
const STORAGE_KEY = 'linkclean_newhome_checklist_v1';
const KAKAO_URL = 'https://pf.kakao.com/_xfxdrxmM?from=qr';

const GROUPS: { zone: string; emoji: string; note?: string; items: string[] }[] = [
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
];

const ALL = GROUPS.flatMap((g) => g.items);

export const ChecklistView: React.FC = () => {
  const { goToReservationWithService } = useApp();
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
    return `새집 입주 체크리스트 (${done}/${ALL.length})\n\n${lines}`;
  }, [checked, done]);

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
      title: '새집 입주 체크리스트 (링크클린)',
      text: '새집 입주 전·당일·입주 후 할 일 — 눌러서 직접 체크해 보세요.',
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
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A1D37] tracking-tight mt-2">새집 입주 체크리스트</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">입주 전부터 입주 후까지, 할 일을 하나씩 눌러서 체크하세요.</p>
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

        {/* 링크클린 안내 */}
        <section className="bg-sky-50 rounded-2xl border border-sky-200 p-4 text-xs sm:text-sm text-slate-700 space-y-1.5">
          <p className="font-black text-[#0A1D37]">💡 링크클린이 도와드려요</p>
          <p>• 입주청소 때 공사 분진 제거와 피톤치드 도포를 함께 해드려요.</p>
          <p>• 청소 전·후를 구역별 사진으로 보내드려서 제주에 안 계셔도 확인할 수 있어요.</p>
        </section>

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
