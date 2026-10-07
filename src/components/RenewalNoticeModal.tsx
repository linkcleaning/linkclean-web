import React, { useState, useEffect } from 'react';
import { Phone, X, ChevronRight, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * 첫 방문 시 뜨는 공지·이벤트 새창.
 * (파일·컴포넌트 이름은 기존 호출부 호환을 위해 그대로 둡니다)
 */
interface RenewalNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DISMISS_KEY = 'linkclean_dismiss_notice_date';

const EVENTS = [
  {
    emoji: '✍️',
    tag: 'EVENT 01',
    title: '솔직한 후기 남기고 커피 한 잔',
    desc: '작업 완료 후 네이버 플레이스에 후기를 남겨주시면 스타벅스 커피 1잔을 드려요.',
    tone: 'bg-amber-50 border-amber-200',
    tagTone: 'bg-amber-500',
  },
  {
    emoji: '🤝',
    tag: 'EVENT 02',
    title: '링크클린 소개하고 커피 한 잔',
    desc: '소개해주신 분의 계약이 진행되면 추천인께 스타벅스 커피 1잔을 드려요.',
    tone: 'bg-sky-50 border-sky-200',
    tagTone: 'bg-[#0284C7]',
  },
];

export const RenewalNoticeModal: React.FC<RenewalNoticeModalProps> = ({ isOpen, onClose }) => {
  const { setCurrentView } = useApp();
  const [dontShowToday, setDontShowToday] = useState(false);

  const handleDismiss = () => {
    if (dontShowToday) {
      const today = new Date().toISOString().split('T')[0];
      try {
        localStorage.setItem(DISMISS_KEY, today);
      } catch {
        // ignore
      }
    }
    onClose();
  };

  const goToEvent = () => {
    handleDismiss();
    setCurrentView('event');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleDismiss();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, dontShowToday]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="notice-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={handleDismiss}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[420px] max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-[#0A1D37] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold text-[#38BDF8] tracking-wider">공지사항 · EVENT</span>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="닫기"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          {/* Headline */}
          <div className="text-center">
            <div className="text-4xl mb-1" aria-hidden="true">☕🎁</div>
            <h2 id="notice-modal-title" className="text-lg sm:text-xl font-black text-[#0A1D37] leading-snug">
              고마운 마음,
              <br />
              커피 한 잔으로 전할게요!
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              지금 링크클린에서 <b className="text-[#0A1D37]">스타벅스 커피 이벤트</b>가 진행 중이에요
            </p>
          </div>

          {/* Event cards */}
          <div className="space-y-2.5">
            {EVENTS.map((ev) => (
              <button
                key={ev.tag}
                type="button"
                onClick={goToEvent}
                className={`w-full text-left rounded-2xl border p-3.5 flex items-start gap-3 hover:shadow-sm transition-shadow cursor-pointer ${ev.tone}`}
              >
                <span className="text-2xl leading-none mt-0.5" aria-hidden="true">{ev.emoji}</span>
                <span className="flex-1">
                  <span className={`inline-block text-[10px] font-black text-white px-2 py-0.5 rounded-full mb-1 ${ev.tagTone}`}>
                    {ev.tag}
                  </span>
                  <span className="block text-sm font-extrabold text-[#0A1D37]">{ev.title}</span>
                  <span className="block text-[11px] text-slate-600 leading-relaxed mt-0.5">{ev.desc}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={goToEvent}
            className="w-full py-3 rounded-xl bg-[#0A1D37] hover:bg-slate-800 text-white font-black text-sm transition-colors cursor-pointer shadow-md"
          >
            🎉 이벤트 자세히 보기
          </button>

          {/* 예약 안내 */}
          <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3.5 text-[11px] text-slate-600 leading-relaxed">
            📢 <b className="text-slate-800">견적·예약 문의</b>는 전화나 카카오톡으로 주시면 가장 빠르게 안내해 드려요.
            <div className="flex gap-2 mt-2.5">
              <a
                href="tel:064-763-4545"
                className="flex-1 py-2.5 rounded-xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#0A1D37] font-black text-xs flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                064-763-4545
              </a>
              <a
                href="https://pf.kakao.com/_xfxdrxmM?from=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-[#FEE500] hover:brightness-95 text-[#3A1D1D] font-black text-xs flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                카톡 상담
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontShowToday}
                onChange={(e) => setDontShowToday(e.target.checked)}
                className="w-4 h-4 text-[#0284C7] rounded border-slate-300 focus:ring-[#38BDF8] cursor-pointer"
              />
              <span className="text-xs text-slate-500 font-medium hover:text-slate-800">오늘 하루 보지 않기</span>
            </label>
            <button
              type="button"
              onClick={handleDismiss}
              className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
