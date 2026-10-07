import React, { useState, useEffect } from 'react';
import { X, ChevronRight } from 'lucide-react';
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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-900/60 animate-in fade-in duration-200"
      onClick={handleDismiss}
    >
      {/* 모바일: 아래에서 올라오는 작은 카드 / PC: 가운데 작은 창 */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-[380px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-200"
      >
        {/* 모바일 손잡이 */}
        <div className="sm:hidden flex justify-center pt-2.5">
          <span className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="닫기"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="px-5 pt-3 pb-4 sm:p-6 sm:pt-6">
          {/* Headline */}
          <div className="flex items-center gap-3 pr-8">
            <span className="text-3xl shrink-0" aria-hidden="true">☕</span>
            <div>
              <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                공지 · 이벤트 진행 중
              </span>
              <h2 id="notice-modal-title" className="text-base font-black text-[#0A1D37] leading-snug">
                스타벅스 커피 1잔 드려요!
              </h2>
            </div>
          </div>

          {/* Events (한 줄씩) */}
          <ul className="mt-3 space-y-1.5">
            {EVENTS.map((ev) => (
              <li key={ev.tag}>
                <button
                  type="button"
                  onClick={goToEvent}
                  className={`w-full text-left rounded-xl border px-3 py-2.5 flex items-center gap-2.5 cursor-pointer ${ev.tone}`}
                >
                  <span className="text-lg leading-none" aria-hidden="true">{ev.emoji}</span>
                  <span className="flex-1 text-[13px] font-bold text-[#0A1D37]">{ev.title}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={goToEvent}
            className="mt-3 w-full py-3 rounded-xl bg-[#0A1D37] hover:bg-slate-800 text-white font-black text-sm cursor-pointer"
          >
            이벤트 자세히 보기
          </button>

          {/* Footer */}
          <div className="mt-2.5 flex items-center justify-between">
            <label className="flex items-center gap-1.5 cursor-pointer select-none py-1">
              <input
                type="checkbox"
                checked={dontShowToday}
                onChange={(e) => setDontShowToday(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 cursor-pointer"
              />
              <span className="text-xs text-slate-500">오늘 하루 보지 않기</span>
            </label>
            <button
              type="button"
              onClick={handleDismiss}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 px-2 py-1 cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>
        {/* 아이폰 하단 홈 바 영역 여백 */}
        <div className="sm:hidden" style={{ height: 'env(safe-area-inset-bottom)' }} />
      </div>
    </div>
  );
};
