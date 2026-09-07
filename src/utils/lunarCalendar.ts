// Utility to calculate Korean Lunar dates and "손없는 날" (Son-eopneun nal - Auspicious Moving Days)
// In Korean tradition, "손없는 날" are days where the lunar day ends in 9 or 0:
// (음력 9일, 10일, 19일, 20일, 29일, 30일)
// These days are believed to be free of harmful spirits, making them the most popular days for moving (이사) and move-in cleaning (입주청소).

import KoreanLunarCalendarLib from 'korean-lunar-calendar';

// Instantiate reusable calendar instance
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CalendarClass: any = (KoreanLunarCalendarLib as any).default || KoreanLunarCalendarLib;
const lunarCalInstance = typeof CalendarClass === 'function' ? new CalendarClass() : null;

export interface SonEopNeunNalInfo {
  year: number;
  month: number; // 1-indexed (1-12)
  day: number;
  dateString: string; // YYYY-MM-DD
  dayOfWeek: string; // '일' | '월' | '화' | '수' | '목' | '금' | '토'
  isSonEopNeunNal: boolean;
  lunarMonth: number;
  lunarDay: number;
  lunarDateString: string; // e.g. "음 8.9"
  isWeekend: boolean;
}

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

/**
 * Check if a specific solar date is "손없는 날"
 */
export function checkSonEopNeunNal(year: number, month: number, day: number): SonEopNeunNalInfo {
  const date = new Date(year, month - 1, day);
  const dayOfWeek = DAY_NAMES[date.getDay()];
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  let lunarMonth = 1;
  let lunarDay = 1;
  let isSon = false;

  try {
    if (lunarCalInstance && typeof lunarCalInstance.setSolarDate === 'function') {
      lunarCalInstance.setSolarDate(year, month, day);
      const lunar = lunarCalInstance.getLunarCalendar();
      lunarMonth = lunar.month;
      lunarDay = lunar.day;
      // Ends in 9 or 0
      isSon = lunarDay % 10 === 9 || lunarDay % 10 === 0;
    }
  } catch (err) {
    console.warn('Error calculating lunar date:', err);
  }

  return {
    year,
    month,
    day,
    dateString,
    dayOfWeek,
    isSonEopNeunNal: isSon,
    lunarMonth,
    lunarDay,
    lunarDateString: `음 ${lunarMonth}.${lunarDay}`,
    isWeekend
  };
}

/**
 * Get all "손없는 날" for a specific month
 */
export function getMonthlySonEopNeunNal(year: number, month: number): SonEopNeunNalInfo[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const list: SonEopNeunNalInfo[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const info = checkSonEopNeunNal(year, month, d);
    if (info.isSonEopNeunNal) {
      list.push(info);
    }
  }

  return list;
}

/**
 * Get full calendar days structure for a given year & month (1-12)
 * Includes padding for previous and next month to fill 7xN grid
 */
export interface MonthlyCalendarDay extends SonEopNeunNalInfo {
  isCurrentMonth: boolean;
  isToday: boolean;
}

export function getFullMonthGrid(year: number, month: number): MonthlyCalendarDay[] {
  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const firstDayOfWeek = new Date(year, month - 1, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month, 0).getDate();
  const prevMonthDays = new Date(year, month - 1, 0).getDate();

  const grid: MonthlyCalendarDay[] = [];

  // Previous month padding
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const prevDay = prevMonthDays - i;
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const info = checkSonEopNeunNal(prevYear, prevMonth, prevDay);
    grid.push({
      ...info,
      isCurrentMonth: false,
      isToday: info.dateString === todayString
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const info = checkSonEopNeunNal(year, month, d);
    grid.push({
      ...info,
      isCurrentMonth: true,
      isToday: info.dateString === todayString
    });
  }

  // Next month padding to fill complete weeks (multiples of 7)
  const remaining = (7 - (grid.length % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const info = checkSonEopNeunNal(nextYear, nextMonth, d);
    grid.push({
      ...info,
      isCurrentMonth: false,
      isToday: info.dateString === todayString
    });
  }

  return grid;
}
