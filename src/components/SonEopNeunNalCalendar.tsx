import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  getFullMonthGrid,
  getMonthlySonEopNeunNal,
  SonEopNeunNalInfo,
  MonthlyCalendarDay
} from '../utils/lunarCalendar';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
  Info,
  CheckCircle2
} from 'lucide-react';

interface SonEopNeunNalCalendarProps {
  initialYear?: number;
  initialMonth?: number; // 1-12
  compact?: boolean;
  onSelectDate?: (dateString: string) => void;
  className?: string;
  id?: string;
}

export const SonEopNeunNalCalendar: React.FC<SonEopNeunNalCalendarProps> = ({
  initialYear,
  initialMonth,
  compact = false,
  onSelectDate,
  className = '',
  id = 'son-eop-neun-nal-calendar'
}) => {
  const { goToReservationWithService } = useApp();

  const today = useMemo(() => new Date(), []);
  const [currentYear, setCurrentYear] = useState<number>(() => initialYear || today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(() => initialMonth || today.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<SonEopNeunNalInfo | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear((prev) => prev - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear((prev) => prev + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
    setSelectedDay(null);
  };

  const handleToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth() + 1);
    setSelectedDay(null);
  };

  // Data for current month
  const gridDays = useMemo<MonthlyCalendarDay[]>(() => {
    return getFullMonthGrid(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  const auspiciousDays = useMemo<SonEopNeunNalInfo[]>(() => {
    return getMonthlySonEopNeunNal(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  // Handle user date selection
  const handleDayClick = (day: MonthlyCalendarDay) => {
    if (!day.isCurrentMonth) return;
    setSelectedDay(day);
    if (onSelectDate) {
      onSelectDate(day.dateString);
    }
  };

  const handleBookDate = (dateString: string) => {
    goToReservationWithService('move-in');
    // Save chosen date to sessionStorage so ReservationWizard can pick it up
    try {
      sessionStorage.setItem('linkclean_preselected_date', dateString);
    } catch {
      // ignore
    }
  };

  // Quick month choices
  const quickMonths = useMemo(() => {
    const list = [];
    const baseDate = new Date();
    for (let i = 0; i < 4; i++) {
      const d = new Date(baseDate.getFullYear(), baseDate.getMonth() + i, 1);
      list.push({
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        label: `${d.getMonth() + 1}월`
      });
    }
    return list;
  }, []);

  return (
    <div
      id={id}
      className={`bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden transition-all ${className}`}
    >
      {/* Calendar Header */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-[#0A1D37] via-[#0D2444] to-[#0A1D37] text-white relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-900 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                이사 길일 · 손없는 날 달력
              </span>
              <span className="text-[11px] font-medium text-cyan-200 bg-cyan-950/60 border border-cyan-800/60 px-2.5 py-0.5 rounded-full">
                월별 한눈에 보기
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white">
              꼼꼼한 현장 확인 & 월별 손없는 날
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              이사·입주 수요가 가장 집중되는 <strong className="text-amber-300 font-bold">손없는 날(음력 9·0 끝자리)</strong>을 확인하고,
              당일 차질 없는 시공을 위해 <strong>2~3주 전 무료 현장 방문 견적</strong>을 먼저 신청해보세요.
            </p>
          </div>

          {/* Quick Month Switcher Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-700/60 backdrop-blur-sm self-start md:self-auto">
            {quickMonths.map((qm) => {
              const isActive = currentYear === qm.year && currentMonth === qm.month;
              return (
                <button
                  key={`${qm.year}-${qm.month}`}
                  type="button"
                  onClick={() => {
                    setCurrentYear(qm.year);
                    setCurrentMonth(qm.month);
                    setSelectedDay(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#38BDF8] text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {qm.year !== today.getFullYear() ? `${qm.year.toString().slice(2)}년 ` : ''}
                  {qm.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Bar (Month Navigator) */}
        <div className="mt-6 pt-5 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white transition-colors cursor-pointer border border-slate-700 flex items-center justify-center"
              title="이전 달"
              aria-label="이전 달"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-xl sm:text-2xl font-black text-white px-2 tracking-tight min-w-[140px] text-center">
              {currentYear}년 <span className="text-[#38BDF8]">{currentMonth}월</span>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white transition-colors cursor-pointer border border-slate-700 flex items-center justify-center"
              title="다음 달"
              aria-label="다음 달"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleToday}
              className="ml-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
            >
              오늘
            </button>
          </div>

          {/* View Mode Toggle & Auspicious Counter */}
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentMonth}월 손없는 날</span>
              <span className="font-extrabold text-amber-200 ml-0.5">총 {auspiciousDays.length}일</span>
            </div>

            <div className="hidden sm:flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#38BDF8] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                달력형
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-[#38BDF8] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                목록형
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-4 sm:p-8">
        {viewMode === 'grid' ? (
          <div>
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center text-xs font-extrabold">
              <span className="text-rose-500 py-2">일</span>
              <span className="text-slate-600 py-2">월</span>
              <span className="text-slate-600 py-2">화</span>
              <span className="text-slate-600 py-2">수</span>
              <span className="text-slate-600 py-2">목</span>
              <span className="text-slate-600 py-2">금</span>
              <span className="text-blue-600 py-2">토</span>
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {gridDays.map((day, idx) => {
                const isSelected = selectedDay?.dateString === day.dateString;
                const isAuspicious = day.isSonEopNeunNal && day.isCurrentMonth;

                let containerClasses = 'relative p-2 sm:p-3 rounded-2xl transition-all flex flex-col justify-between min-h-[68px] sm:min-h-[86px] ';

                if (!day.isCurrentMonth) {
                  containerClasses += 'bg-slate-50/50 text-slate-300 opacity-40 cursor-default';
                } else if (isAuspicious) {
                  containerClasses += isSelected
                    ? 'bg-amber-100/80 border-2 border-amber-500 ring-2 ring-amber-400/40 shadow-md cursor-pointer '
                    : 'bg-gradient-to-b from-amber-50/90 to-yellow-50/40 border border-amber-300/80 hover:border-amber-400 hover:shadow-md cursor-pointer ';
                } else {
                  containerClasses += isSelected
                    ? 'bg-blue-50 border-2 border-[#38BDF8] shadow-sm cursor-pointer '
                    : 'bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300 cursor-pointer ';
                }

                return (
                  <button
                    key={`${day.dateString}-${idx}`}
                    type="button"
                    onClick={() => handleDayClick(day)}
                    disabled={!day.isCurrentMonth}
                    className={containerClasses}
                  >
                    {/* Top row: day number & today pill */}
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={`text-xs sm:text-sm font-black ${
                          !day.isCurrentMonth
                            ? 'text-slate-300'
                            : day.dayOfWeek === '일'
                            ? 'text-rose-600'
                            : day.dayOfWeek === '토'
                            ? 'text-blue-600'
                            : 'text-[#0A1D37]'
                        }`}
                      >
                        {day.day}
                      </span>

                      {day.isToday && (
                        <span className="text-[9px] font-black bg-[#0A1D37] text-white px-1.5 py-0.2 rounded-md">
                          오늘
                        </span>
                      )}
                    </div>

                    {/* Middle: Lunar date indicator */}
                    {day.isCurrentMonth && (
                      <div className="text-[10px] text-slate-400 font-medium text-left">
                        {day.lunarDateString}
                      </div>
                    )}

                    {/* Bottom: Son-eop-neun-nal Badge */}
                    {isAuspicious ? (
                      <div className="mt-1 w-full">
                        <span className="block text-center py-0.5 sm:py-1 px-1 rounded-lg text-[9px] sm:text-[10px] font-black bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-900 shadow-xs leading-none">
                          손없는날 ✨
                        </span>
                      </div>
                    ) : (
                      <div className="h-4 sm:h-5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* List View */
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-amber-500" />
              {currentYear}년 {currentMonth}월 손없는 날 상세 목록 ({auspiciousDays.length}일)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {auspiciousDays.map((day) => (
                <div
                  key={day.dateString}
                  onClick={() => setSelectedDay(day)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedDay?.dateString === day.dateString
                      ? 'bg-amber-50 border-amber-400 shadow-sm'
                      : 'bg-white hover:bg-slate-50 border-slate-200/90'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-700 font-black flex flex-col items-center justify-center text-xs leading-tight">
                      <span>{day.day}일</span>
                      <span className="text-[10px] font-normal">({day.dayOfWeek})</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#0A1D37]">
                          {day.year}.{day.month}.{day.day}
                        </span>
                        {day.isWeekend && (
                          <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.2 rounded-md">
                            주말
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500">{day.lunarDateString} (길일)</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookDate(day.dateString);
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#0A1D37] hover:bg-[#38BDF8] text-white transition-colors cursor-pointer"
                  >
                    방문예약
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Day Action Box */}
        {selectedDay && (
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-sm shrink-0">
                {selectedDay.day}일
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h5 className="text-sm font-extrabold text-[#0A1D37]">
                    {selectedDay.year}년 {selectedDay.month}월 {selectedDay.day}일 ({selectedDay.dayOfWeek}요일)
                  </h5>
                  {selectedDay.isSonEopNeunNal ? (
                    <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                      손없는 날 ✨
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">
                      일반일
                    </span>
                  )}
                  <span className="text-xs text-slate-500">({selectedDay.lunarDateString})</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  {selectedDay.isSonEopNeunNal
                    ? '이사 및 입주청소 문의가 많은 날입니다. 사전 방문 실측으로 일정을 선점하세요.'
                    : '꼼꼼한 현장 확인을 통해 맞춤 청소 범위를 산정해 드립니다.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleBookDate(selectedDay.dateString)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0A1D37] hover:bg-[#02b350] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>이 날짜로 방문견적 예약</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Month Summary Chips */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold text-[#0A1D37] flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {currentMonth}월 손없는 날 빠른 확인
              </span>
              <div className="flex flex-wrap gap-2">
                {auspiciousDays.map((d) => (
                  <button
                    key={d.dateString}
                    type="button"
                    onClick={() => {
                      setSelectedDay(d);
                      setViewMode('grid');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                      selectedDay?.dateString === d.dateString
                        ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-xs'
                        : 'bg-white hover:bg-amber-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>{d.month}/{d.day}({d.dayOfWeek})</span>
                    <span className="text-[10px] text-slate-400 font-normal">[{d.lunarDay}일]</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => goToReservationWithService('move-in')}
              className="px-6 py-3 rounded-xl bg-[#38BDF8] hover:bg-sky-500 text-white font-extrabold text-xs transition-all shadow-sm inline-flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <CalendarIcon className="w-4 h-4" />
              <span>무료 방문 견적 신청하기</span>
            </button>
          </div>
        </div>

        {/* Why "꼼꼼한 현장 확인" is vital before moving days */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200/70">
            <h4 className="text-xs sm:text-sm font-extrabold text-[#0A1D37] flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
              왜 손없는 날 전에 ‘꼼꼼한 현장 확인’이 필수일까요?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
              <div className="space-y-1">
                <strong className="text-[#0A1D37] font-bold block flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  이사 당일 추가금 분쟁 100% 방지
                </strong>
                <p className="leading-relaxed text-slate-500">
                  현장을 미리 보지 않고 유선으로만 견적을 내면 시공 당일 찌든 오염이나 구조적 이유로 추가 요금이 발생할 수 있습니다. 링크클린은 사전에 직접 방문해 확정 금액을 약속합니다.
                </p>
              </div>
              <div className="space-y-1">
                <strong className="text-[#0A1D37] font-bold block flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  손없는 날 조기 예약 마감 대비
                </strong>
                <p className="leading-relaxed text-slate-500">
                  손없는 날은 이삿짐센터와 청소 전문팀의 예약이 평일보다 3배 이상 빠릅니다. 최소 2~3주 전 방문 실측으로 원하는 일정을 안전하게 선점하세요.
                </p>
              </div>
              <div className="space-y-1">
                <strong className="text-[#0A1D37] font-bold block flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  공간별 맞춤 약품 및 전용 장비 배치
                </strong>
                <p className="leading-relaxed text-slate-500">
                  오염도(욕실 스케일, 주방 후드 기름때, 창틀 묵은 때 등)를 직접 파악하여 현장에 딱 맞는 친환경 약품과 스팀 살균 장비를 완벽히 준비합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
