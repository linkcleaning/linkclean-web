import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Gift,
  Sparkles,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Coffee,
  Volume2,
  Phone,
  MessageCircle,
  Star,
  Users,
  Share2,
  ExternalLink,
  Info,
} from 'lucide-react';
import mascotImg from '../assets/images/cleaning_master_mascot_1788782482073.png';
import { cleaningAudio } from '../utils/cleaningAudio';

/* ─────────────────────────────────────────────
   링크 설정
   NAVER_PLACE_URL: 네이버 플레이스 "리뷰 쓰기" 화면 주소로 바꿔주세요.
   (지금은 네이버 지도에서 '링크클린' 검색 결과로 연결됩니다)
───────────────────────────────────────────── */
const NAVER_PLACE_URL = 'https://map.naver.com/p/search/' + encodeURIComponent('제주 링크클린');
const KAKAO_URL = 'https://pf.kakao.com/_xfxdrxmM?from=qr';
const PHONE = '064-763-4545';

const REFERRAL_MESSAGE = `제주 입주·이사청소 링크클린 추천해요! 🧹✨
청소 전·후 사진을 구역별로 보내주고, 확인한 다음에 결제해서 믿을 만했어요.
상담할 때 제 이름 말해주면 돼요 😊
📞 ${PHONE}
🔗 https://linkclean.co.kr`;

interface Step {
  emoji: string;
  title: string;
  desc: React.ReactNode;
}

const REVIEW_STEPS: Step[] = [
  {
    emoji: '🧹',
    title: '청소 완료',
    desc: '링크클린에서 청소를 받아보세요.',
  },
  {
    emoji: '✍️',
    title: '네이버 플레이스 후기 작성',
    desc: (
      <>
        네이버 지도에서 <b>링크클린</b>을 찾아 방문자 리뷰를 남겨주세요.
        청소 전·후 사진을 함께 올려주시면 다른 분들께 큰 도움이 돼요 📸
      </>
    ),
  },
  {
    emoji: '📱',
    title: '카톡으로 인증',
    desc: '작성한 후기 화면을 캡처해서 성함과 함께 카카오톡 채널로 보내주세요.',
  },
  {
    emoji: '☕',
    title: '커피 도착!',
    desc: '확인 후 스타벅스 커피 1잔 모바일 쿠폰을 보내드립니다.',
  },
];

const REFERRAL_STEPS: Step[] = [
  {
    emoji: '💬',
    title: '링크클린 소개하기',
    desc: '청소 업체를 찾는 가족·친구·이웃분께 링크클린을 알려주세요.',
  },
  {
    emoji: '🗣️',
    title: '상담 때 추천인 이름 말하기',
    desc: (
      <>
        소개받은 분이 상담하실 때 <b>“○○○님 소개로 연락드렸어요”</b>라고 말씀해 주시면 돼요.
      </>
    ),
  },
  {
    emoji: '🤝',
    title: '계약 진행',
    desc: '소개받은 분의 청소 계약이 진행되면',
  },
  {
    emoji: '☕',
    title: '추천인께 커피 발송!',
    desc: '소개해주신 분께 스타벅스 커피 1잔 모바일 쿠폰을 보내드립니다.',
  },
];

