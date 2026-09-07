import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Gift,
  Sparkles,
  Clock,
  Bell,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Award,
  ChevronRight,
  Coffee,
  ShoppingBag,
  Flame,
  Trees,
  Volume2
} from 'lucide-react';
import mascotImg from '../assets/images/cleaning_master_mascot_1788782482073.png';
import { cleaningAudio } from '../utils/cleaningAudio';

interface GiftTeaser {
  id: string;
  category: string;
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  badge: string;
  accentColor: string;
  bgGradient: string;
}

export const EventView: React.FC = () => {
  const { setCurrentView, currentUser, goToReservationWithService } = useApp();

  // State for interactive gift preview modal
  const [selectedGift, setSelectedGift] = useState<GiftTeaser | null>(null);

  // State for pre-registration notification
  const [applicantName, setApplicantName] = useState(currentUser?.name || '');
  const [applicantPhone, setApplicantPhone] = useState(currentUser?.phone || '');
  const [isNotified, setIsNotified] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const giftTeasers: GiftTeaser[] = [
    {
      id: 'gift-1',
      category: '이사 & 입주 응원 지원금',
      title: '신세계 / 이마트 30,000원 상품권',
      value: '30,000원권',
      description: '청소 후 생필품과 가전, 소품 구매 시 유용하게 사용하실 수 있는 실속 모바일 상품권',
      icon: <ShoppingBag className="w-6 h-6 text-rose-500" />,
      badge: '선물 준비중 🎁',
      accentColor: 'border-rose-300 text-rose-600',
      bgGradient: 'from-rose-50 to-pink-50/50'
    },
    {
      id: 'gift-2',
      category: '50,000원 상당 프리미엄 홈케어',
      title: '편백 피톤치드 실내 항균탈취 무료 시공권',
      value: '50,000원 상당',
      description: '새집증후군, 묵은 찌든 냄새를 100% 천연 편백 피톤치드 연무로 99.9% 쾌적하게 정화',
      icon: <Trees className="w-6 h-6 text-emerald-600" />,
      badge: '선물 준비중 🌿',
      accentColor: 'border-emerald-300 text-emerald-700',
      bgGradient: 'from-emerald-50 to-teal-50/50'
    },
    {
      id: 'gift-3',
      category: '100% 당첨 감사 기프트',
      title: '스타벅스 커피 & 달콤한 케이크 세트',
      value: '전원 100% 증정',
      description: '청소 견적 상담 및 완료 후 소중한 후기를 작성해주시는 고객님 전원에게 즉시 발송',
      icon: <Coffee className="w-6 h-6 text-amber-600" />,
      badge: '선물 준비중 ☕',
      accentColor: 'border-amber-300 text-amber-700',
      bgGradient: 'from-amber-50 to-yellow-50/50'
    },
    {
      id: 'gift-4',
      category: '전문 클리닝 특화 업그레이드',
      title: '주방 & 욕실 140℃ 고온 스팀 살균 케어',
      value: '무료 업그레이드',
      description: '기름때와 세균 번식이 심한 싱크대 배수구, 가스레인지, 양변기를 고온 스팀으로 멸균 소독',
      icon: <Flame className="w-6 h-6 text-cyan-600" />,
      badge: '선물 준비중 💨',
      accentColor: 'border-cyan-300 text-cyan-700',
      bgGradient: 'from-cyan-50 to-sky-50/50'
    }
  ];

  const handleGiftClick = (gift: GiftTeaser) => {
    cleaningAudio.playFloorWipeSound();
    setSelectedGift(gift);
  };

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim()) {
      setToastMessage('성함을 입력해주세요.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    if (!applicantPhone.trim() || applicantPhone.length < 9) {
      setToastMessage('연락처(휴대폰 번호)를 정확히 입력해주세요.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    setIsNotified(true);
    setToastMessage('🎉 선물 오픈 알림 신청이 완료되었습니다! 정식 오픈 시 가장 먼저 문자로 안내해 드릴게요.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#0A1D37] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#38BDF8] flex items-center gap-2 text-xs sm:text-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Navigation Back */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentView('home')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-[#0A1D37] transition-colors cursor-pointer py-1 px-3 rounded-lg hover:bg-slate-200/60"
            id="event-back-to-home-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            홈으로 돌아가기
          </button>

          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284C7] bg-sky-100 px-3 py-1 rounded-full">
            <Gift className="w-3.5 h-3.5 text-[#38BDF8]" />
            링크클린 특별 감사 이벤트
          </span>
        </div>

        {/* Hero Event Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A1D37] via-[#0F284E] to-[#0A1D37] text-white p-6 sm:p-10 shadow-xl border border-slate-700/80 mb-8">
          {/* Background Decorative Rings */}
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#38BDF8]/10 blur-2xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-52 h-52 rounded-full bg-amber-400/10 blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 sm:gap-8 text-center md:text-left">
            {/* Mascot Visual with Bounce */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1.5 bg-gradient-to-tr from-[#38BDF8] via-amber-200 to-rose-300 shadow-2xl">
                <div className="w-full h-full rounded-full overflow-hidden bg-white border-2 border-white flex items-center justify-center">
                  <img
                    src={mascotImg}
                    alt="링크클린 청소 마스터"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Character Floating Name Tag */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-[#0A1D37] px-3 py-0.5 rounded-full text-[11px] font-black shadow-md whitespace-nowrap border border-slate-200 flex items-center gap-1">
                <span>청소 마스터</span>
                <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
              </div>
            </div>

            {/* Event Header Copy */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-3 border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>청소 마스터가 준비한 특급 혜택</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white mb-2 leading-tight">
                청소 마스터의 시크릿 선물 상자 🎁
              </h1>
              <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-xl">
                링크클린을 찾아주신 고객님께 감사의 마음을 담아 실속 있는 혜택과 푸짐한 사은품을 정성스레 준비하고 있습니다!
              </p>

              {/* Mini Sound Bar in Event View */}
              <div className="mt-4 pt-3 border-t border-slate-700/60 flex flex-wrap items-center gap-2">
                <span className="text-xs text-amber-300 font-bold flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5" />
                  청소 효과음:
                </span>
                <button
                  type="button"
                  onClick={() => cleaningAudio.playSteamSound()}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-orange-300 font-medium transition-colors cursor-pointer border border-orange-400/30 active:scale-95"
                  title="스팀기 소리 재생"
                >
                  💨 스팀기 치익~
                </button>
                <button
                  type="button"
                  onClick={() => cleaningAudio.playVacuumSound()}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-sky-300 font-medium transition-colors cursor-pointer border border-sky-400/30 active:scale-95"
                  title="청소기 소리 재생"
                >
                  🌀 청소기 위잉~
                </button>
                <button
                  type="button"
                  onClick={() => cleaningAudio.playFloorWipeSound()}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-emerald-300 font-medium transition-colors cursor-pointer border border-emerald-400/30 active:scale-95"
                  title="바닥 닦는 소리 재생"
                >
                  ✨ 바닥 쓱싹~
                </button>
                <button
                  type="button"
                  onClick={() => cleaningAudio.playToiletFlushSound()}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-blue-300 font-medium transition-colors cursor-pointer border border-blue-400/30 active:scale-95"
                  title="화장실 물내림 소리 재생"
                >
                  🌊 물내림 콸콸~
                </button>
              </div>
            </div>
          </div>

          {/* Current Status Notice Banner: "현재는 선물 준비중이야" */}
          <div className="mt-8 pt-6 border-t border-slate-700/80">
            <div className="bg-amber-500/15 border border-amber-400/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-sm sm:text-base">
                      현재 선물 준비중 (Coming Soon)
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-400 text-[#0A1D37]">
                      포장 단계
                    </span>
                  </div>
                  <p className="text-xs text-amber-200/90 mt-0.5 font-normal">
                    더욱 알차고 실속 있는 혜택을 제공해드리기 위해 최종 검수 및 제휴 패키징 작업 중입니다.
                  </p>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="w-full sm:w-44 bg-slate-900/60 rounded-xl p-2.5 border border-white/10 text-right">
                <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                  <span>준비 진행률</span>
                  <span className="text-amber-300 font-bold">85%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-400 to-[#38BDF8] h-full rounded-full w-[85%]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: 준비 중인 선물 라인업 살짝 엿보기 */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#0A1D37] flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#38BDF8]" />
                준비 중인 선물 라인업 미리보기
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                상자를 클릭하면 청소 마스터가 준비 중인 상세 혜택을 미리 확인할 수 있습니다.
              </p>
            </div>
            <span className="hidden sm:inline-block text-xs font-bold text-slate-400">
              총 4종 선물 패키지
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {giftTeasers.map((gift) => (
              <div
                key={gift.id}
                onClick={() => handleGiftClick(gift)}
                className={`group relative rounded-2xl p-5 bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:border-[#38BDF8] overflow-hidden`}
              >
                {/* Decorative Top Accent Ribbon */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                    {gift.category}
                  </span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${gift.accentColor} bg-white shadow-2xs flex items-center gap-1`}>
                    <Clock className="w-2.5 h-2.5" />
                    {gift.badge}
                  </span>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    {gift.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-extrabold text-[#0A1D37] group-hover:text-[#0284C7] transition-colors leading-tight">
                      {gift.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-normal mt-1 leading-relaxed">
                      {gift.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-extrabold text-[#0A1D37]">
                    혜택: <span className="text-[#0284C7]">{gift.value}</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1 group-hover:text-[#0A1D37] transition-colors">
                    자세히 보기
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gift Detail Modal */}
        {selectedGift && (
          <div
            className="fixed inset-0 z-50 bg-[#0A1D37]/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedGift(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative text-center animate-in zoom-in-95 duration-200"
            >
              {/* Mascot Bubble Icon */}
              <div className="w-20 h-20 rounded-full mx-auto p-1 bg-gradient-to-tr from-[#38BDF8] to-amber-300 shadow-lg -mt-12 mb-4 bg-white border-2 border-white overflow-hidden">
                <img
                  src={mascotImg}
                  alt="링크클린 청소 마스터"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="inline-flex items-center gap-1 text-xs font-black text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>선물 포장 중!</span>
              </div>

              <h3 className="text-xl font-black text-[#0A1D37] mb-1">
                {selectedGift.title}
              </h3>
              <p className="text-xs text-slate-400 mb-4 font-semibold">
                {selectedGift.category}
              </p>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500">예정 혜택</span>
                  <span className="text-xs font-black text-[#0284C7] bg-sky-100 px-2 py-0.5 rounded">
                    {selectedGift.value}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {selectedGift.description}
                </p>
              </div>

              <p className="text-xs text-slate-500 font-medium mb-6">
                🎁 청소 마스터가 열심히 선물을 포장하고 있어요!<br />
                정식 오픈 시 이벤트 혜택을 가장 먼저 받아보실 수 있습니다.
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedGift(null)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  확인했어요
                </button>
                <button
                  onClick={() => {
                    setSelectedGift(null);
                    // scroll to pre-registration form
                    const formElem = document.getElementById('pre-register-form');
                    formElem?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex-1 py-3 rounded-xl bg-[#0A1D37] hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-md"
                >
                  오픈 알림받기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Section: 선물 오픈 알림 사전 신청하기 Form */}
        <div
          id="pre-register-form"
          className="rounded-3xl bg-white border border-slate-200/90 shadow-md p-6 sm:p-8 mb-8 relative overflow-hidden"
        >
          <div className="max-w-xl mx-auto text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#0A1D37] text-[#38BDF8] flex items-center justify-center mx-auto mb-3 shadow-md">
              <Bell className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0A1D37] mb-1">
              선물 오픈 시 가장 먼저 알려드릴게요!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mb-6 font-normal">
              연락처를 남겨주시면 이벤트 정식 오픈 당일 깜짝 선물 쿠폰 번호와 함께 안내 문자를 가장 먼저 보내드립니다.
            </p>

            {isNotified ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center animate-in fade-in duration-300">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="text-base font-extrabold text-emerald-900 mb-1">
                  사전 알림 예약이 완료되었습니다!
                </h4>
                <p className="text-xs text-emerald-700 font-medium">
                  <strong>{applicantName}</strong>님 ({applicantPhone})께 선물이 준비되는 대로 문자 알림을 발송해 드리겠습니다.
                </p>
                <button
                  onClick={() => setIsNotified(false)}
                  className="mt-4 text-xs text-slate-500 hover:text-slate-800 underline font-medium cursor-pointer"
                >
                  다른 연락처로 재신청하기
                </button>
              </div>
            ) : (
              <form onSubmit={handleNotifySubmit} className="space-y-3.5 text-left">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    성함 / 닉네임
                  </label>
                  <input
                    type="text"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="예: 홍길동"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    휴대폰 번호
                  </label>
                  <input
                    type="tel"
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    placeholder="예: 010-1234-5678"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent transition-all"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#0A1D37] hover:bg-slate-800 text-white font-black text-sm transition-all shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Bell className="w-4 h-4 text-amber-300" />
                    선물 오픈 알림 무료 신청하기
                  </button>
                  <p className="text-[11px] text-slate-400 text-center mt-2">
                    * 수집된 연락처는 선물 오픈 알림 발송 목적 이외에는 사용되지 않습니다.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Quick Action Footer: Visit Reservation or Home */}
        <div className="bg-slate-100/80 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-200">
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-bold text-[#0A1D37]">
              이사·입주 청소가 급하신가요?
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              지금 바로 무료 방문 견적을 예약하고 일정을 선점하세요.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setCurrentView('home')}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer text-center"
            >
              홈으로 이동
            </button>
            <button
              onClick={() => goToReservationWithService('move-in')}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-[#38BDF8] hover:bg-[#0284C7] text-white font-bold text-xs transition-colors shadow-sm cursor-pointer text-center flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              방문 견적 예약하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
