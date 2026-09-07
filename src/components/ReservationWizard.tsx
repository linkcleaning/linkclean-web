import React, { useState, useMemo } from 'react';
import { useApp, STANDARD_TIME_SLOTS, isSeptemberDate } from '../context/AppContext';
import { ServiceType, PropertyType, Reservation } from '../types';
import { checkSonEopNeunNal } from '../utils/lunarCalendar';
import {
  Calendar as CalendarIcon,
  Clock,
  Home,
  User,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  Sparkles,
  Phone,
  ShieldCheck,
  Building,
  Check
} from 'lucide-react';

const SERVICE_OPTIONS: { id: ServiceType; name: string; desc: string; icon: string }[] = [
  { id: 'move-in', name: '입주·이사청소', desc: '새 공간의 시공 분진 및 이전 거주자 묵은 오염 완벽 제거', icon: '🏡' },
  { id: 'residential', name: '거주청소', desc: '생활 중 쌓인 찌든 때, 주방 기름때, 화장실 곰팡이 딥케어', icon: '🛋️' },
  { id: 'commercial', name: '상가청소', desc: '카페, 식당, 매장의 첫인상을 높이는 바닥 왁스 및 쇼윈도우 케어', icon: '☕' },
  { id: 'office', name: '사무실청소', desc: '직원의 쾌적한 업무 몰입을 위한 카페트, 파티션, 사옥 관리', icon: '🏢' },
  { id: 'partial', name: '부분청소', desc: '주방, 욕실, 창틀 등 필요한 공간만 골라 진행하는 알뜰 맞춤 케어', icon: '✨' },
  { id: 'trash', name: '쓰레기집청소', desc: '대량 폐기물 분리 배출 및 악취 탈취, 100% 비밀보장 특수 정리', icon: '🧹' },
];

const PROPERTY_TYPES: PropertyType[] = [
  '아파트',
  '빌라',
  '원룸/오피스텔',
  '주택',
  '상가',
  '사무실',
  '기타'
];