const StepList: React.FC<{ steps: Step[]; tone: 'amber' | 'sky' }> = ({ steps, tone }) => (
  <ol className="space-y-3">
    {steps.map((s, i) => (
      <li key={s.title} className="flex gap-3">
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
              tone === 'amber' ? 'bg-amber-50 border border-amber-200' : 'bg-sky-50 border border-sky-200'
            }`}
          >
            {s.emoji}
          </div>
          {i < steps.length - 1 && <div className="w-px flex-1 bg-slate-200 my-1" />}
        </div>
        <div className="pb-1">
          <p className="text-[11px] font-black text-slate-400 font-mono">STEP {i + 1}</p>
          <p className="text-sm font-extrabold text-[#0A1D37]">{s.title}</p>
          <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{s.desc}</p>
        </div>
      </li>
    ))}
  </ol>
);

export const EventView: React.FC = () => {
  const { setCurrentView, goToReservationWithService } = useApp();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: '링크클린 추천', text: REFERRAL_MESSAGE });
        return;
      }
      await navigator.clipboard.writeText(REFERRAL_MESSAGE);
      showToast('📋 소개 문구가 복사됐어요! 카톡에 붙여넣기 해주세요.');
    } catch {
      // 사용자가 공유를 취소한 경우 등은 무시
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      {/* Toast */}
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
            링크클린 감사 이벤트
          </span>
        </div>

        {/* ───────────── Hero ───────────── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A1D37] via-[#0F284E] to-[#0A1D37] text-white p-6 sm:p-10 shadow-xl border border-slate-700/80 mb-8">
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#38BDF8]/10 blur-2xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-52 h-52 rounded-full bg-amber-400/10 blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 sm:gap-8 text-center md:text-left">
            {/* Mascot */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1.5 bg-gradient-to-tr from-[#38BDF8] via-amber-200 to-rose-300 shadow-2xl">
                <div className="w-full h-full rounded-full overflow-hidden bg-white border-2 border-white flex items-center justify-center">
                  <img src={mascotImg} alt="링크클린 청소 마스터" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="absolute -top-1 -right-2 text-3xl animate-bounce" aria-hidden="true">☕</div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-[#0A1D37] px-3 py-0.5 rounded-full text-[11px] font-black shadow-md whitespace-nowrap border border-slate-200 flex items-center gap-1">
                <span>청소 마스터</span>
                <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
              </div>
            </div>

            {/* Copy */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold mb-3 border border-emerald-400/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>지금 진행 중</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white mb-2 leading-tight">
                고마운 마음,<br className="sm:hidden" /> 커피 한 잔으로 전할게요 ☕
              </h1>
              <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-xl">
                링크클린을 믿고 맡겨주신 고객님, 그리고 주변에 소개해주시는 고객님께
                <b className="text-white"> 스타벅스 커피 1잔</b>을 선물로 드립니다 🎁
              </p>

              {/* Jump buttons */}
              <div className="mt-5 flex flex-col sm:flex-row gap-2 justify-center md:justify-start">
                <a
                  href="#event-review"
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#0A1D37] text-xs sm:text-sm font-black transition-colors flex items-center justify-center gap-1.5"
                >
                  ✍️ 후기 이벤트 보기
                </a>
                <a
                  href="#event-referral"
                  className="px-4 py-2.5 rounded-xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#0A1D37] text-xs sm:text-sm font-black transition-colors flex items-center justify-center gap-1.5"
                >
                  🤝 소개 이벤트 보기
                </a>
              </div>

              {/* Sound bar (기존 기능 유지) */}
              <div className="mt-4 pt-3 border-t border-slate-700/60 flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="text-xs text-amber-300 font-bold flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5" />
                  청소 효과음:
                </span>
                <button type="button" onClick={() => cleaningAudio.playSteamSound()} className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-orange-300 font-medium transition-colors cursor-pointer border border-orange-400/30 active:scale-95">
                  💨 스팀기 치익~
                </button>
                <button type="button" onClick={() => cleaningAudio.playVacuumSound()} className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-sky-300 font-medium transition-colors cursor-pointer border border-sky-400/30 active:scale-95">
                  🌀 청소기 위잉~
                </button>
                <button type="button" onClick={() => cleaningAudio.playFloorWipeSound()} className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-emerald-300 font-medium transition-colors cursor-pointer border border-emerald-400/30 active:scale-95">
                  ✨ 바닥 쓱싹~
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ───────────── EVENT 1: 후기 ───────────── */}
        <section id="event-review" className="scroll-mt-24 mb-8 rounded-3xl bg-white border border-amber-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-5 sm:px-8 py-5 border-b border-amber-100">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-black text-white bg-amber-500 px-2.5 py-0.5 rounded-full">EVENT 01</span>
              <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> 작업 완료 고객 대상
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0A1D37] leading-snug">
              ✍️ 솔직한 후기 남기고 ☕ 커피 한 잔
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              청소가 끝난 뒤 <b>네이버 플레이스</b>에 소중한 후기를 남겨주시면
              <b className="text-amber-700"> 스타벅스 커피 1잔</b>을 보내드려요.
              고객님의 한 줄 후기가 링크클린을 고민하는 다른 분께 가장 큰 도움이 됩니다 🙏
            </p>
          </div>

          <div className="p-5 sm:p-8 grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-3">
              <StepList steps={REVIEW_STEPS} tone="amber" />
            </div>

            <div className="md:col-span-2 space-y-3">
              {/* Reward card */}
              <div className="rounded-2xl bg-[#0A1D37] text-white p-5 text-center">
                <Coffee className="w-8 h-8 text-amber-300 mx-auto mb-2" />
                <p className="text-xs text-slate-300">참여 혜택</p>
                <p className="text-lg font-black">스타벅스 커피 1잔</p>
                <p className="text-[11px] text-slate-400 mt-1">모바일 쿠폰으로 발송</p>
              </div>

              <a
                href={NAVER_PLACE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-[#03C75A] hover:brightness-95 text-white font-black text-sm flex items-center justify-center gap-1.5 shadow-sm"
              >
                <ExternalLink className="w-4 h-4" />
                네이버 플레이스 후기 쓰러 가기
              </a>
              <a
                href={KAKAO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-[#FEE500] hover:brightness-95 text-[#3A1D1D] font-black text-sm flex items-center justify-center gap-1.5 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                카톡으로 후기 인증하기
              </a>

              <div className="rounded-2xl bg-amber-50/70 border border-amber-100 p-3.5 text-[11px] text-slate-600 leading-relaxed">
                <p className="font-bold text-amber-800 mb-1 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" /> 꼭 확인해 주세요
                </p>
                <p>💛 별점이나 내용과 상관없이 드려요. 아쉬운 점도 솔직하게 적어주세요!</p>
                <p className="mt-1">
                  📝 후기 마지막에 <b>“링크클린 후기 이벤트로 커피 쿠폰을 받았습니다”</b> 한 줄을 꼭 남겨주세요.
                  (대가를 받은 후기는 이 사실을 밝히도록 되어 있어요)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────── EVENT 2: 소개 ───────────── */}
        <section id="event-referral" className="scroll-mt-24 mb-8 rounded-3xl bg-white border border-sky-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-sky-50 to-cyan-50 px-5 sm:px-8 py-5 border-b border-sky-100">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-black text-white bg-[#0284C7] px-2.5 py-0.5 rounded-full">EVENT 02</span>
              <span className="text-[11px] font-bold text-sky-700 flex items-center gap-1">
                <Users className="w-3 h-3" /> 누구나 참여 가능
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0A1D37] leading-snug">
              🤝 링크클린 소개하고 ☕ 커피 한 잔
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              주변 분께 링크클린을 소개해 주세요. 소개받은 분의 <b>계약이 진행되면</b> 소개해주신 분께
              <b className="text-[#0284C7]"> 스타벅스 커피 1잔</b>을 보내드려요.
              이사·입주 앞둔 지인분이 계시다면 지금 알려주세요 🏡
            </p>
          </div>

          <div className="p-5 sm:p-8 grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-3">
              <StepList steps={REFERRAL_STEPS} tone="sky" />
            </div>

            <div className="md:col-span-2 space-y-3">
              <div className="rounded-2xl bg-[#0A1D37] text-white p-5 text-center">
                <Coffee className="w-8 h-8 text-[#38BDF8] mx-auto mb-2" />
                <p className="text-xs text-slate-300">추천인 혜택</p>
                <p className="text-lg font-black">스타벅스 커피 1잔</p>
                <p className="text-[11px] text-slate-400 mt-1">계약 진행 확인 후 발송</p>
              </div>

              {/* Share message preview */}
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5">
                <p className="text-[11px] font-bold text-slate-500 mb-1.5">💌 이렇게 보내보세요</p>
                <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">{REFERRAL_MESSAGE}</p>
              </div>

              <button
                type="button"
                onClick={handleShare}
                className="w-full py-3 rounded-xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#0A1D37] font-black text-sm flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                소개 문구 공유하기
              </button>
            </div>
          </div>
        </section>

        {/* ───────────── 유의사항 ───────────── */}
        <section className="mb-8 rounded-2xl bg-white border border-slate-200 p-5 sm:p-6">
          <h3 className="text-sm font-black text-[#0A1D37] mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#38BDF8]" />
            이벤트 유의사항
          </h3>
          <ul className="text-xs text-slate-500 space-y-1.5 leading-relaxed list-disc pl-4">
            <li>커피 쿠폰은 참여 내용 확인 후 순차적으로 모바일 쿠폰으로 보내드립니다.</li>
            <li>후기 이벤트는 링크클린에서 실제로 청소를 받으신 고객님만 참여하실 수 있습니다.</li>
            <li>별점·내용과 관계없이 동일하게 지급하며, 후기 수정·삭제를 요청하지 않습니다.</li>
            <li>후기에는 이벤트로 커피 쿠폰을 받았다는 사실을 꼭 함께 적어주세요.</li>
            <li>소개 이벤트는 소개받은 분이 상담 시 추천인 성함을 말씀해 주셔야 확인이 가능합니다.</li>
            <li>사실과 다른 후기, 대리 작성, 부정 참여가 확인되면 혜택이 취소될 수 있습니다.</li>
            <li>이벤트 내용은 링크클린 사정에 따라 변경되거나 조기 종료될 수 있습니다.</li>
            <li>
              문의: <a href={`tel:${PHONE}`} className="font-bold text-[#0284C7]">{PHONE}</a> 또는 카카오톡 채널
            </li>
          </ul>
        </section>

        {/* Quick Action Footer */}
        <div className="bg-slate-100/80 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-200">
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-bold text-[#0A1D37]">이사·입주 청소가 필요하신가요? 🏠</h4>
            <p className="text-xs text-slate-500 mt-0.5">지금 무료 견적을 받아보세요.</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href={`tel:${PHONE}`}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              전화 상담
            </a>
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
