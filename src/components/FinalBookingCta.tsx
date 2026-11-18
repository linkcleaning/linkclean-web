import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Calendar, PhoneCall, MessageCircle, Plane } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TEAMS_PER_DAY, getScheduledTeams, BOOKING_FLOW_TEXT } from '../data/bookingProcess';
import { checkSonEopNeunNal } from '../utils/lunarCalendar';

/**
 * 홈 맨 아래 마무리 칸 — 공항 출발 안내판 스타일의 "앞으로 열흘 청소 예약 현황".
 * 줄을 누르면 그 날짜로 바로 예약. 예약 화면 달력과 같은 규칙(하루 2팀)을 씁니다.
 * 화면에 보이는 순간 글자가 공항 안내판처럼 '착착' 넘어가며 나타납니다.
 */
const DOW = ['일', '월', '화', '수', '목', '금', '토'];
const DOW_EN = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MON_EN = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];
const pad = (n: number) => String(n).padStart(2, '0');
const DAYS = 10;

const POOL_LATIN = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const POOL_KO = '가나다라마바사아자차카타파하청소예약입주이사';

/** 공항 안내판처럼 글자가 넘어가다 멈추는 글씨 */
const Flap: React.FC<{ text: string; run: boolean; delay?: number; className?: string }> = ({ text, run, delay = 0, className }) => {
  const [shown, setShown] = useState(text);
  useEffect(() => {
    if (!run) return;
    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setShown(text);
      return;
    }
    let frame = 0;
    const total = 9 + Math.floor(text.length * 1.2);
    let timer: number | undefined;
    const start = window.setTimeout(() => {
      timer = window.setInterval(() => {
        frame++;
        const settled = Math.floor((frame / total) * text.length);
        let out = '';
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          if (i < settled || ch === ' ' || ch === '·' || ch === '/' || ch === ':') out += ch;
          else if (/[가-힣]/.test(ch)) out += POOL_KO[Math.floor(Math.random() * POOL_KO.length)];
          else out += POOL_LATIN[Math.floor(Math.random() * POOL_LATIN.length)];
        }
        setShown(out);
        if (frame >= total) {
          window.clearInterval(timer);
          setShown(text);
        }
      }, 55);
    }, delay);
    return () => {
      window.clearTimeout(start);
      if (timer) window.clearInterval(timer);
    };
  }, [text, run, delay]);
  return <span className={className}>{shown}</span>;
};

