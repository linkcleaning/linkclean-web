import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Circle, Share2, MessageCircle, RotateCcw, Copy, Check, Calendar } from 'lucide-react';

/**
 * 입주청소 검수 체크리스트 — 손님이 휴대폰으로 직접 체크하는 페이지
 * 주소: https://www.linkclean.co.kr/?view=checklist  (카톡으로 보내서 현장에서 열기)
 * 체크 상태는 그 휴대폰에만 저장됩니다.
 */
const SHARE_URL = 'https://www.linkclean.co.kr/?view=checklist';
const STORAGE_KEY = 'linkclean_movein_checklist_v1';
const KAKAO_URL = 'https://pf.kakao.com/_xfxdrxmM?from=qr';

const GROUPS: { zone: string; emoji: string; items: string[] }[] = [
  {
    zone: '주방',
    emoji: '🍳',
    items: ['상·하부장 안쪽과 선반 위 (공사 분진)', '싱크대 하부 걸레받이 안쪽', '후드 필터와 후드 내부', '배수구 거름망'],
  },
  {
    zone: '욕실',
    emoji: '🚿',
    items: ['배수구 트랩, 샤워부스 레일', '환풍기 커버', '수전·거울의 물때와 시멘트 자국'],
  },
  {
    zone: '방·거실',
    emoji: '🛋️',
    items: ['창틀 레일과 방충망', '붙박이장 레일과 서랍 안쪽', '콘센트·스위치 커버, 문틀 위'],
  },
  {
    zone: '기타',
    emoji: '🚪',
    items: ['베란다 배수구와 실외기 주변', '현관 신발장 안과 현관 바닥 줄눈'],
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
    return `링크클린 입주청소 검수 체크 (${done}/${ALL.length})\n\n${lines}`;
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
      title: '입주청소 검수 체크리스트 (링크클린)',
      text: '입주청소 끝난 뒤 꼭 확인할 12곳 — 눌러서 직접 체크해 보세요.',
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
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A1D37] tracking-tight mt-2">입주청소 검수 체크리스트</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">청소 직후, 짐 들어오기 전에 하나씩 눌러서 체크하세요.</p>
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
          '카톡으로 받기'를 누르고 카카오톡 → 나와의 채팅을 고르면 청소 당일 바로 열어볼 수 있어요.
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

        {/* 검수 요령 */}
        <section className="bg-sky-50 rounded-2xl border border-sky-200 p-4 text-xs sm:text-sm text-slate-700 space-y-1.5">
          <p className="font-black text-[#0A1D37]">💡 검수 요령</p>
          <p>• 흰 물티슈로 선반 위·문틀을 쓸어보면 분진이 바로 보여요.</p>
          <p>• 휴대폰 손전등을 바닥과 수평으로 비추면 남은 먼지가 잘 보여요.</p>
          <p>• 미흡한 곳은 사진을 찍어 그 자리에서 바로 요청하세요.</p>
        </section>

        {/* 결과 보내기 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={sendResult}
            className="py-3 rounded-xl bg-[#0A1D37] text-white font-bold text-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Share2 className="w-4 h-4 text-[#38BDF8]" />
            {copied === 'result' ? '결과 복사됨 → 카톡에 붙여넣기' : '체크 결과 링크클린 카톡으로 보내기'}
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
          체크 결과는 이 휴대폰에만 저장됩니다. 결과 보내기를 누르면 내용이 복사되고 링크클린 카톡이 열려요.
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
