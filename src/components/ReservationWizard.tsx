import { BookingProcessNotice } from './BookingProcessNotice';
import { TEAMS_PER_DAY, getScheduledTeams, BOOKING_FLOW_TEXT } from '../data/bookingProcess';
import { RefundPolicyList } from './RefundPolicyList';
import { REFUND_POLICY_SUMMARY } from '../data/refundPolicy';
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
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
  { id: 'memorial', name: '유품정리·특수청소', desc: '유품 분류·귀중품 전달, 폐기물 반출, 오염 제거·오존 탈취', icon: '🕊️' },
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
    currentUser,
    setCurrentView,
    preselectedReservationService,
    timeSlotConfigs,
    reservations
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
    return ''; // 청소 날짜는 손님이 달력에서 직접 고름
  });
  const DATE_UNDECIDED = '날짜 미정';
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
  const [agreeRefund, setAgreeRefund] = useState<boolean>(false); // 취소·환불 규정 동의 (직접 체크)
  const [showRefund, setShowRefund] = useState<boolean>(false);

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

  // 날짜별 남은 팀 수 (하루 2팀 운영 - 기존 일정 - 이 기기에서 접수된 예약)
  const teamsLeft = React.useCallback(
    (dateString: string, isSon = false): number => {
      const config = timeSlotConfigs[dateString];
      if (config?.isHoliday || config?.isClosed) return 0;
      const mine = reservations.filter((r) => r.visit_date === dateString && r.status !== 'CANCELLED').length;
      return Math.max(0, TEAMS_PER_DAY - getScheduledTeams(dateString, isSon) - mine);
    },
    [timeSlotConfigs, reservations]
  );

  // 미리 골라 온 날짜가 이미 마감이면 선택 해제
  React.useEffect(() => {
    if (selectedDate && selectedDate !== DATE_UNDECIDED && /^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
      const [y, m, d] = selectedDate.split('-').map(Number);
      if (teamsLeft(selectedDate, checkSonEopNeunNal(y, m, d).isSonEopNeunNal) <= 0) setSelectedDate('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      left: number;
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
        isSonEopNeunNal: false,
        left: 0
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateString = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const thisDate = new Date(calendarYear, calendarMonth, d);
      const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isPast = thisDate <= todayZero; // 당일·지난 날짜는 예약 불가

      const config = timeSlotConfigs[dateString];
      const isHoliday = !!config?.isHoliday;

      const sonInfo = checkSonEopNeunNal(calendarYear, calendarMonth + 1, d);
      const left = isPast || isHoliday ? 0 : teamsLeft(dateString, sonInfo.isSonEopNeunNal);
      const isAllFull = !isPast && !isHoliday && left <= 0;
      const isSelectable = !isPast && !isHoliday && left > 0;

      days.push({
        dateString,
        dayNumber: d,
        isCurrentMonth: true,
        isPast,
        isSelectable,
        isAllFull,
        isHoliday,
        isSonEopNeunNal: sonInfo.isSonEopNeunNal,
        left
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
        isSonEopNeunNal: false,
        left: 0
      });
    }

    return days;
  }, [calendarYear, calendarMonth, today, timeSlotConfigs, teamsLeft]);

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
  // 손님이 모든 칸을 채우지 않아도 다음 단계로 넘어갈 수 있게 함.
  // 접수에 꼭 필요한 것은 연락처와 개인정보 동의뿐 (나머지는 상담 때 확인)
  const canProceedStep1 = !!selectedDate; // 청소 날짜(또는 '날짜 미정')는 꼭 골라야 함
  const canProceedStep2 = true;
  const canProceedStep3 = true;
  const canProceedStep4 = phone.replace(/[^0-9]/g, '').length >= 9 && agreePrivacy && agreeContact && agreeRefund;

  // Submit Final Reservation
  const handleSubmitReservation = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await createReservation({
        user_id: currentUser ? currentUser.id : 'guest',
        customer_name: customerName.trim() || '고객(이름 미입력)',
        phone,
        email: email.trim(),
        service_type: serviceType,
        visit_date: selectedDate,
        visit_time: '시간 협의',
        address,
        address_detail: addressDetail,
        property_type: propertyType,
        area,
        customer_message: ['[청소 날짜 예약 · 확인전화 필요]', customerMessage].filter(Boolean).join(' '),
        cleaning_date_hint: selectedDate === DATE_UNDECIDED ? '미정(상담 후 결정)' : `${selectedDate} (청소 예약일)`,
        refund_agreed: agreeRefund,
        uploaded_images: uploadedImages
      });

      if (result.success && result.reservation) {
  setCompletedReservation(result.reservation);

  const w = window as any;
  if (w.wcs) {
    if (!w.wcs_add) w.wcs_add = {};
    w.wcs_add['wa'] = 's_274563371b48';

    const _conv = {
      type: 'schedule'
    };

    w.wcs.trans(_conv);
  }

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
            청소 예약 신청이 접수되었습니다.
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5 max-w-md mx-auto">
            담당자가 확인 후 남겨주신 번호로 <b className="text-[#0A1D37]">확인 전화</b>를 드립니다.
            필요한 경우에만 방문 견적을 진행하고, <b className="text-[#0A1D37]">계약금 입금 시 예약이 확정</b>됩니다.
          </p>
          <BookingProcessNotice compact className="mb-8" />

          {/* Reservation Details Box */}
          <div className="bg-slate-50/80 border border-slate-100 rounded-3xl p-6 text-left space-y-3.5 mb-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 text-xs sm:text-sm">
              <span className="text-slate-500 font-medium">예약 번호</span>
              <span className="font-mono font-bold text-[#38BDF8] bg-[#0A1D37] px-3 py-1 rounded-full text-xs">
                {completedReservation.reservation_id}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-slate-500 font-medium">청소 희망 날짜</span>
              <span className="font-extrabold text-[#0A1D37]">
                {completedReservation.visit_date}
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
              지금은 <b>예약 신청(날짜 임시 보관)</b> 상태예요. 확인 전화 후 계약금을 입금하시면 날짜가 최종 확정됩니다.
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
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      {/* 홈으로 돌아가기 */}
      <button
        type="button"
        onClick={() => setCurrentView('home')}
        className="mb-4 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-[#0A1D37] py-1.5 px-3 rounded-full border border-slate-200 bg-white shadow-2xs cursor-pointer"
        id="wizard-back-home-btn"
      >
        <ChevronLeft className="w-4 h-4" />
        <Home className="w-3.5 h-3.5 text-[#38BDF8]" />
        홈으로
      </button>

      {/* Top Header */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          하루 2팀 운영 · 실시간 예약 현황
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0A1D37] tracking-tight">
          청소 예약
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-xl mx-auto leading-relaxed">
          청소 날짜를 먼저 잡아두세요. 링크클린이 확인 전화로 금액과 작업 범위를 안내해드립니다.
        </p>
      </div>

      <BookingProcessNotice className="mb-6" />

      {/* 온라인 접수 안내 */}
      <div className="mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 flex items-center justify-between gap-3">
        <p className="text-xs sm:text-sm text-emerald-900 font-medium leading-relaxed">
          ✅ <strong className="font-bold">온라인 예약 접수 중</strong> · 신청하시면 담당자가 바로 확인하고 연락드려요.
        </p>
        <a
          href="tel:064-763-4545"
          className="shrink-0 px-3 py-2 rounded-xl bg-white border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1"
        >
          <Phone className="w-3.5 h-3.5" />
          전화
        </a>
      </div>

      {/* 5-Step Stepper Progress Bar */}
      <div className="mb-8 sm:mb-10">
        <div className="grid grid-cols-5 gap-1.5 sm:gap-3 text-center">
          {[
            { step: 1, label: '청소날짜', icon: CalendarIcon },
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
                ① 청소를 원하는 날짜를 선택해주세요.
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                링크클린은 품질을 위해 <b className="text-[#0A1D37]">하루 2팀만 운영</b>합니다. 날짜별 남은 팀을 확인하세요.
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
                      onClick={() => setSelectedDate(day.dateString)}
                      className={`h-12 sm:h-14 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center text-xs sm:text-sm font-semibold transition-all relative cursor-pointer ${buttonStyles}`}
                    >
                      {day.isSonEopNeunNal && day.isCurrentMonth && (
                        <span
                          className="absolute top-0.5 right-0.5 text-[7px] sm:text-[8px] font-black px-0.5 rounded-sm leading-none bg-amber-400 text-slate-950"
                          title="손없는 날 (이사 길일)"
                        >
                          손
                        </span>
                      )}
                      <span className="relative z-10 leading-none">{day.dayNumber}</span>
                      {day.isCurrentMonth && !day.isPast && (
                        <span
                          className={`mt-1 text-[8px] sm:text-[10px] font-bold leading-none whitespace-nowrap ${
                            day.isHoliday
                              ? 'text-red-400'
                              : day.isAllFull
                              ? 'text-slate-400'
                              : isSelected
                              ? 'text-[#38BDF8]'
                              : day.left === 1
                              ? 'text-orange-500'
                              : 'text-emerald-600'
                          }`}
                        >
                          {day.isHoliday ? '휴무' : day.isAllFull ? '마감' : day.left === 1 ? '1팀 남음' : '2팀 가능'}
                        </span>
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
                  <span className="text-[10px] font-bold text-emerald-600">2팀 가능</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-orange-500">1팀 남음</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-slate-200" />
                  <span>마감 (2팀 모두 예약)</span>
                </div>
              </div>
            </div>

            {/* 선택한 청소 날짜 / 날짜 미정 */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
              <div className={`flex-1 rounded-2xl border px-4 py-3 text-sm ${selectedDate ? 'bg-[#0A1D37] border-[#0A1D37] text-white' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                {selectedDate ? (
                  <>
                    <span className="text-[11px] text-[#38BDF8] font-bold block">선택한 청소 날짜</span>
                    <span className="font-extrabold">{selectedDate}</span>
                    {selectedDate !== DATE_UNDECIDED && (
                      <span className="text-[11px] text-slate-300 ml-2">· 시작 시간은 확인 전화 때 맞춰드려요</span>
                    )}
                  </>
                ) : (
                  <span className="font-bold">위 달력에서 청소 날짜를 눌러주세요</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedDate(DATE_UNDECIDED)}
                className={`shrink-0 px-4 py-3 rounded-2xl border text-xs font-bold cursor-pointer ${
                  selectedDate === DATE_UNDECIDED ? 'bg-[#38BDF8] border-[#38BDF8] text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-[#38BDF8]'
                }`}
              >
                아직 날짜 미정 · 상담 후 결정
              </button>
            </div>
            <p className="text-[11px] text-slate-500 -mt-4">
              ※ 날짜를 고르면 확인 전화 전까지 임시로 잡아둡니다. 진행 순서: {BOOKING_FLOW_TEXT}
            </p>

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
                확인 전화 때 정확한 금액을 안내드리기 위한 기초 정보입니다.
              </p>
            </div>

            {/* Property Type Selection */}
            <div>
              <label className="block text-xs font-extrabold text-[#0A1D37] mb-2">
                건물 유형 <span className="text-slate-400 font-medium">(선택)</span>
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
                  공급 면적 (평수) <span className="text-slate-400 font-medium">(선택)</span>
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
                  기본 주소 <span className="text-slate-400 font-medium">(선택)</span>
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
                placeholder="예: 104동 1201호"
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
                확인 전화와 일정 안내를 위해 연락 가능한 번호를 정확히 적어주세요.
              </p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
                ✅ 휴대폰 번호만 있으면 접수돼요. 나머지는 상담 때 여쭤볼게요!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-[#0A1D37] mb-1.5">
                  예약자 성함 <span className="text-slate-400 font-medium">(선택)</span>
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
                이메일 주소 <span className="text-slate-400 font-medium">(선택)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="예: user@example.com (견적서 발송용)"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-[#38BDF8]"
              />
            </div>

            {/* 개인정보 안내: 회원가입 아님 */}
            <div className="rounded-2xl bg-sky-50 border border-sky-200 px-4 py-3 flex items-start gap-2.5">
              <span className="text-lg leading-none" aria-hidden="true">🔒</span>
              <div className="text-xs text-slate-700 leading-relaxed">
                <p className="font-extrabold text-[#0A1D37]">회원가입 없이 예약됩니다</p>
                <p className="mt-0.5">
                  남겨주신 성함·연락처·주소는 <b>회원가입이나 광고 목적으로 사용하지 않으며</b>, 이번 예약의
                  확인 전화 · 일정 안내 · 청소 진행에만 사용합니다.
                </p>
              </div>
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
                  <strong className="text-[#0A1D37] font-bold">[필수]</strong> 개인정보 수집 및 이용 동의 (목적: 청소 예약 확인 전화, 견적 상담 및 일정 조율)
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

              {/* 취소·환불 규정 동의 */}
              <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeRefund}
                    onChange={(e) => setAgreeRefund(e.target.checked)}
                    className="w-4 h-4 text-[#38BDF8] rounded mt-0.5 accent-[#38BDF8]"
                  />
                  <span className="text-xs text-slate-700 leading-relaxed">
                    <strong className="text-[#0A1D37] font-bold">[필수]</strong> 예약금 및 취소·환불 규정을 확인했고 동의합니다.
                    <span className="block mt-1 text-[11px] text-slate-500">{REFUND_POLICY_SUMMARY}</span>
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowRefund((v) => !v)}
                  className="mt-2 ml-7 text-[11px] font-bold text-amber-700 underline underline-offset-2 cursor-pointer"
                >
                  {showRefund ? '규정 접기 ▲' : '취소·환불 규정 전체 보기 ▼'}
                </button>
                {showRefund && (
                  <div className="mt-2 ml-7 rounded-xl bg-white border border-amber-100 p-3 max-h-64 overflow-y-auto">
                    <RefundPolicyList compact />
                  </div>
                )}
              </div>
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
            {!canProceedStep4 && (
              <p className="text-right text-[11px] text-slate-400 -mt-3">
                {phone.replace(/[^0-9]/g, '').length < 9 ? '휴대폰 번호를 입력하면 다음으로 넘어가요' : '필수 동의 3개에 체크해 주세요'}
              </p>
            )}
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
                입력하신 정보가 맞는지 검토 후 [청소 예약 신청하기]를 누르시면 접수됩니다.
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
                  <span className="text-xs text-slate-400 font-medium block">청소 희망 날짜</span>
                  <span className="font-extrabold text-sm sm:text-base text-[#0A1D37] flex items-center gap-1.5 mt-0.5">
                    <CalendarIcon className="w-4 h-4 text-[#38BDF8]" />
                    {selectedDate} (시간은 확인 전화 때 협의)
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
                    {propertyType} ({area.trim() || '평수 미입력'})
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">청소 주소</span>
                  <span className="font-semibold text-xs sm:text-sm text-slate-700 mt-0.5 block">
                    {address.trim() || addressDetail.trim() ? `${address} ${addressDetail}` : '미입력 (상담 시 확인)'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200/70">
                <div>
                  <span className="text-xs text-slate-400 font-medium block">예약자명</span>
                  <span className="font-semibold text-xs sm:text-sm text-slate-700 mt-0.5 block">{customerName.trim() || '미입력'}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">연락처 / 이메일</span>
                  <span className="font-semibold text-xs sm:text-sm text-slate-700 mt-0.5 block">
                    {phone}{email.trim() ? ` / ${email}` : ''}
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
                <strong>안심하고 신청하세요:</strong> 신청만으로는 비용이 들지 않습니다. 확인 전화로 금액을 안내받고, 필요하면 무료 방문 견적까지 받아보신 뒤 <b>계약금 입금 시에만 예약이 확정</b>됩니다.
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
                    청소 예약 신청하기
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