export const FinalBookingCta: React.FC<{ onReserve: () => void }> = ({ onReserve }) => {
  const { reservations, timeSlotConfigs } = useApp();
  const boardRef = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 15000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    const el = boardRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setRun(true);
      return;
    }
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setRun(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const days = useMemo(() => {
    const out: { date: string; m: number; d: number; dow: number; left: number; son: boolean }[] = [];
    const base = new Date();
    for (let i = 1; i <= DAYS; i++) {
      const t = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
      const date = `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`;
      const son = checkSonEopNeunNal(t.getFullYear(), t.getMonth() + 1, t.getDate()).isSonEopNeunNal;
      const cfg = timeSlotConfigs[date];
      const mine = reservations.filter((r) => r.visit_date === date && r.status !== 'CANCELLED').length;
      const left = cfg?.isHoliday || cfg?.isClosed ? 0 : Math.max(0, TEAMS_PER_DAY - getScheduledTeams(date, son) - mine);
      out.push({ date, m: t.getMonth() + 1, d: t.getDate(), dow: t.getDay(), left, son });
    }
    return out;
  }, [reservations, timeSlotConfigs]);

  const openCount = days.filter((x) => x.left > 0).length;

  const pick = (date: string) => {
    try {
      sessionStorage.setItem('linkclean_preselected_date', date);
    } catch {
      // ignore
    }
    onReserve();
  };

  const flapFont = { fontFamily: '"Do Hyeon", "Pretendard", sans-serif' } as const;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl sm:rounded-3xl bg-[#101114] p-2.5 sm:p-4 border-[7px] border-[#2B2D31] shadow-[0_10px_30px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]">
        {/* 위: 안내판 머리글 */}
        <div className="flex items-center justify-between gap-2 rounded-t-lg bg-[#1C1E22] px-3 py-2 sm:px-4">
          <div className="flex items-center gap-2 min-w-0">
            <span className="grid h-7 w-7 sm:h-8 sm:w-8 shrink-0 place-items-center rounded bg-[#2CC4A8]">
              <Plane className="h-4 w-4 sm:h-5 sm:w-5 text-[#101114] -rotate-12" />
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-[15px] sm:text-xl text-white" style={flapFont}>
                링크클린 청소 출발 안내
              </p>
              <p className="truncate text-[9px] sm:text-[11px] font-semibold tracking-[0.18em] text-slate-400">LINKCLEAN DEPARTURES · 하루 2팀</p>
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 shrink-0" style={flapFont}>
            <span className="text-[11px] sm:text-sm text-[#FF6B4A]">
              {MON_EN[now.getMonth()]} {now.getDate()}
            </span>
            <span className="text-2xl sm:text-4xl leading-none text-[#FF6B4A] tabular-nums">
              {pad(now.getHours())}:{pad(now.getMinutes())}
            </span>
          </div>
        </div>

        {/* 표 */}
        <div ref={boardRef} className="bg-[#16181F] rounded-b-lg overflow-hidden" style={flapFont}>
          <div className="grid grid-cols-[4.6rem_1fr_3rem_5.6rem] sm:grid-cols-[6.5rem_1fr_7rem_4.5rem_8.5rem] items-end gap-x-2 px-3 sm:px-4 pt-2 pb-1 text-[10px] sm:text-xs text-[#C9CEDB]">
            <span>날짜 Date</span>
            <span>행선지 To</span>
            <span className="hidden sm:block">편명 Flight</span>
            <span className="text-center">남은 팀</span>
            <span>상태 Remarks</span>
          </div>
          <ul>
            {days.map((x, i) => {
              const full = x.left <= 0;
              const status = full
                ? { ko: '마감', en: 'CLOSED', cls: 'text-[#7C8294]' }
                : x.left === 1
                  ? { ko: '마감임박', en: 'FINAL CALL', cls: 'text-[#FFB547]' }
                  : { ko: '예약가능', en: 'ON TIME', cls: 'text-[#3EE0A0]' };
              const flight = `LC${pad(x.m)}${pad(x.d)}`;
              const dayCls = x.dow === 0 ? 'text-[#FF8A7A]' : x.dow === 6 ? 'text-[#7FB8FF]' : '';
              return (
                <li key={x.date}>
                  <button
                    type="button"
                    disabled={full}
                    onClick={() => pick(x.date)}
                    className={`w-full grid grid-cols-[4.6rem_1fr_3rem_5.6rem] sm:grid-cols-[6.5rem_1fr_7rem_4.5rem_8.5rem] items-center gap-x-2 px-3 sm:px-4 py-1.5 sm:py-2 text-left border-t border-black/40 transition-colors ${
                      i % 2 ? 'bg-[#1C1F29]' : 'bg-[#16181F]'
                    } ${full ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-[#262A36]'}`}
                  >
                    <span className={`text-[15px] sm:text-xl tabular-nums ${full ? 'text-[#8A8F9E]' : 'text-[#F4E3B1]'}`}>
                      <Flap text={`${x.m}/${x.d}`} run={run} delay={i * 70} />{' '}
                      <span className={`text-[12px] sm:text-base ${dayCls}`}>{DOW[x.dow]}</span>
                    </span>
                    <span className={`min-w-0 truncate text-[15px] sm:text-xl ${full ? 'text-[#8A8F9E]' : 'text-[#F4E3B1]'}`}>
                      <span className="sm:hidden"><Flap text="제주" run={run} delay={i * 70 + 40} /></span>
                      <span className="hidden sm:inline"><Flap text="제주 전지역" run={run} delay={i * 70 + 40} /></span>
                      {x.son && (
                        <span className="ml-1.5 inline-block align-middle rounded-sm bg-[#F5D547] px-1 text-[10px] sm:text-xs leading-4 text-[#141826]">
                          손없는날
                        </span>
                      )}
                      <span className="hidden sm:inline ml-2 text-[11px] text-[#8A8F9E] tracking-wider">{DOW_EN[x.dow]}</span>
                    </span>
                    <span className={`hidden sm:block text-xl tabular-nums tracking-wide ${full ? 'text-[#8A8F9E]' : 'text-[#F4E3B1]'}`}>
                      <Flap text={flight} run={run} delay={i * 70 + 80} />
                    </span>
                    <span className="flex justify-center">
                      <span
                        className={`min-w-[2rem] rounded-sm px-1.5 text-center text-[17px] sm:text-xl leading-6 sm:leading-7 tabular-nums ${
                          full ? 'bg-[#33363D] text-[#8A8F9E]' : 'bg-[#F4E3B1] text-[#141826]'
                        }`}
                      >
                        {x.left}
                      </span>
                    </span>
                    <span className={`leading-tight ${status.cls}`}>
                      <span className="block text-[15px] sm:text-xl">
                        <Flap text={status.ko} run={run} delay={i * 70 + 120} />
                      </span>
                      <span className="block text-[9px] sm:text-[11px] tracking-[0.12em] opacity-80">{status.en}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 아래: 안내 + 버튼 */}
        <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center px-1 sm:px-2 pb-1">
          <div className="text-center lg:text-left">
            <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white leading-snug">
              원하는 날짜, 비어 있을 때 먼저 잡으세요.
            </h2>
            <p className="mt-1 text-[11px] sm:text-sm text-slate-400">
              앞으로 {DAYS}일 중 <b className="text-[#3EE0A0]">{openCount}일</b> 예약 가능 · 줄을 누르면 그 날짜로 바로 예약돼요. 신청만으로는 비용이 없어요.
            </p>
            <p className="mt-0.5 text-[10px] text-slate-500">{BOOKING_FLOW_TEXT}</p>
          </div>
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 lg:w-[22rem]">
            <button
              type="button"
              onClick={onReserve}
              className="py-2.5 rounded-xl bg-[#3EE0A0] hover:bg-[#2CC4A8] text-[#101114] font-black text-xs sm:text-sm inline-flex items-center justify-center gap-1 cursor-pointer"
              id="final-cta-reserve-btn"
            >
              <Calendar className="w-4 h-4" /> 청소 예약
            </button>
            <a
              href="tel:064-763-4545"
              className="py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-1"
            >
              <PhoneCall className="w-4 h-4 text-[#3EE0A0]" /> 전화
            </a>
            <a
              href="https://pf.kakao.com/_xfxdrxmM?from=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 rounded-xl bg-[#FEE500] text-[#371D1E] font-black text-xs sm:text-sm inline-flex items-center justify-center gap-1"
            >
              <MessageCircle className="w-4 h-4 fill-[#371D1E]" /> 카톡
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