export const ReservationWizard: React.FC = () => {
  const {
    createReservation,
    isSlotAvailable,
    currentUser,
    setCurrentView,
    preselectedReservationService,
    timeSlotConfigs
  } = useApp();

  // Wizard Step: 1 -> 2 -> 3 -> 4 -> 5 -> 6(Confirmed)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    try {
      const pre = sessionStorage.getItem('linkclean_preselected_date');
      if (pre) {
        sessionStorage.removeItem('linkclean_preselected_date');
        return pre;
      }
    } catch {
      // ignore
    }
    // default to tomorrow
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });

  const [selectedTime, setSelectedTime] = useState<string>('');
  const [serviceType, setServiceType] = useState<ServiceType>(preselectedReservationService || 'move-in');
  const [propertyType, setPropertyType] = useState<PropertyType>('아파트');
  const [area, setArea] = useState<string>('30평');
  const [address, setAddress] = useState<string>('');
  const [addressDetail, setAddressDetail] = useState<string>('');
  const [customerMessage, setCustomerMessage] = useState<string>('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // Customer info
  const [customerName, setCustomerName] = useState<string>(currentUser?.name || '');
  const [phone, setPhone] = useState<string>(currentUser?.phone || '');
  const [email, setEmail] = useState<string>(currentUser?.email || '');
  const [agreePrivacy, setAgreePrivacy] = useState<boolean>(true);
  const [agreeContact, setAgreeContact] = useState<boolean>(true);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [completedReservation, setCompletedReservation] = useState<Reservation | null>(null);

  // Calendar navigation state (Year and Month)
  const today = useMemo(() => new Date(), []);
  const [calendarYear, setCalendarYear] = useState(() => {
    try {
      const parts = selectedDate.split('-');
      if (parts.length === 3) return parseInt(parts[0], 10);
    } catch {
      // fallback
    }
    return today.getFullYear();
  });
  const [calendarMonth, setCalendarMonth] = useState(() => {
    try {
      const parts = selectedDate.split('-');
      if (parts.length === 3) return parseInt(parts[1], 10) - 1;
    } catch {
      // fallback
    }
    return today.getMonth();
  }); // 0-indexed

  // Auto-select first available time slot if current selectedTime is empty or unavailable
  React.useEffect(() => {
    if (!selectedTime || !isSlotAvailable(selectedDate, selectedTime)) {
      const firstAvailable = STANDARD_TIME_SLOTS.find((s) => isSlotAvailable(selectedDate, s));
      if (firstAvailable) {
        setSelectedTime(firstAvailable);
      }
    }
  }, [selectedDate, isSlotAvailable, selectedTime]);

  // Generate days in month for calendar
  const calendarDays = useMemo(() => {
    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const prevMonthDays = new Date(calendarYear, calendarMonth, 0).getDate();

    const days: {
      dateString: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isPast: boolean;
      isSelectable: boolean;
      isAllFull: boolean;
      isHoliday: boolean;
      isSonEopNeunNal: boolean;
    }[] = [];

    // Prev month padding
    for (let i = firstDay - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      const prevDate = new Date(calendarYear, calendarMonth - 1, dayNum);
      const dateString = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      days.push({
        dateString,
        dayNumber: dayNum,
        isCurrentMonth: false,
        isPast: true,
        isSelectable: false,
        isAllFull: false,
        isHoliday: false,
        isSonEopNeunNal: false
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateString = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const thisDate = new Date(calendarYear, calendarMonth, d);
      const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isPast = thisDate <= todayZero; // Same-day or past is not allowed for on-site estimator scheduling

      const config = timeSlotConfigs[dateString];
      const isHoliday = !!config?.isHoliday;

      // Check if all standard slots are unavailable
      const hasAnyAvailableSlot = !isHoliday && STANDARD_TIME_SLOTS.some((slot) => isSlotAvailable(dateString, slot));
      const isAllFull = !isPast && !hasAnyAvailableSlot;
      const isSelectable = !isPast && !isHoliday && hasAnyAvailableSlot;

      const sonInfo = checkSonEopNeunNal(calendarYear, calendarMonth + 1, d);

      days.push({
        dateString,
        dayNumber: d,
        isCurrentMonth: true,
        isPast,
        isSelectable,
        isAllFull,
        isHoliday,
        isSonEopNeunNal: sonInfo.isSonEopNeunNal
      });
    }

    // Next month padding to fill 35 or 42 grid cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let n = 1; n <= remaining; n++) {
      const nextDate = new Date(calendarYear, calendarMonth + 1, n);
      const dateString = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(n).padStart(2, '0')}`;
      days.push({
        dateString,
        dayNumber: n,
        isCurrentMonth: false,
        isPast: false,
        isSelectable: false,
        isAllFull: false,
        isHoliday: false,
        isSonEopNeunNal: false
      });
    }

    return days;
  }, [calendarYear, calendarMonth, today, timeSlotConfigs, isSlotAvailable]);

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarYear((prev) => prev - 1);
      setCalendarMonth(11);
    } else {
      setCalendarMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarYear((prev) => prev + 1);
      setCalendarMonth(0);
    } else {
      setCalendarMonth((prev) => prev + 1);
    }
  };

  // Image Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setUploadedImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Form Validation per step
  const canProceedStep1 = selectedDate && selectedTime;
  const canProceedStep2 = !!serviceType;
  const canProceedStep3 = propertyType && area.trim() && address.trim();
  const canProceedStep4 = customerName.trim() && phone.trim() && email.trim() && agreePrivacy && agreeContact;

  // Submit Final Reservation
  const handleSubmitReservation = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await createReservation({
        user_id: currentUser ? currentUser.id : 'guest',
        customer_name: customerName,
        phone,
        email,
        service_type: serviceType,
        visit_date: selectedDate,
        visit_time: selectedTime,
        address,
        address_detail: addressDetail,
        property_type: propertyType,
        area,
        customer_message: customerMessage,
        uploaded_images: uploadedImages
      });

      if (result.success && result.reservation) {
        setCompletedReservation(result.reservation);
        setCurrentStep(6); // Step 6: Confirmation Screen
      } else {
        setSubmitError(result.error || '예약 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } catch {
      setSubmitError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 6: Completed view
  if (currentStep === 6 && completedReservation) {
    const serviceName = SERVICE_OPTIONS.find((s) => s.id === completedReservation.service_type)?.name || completedReservation.service_type;

    return (
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-8 sm:p-12 text-center animate-in fade-in duration-300">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6 ring-8 ring-emerald-50/50">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A1D37] tracking-tight mb-2">
            방문 견적 신청이 완료되었습니다.
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-8 max-w-md mx-auto">
            신청하신 내용을 담당자가 확인한 후 입력하신 연락처로 방문 일정을 신속히 안내드립니다.
          </p>

          {/* Reservation Details Box */}
          <div className="bg-slate-50/80 border border-slate-100 rounded-3xl p-6 text-left space-y-3.5 mb-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 text-xs sm:text-sm">
              <span className="text-slate-500 font-medium">예약 번호</span>
              <span className="font-mono font-bold text-[#38BDF8] bg-[#0A1D37] px-3 py-1 rounded-full text-xs">
                {completedReservation.reservation_id}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-slate-500 font-medium">방문 예정 일시</span>
              <span className="font-extrabold text-[#0A1D37]">
                {completedReservation.visit_date} {completedReservation.visit_time}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-slate-500 font-medium">신청 서비스</span>
              <span className="font-bold text-[#0A1D37]">{serviceName}</span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-slate-500 font-medium">공간 정보</span>
              <span className="font-semibold text-slate-700">
                {completedReservation.property_type} ({completedReservation.area})
              </span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-slate-500 font-medium">예약자 / 연락처</span>
              <span className="font-semibold text-slate-700">
                {completedReservation.customer_name} ({completedReservation.phone})
              </span>
            </div>
          </div>

          {/* Notice Banner */}
          <div className="bg-amber-50/80 border border-amber-200/60 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3 text-left mb-8">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block text-amber-950 mb-0.5">중요 안내</strong>
              예약 신청은 담당자 확인 후 최종 확정되며, 기재해주신 전화번호로 사전 연락을 드립니다.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setCurrentView('mypage')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#38BDF8] hover:bg-[#0EA5E9] text-white font-extrabold text-sm shadow-sm transition-all cursor-pointer"
              id="confirm-go-to-mypage-btn"
            >
              내 예약 확인 (마이페이지)
            </button>
            <button
              onClick={() => setCurrentView('home')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-slate-200 hover:bg-slate-50 text-[#0A1D37] font-bold text-sm transition-all cursor-pointer"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          실시간 방문견적 간편 예약
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0A1D37] tracking-tight">
          방문 견적 예약 신청
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-xl mx-auto leading-relaxed">
          원하는 날짜와 시간을 직접 선택하세요. 현장을 직접 확인하고 투명한 견적을 안내해드립니다.
        </p>
      </div>

      {/* 5-Step Stepper Progress Bar */}
      <div className="mb-8 sm:mb-10">
        <div className="grid grid-cols-5 gap-1.5 sm:gap-3 text-center">
          {[
            { step: 1, label: '날짜/시간', icon: CalendarIcon },
            { step: 2, label: '서비스', icon: Sparkles },
            { step: 3, label: '공간정보', icon: Home },
            { step: 4, label: '고객정보', icon: User },
            { step: 5, label: '예약확인', icon: CheckCircle2 }
          ].map((item) => {
            const isCompleted = currentStep > item.step;
            const isCurrent = currentStep === item.step;

            return (
              <div key={item.step} className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${
                    isCompleted
                      ? 'bg-[#0A1D37] text-white shadow-xs'
                      : isCurrent
                      ? 'bg-[#38BDF8] text-white ring-4 ring-[#38BDF8]/20 shadow-sm'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : item.step}
                </div>
                <span
                  className={`text-[11px] sm:text-xs font-bold mt-1.5 whitespace-nowrap ${
                    isCurrent ? 'text-[#0A1D37]' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
        {/* Track bar */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-[#38BDF8] h-full transition-all duration-300"
            style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Form Body */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-10">
        {/* STEP 01: 날짜 & 시간 선택 */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0A1D37] tracking-tight">
                ① 방문을 원하는 날짜와 시간을 선택해주세요.
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                신축 입주 및 이사 일정에 맞추어 원하는 일시를 선택하실 수 있습니다.
              </p>
            </div>

            {/* Calendar Controls */}
            <div className="bg-slate-50/70 border border-slate-100 rounded-3xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/70">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-2 rounded-full hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="text-base sm:text-lg font-extrabold text-[#0A1D37]">
                  {calendarYear}년 {calendarMonth + 1}월
                </div>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-2 rounded-full hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Day of Week Headers */}
              <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-400 mb-2">
                <span className="text-red-500">일</span>
                <span>월</span>
                <span>화</span>
                <span>수</span>
                <span>목</span>
                <span>금</span>
                <span className="text-blue-600">토</span>
              </div>

              {/* Calendar Days Grid */}
              <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center">
                {calendarDays.map((day, idx) => {
                  const isSelected = selectedDate === day.dateString;

                  let buttonStyles = 'bg-white text-slate-700 hover:bg-blue-50 border border-slate-200/80';
                  if (!day.isCurrentMonth) {
                    buttonStyles = 'bg-transparent text-slate-300 cursor-not-allowed border-transparent';
                  } else if (day.isPast) {
                    buttonStyles = 'bg-slate-100/50 text-slate-300 cursor-not-allowed border-transparent line-through';
                  } else if (day.isHoliday) {
                    buttonStyles = 'bg-red-50 text-red-300 cursor-not-allowed border-red-100';
                  } else if (day.isAllFull) {
                    buttonStyles = 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200';
                  } else if (isSelected) {
                    buttonStyles = 'bg-[#0A1D37] text-white font-bold ring-2 ring-[#38BDF8] shadow-sm border-[#0A1D37]';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={!day.isSelectable}
                      onClick={() => {
                        setSelectedDate(day.dateString);
                        // reset or pick available time slot for newly selected date
                        if (!selectedTime || !isSlotAvailable(day.dateString, selectedTime)) {
                          const firstAvailable = STANDARD_TIME_SLOTS.find((s) => isSlotAvailable(day.dateString, s));
                          setSelectedTime(firstAvailable || '');
                        }
                      }}
                      className={`h-11 sm:h-13 rounded-2xl flex flex-col items-center justify-center text-xs sm:text-sm font-semibold transition-all relative cursor-pointer ${buttonStyles}`}
                    >
                      <span className="relative z-10">{day.dayNumber}</span>
                      {day.isSonEopNeunNal && day.isCurrentMonth && (
                        <span
                          className={`text-[8px] font-black px-1 rounded-sm leading-none mt-0.5 ${
                            isSelected
                              ? 'bg-amber-400 text-slate-950 font-black'
                              : 'bg-amber-100 text-amber-800 border border-amber-300/70'
                          }`}
                          title="손없는 날 (이사 길일)"
                        >
                          손
                        </span>
                      )}
                      {day.isHoliday && (
                        <span className="text-[9px] text-red-400 font-normal">휴무</span>
                      )}
                      {day.isAllFull && (
                        <span className="text-[9px] text-slate-400 font-normal">마감</span>
                      )}
                      {isSelected && !day.isSonEopNeunNal && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Calendar Legend */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-4 pt-3 border-t border-slate-200/70">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#0A1D37]" />
                  <span>선택 날짜</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-black px-1 rounded-sm bg-amber-400 text-slate-950">손</span>
                  <span className="text-amber-700 font-bold">손없는 날 (이사 길일)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white border border-slate-300" />
                  <span>예약 가능</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-slate-200" />
                  <span>마감 / 예약 불가</span>
                </div>
              </div>
            </div>

            {/* Time Slot Selection (Section 21) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-extrabold text-[#0A1D37] text-sm sm:text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#38BDF8]" />
                  방문 희망 시간 선택 ({selectedDate})
                </h3>
                <span className="text-xs text-slate-500">마감된 시간대는 선택이 제한됩니다.</span>
              </div>

              {/* 9월 한정: 하루 2타임 오픈 안내 */}
              {isSeptemberDate(selectedDate) && (
                <div className="mb-3 px-3.5 py-2.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-amber-800 bg-amber-200/90 px-2 py-0.5 rounded text-[11px] whitespace-nowrap">
                      9월 예약 정책
                    </span>
                    <span className="text-slate-700 font-medium">
                      현장 정밀 실측과 작업 품질을 위해 <strong className="text-amber-950 font-bold">하루 2타임(오전/오후)</strong>만 오픈됩니다.
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-amber-700 whitespace-nowrap">
                    (선택 가능 외 나머지 5개 시간대는 예약마감)
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {STANDARD_TIME_SLOTS.map((time) => {
                  const available = isSlotAvailable(selectedDate, time);
                  const isSelected = selectedTime === time;

                  return (
                    <button
                      key={time}
                      type="button"
                      disabled={!available}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 px-3 rounded-2xl border text-xs sm:text-sm font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                        !available
                          ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-75'
                          : isSelected
                          ? 'bg-[#0A1D37] border-[#0A1D37] text-white shadow-sm ring-2 ring-[#38BDF8]'
                          : 'bg-white border-slate-100 text-[#0A1D37] hover:border-[#38BDF8]/50 hover:bg-blue-50/40 shadow-xs'
                      }`}
                    >
                      <span className="text-sm sm:text-base">{time}</span>
                      <span className={`text-[10px] mt-0.5 font-medium ${
                        !available ? 'text-red-500 font-bold' : isSelected ? 'text-[#38BDF8]' : 'text-emerald-600'
                      }`}>
                        {!available ? '예약마감' : '예약가능'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 1 Actions */}
            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                disabled={!canProceedStep1}
                onClick={() => setCurrentStep(2)}
                className="px-8 py-3.5 rounded-full bg-[#38BDF8] hover:bg-[#0EA5E9] disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                id="wizard-step-1-next-btn"
              >
                다음: 서비스 선택
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 02: 서비스 선택 */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0A1D37] tracking-tight">
                ② 어떤 청소가 필요하신가요?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                원하시는 서비스를 선택하시면 현장 진단 및 특화 약품을 사전에 세팅합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {SERVICE_OPTIONS.map((svc) => {
                const isSelected = serviceType === svc.id;

                return (
                  <button
                    key={svc.id}
                    type="button"
                    onClick={() => setServiceType(svc.id)}
                    className={`p-5 rounded-3xl border text-left transition-all relative cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/50 border-[#38BDF8] ring-2 ring-[#38BDF8]/40 shadow-sm'
                        : 'bg-white border-slate-100 hover:border-[#38BDF8]/40 hover:bg-slate-50/50 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="text-2xl p-2.5 rounded-2xl bg-slate-50 shadow-xs border border-slate-100">
                        {svc.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-extrabold text-[#0A1D37] text-base">{svc.name}</h3>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-[#38BDF8] text-white flex items-center justify-center">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{svc.desc}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 rounded-full border border-slate-200 text-[#0A1D37] font-bold text-xs sm:text-sm hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                이전 단계
              </button>
              <button
                type="button"
                disabled={!canProceedStep2}
                onClick={() => setCurrentStep(3)}
                className="px-8 py-3.5 rounded-full bg-[#38BDF8] hover:bg-[#0EA5E9] disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                id="wizard-step-2-next-btn"
              >
                다음: 공간정보 입력
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 03: 공간정보 */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0A1D37] tracking-tight">
                ③ 청소하실 공간을 알려주세요.
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                정확한 현장 방문과 정확한 견적 산출을 위한 기초 정보입니다.
              </p>
            </div>

            {/* Property Type Selection */}
            <div>
              <label className="block text-xs font-extrabold text-[#0A1D37] mb-2">
                건물 유형 <span className="text-[#38BDF8]">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {PROPERTY_TYPES.map((pt) => (
                  <button
                    key={pt}
                    type="button"
                    onClick={() => setPropertyType(pt)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      propertyType === pt
                        ? 'bg-[#0A1D37] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {pt}
                  </button>
                ))}
              </div>
            </div>

            {/* Area & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-[#0A1D37] mb-1.5">
                  공급 면적 (평수) <span className="text-[#38BDF8]">*</span>
                </label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="예: 24평, 34평, 50평"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-[#38BDF8]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-extrabold text-[#0A1D37] mb-1.5">
                  기본 주소 <span className="text-[#38BDF8]">*</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="예: 서귀포시 서호남로 91"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-[#38BDF8]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#0A1D37] mb-1.5">
                상세 주소 (동/호수/층수)
              </label>
              <input
                type="text"
                value={addressDetail}
                onChange={(e) => setAddressDetail(e.target.value)}
                placeholder="예: 104동 1201호 (방문 견적을 위해 필요합니다)"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-[#38BDF8]"
              />
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-xs font-extrabold text-[#0A1D37] mb-1.5">
                청소 공간에 대한 요청사항 및 특이사항
              </label>
              <textarea
                rows={3}
                value={customerMessage}
                onChange={(e) => setCustomerMessage(e.target.value)}
                placeholder="예: 베란다 곰팡이가 심한 편입니다, 싱크대 후드 기름때 중점 확인 부탁드립니다, 신축 분진이 많습니다 등"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-[#38BDF8] resize-none"
              />
            </div>

            {/* Multi Photo Attachment */}
            <div>
              <label className="block text-xs font-extrabold text-[#0A1D37] mb-1.5">
                현장 사진 첨부 (선택 사항, 여러 장 가능)
              </label>
              <p className="text-xs text-slate-500 mb-3">
                오염 상태나 구조 사진을 미리 첨부해주시면 더욱 정확한 진단에 도움이 됩니다.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <label className="cursor-pointer flex flex-col items-center justify-center w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#38BDF8] bg-slate-50 hover:bg-blue-50/30 text-slate-500 transition-colors">
                  <Upload className="w-5 h-5 text-slate-400 mb-1" />
                  <span className="text-[11px] font-bold">사진 추가</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {uploadedImages.map((img, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-100 shadow-xs group">
                    <img src={img} alt="업로드 이미지" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/70 text-white hover:bg-red-600 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 rounded-full border border-slate-200 text-[#0A1D37] font-bold text-xs sm:text-sm hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                이전 단계
              </button>
              <button
                type="button"
                disabled={!canProceedStep3}
                onClick={() => setCurrentStep(4)}
                className="px-8 py-3.5 rounded-full bg-[#38BDF8] hover:bg-[#0EA5E9] disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                id="wizard-step-3-next-btn"
              >
                다음: 고객정보 입력
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 04: 고객정보 */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0A1D37] tracking-tight">
                ④ 예약자 정보를 입력해주세요.
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                방문 일정 조율 및 견적 안내를 위해 연락 가능한 번호를 정확히 적어주세요.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-[#0A1D37] mb-1.5">
                  예약자 성함 <span className="text-[#38BDF8]">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="예: 홍길동"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-[#38BDF8]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#0A1D37] mb-1.5">
                  휴대폰 번호 <span className="text-[#38BDF8]">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="예: 010-1234-5678"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-[#38BDF8]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#0A1D37] mb-1.5">
                이메일 주소 <span className="text-[#38BDF8]">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="예: user@example.com (견적서 발송용)"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-[#38BDF8]"
              />
            </div>

            {/* Agreements */}
            <div className="bg-slate-50/80 rounded-3xl p-5 border border-slate-100 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreePrivacy}
                  onChange={(e) => setAgreePrivacy(e.target.checked)}
                  className="w-4 h-4 text-[#38BDF8] rounded mt-0.5 accent-[#38BDF8]"
                />
                <span className="text-xs text-slate-700 leading-relaxed">
                  <strong className="text-[#0A1D37] font-bold">[필수]</strong> 개인정보 수집 및 이용 동의 (목적: 방문 견적 상담, 연락처 확인 및 일정 조율)
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeContact}
                  onChange={(e) => setAgreeContact(e.target.checked)}
                  className="w-4 h-4 text-[#38BDF8] rounded mt-0.5 accent-[#38BDF8]"
                />
                <span className="text-xs text-slate-700 leading-relaxed">
                  <strong className="text-[#0A1D37] font-bold">[필수]</strong> 예약 안내를 위한 전화 및 문자(SMS/카카오 알림톡) 수신 동의
                </span>
              </label>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-6 py-3 rounded-full border border-slate-200 text-[#0A1D37] font-bold text-xs sm:text-sm hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                이전 단계
              </button>
              <button
                type="button"
                disabled={!canProceedStep4}
                onClick={() => setCurrentStep(5)}
                className="px-8 py-3.5 rounded-full bg-[#38BDF8] hover:bg-[#0EA5E9] disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                id="wizard-step-4-next-btn"
              >
                다음: 최종 예약 확인
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 05: 예약 최종 확인 (Section 25) */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0A1D37] tracking-tight">
                ⑤ 예약 내용을 최종 확인해주세요.
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                입력하신 정보가 맞는지 검토 후 [방문 견적 신청하기]를 누르시면 접수됩니다.
              </p>
            </div>

            {submitError && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Summary Review Card */}
            <div className="bg-slate-50/80 border border-slate-100 rounded-3xl p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200/70">
                <div>
                  <span className="text-xs text-slate-400 font-medium block">방문 예정 일시</span>
                  <span className="font-extrabold text-sm sm:text-base text-[#0A1D37] flex items-center gap-1.5 mt-0.5">
                    <CalendarIcon className="w-4 h-4 text-[#38BDF8]" />
                    {selectedDate} ({selectedTime})
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">신청 서비스</span>
                  <span className="font-extrabold text-sm sm:text-base text-[#0A1D37] mt-0.5 block">
                    {SERVICE_OPTIONS.find((s) => s.id === serviceType)?.name}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200/70">
                <div>
                  <span className="text-xs text-slate-400 font-medium block">공간 유형 및 평수</span>
                  <span className="font-semibold text-xs sm:text-sm text-slate-700 mt-0.5 block">
                    {propertyType} ({area})
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">방문 주소</span>
                  <span className="font-semibold text-xs sm:text-sm text-slate-700 mt-0.5 block">
                    {address} {addressDetail}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200/70">
                <div>
                  <span className="text-xs text-slate-400 font-medium block">예약자명</span>
                  <span className="font-semibold text-xs sm:text-sm text-slate-700 mt-0.5 block">{customerName}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">연락처 / 이메일</span>
                  <span className="font-semibold text-xs sm:text-sm text-slate-700 mt-0.5 block">
                    {phone} / {email}
                  </span>
                </div>
              </div>

              {customerMessage && (
                <div className="pt-1">
                  <span className="text-xs text-slate-400 font-medium block">고객 요청사항</span>
                  <p className="text-xs text-slate-700 mt-1 bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs">
                    {customerMessage}
                  </p>
                </div>
              )}

              {uploadedImages.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs text-slate-400 font-medium block mb-2">
                    첨부 사진 ({uploadedImages.length}장)
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {uploadedImages.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="미리보기"
                        className="w-16 h-16 object-cover rounded-2xl border border-slate-200 shrink-0"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Final Assurance Banner */}
            <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 text-xs text-[#0A1D37] flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#38BDF8] shrink-0" />
              <div>
                <strong>링크클린 안심 보증:</strong> 방문 견적은 무료로 진행되며, 현장 확인 후 고객님이 직접 견적서를 확인하시고 청소 여부를 결정하실 수 있습니다.
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-6 py-3 rounded-full border border-slate-200 text-[#0A1D37] font-bold text-xs sm:text-sm hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                이전 단계
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitReservation}
                className="px-8 py-3.5 rounded-full bg-[#38BDF8] hover:bg-[#0EA5E9] disabled:bg-[#38BDF8]/50 text-white font-extrabold text-sm sm:text-base shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
                id="wizard-final-submit-btn"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    예약 접수 처리중...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    방문 견적 신청하기
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
