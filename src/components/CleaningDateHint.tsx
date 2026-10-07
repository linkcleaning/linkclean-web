import React, { useMemo } from 'react';

/**
 * 실제 "청소하는 날"을 대략이라도 받는 입력칸.
 * 버튼(이번 주/다음 주/…)을 누르거나 직접 적거나, 날짜를 골라도 됩니다.
 */
interface Props {
  value: string;
  onChange: (v: string) => void;
  compact?: boolean;
}

const fmtDate = (iso: string) => {
  const [, m, d] = iso.split('-').map(Number);
  if (!m || !d) return iso;
  const day = ['일', '월', '화', '수', '목', '금', '토'][new Date(iso + 'T00:00:00').getDay()];
  return `${m}월 ${d}일(${day})`;
};

export const CleaningDateHint: React.FC<Props> = ({ value, onChange, compact }) => {
  const chips = useMemo(() => {
    const now = new Date();
    const m = now.getMonth() + 1;
    const next = (m % 12) + 1;
    return ['이번 주', '다음 주', `${m}월 중순`, `${m}월 말`, `${next}월 초`, `${next}월 중`, '아직 미정'];
  }, []);

  return (
    <div className={compact ? 'space-y-2' : 'space-y-2.5'}>
      <div className="flex flex-wrap gap-1.5">
        {chips.map((c) => {
          const on = value === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => onChange(on ? '' : c)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                on
                  ? 'bg-[#0A1D37] text-white border-[#0A1D37]'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-[#38BDF8] hover:text-[#0A1D37]'
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="예: 10월 25일 이사 후, 11월 초 평일"
          className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] bg-white"
        />
        <label className="relative shrink-0 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-600 flex items-center gap-1 cursor-pointer hover:border-[#38BDF8]">
          📅 날짜 선택
          <input
            type="date"
            aria-label="청소 희망일 날짜 선택"
            onChange={(e) => e.target.value && onChange(fmtDate(e.target.value))}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
};
